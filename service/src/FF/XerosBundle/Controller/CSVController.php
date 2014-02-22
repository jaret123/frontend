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
     * @Route("/csv/{fromDate}/{toDate}")
     *
     * reportAction handles the routing of request to the functions below
     * reportName maps to a function call below and fromDate adn toDate are
     * SQL formatted dates ('YYYY-MM-DD')
     */
    public function CSVAction($fromDate, $toDate)
    {

        $this->u = new Utils();
        $conn = $this->get('database_connection');

        $userRole = $this->u->getUserRole($conn);

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
  SELECT * FROM xeros_cycle
  WHERE
    reading_date >= ':fromDate'
    AND reading_date <= ':toDate'
    AND machine_id in ( :machineIds )
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