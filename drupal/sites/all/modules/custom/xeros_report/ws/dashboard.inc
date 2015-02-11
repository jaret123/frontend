<?php

/**
 * METRICS
 *
 * Generate the metrics calculations.  Store them in an array and iterate over them
 *
**/

include_once (drupal_get_path('module', 'xeros_report') . '/conversion.inc');

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
function ws_dashboard($location_ids = '', $from_date, $to_date, $format = '') {


  $u = new WsUtils();

  $l = $u->user_access_locations();

  $u->get_timezone_offset($GLOBALS['user']->timezone,'America/New_York');

  // Kick the person out if they don't have access
  if (!user_is_logged_in()) {
    return "Access Denied";
  }

  // Return a warning if they are trying to access a location ID they don't have access to.
  $location_ids = explode(',', $location_ids);

  foreach ($location_ids as $location_id) {
    if (!in_array($location_id, $l)) {
      print json_encode(array('error' => 'Access denied to location id ' . $location_id));
      return;
    }
  }

  $output = array(
    'options' => array(), // Report options that the user can configure
  );


  // need to get by location and machine_type_filter
  //TODO: Get the machines by location ID for all locations
  $machine_ids = $u->machines_by_location($location_ids);

  $filters = array(
    ':fromDate'        => $from_date,
    ':toDate'          => $to_date . ' 12:59:59',
    ':machineIds'      => implode(",", $machine_ids),
    ':water_only_diff' => '3.2', //todo Pull this from DB
    ':default_mass'     => DEFAULT_MASS,
    ':unit_mass'        => locale_currency_get_current_mass(),
    ':default_volume'   => DEFAULT_VOLUME,
    ':unit_volume'      => locale_currency_get_current_volume(),
    ':default_temperature' => DEFAULT_TEMPERATURE,
    ':unit_temperature' => locale_currency_get_current_temperature(),
    ':default_energy'     => DEFAULT_ENERGY,
    ':unit_energy'        => locale_currency_get_current_energy(),
    ':default_currency' => DEFAULT_CURRENCY,
    ':unit_currency'   => locale_currency_get_current_currency(),
    ':timezone'       => $GLOBALS['user']->timezone
  );

  // Get the machine types at this location and return all the correct data and models

  $sql
    = <<<SQL
  SELECT
          DISTINCT CASE
              WHEN Manufacturer = 'xeros' THEN 'xeros'
              ELSE 'non_xeros'
          END AS model
          FROM xeros_machine
          WHERE location_id IN ( :location_id )
SQL;

  $query = db_query($u->replaceFilters($sql, array(':location_id' => implode(",", $location_ids))));

  $machine_types = $query->fetchAll();

  /**
   * Do seperate calculations for each machine_type
   */
  foreach ($machine_types as $machine_type) {

    $kpis = array();
    $metrics = array();

    switch ($machine_type->model) {
      case "xeros":
        $filters[':machine_type_filter'] = "and xc.manufacturer = 'xeros'";
        break;
      case "non_xeros":
        $filters[':machine_type_filter'] = "and xc.manufacturer <> 'xeros'";
        break;
    }
    /**
     * Calculate the data points for the charts
     *
     * :metric will have the actual calculations
     */

    $dataPointSql
      = <<<SQL
        SELECT
            xd.date,
            IFNULL(b.cycles, 0) AS cycles,
            IFNULL(b.actual_value, 0) AS actual_value,
            IFNULL(b.model_xeros_value, 0) AS model_xeros_value,
            udf_convert_currency(IFNULL(b.actual_cost, 0), ':default_currency', ':unit_currency') AS actual_cost,
            udf_convert_currency(IFNULL(b.model_xeros_cost, 0), ':default_currency', ':unit_currency')  AS model_xeros_cost
        FROM
          xeros_dates AS xd
            LEFT JOIN
            (
            SELECT
                date(convert_tz(xc.reading_timestamp, xc.olson_timezone_id, ':timezone')) as date,
                count(*) AS cycles,
                :metric
            FROM
                 xeros_cycle AS xc
            WHERE
                date(convert_tz(xc.reading_timestamp, xc.olson_timezone_id, ':timezone')) >= ':fromDate'
                AND date(convert_tz(xc.reading_timestamp, xc.olson_timezone_id, ':timezone')) <= ':toDate'
                AND xc.machine_id IN ( :machineIds )
                :machine_type_filter
            GROUP BY
                date(convert_tz(xc.reading_timestamp, xc.olson_timezone_id, ':timezone'))
            ) AS b
              ON xd.date = b.date
        WHERE
           xd.date >= ':fromDate'
           AND xd.date <= ':toDate'
        ORDER BY
            xd.date
SQL;

    /**
     * Calculate the summary data for the dashboard charts
     *
     * :metric will have the actual calculations
     */
    $summarySql
      = <<<SQL
      SELECT
        sum(IFNULL(b.actual_value, 0)) AS actual_value,
        sum(IFNULL(b.model_xeros_value, 0)) AS model_xeros_value,
        sum(IFNULL(b.actual_cost, 0)) AS actual_cost,
        sum(IFNULL(b.model_xeros_cost, 0)) AS model_xeros_cost
          FROM
          (
          SELECT
              :metric
            FROM
                 xeros_cycle AS xc
            WHERE
                date(convert_tz(xc.reading_timestamp, xc.olson_timezone_id, ':timezone')) >= ':fromDate'
                AND date(convert_tz(xc.reading_timestamp, xc.olson_timezone_id, ':timezone')) <= ':toDate'
                AND xc.machine_id IN ( :machineIds )
                :machine_type_filter
          ) AS b
SQL;

    /**
     *
     * If it's a xeros machine, then the actual data is the actual data (ie - water measured from a xeros machine)
     * the "value_xeros" value is the industry average model data.
     */

    $metrics = array();
        // Cold Water
        array_push(
          $metrics, array(
            "name"  => "cold-water",
            "query" => <<<METRIC
   		    udf_convert_volume(sum(truncate(xc.cycle_cold_water_volume, 0)), ':default_volume', ':unit_volume') as actual_value,
   		    udf_convert_volume(sum(IFNULL(xc.cycle_cold_water_xeros_volume, 0)), ':default_volume', ':unit_volume') as model_xeros_value,
   		    udf_convert_currency(sum(IFNULL(xc.cycle_cold_water_cost, 0)), ':default_currency', ':unit_currency') as actual_cost,
   		    udf_convert_currency(sum(IFNULL(xc.cycle_cold_water_xeros_cost, 0)) , ':default_currency', ':unit_currency') as model_xeros_cost
METRIC
          )
        );
        // Hot Water (Therms)
        array_push(
          $metrics, array(
            "name"  => "therms",
            "query" => <<<METRIC
   		udf_convert_energy(sum(IFNULL(xc.cycle_therms, 0)), ':default_energy', ':unit_energy') as actual_value,
   		udf_convert_energy(sum(IFNULL(xc.cycle_therms_xeros, 0)), ':default_energy', ':unit_energy') as model_xeros_value,
   		udf_convert_currency(sum(IFNULL(xc.cycle_therms_cost, 0)) , ':default_currency', ':unit_currency') as actual_cost,
   		udf_convert_currency(sum(IFNULL(xc.cycle_therms_cost_xeros, 0)) , ':default_currency', ':unit_currency') as model_xeros_cost
METRIC
            // Cycle Time (not in use)
          )
        );
//        array_push($metrics, array(
//            "name" => "cycle-time",
//            "query" => <<<METRIC
//   		sum(xc.cycle_time_total_time) as value,
//   		sum(xc.cycle_time_xeros_total_time) as value_xeros,
//   		sum(xc.cycle_time_labor_cost) * :exchange_rate as cost,
//   		sum(xc.cycle_time_xeros_labor_cost) * exchange_rate as cost_xeros
//METRIC
//        ));
        // Chemical
        // (not in use)
//          array_push($metrics, array(
//              "name" => "chemical",
//              "query" => <<<METRIC
//   		udf_convert_mass(sum(IFNULL(xc.cycle_chemical_strength, 0)), ':default_mass', ':unit_mass') as value,
//   		udf_convert_mass(count(*) * 17.3884, ':default_mass', ':unit_mass') as value_xeros, -- Model data
//   		sum(IFNULL(xc.cycle_chemical_cost, 0)) * :exchange_rate as cost,
//   		count(*) * 1.18185 * :exchange_rate as cost_xeros -- Model data
//METRIC
//            ));

    /**
     * Calculate the metrics
     *
     * Iterate over the metrics array and build the SQL for the calculations
     */


    foreach ($metrics as $k => $v) {
      $metric_name = $v['name'];
      $ar = array(
        'name'        => $metric_name,
        'summaryData' => array(),
        'chartData'   => array()
      );

      $filters[':metric'] = $u->replaceFilters($v["query"], $filters);

      // PDO tries to add extra strings to our replacement
      $s = $u->replaceFilters($summarySql, $filters);
      // PDO tries to add extra strings to our replacement
      $d = $u->replaceFilters($dataPointSql, $filters);

      $results = db_query($s);

      // BUG - Check whether we get data before we process it or send back a notice
      // LOG all SQL requests
      $a = $results->fetchAll();

      $ar["summaryData"] = $a[0];

      if ( $format !== 'summary') {
        $dataPoints = db_query($d);

        $ar["chartData"] = $dataPoints->fetchAll();
      }

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

      // Model definition
      $metric = array(
        'name' => $metric_name,
        'actual' => array(
          'summary' => array(
            'value' => floatval($ar['summaryData']->actual_value),
            'cost' => floatval($ar['summaryData']->actual_cost)
          ),
          'chart' => array(),
        ),
        'model_xeros' => array(
          'active' => true,
          'summary' => array(
            'value' => floatval($ar['summaryData']->model_xeros_value),
            'cost' => floatval($ar['summaryData']->model_xeros_cost)
          )
        ),
      );

      if ( $format !== 'summary' ) {
        foreach ($ar['chartData'] as $value) {
          $metric['actual']['chart'][] = array(
            'date' => $value->date,
            'value' => floatval($value->actual_value),
            'cost' => floatval($value->actual_cost)
          );
          $metric['model_xeros']['chart'][] = array(
            'date' => $value->date,
            'value' => floatval($value->model_xeros_value),
            'cost' => floatval($value->model_xeros_cost)
          );
        }
      }


      /**
       * Machine type differences
       */
      switch($machine_type->model) {
        case 'xeros':
          $output['options']['machine_types']['xeros'] = array();
          $output['options']['machine_types']['xeros']['models'][] = 'model_non_xeros_simple';

          $metric['model_xeros_simple'] = array(
            'notes' => 'Because this machine is a xeros machine the xeros_simple model is not available.',
            'active' => false
          );

          switch ($metric_name) { // metric
            case 'cold-water':
              $metric['model_non_xeros_simple'] = array(
                'summary' => array(
                  'value' => $metric['actual']['summary']['value'] * INDUSTRY_WATER_DIFF,
                  'cost' => $metric['actual']['summary']['cost'] * INDUSTRY_WATER_DIFF
                )
              );

              if ( $format !== 'summary' ) {
                foreach ( $metric['actual']['chart'] as $datapoint ) {
                  $metric['model_non_xeros_simple']['chart'][] = array(
                    'date' => $datapoint['date'],
                    'value' => $datapoint['value'] * INDUSTRY_WATER_DIFF,
                    'cost' => $datapoint['cost'] * INDUSTRY_WATER_DIFF,
                  );
                }
              }
              break;

            case 'therms':
              // It's important that the metrics are pulled in order.  Cold water has
              // to be calculated before therms or this will error

              $metric['model_non_xeros_simple'] = array(
                'summary' => array(
                  'value' => $output[$machine_type->model]['cold-water']['actual']['summary']['value'] * INDUSTRY_THERMS,
                  'cost' => $output[$machine_type->model]['cold-water']['actual']['summary']['cost'] * INDUSTRY_THERMS_COST
                )
              );
              if ( $format !== 'summary' ) {
                foreach ( $metric['actual']['chart'] as $index => $datapoint ) {
                  $metric['model_non_xeros_simple']['chart'][$index] = array(
                    'date' => $datapoint['date'],
                    'value' => $output[$machine_type->model]['cold-water']['actual']['chart']['value'][$index] * INDUSTRY_THERMS,
                    'cost' => $output[$machine_type->model]['cold-water']['actual']['chart']['cost'][$index] * INDUSTRY_THERMS_COST,
                  );
                }
              }
              break;
          }

          break;
        case 'non_xeros':
          $output['options']['machine_types']['non_xeros'] = array();
          $output['options']['machine_types']['non_xeros']['models'][] = 'model_xeros_simple';
          $output['options']['machine_types']['non_xeros']['models'][] = 'model_xeros';

          $metric['model_non_xeros_simple'] = array(
            'notes' => 'Because this machine is a nonxeros machine the non_xeros_simple model is not available.',
            'active' => false
          );

          switch ($metric_name) { // metric
            case 'cold-water':
              $metric['model_xeros_simple'] = array(
                'summary' => array(
                  'value' => $metric['actual']['summary']['value'] / INDUSTRY_WATER_DIFF,
                  'cost' => $metric['actual']['summary']['cost'] / INDUSTRY_WATER_DIFF
                )
              );
              if ( $format !== 'summary' ) {
                foreach ( $metric['actual']['chart'] as $datapoint ) {
                  $metric['model_xeros_simple']['chart'][] = array(
                    'date' => $datapoint['date'],
                    'value' => $datapoint['value'] / INDUSTRY_WATER_DIFF,
                    'cost' => $datapoint['cost'] / INDUSTRY_WATER_DIFF, //todo units conversion(locatzation)
                  );
                }
              }
              break;

            case 'therms':
              $metric['model_xeros_simple'] = array(
                'summary' => array(
                  'value' => $metric['actual']['summary']['value'] * XEROS_THERMS_DIFF,
                  'cost' => $metric['actual']['summary']['cost'] * XEROS_THERMS_DIFF
                )
              );
              if ( $format !== 'summary' ) {
                foreach ( $metric['actual']['chart'] as $index => $datapoint ) {
                  $metric['model_xeros_simple']['chart'][] = array(
                    'date' => $datapoint['date'],
                    'value' => XEROS_THERMS,
                    'cost' => XEROS_THERMS,
                  );
                }
              }
              break;
          }
          break;
      }

      $output[$machine_type->model][$metric['name']] = $metric;
    }
  }
  print json_encode($output);

}

