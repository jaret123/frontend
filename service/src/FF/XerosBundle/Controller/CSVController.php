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
     * @Route("/csv/{fromDate}/{toDate}.{_format}", name="ff_csv")
     * @Route("/csv/{fromDate}/{toDate}/{locationId}.{_format}", name="ff_csv_location", defaults={"locationId" = null})

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
    dai_meter_actual_id as 'Meter ID',
    machine_id as 'Machine ID',
    classification_id as 'Classification ID',
    reading_timestamp as 'Reading Date',
    cycle_load_size as 'Load Size',
    cycle_xeros_load_size as 'Load Size (Xeros)',
    cycle_cold_water_volume as 'Cold Water Volume',
    cycle_cold_water_xeros_volume as 'Cold Water Volume (Xeros)',
    cycle_cold_water_cost as 'Cold Water Cost',
    cycle_cold_water_xeros_cost as 'Cold Water Cost (Xeros)',
    cycle_cold_water_volume_per_pound as 'Cold Water Volume Per Pound',
    cycle_cold_water_xeros_volume_per_pound as 'Cold Water Volume Per Pound (Xeros)',
    cycle_cold_water_cost_per_pound as 'Cold Water Cost Per Pound',
    cycle_cold_water_xeros_cost_per_pound as 'Cold Water Cost Per Pound (Xeros)',
    cycle_hot_water_volume as 'Hot Water Volume',
    cycle_therms as 'Therms',
    cycle_therms_xeros as 'Therms (Xeros)',
    cycle_therms_cost as 'Therms Cost',
    cycle_therms_cost_xeros as 'Therms Cost (Xeros)',
    cycle_therms_per_pound as 'Therms Per Pound',
    cycle_therms_per_pound_xeros as 'Therms Per Pound (Xeros)',
    cycle_therm_cost_per_pound as 'Therms Cost Per Pound',
    cycle_therm_cost_per_pound_xeros as 'Therms Cost Per Pound (Xeros)',
    cycle_time_total_time as 'Cycle Time',
    cycle_time_xeros_total_time as 'Cycle Time (Xeros)',
    cycle_time_labor_cost as 'Labor Cost',
    cycle_time_xeros_labor_cost as 'Labor Cost (Xeros)',
    cycle_time_labor_cost_per_pound as 'Labor Cost Per Pound',
    cycle_time_xeros_labor_cost_per_pound as 'Labor Cost Per Pound (Xeros)',
    cycle_chemical_cost as 'Chemical Cost',
    cycle_chemical_xeros_cost as 'Chemical Cost (Xeros)',
    cycle_chemical_cost_per_pound as 'Chemical Cost Per Pound',
    cycle_chemical_xeros_cost_per_pound as 'Chemical Cost Per Pound (Xeros)',
    cycle_chemical_strength as 'Chemical Volume',
    cycle_chemical_xeros_strength as 'Chemical Volume (Xeros)',
    cycle_chemical_strength_per_pound as 'Chemical Volume Per Pound',
    cycle_chemical_xeros_strength_per_pound as 'Chemical Volume Per Pound (Xeros)'
  from
    xeros_cycle
  WHERE
    reading_date >= ':fromDate'
    AND reading_date <= ':toDate'
    AND machine_id in ( :machineIds )
  ORDER BY
    reading_date,
    machine_id,
    classification_id
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