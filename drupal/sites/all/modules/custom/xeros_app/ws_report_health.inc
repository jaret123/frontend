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


  $output = array();
  $kpis = array();
  $metrics = array();

  // need to get by location and machine_type_filter
  //TODO: Get the machines by location ID for all locations
  $machine_ids = $u->machines_by_location($location_ids);

  $filters = array(
    ':fromDate' => $from_date,
    ':toDate' => $to_date . ' 12:59:59',
    ':machineIds' => implode(",", $machine_ids),
    ':water_only_diff' => '3.2'
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
           sum(cycle_cold_water_volume) AS cold_water_actual,
           sum(cycle_cold_water_xeros_volume) as cold_water_model_xeros,

           sum(cycle_therms)              AS therms_actual,
           sum(cycle_therms_xeros)        AS therms_model_xeros,

           sum(cycle_time_total_time)           AS time_actual,
           sum(cycle_time_xeros_total_time)     AS time_model_xeros,

           sum(cycle_chemical_strength)       AS chemical_actual,
           sum(cycle_chemical_xeros_strength) AS chemical_model_xeros

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

    $data = new StdClass();
    $data->info = new StdClass();
    $data->actual = new StdClass();
    $data->model_xeros = new StdClass();
    $data->model_xeros_simple = new StdClass();
    $data->model_non_xeross_simple = new StdClass();

    $data->actual->cold_water = $d->cold_water_actual;
    $data->actual->therms = $d->therms_actual;
    $data->actual->time = $d->time_actual;
    $data->actual->chemical = $d->chemical_actual;

    $data->model_xeros->cold_water = $d->cold_water_model_xeros;
    $data->model_xeros->therms = $d->therms_model_xeros;
    $data->model_xeros->time = $d->time_model_xeros;
    $data->model_xeros->chemical = $d->chemical_model_xeros;

    $data->info->machine_name = $d->machine_name;
    $data->info->manufacturer = $d->manufacturer;
    $data->info->machine_type = $d->machine_type;
    $data->info->serial_number = $d->serial_number;
    $data->info->size = $d->size;
    $data->info->water_only = $d->water_only;
    $data->info->cycles = $d->cycles;

    switch ($data->info->machine_type) {
        case 'xeros':
          switch ($data->info->water_only) {
            case "1":
              $data->model_xeros = new StdClass();

              $data->model_non_xeros_simple->cold_water = $data->actual->cold_water * 4;
              $data->model_non_xeros_simple->therms = $data->actual->cold_water * .5 * 3.2;
              break;
            case 0:


              break;
            default:
            default:
              $error = 'Error: Water only not identifiable';
              break;
          }
          break;
        case 'non-xeros':
          switch ($data->info->water_only) {
            case 1:
              $data->model_xeros = new StdClass();

              $data->model_xeros_simple->cold_water = $data->actual->cold_water * .25;
              $data->model_xeros_simple->therms = $data->actual->cold_water * 0;
              break;
            case 0:

              break;
            default:
              $error = 'Error: Water only not identifiable';
              break;
          }
          break;
        default:
          $error = 'Error: Machine type not identifiable';
          break;
      }
    $results[] = $data;
  }
  print json_encode($results);

//  print json_encode($output);
  //print "Hello World";

}

