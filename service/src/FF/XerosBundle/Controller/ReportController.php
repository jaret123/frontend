<?php
/**
 * Created by PhpStorm.
 * User: acheson
 * Date: 1/15/14
 * Time: 4:33 PM
 */

namespace FF\XerosBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\View;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class ReportController extends Controller {

    /**
     * @return array
     * @View()
     * @Route("/report/{reportName}/{fromDate}/{toDate}.{_format}")
     *
     * reportAction handles the routing of request to the functions below
     * reportName maps to a function call below and fromDate adn toDate are
     * SQL formatted dates ('YYYY-MM-DD')
     */
    public function reportAction($reportName, $fromDate, $toDate)
    {
        // Resources directory
        $dir = __DIR__ . '/../Resources/data/';

        $userRole = $this->getUserRole();

        if ( $userRole['uid'] === NULL or $userRole['uid'] === 0 ) {
            return array ("message" => "Access denied");
        } else {
            $filters = array(
                'fromDate' => $fromDate,
                'toDate' => $toDate,
                'machineIds' => $this->arrayToString($userRole["machine_ids"])
            );

            switch ($reportName) {
                case "kpis":
                    $ar = $this->reportKPIs($filters);
                    break;
                case "consumption":
                    $ar = $this->reportConsumption($filters);
                    break;
                case "consumptionDetails":
                    $ar = $this->reportConsumptionDetails($filters);
                    break;
                case "news":
                    $json = file_get_contents($dir . "news.json");
                    $ar = json_decode($json, true);
                    break;
            }

             //$ar = json_decode($json, true);
            return array ("data" => $ar);
        }
    }

    /**
     * @return array
     *
     * userRole tests for the session ID in the site cookies and checks to see if it matches
     * an authenticated Drupal session.   If it does, then the user can access the web services
     */
    private function getUserRole()
    {
        $sid = NULL;

        $userRole['uid'] = NULL;

        // Is there something that looks like a Drupal Session ID
        foreach ($_COOKIE as $key => $value)
        {
            if ( substr($key, 0, 4) == 'SESS' ) {
                $sid = $value;
            }
        }

        if ( $sid === NULL ) {
            return array ("uid" => NULL);
        } else {
            // Does this session ID exist in the sessions table
            $sql = sprintf("SELECT * FROM sessions WHERE sid = '%s'", $sid);
            $conn = $this->get('database_connection');
            $user = $conn->fetchAll($sql);

            // If it does, then return user array
            if ( $user[0]['uid'] >= 0 ) {
                // Get the user company_id and location_id

                $userRole = array ("uid" => $user[0]['uid'], "role" => 'role', "location" => 'location');

                $sql = <<<SQL
                    select u.uid, u.name, u.mail, fc.field_company_target_id as company_id
                    from
                        users as u
                        left join field_data_field_company as fc
                             on u.uid = fc.entity_id
                        left join node as n
                             on fc.field_company_target_id = n.nid
                    where u.uid = :uid
SQL;
                $sqlParsed = $this->replaceFilters($sql, array("uid" => $user[0]['uid']));
                $userData = $conn->fetchAll($sqlParsed);
                // TODO : Check to make sure user had a company id
                $userRole["company_id"] = $userData[0]["company_id"];

                // Get machines associated with the company

                $sql = <<<SQL

                select machine_id, serial_number, fc.field_company_target_id as company_id, fl.field_location_target_id as location_id from
                        xeros_machine as xm
                        left join field_data_field_company as fc
                          on xm.machine_id = fc.entity_id and fc.entity_type = 'data_xeros_machine'
                        left join field_data_field_location as fl
                          on xm.machine_id = fl.entity_id and fl.entity_type = 'data_xeros_machine'
                where fc.field_company_target_id = :company_id
SQL;
                $sqlParsed = $this->replaceFilters($sql, array("company_id" => $userRole["company_id"]));
                $machineData = $conn->fetchAll($sqlParsed);
                // TODO : More error checking on this
                foreach ( $machineData as $record ) {
                    $userRole["machine_ids"][] = $record["machine_id"];
                }
            } else {
                // Access denied
                // Do nothing
            }
        }
        return $userRole;
    }

