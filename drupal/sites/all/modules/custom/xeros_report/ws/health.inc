<?php

/**
 * @param        $from_date
 * @param        $to_date
 * @param null   $location_id
 * @param string $machine_type_filter
 *
 * Test data
 *
 * Company - 8 - Sterling
 * Location - 10 - Sterling Headquarters
 * Machines - 6 ( Milnor ), 7 ( Xeros)
 */


include_once (drupal_get_path('module', 'xeros_admin') . '/db/location_profile.inc');
include_once (drupal_get_path('module', 'xeros_report') . '/conversion.inc');

// TODO: : Add company ID as an optional parameter when we start allowing company level reports
function ws_health($location_ids = '', $from_date, $to_date ) {

  $u = new WsUtils();

  $l = $u->user_access_locations();

  // Kick the person out if they don't have access
  if ( !user_is_logged_in() ) {
    return "Access Denied";
  }

  // Return a warning if they are trying to access a location ID they don't have access to.
  $location_ids = explode(',', $location_ids);

  if ( $location_ids[0] == '*' ) {
    if (!user_access('xeros view all locations')) {
      print json_encode(array('error' => 'Access denied (all locations)'));
      return;
    } else {
      // Return all locations
      $location_ids = $l;
    }
  } else {
    foreach ( $location_ids as $location_id ) {
      if ( !in_array($location_id, $l) ) {
        print json_encode(array('error' => 'Access denied to location id ' . $location_id));
        return;
      }
    }
  }

  $lp = new location_profile();

  // Get the location specific values (needed for the new calculations)
  $location_profiles = $lp->select_locations($location_ids);

  $output = array();
  $kpis = array();
  $metrics = array();

  // need to get by location and machine_type_filter
  //TODO: Get the machines by location ID for all locations
  $machine_ids = $u->machines_by_location($location_ids);

  if (count($machine_ids) == 0) {
    print json_encode(array('error' => 'This location has no active machines.  See location configuration.'));
    drupal_set_error(t('This location has no active machines.  See location configuration.'));
    return;
  }

  $filters = array(
    ':fromDate'         => $from_date,
    ':toDate'           => $to_date . ' 12:59:59',
    ':machineIds'       => implode(",", $machine_ids),
    ':water_only_diff'  => '3.2',
    ':default_mass'     => DEFAULT_MASS,
    ':unit_mass'        => locale_currency_get_current_mass(),
    ':default_volume'   => DEFAULT_VOLUME,
    ':unit_volume'      => locale_currency_get_current_volume(),
    ':default_temperature' => DEFAULT_TEMPERATURE,
    ':unit_temperature' => locale_currency_get_current_temperature(),
    ':default_energy'   => DEFAULT_ENERGY,
    ':unit_energy'      => locale_currency_get_current_energy(),
    ':default_currency' => DEFAULT_CURRENCY,
    ':unit_currency'    => locale_currency_get_current_currency(),
    ':exchange_rate'    => CurrencyExchanger::load(DEFAULT_CURRENCY, locale_currency_get_current_currency())
  );


  /**
   *   Get the actual metered values and the xeros model data
   */
  $sql = <<<SQL
    SELECT
      xm.machine_id   AS id,
      xm.machine_name AS machine_name,
      xm.manufacturer AS manufacturer,
      case
        when manufacturer = 'xeros' then
          'xeros'
        else
          'non-xeros'
      end as machine_type,
      xm.serial_number,
      xm.size,
      xm.water_only,
      b.cycles,
      xm.status,
      xm.active,
      truncate(b.cold_water_actual, 0) as cold_water_actual,
      case xm.water_only
        when 1 then
            :water_only_diff * coalesce(b.cold_water_actual, 0)
        else
            coalesce(b.cold_water_model_xeros, 0)
      end as cold_water_model_xeros,
      truncate(b.therms_actual, 0) as therms_actual,
      truncate(coalesce(b.therms_model_xeros, 0), 0) as therms_model_xeros,

      truncate(b.time_actual, 0) as time_actual,
      truncate(b.time_model_xeros, 0) as time_model_xeros,

      truncate(b.chemical_actual, 0) as chemical_actual,
      truncate(b.chemical_model_xeros, 0) as chemical_model_xeros

    FROM
        xeros_machine AS xm
        LEFT JOIN
        (-- metrics
         SELECT
           machine_id,
           count(*) as cycles,
           udf_convert_volume(sum(cycle_cold_water_volume), ':default_volume', ':unit_volume')       AS cold_water_actual,
           udf_convert_volume(sum(cycle_cold_water_xeros_volume), ':default_volume', ':unit_volume') AS cold_water_model_xeros,

           udf_convert_energy(sum(cycle_therms), ':default_energy', ':unit_energy')                  AS therms_actual,
           udf_convert_energy(sum(cycle_therms_xeros), ':default_energy', ':unit_energy')            AS therms_model_xeros,

           sum(cycle_time_total_time)         AS time_actual,
           sum(cycle_time_xeros_total_time)   AS time_model_xeros,

           udf_convert_mass(sum(cycle_chemical_strength), ':default_mass', ':unit_mass')             AS chemical_actual,
           udf_convert_mass(sum(cycle_chemical_xeros_strength), ':default_mass', ':unit_mass')       AS chemical_model_xeros

         FROM
           xeros_cycle
         WHERE
           reading_date >= ':fromDate' AND reading_date <= ':toDate'
           and machine_id in ( :machineIds )
         GROUP BY
           machine_id
        ) AS b
          ON xm.machine_id = b.machine_id
        WHERE xm.machine_id in ( :machineIds )
SQL;


  $sql = $u->replaceFilters($sql, $filters);

  //dpm($sql);

  $results = db_query($sql);

  $ar = $results->fetchAll();

  /**
   *
   * Add other models
   *
   * Xeros
   *
   * When a machine is a xeros machine - compare to industry averages.
   * Use static values which are based on analysis of data that we collect on non-xeros machines.
   *
   * Water - A xeros machine uses 1/4 as much water as a Xeros machine.  4 = static_water_ratio
   *
   *              cold_water_actual * 1/static_cold_water_ratio = cold_water_model_nonxeros_simple
   *
   * Therms - Since a xeros machine does not use hot water and we don't know how many cycles
   *          this is a little more complicated.
   *          If a non-xeros machine uses on average 1 gallon of hot water for every 2 gallons and
   *          it takes (t) therms per gallon.  Then we can estimate industry therms as
   *
   *               cold_water_actual * static_hot_water_ratio * static_therms_per_gallon
   *
   *               cold_water_actual * xeros_cold_water_ratio * static_hot_water_ratio = Hot water used by a Non-Xeros machine
   *               (Hot water used * 8.34 * (temp_rise_season / heating_rise_efficiency)) / 100,000
   *
   * Non Xeros
   *
   * When a machine is a non xeros machine - compare to high level theoretical Xeros differences.
   *
   * Water - Xeros uses 1/4 the water as a non-xeros machine
   *
   *              cold_water_actual * static_cold_water_value = cold_water_model_xeros_simple
   *
   * Therms - Xeros does not use hot water so it uses 0 therms
   *
   *              therms * 0 = therms_model_xeros_simple
   * Chemical - TBD
   * Cycle Time - TBD
   *
   */

  $results = array();
  foreach ($ar as $machine_id => $d) {

    // Restructure the data coming out of the database and do the model calculations
    $data = new StdClass();
    $data->info = new StdClass();

    $data->actual = new StdClass();
    $data->actual->description = 'The actual metered data from the machine.';
    $data->actual->active = true;

    $data->model_xeros = new StdClass();
    $data->model_xeros->description = 'The expected data of a xeros machine based on the classifications of laundry.';
    $data->model_xeros->notes = 'This data is only valid if we know the classifications of the laundry for each cycle.';

    $data->model_xeros_simple = new StdClass();
    $data->model_xeros_simple->description = 'The expected data of a xeros machine based on simple calculations of aggregate data.';
    $data->model_xeros_simple->notes = 'This model only makes sense when compared to a non-xeros machine.';

    $data->model_non_xeros_simple = new StdClass();
    $data->model_non_xeros_simple->description = 'The expected data of a non-xeros machine based on simple calculations of aggregate data';
    $data->model_non_xeros_simple->notes = 'This model only makes sense when compared to a xeros machine.';

    $data->actual->cold_water = floatval($d->cold_water_actual);
    $data->actual->therms = floatval($d->therms_actual);
    $data->actual->time = floatval($d->time_actual);
    $data->actual->chemical = floatval($d->chemical_actual);

    $data->model_xeros->cold_water = floatval($d->cold_water_model_xeros);
    $data->model_xeros->therms = floatval($d->therms_model_xeros);
    $data->model_xeros->time = floatval($d->time_model_xeros);
    $data->model_xeros->chemical = floatval($d->chemical_model_xeros);
    $data->model_xeros->active = true;

    $data->info->machine_id = (int)$d->id;
    $data->info->machine_name = $d->machine_name;
    $data->info->manufacturer = $d->manufacturer;
    $data->info->machine_type = $d->machine_type;
    $data->info->serial_number = $d->serial_number;
    $data->info->size = $d->size;
    $data->info->water_only = (int)$d->water_only;
    $data->info->cycles = $d->cycles;
    $data->info->status = $d->status;
    $data->info->active = (int)$d->active;


    switch($data->info->machine_type) {
      case 'xeros':
        $data->model_non_xeros_simple->cold_water = convert_non_xeros_water($data->actual->cold_water);
        $data->model_non_xeros_simple->therms = convert_non_xeros_therms($data->actual->cold_water, $location_profiles[$location_id], $filters[':unit_volume']);
        $data->model_non_xeros_simple->active = true;

        $data->model_xeros_simple->notes = 'Because this machine is a xeros machine the xeros_simple model is not available.';
        $data->model_xeros_simple->active = false;
        break;
      case 'non-xeros':
        $data->model_xeros_simple->cold_water = convert_xeros_water($data->actual->cold_water);
        $data->model_xeros_simple->therms = convert_xeros_therms($data->actual->cold_water);
        $data->model_xeros_simple->active = true;

        $data->model_non_xeros_simple->notes = 'Because this machine is a nonxeros machine the non_xeros_simple model is not available.';
        $data->model_non_xeros_simple->active = false;

        break;
    }

    switch($data->info->water_only) {
      case '1':
        // Remove cycle counts
        $data->info->cycles = 'na';
        // Removed the standard model because it is not relevant
        $data->model_xeros = new StdClass();
        $data->model_xeros->description = 'The expected data of a xeros machine based on the classifications of laundry.';
        $data->model_xeros->notes = 'Because this is a water only machine, this data is not available.';
        $data->model_xeros->active = false;
    }

    // Push this onto the array
    $results[$data->info->machine_id] = $data;
  }
  print json_encode($results);

}



