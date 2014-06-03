<?php

namespace FF\XerosBundle\Controller;

use Doctrine\DBAL\Sharding\SQLAzure\SQLAzureFederationsSynchronizer;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use FF\XerosBundle\Utils\Utils;
use FOS\RestBundle\Controller\Annotations\View;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class CSVController extends Controller
{

    // utility class
    private $u = NULL;

    /**
     * @return array
     * @Template()
     *
     * @Route("/csv/{fromDate}/{toDate}", name="ff_csv")
     * @Route("/csv/{fromDate}/{toDate}/{locationId}", name="ff_csv_location", defaults={"locationId" = null})

     *
     * reportAction handles the routing of request to the functions below
     * reportName maps to a function call below and fromDate adn toDate are
     * SQL formatted dates ('YYYY-MM-DD')
     */
    public function CSVAction($fromDate, $toDate, $locationId = null)
    {

        $this->u = new Utils();
        $conn = $this->get('database_connection');

        $userRole = $this->u->getUserRole($conn, $locationId);

        if ( $userRole['uid'] === NULL or $userRole['uid'] === 0 ) {
            return array ("message" => "Access denied");
        } else {
            $filters = array(
                'fromDate' => $fromDate,
                'toDate' => $toDate,
                'machineIds' => $this->u->arrayToString($userRole["machine_ids"])
            );

//            switch ($reportName) {
//                case "kpis":
//                    $ar = $this->reportKPIs($filters);
//                    break;
//                case "consumption":
//                    $ar = $this->reportConsumption($filters);
//                    break;
//                case "consumptionDetails":
//                    $ar = $this->reportConsumptionDetails($filters);
//                    break;
//                case "news":
//                    $json = file_get_contents($dir . "news.json");
//                    $ar = json_decode($json, true);
//                    break;
//            }

            //$ar = json_decode($json, true);
            //return array ("data" => $ar);

            $response = $this->cycleData($filters);
            return $response;
        }
    }

    private function cycleData($filters) {
        $conn = $this->get('database_connection');

        $sql = <<<SQL
select
    xc.dai_meter_actual_id as 'Meter ID',
    xc.machine_id as 'Machine ID',
    xm.model as 'Machine Model',
    xm.serial_number as 'Machine Serial Number',
    xm.manufacturer as 'Machine Manufacturer',
    xc.classification_id as 'Classification ID',
    xc.reading_timestamp as 'Reading Date',
    xc.cycle_load_size as 'Load Size',
    xc.cycle_xeros_load_size as 'Load Size (Xeros)',
    xc.cycle_cold_water_volume as 'Cold Water Volume',
    xc.cycle_cold_water_xeros_volume as 'Cold Water Volume (Xeros)',
    xc.cycle_cold_water_cost as 'Cold Water Cost',
    xc.cycle_cold_water_xeros_cost as 'Cold Water Cost (Xeros)',
    xc.cycle_cold_water_volume_per_pound as 'Cold Water Volume Per Pound',
    xc.cycle_cold_water_xeros_volume_per_pound as 'Cold Water Volume Per Pound (Xeros)',
    xc.cycle_cold_water_cost_per_pound as 'Cold Water Cost Per Pound',
    xc.cycle_cold_water_xeros_cost_per_pound as 'Cold Water Cost Per Pound (Xeros)',
    xc.cycle_hot_water_volume as 'Hot Water Volume',
    xc.cycle_therms as 'Therms',
    xc.cycle_therms_xeros as 'Therms (Xeros)',
    xc.cycle_therms_cost as 'Therms Cost',
    xc.cycle_therms_cost_xeros as 'Therms Cost (Xeros)',
    xc.cycle_therms_per_pound as 'Therms Per Pound',
    xc.cycle_therms_per_pound_xeros as 'Therms Per Pound (Xeros)',
    xc.cycle_therm_cost_per_pound as 'Therms Cost Per Pound',
    xc.cycle_therm_cost_per_pound_xeros as 'Therms Cost Per Pound (Xeros)',
    xc.cycle_time_total_time as 'Cycle Time',
    xc.cycle_time_xeros_total_time as 'Cycle Time (Xeros)',
    xc.cycle_time_labor_cost as 'Labor Cost',
    xc.cycle_time_xeros_labor_cost as 'Labor Cost (Xeros)',
    xc.cycle_time_labor_cost_per_pound as 'Labor Cost Per Pound',
    xc.cycle_time_xeros_labor_cost_per_pound as 'Labor Cost Per Pound (Xeros)',
    xc.cycle_chemical_cost as 'Chemical Cost',
    xc.cycle_chemical_xeros_cost as 'Chemical Cost (Xeros)',
    xc.cycle_chemical_cost_per_pound as 'Chemical Cost Per Pound',
    xc.cycle_chemical_xeros_cost_per_pound as 'Chemical Cost Per Pound (Xeros)',
    xc.cycle_chemical_strength as 'Chemical Volume',
    xc.cycle_chemical_xeros_strength as 'Chemical Volume (Xeros)',
    xc.cycle_chemical_strength_per_pound as 'Chemical Volume Per Pound',
    xc.cycle_chemical_xeros_strength_per_pound as 'Chemical Volume Per Pound (Xeros)'
  FROM
    xeros_cycle as xc
    left join xeros_machine as xm
      on xc.machine_id = xm.machine_id
  WHERE
    reading_date >= ':fromDate'
    AND xc.reading_date <= ':toDate'
    AND xc.machine_id in ( :machineIds )
  ORDER BY
    xc.reading_date,
    xc.machine_id,
    xc.classification_id
SQL;

        $sqlParsed = $this->u->replaceFilters($sql, $filters);

        $data = $conn->fetchAll($sqlParsed);

        $fromDate = $filters['fromDate'];
        $toDate = $filters['toDate'];

        $response = $this->render('FFXerosBundle:CSV:csvfile.html.twig', array(
                                                                              'fromDate' => $fromDate,
                                                                              'toDate' => $toDate,
                                                                              'data' => $data
                                                                         ));

        $filename = "xeros-data.csv";

        $response->setStatusCode(200);
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Description', 'Submissions Export');
        $response->headers->set('Content-Disposition', 'attachment; filename=' . $filename);
        $response->headers->set('Content-Transfer-Encoding', 'binary');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');

//$response->prepare($response);
//        $response->sendHeaders();
//        $response->sendContent();
        return $response;
    }
}