    /**
     * @param $string
     * @param $filters
     *
     * @return mixed
     *
     * replaceFilters is a private function to help build the report SQL used below
     */
    private function replaceFilters($string, $filters) {
        foreach ($filters as $k => $v) {
            $string = str_replace(':' . $k, $v, $string);
        }
        return $string;
    }

    private function arrayToString($array) {
        $string = "";
        $length = count($array);
        $i = 0;
        foreach ( $array  as $k => $v ) {
            $i = $i + 1;
            $string = $string . $v;
            if ( $i < $length ) {
                $string = $string . ", ";
            }
        }
        return $string;
    }
    /**
     * @param $filters
     *
     * @return array
     *
     * reportKPIs is used for the dashboard report on sbeadycare.
     * It returns a JSON formatted feed of summary data for each metric
     * and arrays of point data for the charts
     */
    private function reportKPIs($filters) {

        $kpis = array();
        $metrics = array();

        // Date points for the charts
        $dataPointSql = <<<SQL
select
    b.date,
	b.reading_date,
	coalesce(b.value, "") as value,
	coalesce(b.value_xeros, "") as value_xeros,
	coalesce(b.cost, "") as cost,
	coalesce(b.cost_xeros, "") as cost_xeros
from
	(
	select
	    xd.date,
	    xc.reading_date,
        :metric
	from
	    xeros_dates as xd
	    left join xeros_cycle as xc
	      on xd.date = xc.reading_date
	where
	    1 = 1
	    and xd.date >= ':fromDate' and xd.date <= ':toDate'
	    and xc.machine_id in ( :machineIds )
	group by
		xd.date,
		xc.reading_date
	) as b
where
   1 = 1
order by
	b.date
SQL;

        $summarySql = <<<SQL
select
  b.*
from
	(
	select
	    xd.date,
	    xc.reading_date,
        :metric
	from
	    xeros_dates as xd
	    left join xeros_cycle as xc
	      on xd.date = xc.reading_date
	where
	    1 = 1
	    and xd.date >= ':fromDate' and xd.date <= ':toDate'
	    and xc.machine_id in ( :machineIds )
	) as b
where
   1 = 1
order by
	b.date
SQL;
        array_push($metrics, array(
                                  "name" => "total",
                                  "meta" => array( "title" => "Total Savings", "label" => "Overall Expense", "icon" => "Globe", "cssClass" => "overall"),
                                  "query" => <<<METRIC
   		truncate(sum(xc.cycle_cold_water_cost + xc.cycle_hot_water_cost + xc.cycle_time_labor_cost + xc.cycle_chemical_cost), 0) as value,
   		truncate(sum(xc.cycle_cold_water_xeros_cost + xc.cycle_hot_water_xeros_cost + xc.cycle_time_xeros_labor_cost + xc.cycle_chemical_xeros_cost), 0) as value_xeros,
   		truncate(sum(xc.cycle_cold_water_cost + xc.cycle_hot_water_cost + xc.cycle_time_labor_cost + xc.cycle_chemical_cost), 0) as cost,
   		truncate(sum(xc.cycle_cold_water_xeros_cost + xc.cycle_hot_water_xeros_cost + xc.cycle_time_xeros_labor_cost + xc.cycle_chemical_xeros_cost), 0) as cost_xeros
METRIC
                             ));

        array_push($metrics, array(
            "name" => "cold-water",
            "meta" => array( "title" => "Cold Water", "label" => "Gallons", "icon" => "Drop", "cssClass" => "gallons"),
            "query" => <<<METRIC
   		truncate(sum(xc.cycle_cold_water_volume), 0) as value,
   		truncate(sum(xc.cycle_cold_water_xeros_volume), 0) as value_xeros,
   		truncate(sum(xc.cycle_cold_water_cost), 0) as cost,
   		truncate(sum(xc.cycle_cold_water_xeros_cost), 0) as cost_xeros
METRIC
        ));
        array_push($metrics, array(
            "name" => "hot-water",
            "meta" => array( "title" => "Hot Water", "label" => "Efficiency", "icon" => "Thermometer", "cssClass" => "efficiency"),
            "query" => <<<METRIC
   		truncate(sum(xc.cycle_hot_water_volume), 0) as value,
   		truncate(sum(xc.cycle_hot_water_xeros_volume), 0) as value_xeros,
   		truncate(sum(xc.cycle_hot_water_cost), 0) as cost,
   		truncate(sum(xc.cycle_hot_water_xeros_cost), 0) as cost_xeros
METRIC
        ));
        array_push($metrics, array(
            "name" => "cycle-time",
            "meta" => array( "title" => "Cycle Time", "label" => "Labor", "icon" => "Clock", "cssClass" => "labor"),
            "query" => <<<METRIC
   		truncate(sum(xc.cycle_time_total_time), 0) as value,
   		truncate(sum(xc.cycle_time_xeros_total_time), 0) as value_xeros,
   		truncate(sum(xc.cycle_time_labor_cost), 0) as cost,
   		truncate(sum(xc.cycle_time_xeros_labor_cost), 0) as cost_xeros
METRIC
        ));
        array_push($metrics, array(
            "name" => "chemical",
            "meta" => array( "title" => "Chemical Strength", "label" => "Usage", "icon" => "Atom", "cssClass" => "chemicals"),
            "query" => <<<METRIC
   		truncate(sum(xc.cycle_chemical_strength), 0) as value,
   		truncate(sum(xc.cycle_chemical_xeros_strength), 0) as value_xeros,
   		truncate(sum(xc.cycle_chemical_cost), 0) as cost,
   		truncate(sum(xc.cycle_chemical_xeros_cost), 0) as cost_xeros
METRIC
        ));


        foreach ( $metrics as $k => $v) {
            $ar = array (
                'name' => $v["name"],
                'meta' => $v["meta"],
                'summaryData' => array(),
                'chartData' => array()
            );

            $filters['metric'] = $v["query"];
            $conn = $this->get('database_connection');

            $summarySqlParsed = $this->replaceFilters($summarySql, $filters);

            $a = $conn->fetchAll($summarySqlParsed);
            $ar["summaryData"] = $a[0];

            $dataPointSqlParsed = $this->replaceFilters($dataPointSql, $filters);

            $ar["chartData"] = $conn->fetchAll($dataPointSqlParsed);

            array_push($kpis, $ar);
        }

        return $kpis;

    }

