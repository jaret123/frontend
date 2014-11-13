<?php
/**
 * Created by PhpStorm.
 * User: acheson
 * Date: 1/15/14
 * Time: 4:33 PM
 */

namespace FF\XerosBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FF\XerosBundle\Utils\Utils;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\Annotations\View;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class ReportController extends Controller {

    private $u = NULL;
    /**
     * @return array
     * @View()
     * @Route("/report/{reportName}/{fromDate}/{toDate}.{_format}", name="ff_report")
     * @Route("/report/{reportName}/{fromDate}/{toDate}/{locationId}.{_format}", name="ff_report_location", defaults={"locationId" = null})

     *
     * reportAction handles the routing of request to the functions below
     * reportName maps to a function call below and fromDate adn toDate are
     * SQL formatted dates ('YYYY-MM-DD')
     */

    // TODO : Add company ID and location ID as optional parameters.
    // Only use them if the user is a Xeros Admin
    public function reportAction($reportName, $fromDate, $toDate, $locationId = null)
    {

        // Resources directory
        $dir = __DIR__ . '/../Resources/data/';

        $this->u = new Utils();
        $conn = $this->get('database_connection');

        $userRole = $this->u->getUserRole($conn, $locationId);

        if ( $userRole['uid'] === NULL or $userRole['uid'] === 0 ) {
            return array ("message" => "Access denied");
        } else {

            $filters = array(
                'fromDate' => $fromDate,
                'toDate' => $toDate . ' 12:59:59',
                'machineIds' => $this->u->arrayToString($userRole["machine_ids"]),
                'water_only_diff' => $this->u->getStaticValue($conn, "water_only_diff")
            );

            switch ($reportName) {
                case "kpis":
                    $machine_type = $this->u->getLocationMachineTypes($conn, $userRole['location']);
                    $ar = $this->reportKPIs($filters, $machine_type);
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
     * @param $filters
     * @param $machine_type
     *
     * @return array
     *
     * reportKPIs is used for the dashboard report on sbeadycare.
     * It returns a JSON formatted feed of summary data for each metric
     * and arrays of point data for the charts
     */
    private function reportKPIs($filters, $machine_type) {

        $kpis = array();
        $metrics = array();

        // HACK: This is to filter out Xeros data if comparing non-xeros machines and vice-versa
        // Default is only non-xeros machines
        switch ($machine_type) {
          case "xeros":
            $filters['machine_type_filter'] = "and xc.manufacturer = 'xeros'";
            break;
          case "non-xeros":
            $filters['machine_type_filter'] = "and xc.manufacturer <> 'xeros'";
            break;
          case "both":
            $filters['machine_type_filter'] = "";
            break;
          default:
            $filters['machine_type_filter'] = "and xc.manufacturer <> 'xeros'";
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
	coalesce(b.value, 0) as value,
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


      switch ($machine_type) {
        case "xeros":
          // Cold Water
          array_push($metrics, array(
              "name" => "cold-water",
              "query" => <<<METRIC
   		sum(truncate(xc.cycle_cold_water_volume, 0)) as value,
   		sum(truncate(xc.cycle_cold_water_volume, 0) * 4) as value_xeros, -- Model data
   		sum(coalesce(xc.cycle_cold_water_cost, 0)) as cost,
   		sum(coalesce(xc.cycle_cold_water_cost, 0) * 4) as cost_xeros -- Model data
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

            $filters['metric'] = $this->u->replaceFilters($v["query"], $filters);
            $conn = $this->get('database_connection');



            $summarySqlParsed = $this->u->replaceFilters($summarySql, $filters);

            // BUG - Check whether we get data before we process it or send back a notice
            // LOG all SQL requests
            $a = $conn->fetchAll($summarySqlParsed);

            $ar["summaryData"] = $a[0];

            $dataPointSqlParsed = $this->u->replaceFilters($dataPointSql, $filters);

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
  xm.machine_name AS machine_name,
  xm.manufacturer AS manufacturer,
  xm.serial_number,
  xm.size,
  xm.water_only,
  b.cycles,
  truncate(b.cold_water_value, 0) as cold_water_value,
  case xm.water_only
	when 1 then
		:water_only_diff * coalesce(b.cold_water_value, 0)
	else
		coalesce(b.cold_water_xeros_value, 0)
  end as cold_water_xeros_value,
  truncate(b.hot_water_value, 0) as hot_water_value,
  truncate(coalesce(b.hot_water_xeros_value, 0), 0) as hot_water_xeros_value,
  
  truncate(b.time_total_time, 0) as time_value,
  truncate(b.time_xeros_total_time, 0) as time_xeros_value,
  
  truncate(b.chemical_strength, 0) as chemical_value,
  truncate(b.chemical_xeros_strength, 0) as chemical_xeros_value

FROM
    xeros_machine AS xm
    LEFT JOIN
    (-- metrics
     SELECT
       machine_id,
       count(*) as cycles,
       sum(cycle_cold_water_volume) AS cold_water_value,
       sum(cycle_cold_water_xeros_volume) as cold_water_xeros_value,

       sum(cycle_therms)              AS hot_water_value,
       sum(cycle_therms_xeros)        AS hot_water_xeros_value,

       sum(cycle_time_total_time)           AS time_total_time,
       sum(cycle_time_xeros_total_time)     AS time_xeros_total_time,

       sum(cycle_chemical_strength)       AS chemical_strength,
       sum(cycle_chemical_xeros_strength) AS chemical_xeros_strength

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
        $sql = $this->u->replaceFilters($sql, $filters);
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

        $logger = $this->get('logger');
        $logger->info('I just got the logger');

        $logger->info('Started reportConsumptionDetails');

        $data = array();
        $metrics = array();

        $machinesSql = <<<machineSQL
            select
                machine_id,
                machine_name as machine_name,
                manufacturer as manufacturer,
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
                xmc.load_size,
                xmc.xeros_load_size,
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
                inner join
                ( -- metrics
                select
                    xc.machine_id,
                    xc.classification_id,
                    count(*) as cycles,
                    :metric
                from
                    xeros_cycle as xc
                where
                    reading_date >= ':fromDate' and reading_date <= ':toDate'
                    and xc.machine_id = :machine_id
                    and xc.classification_id = :classification_id
                ) as b
                   on b.machine_id = xm.machine_id
SQL;

        // TODO: Make all these field names the same
        array_push($metrics, array(
            "name" => "Water Sewer",
            "id" => "cold_water",
            "query" => <<<METRIC

                sum(xc.cycle_cold_water_volume) as value_one,
                sum(xc.cycle_cold_water_xeros_volume) as xeros_value_one,

                avg(xc.cycle_cold_water_volume_per_pound) as value_three,
                avg(xc.cycle_cold_water_xeros_volume_per_pound) as xeros_value_three,

                avg(xc.cycle_cold_water_cost_per_pound) as value_four,
                avg(xc.cycle_cold_water_xeros_cost_per_pound) as xeros_value_four
METRIC
        ));

        array_push($metrics, array(
            "name" => "Therms",
            "id" => "hot_water",
            "query" => <<<METRIC
                sum(xc.cycle_hot_water_volume) as value_one,
                sum(xc.cycle_hot_water_xeros_volume) as xeros_value_one,

                avg(xc.cycle_therms_per_pound) as value_three,
                avg(xc.cycle_therms_per_pound_xeros) as xeros_value_three,

                avg(xc.cycle_therm_cost_per_pound) as value_four,
                avg(xc.cycle_therm_cost_per_pound_xeros) as xeros_value_four
METRIC
        ));
        array_push($metrics, array(
            "name" => "Cycle Time",
            "id" => "cycle_time",
            "query" => <<<METRIC

                sum(xc.cycle_time_total_time) as value_one,
                sum(xc.cycle_time_xeros_total_time) as xeros_value_one,

                sum(xc.cycle_time_labor_cost) as value_three,
                sum(xc.cycle_time_xeros_labor_cost) as xeros_value_three,

                avg(xc.cycle_time_labor_cost_per_pound) as value_four,
                avg(xc.cycle_time_xeros_labor_cost_per_pound) as xeros_value_four
METRIC
        ));
        array_push($metrics, array(
            "name" => "Chemical",
            "id" => "chemical",
            "query" => <<<METRIC

                sum(xc.cycle_chemical_strength) as value_one,
                sum(xc.cycle_chemical_xeros_strength) as xeros_value_one,

                avg(xc.cycle_chemical_strength_per_pound) as value_three,
                avg(xc.cycle_chemical_xeros_strength_per_pound) as xeros_value_three,

                avg(xc.cycle_chemical_cost_per_pound) as value_four,
                avg(xc.cycle_chemical_xeros_cost_per_pound) as xeros_value_four
METRIC
        ));

        $conn = $this->get('database_connection');

        $machines = $conn->fetchAll($this->u->replaceFilters($machinesSql, $filters));
        $logger->info('get machines  ' . $machinesSql);

        // Machines
        foreach ($machines as $k => $machine ) {

            $machine_id = $machine["machine_id"];
            // Add the machine meta data
            $data[$machine_id] = $machine;
            $data[$machine_id]["metrics"] = array();

            // Add the machine_id filter to the sql filters
            $filters['machine_id'] = $machine["machine_id"];

            // Get all the classifications for this machine
            $classificiationSqlParsed = $this->u->replaceFilters($classificiationSql, $filters);
            $classifications = $conn->fetchAll($classificiationSqlParsed);

            $logger->info('get classifications  ');

            // Metrics
            foreach ($metrics as $k2 => $metric) {

                $metric_id = $metric["id"];

                $logger->info('metric id'  . $metric_id);
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

                    $sqlParsed = $this->u->replaceFilters($sql, $filters);

                    $results = $conn->fetchAll($sqlParsed);

                    $logger->info('get classification data ' . $class["classification_id"] );

                    $data[$machine_id]["metrics"][$metric_id]["classifications"][$class_id]["data"] = $results;

                    unset($data[$machine_id]["metrics"][$metric_id]["query"]);
                }

            }
        }

        return $data;
    }

} 