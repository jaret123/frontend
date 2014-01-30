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
     */
    public function reportAction($reportName, $fromDate, $toDate)
    {
        // Resources directory
        $dir = __DIR__ . '/../Resources/data/';

        $userRole = $this->userRole();

        if ( $userRole['uid'] === NULL or $userRole['uid'] === 0 ) {
            return array ("message" => "Access denied");
        } else {
            $filters = array(
                'fromDate' => $fromDate,
                'toDate' => $toDate
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
                    break;
            }

             //$ar = json_decode($json, true);
            return array ("data" => $ar);
        }
    }

    private function userRole()
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
                $userRole = array ("uid" => $user[0]['uid'], "role" => 'role', "location" => 'location');
            } else {
                // Access denied
                // Do nothing
            }
        }
        return $userRole;
    }

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
	coalesce(b.cost_xeros, "") as cost_xeros,
	coalesce(b.savings, "") as savings
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
	) as b
where
   1 = 1
order by
	b.date
SQL;


        array_push($metrics, array(
            "name" => "cold-water",
            "meta" => array( "title" => "Cold Water", "label" => "Gallons", "icon" => "Drop", "cssClass" => "gallons"),
            "query" => <<<METRIC
   		truncate(sum(xc.cycle_cold_water_volume), 0) as value,
   		truncate(sum(xc.cycle_cold_water_xeros_volume), 0) as value_xeros,
   		truncate(sum(xc.cycle_cold_water_cost), 0) as cost,
   		truncate(sum(xc.cycle_cold_water_xeros_cost), 0) as cost_xeros,
   		truncate(
   		    100 * (
   		           ( sum(xc.cycle_cold_water_cost) - sum(xc.cycle_cold_water_xeros_cost) )
   		             / sum(xc.cycle_cold_water_cost)
   		           )
   		           , 0) as savings
METRIC
        ));
        array_push($metrics, array(
            "name" => "hot-water",
            "meta" => array( "title" => "Hot Water", "label" => "Efficiency", "icon" => "Thermometer", "cssClass" => "efficiency"),
            "query" => <<<METRIC
   		truncate(sum(xc.cycle_hot_water_volume), 0) as value,
   		truncate(sum(xc.cycle_hot_water_volume), 0) as value_xeros,
   		truncate(sum(xc.cycle_hot_water_cost), 0) as cost,
   		truncate(sum(xc.cycle_hot_water_xeros_cost), 0) as cost_xeros,
   		truncate(
   		   		100 * (
   		   		    ( sum(xc.cycle_hot_water_cost) - sum(xc.cycle_hot_water_xeros_cost) )
   		   		    / sum(xc.cycle_hot_water_cost)
   		   		    )
   		   		    , 0) as savings
METRIC
        ));
        array_push($metrics, array(
            "name" => "cycle-time",
            "meta" => array( "title" => "Cycle Time", "label" => "Labor", "icon" => "Clock", "cssClass" => "labor"),
            "query" => <<<METRIC
   		truncate(sum(xc.cycle_time_total_time), 0) as value,
   		truncate(sum(xc.cycle_time_xeros_total_time), 0) as value_xeros,
   		truncate(sum(xc.cycle_time_labor_cost), 0) as cost,
   		truncate(sum(xc.cycle_time_xeros_labor_cost), 0) as cost_xeros,
   		truncate(
   		        100 * (
   		            (  sum(xc.cycle_time_labor_cost) - sum(xc.cycle_time_xeros_labor_cost) )
   		            / sum(xc.cycle_time_labor_cost)
   		            )
   		            , 0) as savings
METRIC
        ));
        array_push($metrics, array(
            "name" => "chemical",
            "meta" => array( "title" => "Chemical Strength", "label" => "Usage", "icon" => "Atom", "cssClass" => "chemicals"),
            "query" => <<<METRIC
   		truncate(sum(xc.cycle_chemical_strength), 0) as value,
   		truncate(sum(xc.cycle_chemical_xeros_strength), 0) as value_xeros,
   		truncate(sum(xc.cycle_chemical_cost), 0) as cost,
   		truncate(sum(xc.cycle_chemical_xeros_cost), 0) as cost_xeros,
   	    truncate(
   	            100 * (
   	            (  sum(xc.cycle_chemical_cost) - sum(xc.cycle_chemical_xeros_cost) )
   	             / sum(xc.cycle_chemical_cost)
   	             )
   	             , 0) as savings
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

    private function replaceFilters($string, $filters) {
        foreach ($filters as $k => $v) {
            $string = str_replace(':' . $k, $v, $string);
        }
        return $string;
    }

    private function reportConsumption($filters) {
        //$json = file_get_contents($dir . "consumption.json");

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
	    machine_id,
   		sum(cycle_cold_water_volume) as cold_water_volume,
   		sum(cycle_cold_water_xeros_volume) as cold_water_xeros_volume,
   		sum(cycle_hot_water_volume) as hot_water_volume,
   		sum(cycle_hot_water_volume) as hot_water_xeros_volume,
   		sum(cycle_time_run_time) as time_run_time,
   		sum(cycle_time_xeros_run_time) as time_xeros_run_time,
   		sum(cycle_chemical_strength) as chemical_strength,
   		sum(cycle_chemical_xeros_strength) as chemical_strength_xeros
	from
   		xeros_cycle
	where
	    1 = 1
   	    and reading_date >= ':fromDate' and reading_date <= ':toDate'
	group by
   		machine_id
	) as b
	    on xm.machine_id = b.machine_id
where
   1 = 1
   # put in location filter;


SQL;
        $sql = $this->replaceFilters($sql, $filters);
        $conn = $this->get('database_connection');
        $ar = $conn->fetchAll($sql);

        return $ar;
    }

    private function reportConsumptionDetails($filters) {

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

   		sum(xc.cycle_cold_water_volume) as cold_water_volume,
   		sum(xc.cycle_cold_water_xeros_volume) as cold_water_xeros_volume,
   		sum(xc.cycle_cold_water_volume_per_pound) as cold_water_volume_per_pound,
   		sum(xc.cycle_cold_water_xeros_volume_per_pound) as cold_water_xeros_volume_per_pound,
   		sum(xc.cycle_cold_water_cost_per_pound) as cold_water_cost_per_pound,
   		sum(xc.cycle_cold_water_xeros_cost_per_pound) as cold_water_xeros_cost_per_pound,
   		sum(xc.cycle_cold_water_volume_per_pound) -
   		    sum(xc.cycle_cold_water_xeros_volume_per_pound)  as cold_water_volume_per_pound_delta,
   		sum(xc.cycle_cold_water_cost_per_pound) /
   		    sum(xc.cycle_cold_water_xeros_cost_per_pound) as cold_water_cost_per_pound_delta,

   		sum(xc.cycle_hot_water_volume) as hot_water_volume,
   		sum(xc.cycle_hot_water_volume) as hot_water_xeros_volume,
   		sum(xc.cycle_hot_water_volume_per_pound) as hot_water_volume_per_pound,
   		sum(xc.cycle_hot_water_xeros_volume_per_pound) as hot_water_xeros_volume_per_pound,
   		sum(xc.cycle_hot_water_cost_per_pound) as hot_water_cost_per_pound,
   		sum(xc.cycle_hot_water_xeros_cost_per_pound) as hot_water_xeros_cost_per_pound,
   		   		sum(xc.cycle_hot_water_volume_per_pound) -
   		    sum(xc.cycle_hot_water_xeros_volume_per_pound)  as hot_water_delta_volume_per_pound,
   		sum(xc.cycle_hot_water_cost_per_pound) /
   		    sum(xc.cycle_hot_water_xeros_cost_per_pound) as hot_water_delta_cost_per_pound,

   		sum(xc.cycle_time_run_time) as time_run_time,
   		sum(xc.cycle_time_xeros_run_time) as time_xeros_run_time,
   		sum(xc.cycle_time_total_time) as time_total_time,
   		sum(xc.cycle_time_xeros_total_time) as time_xeros_total_time,
   		sum(xc.cycle_time_labor_cost) as time_labor_cost,
   		sum(xc.cycle_time_xeros_labor_cost) as time_xeros_labor_cost,
   		sum(xc.cycle_time_labor_cost_per_pound) as time_labor_cost_per_pound,
   		sum(xc.cycle_time_xeros_labor_cost_per_pound) as time_xeros_labor_cost_per_pound,
   		sum(xc.cycle_time_total_time) /
   		sum(xc.cycle_time_xeros_total_time) as time_delta_total_time,
   		sum(xc.cycle_time_labor_cost_per_pound) /
   		   		sum(xc.cycle_time_xeros_labor_cost_per_pound) as time_delta_labor_cost_per_pound,



   		sum(xc.cycle_chemical_strength) as chemical_strength,
   		sum(xc.cycle_chemical_xeros_strength) as chemical_strength_xeros,
   		sum(xc.cycle_chemical_strength_per_pound) as chemical_strength_per_pound,
   		sum(xc.cycle_chemical_xeros_strength_per_pound) as chemical_xeros_strength_per_pound,
   		sum(xc.cycle_chemical_cost_per_pound) as chemical_cost_per_pound,
   		sum(xc.cycle_chemical_xeros_cost_per_pound) as chemical_xeros_cost_per_pound,
   		sum(xc.cycle_chemical_strength_per_pound) /
   		sum(xc.cycle_chemical_xeros_strength_per_pound) as chemical_delta_strength_per_pound,
   		sum(xc.cycle_chemical_cost_per_pound) /
   		sum(xc.cycle_chemical_xeros_cost_per_pound) as chemical_delta_cost_per_pound

	from
   		xeros_cycle as xc
   		    left join xeros_machine_classification as xmc
        		on xc.machine_id = xmc.machine_id
        		and xc.classification_id = xmc.classification_id
         	left join xeros_classification as xcl
         		on xmc.classification_id = xcl.classification_id
	where
	    1 = 1
   		AND xc.machine_id = 1
        and reading_date >= ':fromDate' and reading_date =< ':toDate'
	group by
   		xc.machine_id,
   		xc.classification_id
	) as b
	    on xm.machine_id = b.machine_id
where
   1 = 1
   and xm.machine_id = 1
   # put in location filter;

SQL;

        $sql = $this->replaceFilters($sql, $filters);
        $conn = $this->get('database_connection');
        $ar = $conn->fetchAll($sql);

        return $ar;
    }
} 