    /**
     * @param $filters
     *
     * @return mixed
     *
     * reportConsumption returns the data for the consumption page
     *
     */
    private function reportConsumption($filters) {
        //$json = file_get_contents($dir . "consumption.json");

        $sql = <<<SQL
SELECT
  xm.machine_id   AS id,
  xm.manufacturer AS machine_name,
  xm.serial_number,
  xm.size,
  truncate(b.cold_water_volume, 0) as cold_water_value,
  truncate(b.cold_water_xeros_volume, 0) as cold_water_xeros_value,
  truncate(b.cold_water_delta_volume, 0) as cold_water_delta_value,

  truncate(b.hot_water_volume, 0) as hot_water_value,
  truncate(b.hot_water_xeros_volume, 0) as hot_water_xeros_value,
  truncate(b.hot_water_delta_volume, 0) as hot_water_delta_value,
  
  truncate(b.total_water_volume, 0) as total_water_value,
  truncate(b.total_water_xeros_volume, 0) as total_water_xeros_value,
  truncate(b.total_water_delta_volume, 0) as total_water_delta_value,
  
  truncate(b.time_run_time, 0) as time_value,
  truncate(b.time_xeros_run_time, 0) as time_xeros_value,
  truncate(b.time_delta_run_time, 0) as time_delta_value,
  
  truncate(b.chemical_strength, 0) as chemical_value,
  truncate(b.chemical_xeros_strength, 0) as chemical_xeros_value,
  truncate(b.chemical_delta_strength, 0) as chemical_delta_value
FROM
    xeros_machine AS xm
    LEFT JOIN
    (-- metrics
     SELECT
       machine_id,
       sum(cycle_cold_water_volume)             AS cold_water_volume,
       sum(cycle_cold_water_xeros_volume)       AS cold_water_xeros_volume,
       (sum(cycle_cold_water_volume) - sum(cycle_cold_water_xeros_volume)) /
       sum(cycle_cold_water_volume)             AS cold_water_delta_volume,

       sum(cycle_hot_water_volume)              AS hot_water_volume,
       sum(cycle_hot_water_xeros_volume)        AS hot_water_xeros_volume,
       (sum(cycle_hot_water_volume) - sum(cycle_hot_water_xeros_volume)) /
       sum(cycle_hot_water_volume)              AS hot_water_delta_volume,

       sum(cycle_cold_water_volume) + sum(cycle_hot_water_volume)
                                                AS total_water_volume,
       sum(cycle_cold_water_xeros_volume) + sum(cycle_cold_water_xeros_volume)
                                                as total_water_xeros_volume,

       (( sum(cycle_cold_water_volume) + sum(cycle_hot_water_volume) ) -  ( sum(cycle_cold_water_xeros_volume) + sum(cycle_cold_water_xeros_volume) ))
           / ( sum(cycle_cold_water_volume) + sum(cycle_hot_water_volume) )  as total_water_delta_volume,

       sum(cycle_time_run_time)           AS time_run_time,
       sum(cycle_time_xeros_run_time)     AS time_xeros_run_time,
       (sum(cycle_time_run_time) - sum(cycle_time_xeros_run_time)) /
       sum(cycle_time_run_time)       AS time_delta_run_time,

       sum(cycle_chemical_strength)       AS chemical_strength,
       sum(cycle_chemical_xeros_strength) AS chemical_xeros_strength,
       (sum(cycle_chemical_strength) - sum(cycle_chemical_xeros_strength)) /
       sum(cycle_chemical_strength)       AS chemical_delta_strength
     FROM
       xeros_cycle
     WHERE
       1 = 1
       AND reading_date >= ':fromDate' AND reading_date <= ':toDate'
       and machine_id in ( :machineIds )
     GROUP BY
       machine_id
    ) AS b
      ON xm.machine_id = b.machine_id
WHERE
  1 = 1
  and xm.machine_id in ( :machineIds )

SQL;
        $sql = $this->replaceFilters($sql, $filters);
        $conn = $this->get('database_connection');
        $ar = $conn->fetchAll($sql);

        return $ar;
    }

