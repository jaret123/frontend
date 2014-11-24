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
function ws_kpi($location_ids = '', $from_date, $to_date ) {

  $u = new WsUtils();

  $l = $u->user_access_locations();

  // Kick the person out if they don't have access
  if ( !user_is_logged_in() ) {
    return "Access Denied";
  }

  // Return a warning if they are trying to access a location ID they don't have access to.
  $location_ids = explode(',', $location_ids);

  foreach ( $location_ids as $location_id ) {
    if ( !in_array($location_id, $l) ) {
      print json_encode(array('error' => 'Access denied to location id ' . $location_id));
      return;
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

  // Get the machine types at this location and return all the correct data and models

  $sql = <<<SQL
  select
          distinct case
              when Manufacturer = 'xeros' then 'xeros'
              else 'non-xeros'
          end as model
          from xeros_machine
          where location_id in ( :location_id )
SQL;

  $query = db_query($u->replaceFilters($sql, array(':location_id' => implode(",", $location_ids))));

  $machine_types = $query->fetchAll();

foreach ($machine_types as $machine_type) {

  switch ($machine_type->model) {
    case "xeros":
      $filters[':machine_type_filter'] = "and xc.manufacturer = 'xeros'";
      break;
    case "non-xeros":
      $filters[':machine_type_filter'] = "and xc.manufacturer <> 'xeros'";
      break;
  }
  /**
   * Calculate the data points for the charts
   *
   * :metric will have the actual calculations
   */

  $dataPointSql = <<<SQL
select
    b.date,
    b.cycles,
	coalesce(b.value, 0) as actual_non_xeros,
	coalesce(b.value_xeros, 0) as value_xeros,
	coalesce(b.cost, 0) as cost,
	coalesce(b.cost_xeros, 0) as cost_xeros
from
	(
	select
	    xd.date,
	    count(*) as cycles,
        :metric
	from
	    xeros_dates as xd
	    left join xeros_cycle as xc
	      on xd.date = xc.reading_date
	      and xc.machine_id in ( :machineIds )
	      :machine_type_filter
	where
	    1 = 1
	    and xd.date >= ':fromDate' and xd.date <= ':toDate'
	group by
		xd.date
	) as b
where
   1 = 1
order by
	b.date
SQL;

  /**
   * Calculate the summary data for the dashboard charts
   *
   * :metric will have the actual calculations
   */
  $summarySql = <<<SQL
select
  b.date,
  coalesce(truncate(b.value, 0), 0) as value,
  coalesce(truncate(b.value_xeros, 0), 0) as value_xeros,
  coalesce(truncate(b.cost, 0), 0) as cost,
  coalesce(truncate(b.cost_xeros, 0), 0) as cost_xeros
from
	(
	select
	    xd.date,
        :metric
	from
	    xeros_dates as xd
	    left join xeros_cycle as xc
	      on xd.date = xc.reading_date
	      and xc.machine_id in ( :machineIds )
	      :machine_type_filter
	where
	    1 = 1
	    and xd.date >= ':fromDate' and xd.date <= ':toDate'
	) as b
where
   1 = 1

SQL;

  /**
   * METRICS
   *
   * Generate the metrics calculations.  Store them in an array and iterate over them
   *
   *
   * Hard coding the multipliers for now
   *
   * From ws/industry/averages
   * {
  avg_cold_water_volume: "121.64078133",
  avg_cold_water_cost: "1.20101627",
  avg_hot_water_volume: "51.41446880",
  avg_therms: "0.37381793",
  avg_therm_cost: "0.34448701",
  avg_chemical_strength: "17.38840517",
  avg_chemical_cost: "1.18185205"
  }
   */


  /**
   *
   * If it's a xeros machine, then the actual data is the actual data (ie - water measured from a xeros machine)
   * the "value_xeros" value is the industry average model data.
   */

  switch ($machine_type->model) {
    case "xeros":
      // Cold Water
      array_push($metrics, array(
          "name" => "cold-water",
          "query" => <<<METRIC
   		sum(truncate(xc.cycle_cold_water_volume, 0)) as value,
   		sum(truncate(xc.cycle_cold_water_volume, 0) * 4) as value_xeros,
   		sum(coalesce(xc.cycle_cold_water_cost, 0)) as cost,
   		sum(coalesce(xc.cycle_cold_water_cost, 0) * 4) as cost_xeros
METRIC
        ));
      // Hot Water (Therms)
      array_push($metrics, array(
          "name" => "hot-water",
          "query" => <<<METRIC
   		sum(coalesce(xc.cycle_therms, 0)) as value,
   		count(*) * 0.37381793 as value_xeros, -- Model data
   		sum(coalesce(xc.cycle_therms_cost, 0)) as cost,
   		count(*) * 0.34448 as cost_xeros -- Model data
METRIC
          // Cycle Time (not in use)
        ));
//        array_push($metrics, array(
//            "name" => "cycle-time",
//            "query" => <<<METRIC
//   		sum(xc.cycle_time_total_time) as value,
//   		sum(xc.cycle_time_xeros_total_time) as value_xeros,
//   		sum(xc.cycle_time_labor_cost) as cost,
//   		sum(xc.cycle_time_xeros_labor_cost) as cost_xeros
//METRIC
//        ));
      // Chemical
      // (not in use)
//          array_push($metrics, array(
//              "name" => "chemical",
//              "query" => <<<METRIC
//   		sum(coalesce(xc.cycle_chemical_strength, 0)) as value,
//   		count(*) * 17.3884 as value_xeros, -- Model data
//   		sum(coalesce(xc.cycle_chemical_cost, 0)) as cost,
//   		count(*) * 1.18185 as cost_xeros -- Model data
//METRIC
//            ));

      break;

    case "non-xeros":
      // Cold Water
      array_push($metrics, array(
          "name" => "cold-water",
          "query" => <<<METRIC
   		sum(truncate(xc.cycle_cold_water_volume, 0)) as value,
   		sum(
          case xc.water_only
	        when 1 then
		      :water_only_diff * coalesce(xc.cycle_cold_water_volume, 0)
	        else
		      coalesce(xc.cycle_cold_water_xeros_volume, 0)
          end
   		  ) as value_xeros,
   		sum(coalesce(xc.cycle_cold_water_cost, 0)) as cost,
   		sum(
          case xc.water_only
	        when 1 then
		      :water_only_diff * coalesce(xc.cycle_cold_water_cost, 0)
	        else
		      coalesce(xc.cycle_cold_water_xeros_cost, 0)
          end
   		) as cost_xeros
METRIC
        ));
      // Hot Water (Therms)
      array_push($metrics, array(
          "name" => "hot-water",
          "query" => <<<METRIC
   		sum(coalesce(xc.cycle_therms, 0)) as value,
   		sum(coalesce(xc.cycle_therms_xeros, 0)) as value_xeros,
   		sum(coalesce(xc.cycle_therms_cost, 0)) as cost,
   		sum(coalesce(xc.cycle_therms_cost_xeros, 0)) as cost_xeros
METRIC
        ));
      // Cycle Time -- not in use
//        array_push($metrics, array(
//            "name" => "cycle-time",
//            "query" => <<<METRIC
//   		sum(xc.cycle_time_total_time) as value,
//   		sum(xc.cycle_time_xeros_total_time) as value_xeros,
//   		sum(xc.cycle_time_labor_cost) as cost,
//   		sum(xc.cycle_time_xeros_labor_cost) as cost_xeros
//METRIC
//        ));
      // Chemical Strength
//          array_push($metrics, array(
//              "name" => "chemical",
//              "query" => <<<METRIC
//   		sum(coalesce(xc.cycle_chemical_strength, 0)) as value,
//   		sum(coalesce(xc.cycle_chemical_xeros_strength, 0)) as value_xeros,
//   		sum(coalesce(xc.cycle_chemical_cost, 0)) as cost,
//   		sum(coalesce(xc.cycle_chemical_xeros_cost, 0)) as cost_xeros
//METRIC
//            ));
      break;
  }



  /**
   * Calculate the metrics
   *
   * Iterate over the metrics array and build the SQL for the calculations
   */
  foreach ( $metrics as $k => $v) {
    $ar = array (
      'name' => $v["name"],
      'summaryData' => array(),
      'chartData' => array()
    );

    $filters[':metric'] = $u->replaceFilters($v["query"], $filters);

    // PDO tries to add extra strings to our replacement
    $summarySql = $u->replaceFilters($summarySql, $filters);
    // PDO tries to add extra strings to our replacement
    $dataPointSql = $u->replaceFilters($dataPointSql, $filters);

    dpm($summarySql);
    //dpm($dataPointSql);
    dpm($filters);

    $results = db_query($summarySql);

    //dpq($results);

    // BUG - Check whether we get data before we process it or send back a notice
    // LOG all SQL requests
    $a = $results->fetchAll();

    $ar["summaryData"] = $a[0];

    $dataPoints = db_query($dataPointSql);

    $ar["chartData"] = $dataPoints->fetchAll();

    array_push($kpis, $ar, array($summarySql, $dataPointSql));
  }

  $output[$machine_type->model] = $kpis;
}
  print json_encode($output);
  //print "Hello World";

}

