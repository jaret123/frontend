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
     * @Route("/report/{uid}/{id}/{fromDate}/{toDate}.{_format}")
     */
    public function reportAction($uid, $id, $fromDate, $toDate)
    {
        // Resources directory
        $dir = __DIR__ . '/../Resources/data/';

        $userRole = $this->userRole();

        // {id} = Report ID
        switch ($id) {
            case "users":
                $sql = sprintf("SELECT * FROM users WHERE uid = '%s'", $uid);
                $conn = $this->get('database_connection');
                $users = $conn->fetchAll($sql);

                return array ("report" => $users);
                break;
            case "kpis":

                $ar = $this->reportKPIs($dir);
                break;
            case "consumption":

                $ar = $this->reportConsumption();
                break;
            case "consumptionDetails":
                $ar = $this->reportConsumptionDetails();
                break;
            case "news":
                $json = file_get_contents($dir . "news.json");
                break;
        }

         //$ar = json_decode($json, true);
        return array ("data" => $ar);
    }

    private function userRole()
    {
        foreach ($_COOKIE as $key => $value)
        {
            if ( substr($key, 0, 4) == 'SESS' ) {
                $sid = $value;
            }
        }

        $sql = sprintf("SELECT * FROM sessions WHERE sid = '%s'", $sid);
        $conn = $this->get('database_connection');
        $user = $conn->fetchAll($sql);

        return array ("uid" => $user[0]['uid'], "role" => 'role', "location" => 'location');
    }

    private function reportKPIs() {

        $sql = <<<SQL
select
	b.*
from
	( -- metrics
	select
	    xd.date,
	    xc.reading_date,
   		sum(xc.cycle_cold_water_volume) as cold_water_volume,
   		sum(xc.cycle_cold_water_xeros_volume) as cold_water_xeros_volume,
   		sum(xc.cycle_cold_water_cost) as cold_water_cost,
   		sum(xc.cycle_cold_water_xeros_cost) as cold_water_xeros_cost,

   		sum(xc.cycle_hot_water_volume) as hot_water_volume,
   		sum(xc.cycle_hot_water_volume) as hot_water_xeros_volume,
   		sum(xc.cycle_hot_water_cost) as hot_water_cost,
   		sum(xc.cycle_hot_water_xeros_cost) as hot_water_xeros_cost,

   		sum(xc.cycle_time_total_time) as time_total_time,
   		sum(xc.cycle_time_xeros_total_time) as time_xeros_total_time,
   		sum(xc.cycle_time_labor_cost) as time_labor_cost,
   		sum(xc.cycle_time_xeros_labor_cost) as time_xeros_labor_cost,

   		sum(xc.cycle_chemical_strength) as chemical_strength,
   		sum(xc.cycle_chemical_xeros_strength) as chemical_strength_xeros,
   		sum(xc.cycle_chemical_cost) as chemical_cost,
   		sum(xc.cycle_chemical_xeros_cost) as chemical_xeros_cost
	from
	    xeros_dates as xd
	    left join xeros_cycle as xc
	      on xd.date = xc.reading_date
	where
	    1 = 1
	    and xd.date > '2013-11-28' and xd.date < '2013-12-12'
	group by
		xd.date,
		xc.reading_date
	) as b
where
   1 = 1
order by
	b.date
SQL;

        $conn = $this->get('database_connection');
        $ar = $conn->fetchAll($sql);

        return $ar;

    }

    private function reportConsumption() {
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
   		-- machine_id = 1
   		-- put in date ranges
	group by
   		machine_id
	) as b
	    on xm.machine_id = b.machine_id
where
   1 = 1
   # put in location filter;


SQL;
        $conn = $this->get('database_connection');
        $ar = $conn->fetchAll($sql);

        return $ar;
    }

    private function reportConsumptionDetails() {

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
   		-- put in date ranges
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

        $conn = $this->get('database_connection');
        $ar = $conn->fetchAll($sql);

        return $ar;
    }
} 