    /**
     * @param $filters
     *
     * @return array
     *
     * Returns a structured array (JSON object) for the Consumption Details page
     */
    private function reportConsumptionDetails($filters) {

        $data = array();
        $metrics = array();

        $machinesSql = <<<machineSQL
            select
                machine_id,
                manufacturer as name,
                serial_number,
                size,
                fuel_type
            from
                xeros_machine
            where machine_id in ( :machineIds )
machineSQL;

        $classificiationSql = <<<classificationSQL
            select
                xmc.classification_id,
                xc.name
            from
                xeros_machine_classification as xmc
                 left join xeros_classification as xc
                   on xmc.classification_id = xc.classification_id
            where
                xmc.machine_id = :machine_id
classificationSQL;

        $sql = <<<SQL
            select
                xm.machine_id as id,
                xm.manufacturer as machine_name,
                xm.size,
                b.*
            from
                xeros_machine as xm
                left join
                ( -- metrics
                select
                    xc.machine_id,
                    xc.classification_id,

                    xmc.load_size,
                    xmc.xeros_load_size,

                    xcl.name,

                    :metric
                from
                    xeros_cycle as xc
                        left join xeros_machine_classification as xmc
                            on xc.machine_id = xmc.machine_id
                            and xc.classification_id = xmc.classification_id
                        left join xeros_classification as xcl
                            on xmc.classification_id = xcl.classification_id
                where
                    1 = 1
                    and reading_date >= ':fromDate' and reading_date <= ':toDate'
                    and xc.machine_id in ( :machineIds )
                group by
                    xc.machine_id,
                    xc.classification_id
                ) as b
                    on xm.machine_id = b.machine_id
            where
               1 = 1
               and xm.machine_id = :machine_id
               and b.classification_id = :classification_id
SQL;

        // TODO: Make all these field names the same
        array_push($metrics, array(
            "name" => "Cold Water",
            "id" => "cold_water",
            "query" => <<<METRIC
                'Gallons' as value_one_label,
                truncate(sum(xc.cycle_cold_water_volume), 0) as value_one,
                truncate(sum(xc.cycle_cold_water_xeros_volume), 0) as xeros_value_one,

                'Load Size' as value_two_label,
                '50' as value_two,
                '50' as xeros_value_two,

                'Gallons Per Pound' as value_three_label,
                truncate(sum(xc.cycle_cold_water_volume_per_pound), 0) as value_three,
                truncate(sum(xc.cycle_cold_water_xeros_volume_per_pound), 0) as xeros_value_three,

                'Cost Per Pound' as value_four_label,
                truncate(sum(xc.cycle_cold_water_cost_per_pound), 2) as value_four,
                truncate(sum(xc.cycle_cold_water_xeros_cost_per_pound), 2) as xeros_value_four
METRIC
        ));
        // TODO: Cost Reduction need to be total, not per pound

        array_push($metrics, array(
            "name" => "Hot Water",
            "id" => "hot_water",
            "query" => <<<METRIC
                'Gallons' as value_one_label,
                truncate(sum(xc.cycle_hot_water_volume), 0) as value_one,
                truncate(sum(xc.cycle_hot_water_xeros_volume), 0) as xeros_value_one,

                'Load Size' as value_two_label,
                '50' as value_two,
                '50' as xeros_value_two,

                'Gallons Per Pound' as value_three_label,
                truncate(sum(xc.cycle_hot_water_volume_per_pound), 0) as value_three,
                truncate(sum(xc.cycle_hot_water_xeros_volume_per_pound), 0) as xeros_value_three,

                'Cost Per Pound' as value_four_label,
                truncate(sum(xc.cycle_hot_water_cost_per_pound), 2) as value_four,
                truncate(sum(xc.cycle_hot_water_xeros_cost_per_pound), 2) as xeros_value_four
METRIC
        ));

        array_push($metrics, array(
            "name" => "Total Water",
            "id" => "total_water",
            "query" => <<<METRIC

                'Gallons' as value_one_label,
                truncate( sum(xc.cycle_hot_water_volume) + sum(xc.cycle_cold_water_volume) , 0) as value_one,
                truncate( sum(xc.cycle_hot_water_xeros_volume) + sum(xc.cycle_cold_water_xeros_volume), 0) as xeros_value_one,

                'Load Size' as value_two_label,
                '50' as value_two,
                '50' as xeros_value_two,

                'Gallons Per Pound' as value_three_label,
                truncate( sum(xc.cycle_hot_water_volume_per_pound) + sum(xc.cycle_cold_water_volume_per_pound) , 0) as value_three,
                truncate( sum(xc.cycle_hot_water_xeros_volume_per_pound) + sum(xc.cycle_cold_water_xeros_volume_per_pound)  , 0) as xeros_value_three,

                'Cost Per Pound' as value_four_label,
                truncate( sum(xc.cycle_hot_water_cost_per_pound) + sum(xc.cycle_cold_water_cost_per_pound), 2) as value_four,
                truncate( sum(xc.cycle_hot_water_xeros_cost_per_pound) + sum(xc.cycle_cold_water_xeros_cost_per_pound), 2) as xeros_value_four

METRIC
        ));

        array_push($metrics, array(
            "name" => "Cycle Time",
            "id" => "cycle_time",
            "query" => <<<METRIC

                'Total Cycle Time' as value_one_label,
                truncate(sum(xc.cycle_time_run_time), 0) as value_one,
                truncate(sum(xc.cycle_time_xeros_run_time), 0) as xeros_value_one,

                'Load Size' as value_two_label,
                '50' as value_two,
                '50' as xeros_value_two,

                'Labor Cost' as value_three_label,
                truncate(sum(xc.cycle_time_labor_cost), 0) as value_three,
                truncate(sum(xc.cycle_time_xeros_labor_cost), 0) as xeros_value_three,

                'Cost Per Pound' as value_four_label,
                truncate(sum(xc.cycle_time_labor_cost_per_pound), 2) as value_four,
                truncate(sum(xc.cycle_time_xeros_labor_cost_per_pound), 2) as xeros_value_four
METRIC
        ));

        array_push($metrics, array(
            "name" => "Chemical",
            "id" => "chemical",
            "query" => <<<METRIC

                'Total Ounces' as value_one_label,
                truncate(sum(xc.cycle_chemical_strength), 0) as value_one,
                truncate(sum(xc.cycle_chemical_xeros_strength), 0) as xeros_value_one,

                'Load Size' as value_two_label,
                '50' as value_two,
                '50' as xeros_value_two,

                'Ounces Per Pound' as value_three_label,
                truncate(sum(xc.cycle_chemical_strength_per_pound), 0) as value_three,
                truncate(sum(xc.cycle_chemical_xeros_strength_per_pound), 0) as xeros_value_three,

                'Cost Per Pound' as value_four_label,
                truncate(sum(xc.cycle_chemical_cost_per_pound), 2) as value_four,
                truncate(sum(xc.cycle_chemical_xeros_cost_per_pound), 2) as xeros_value_four
METRIC
        ));

        $conn = $this->get('database_connection');

        $machines = $conn->fetchAll($this->replaceFilters($machinesSql, $filters));

        // Machines
        foreach ($machines as $k => $machine ) {

            $machine_id = $machine["machine_id"];
            // Add the machine meta data
            $data[$machine_id] = $machine;
            $data[$machine_id]["metrics"] = array();

            // Add the machine_id filter to the sql filters
            $filters['machine_id'] = $machine["machine_id"];

            // Get all the classifications for this machine
            $classificiationSqlParsed = $this->replaceFilters($classificiationSql, $filters);
            $classifications = $conn->fetchAll($classificiationSqlParsed);

            // Metrics
            foreach ($metrics as $k2 => $metric) {

                $metric_id = $metric["id"];
                // Add the metric meta data
                $data[$machine_id]["metrics"][$metric_id] = $metric;
                $data[$machine_id]["metrics"][$metric_id]["classifications"] = array();

                // Add the metrics to the sql filter
                $filters['metric'] = $metric["query"];

                // Classifications
                foreach ($classifications as $k1 => $class) {

                    $class_id = $class["classification_id"];

                    $data[$machine_id]["metrics"][$metric_id]["classifications"][$class_id] = $class;

                    $filters['classification_id'] = $class["classification_id"];

                    $sqlParsed = $this->replaceFilters($sql, $filters);

                    $results = $conn->fetchAll($sqlParsed);

                    $data[$machine_id]["metrics"][$metric_id]["classifications"][$class_id]["data"] = $results;

                }

            }
        }

        return $data;
    }
} 