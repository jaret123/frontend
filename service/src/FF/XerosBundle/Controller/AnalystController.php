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

class AnalystController extends Controller
{

    // utility class
    private $u = NULL;

    /**
     * @return array
     * @Template()
     *
     * @Route("/analyst/{reportName}/{fromDate}/{toDate}", name="ff_analyst")
     * @Route("/analyst/{reportName}/{fromDate}/{toDate}/{locationId}", name="ff_analyst_location", defaults={"locationId" = null})

     *
     * reportAction handles the routing of request to the functions below
     * reportName maps to a function call below and fromDate adn toDate are
     * SQL formatted dates ('YYYY-MM-DD')
     */
    public function AnalystAction($reportName, $fromDate = null, $toDate = null, $locationId = null)
    {

        $this->u = new Utils();
        $conn = $this->get('database_connection');

        $userRole = $this->u->getUserRole($conn, $locationId);

      // Double check security filters on CSV controller and ReportController.  CSV controller looks a little too open.
        if ( $userRole['uid'] === NULL or $userRole['uid'] === 0 ) {
          // TODO: Limit this to "xeros analyst" role
            return array ("message" => "Access denied");
        } else {
            $filters = array(
                'fromDate' => $fromDate,
                'toDate' => $toDate,
                'machineIds' => $this->u->arrayToString($userRole["machine_ids"])
            );

            switch ($reportName) {
                case "reportDAIMeterActual":
                    $data = $this->reportDAIMeterActual($filters);
                    break;
                case "reportDAIMeterCollection":
                  $data = $this->reportDAIMeterCollection($filters);
                  break;
                case "reportDAIMeterCollectionDetail":
                  $data = $this->reportDAIMeterCollectionDetail($filters);
                  break;
            }

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

          return $response;

        }
    }

    private function reportDAIMeterActual($filters) {
        $conn = $this->get('database_connection');

        $sql = <<<SQL
select
    *
  from
    xeros_dai_meter_actual
  WHERE
    reading_timestamp >= ':fromDate'
    AND reading_timestamp <= ':toDate'
    AND machine_id in ( :machineIds )
  ORDER BY
    dai_meter_actual_id
SQL;

        $sqlParsed = $this->u->replaceFilters($sql, $filters);
        $data = $conn->fetchAll($sqlParsed);

        return $data;
    }

    private function reportDAIMeterCollection($filters) {
      $conn = $this->get('database_connection');

      $sql = <<<SQL
  select
      *
    from
      xeros_dai_meter_collection
    WHERE
      dai_write_timestamp >= ':fromDate'
      AND dai_write_timestamp <= ':toDate'
      AND machine_id in ( :machineIds )
    ORDER BY
      id
SQL;

      $sqlParsed = $this->u->replaceFilters($sql, $filters);
      $data = $conn->fetchAll($sqlParsed);

      return $data;
    }

    private function reportDAIMeterCollectionDetail($filters) {
      $conn = $this->get('database_connection');

      $sql = <<<SQL
        select
          *
        from
          xeros_dai_meter_collection_detail
        WHERE
          collection_id in (
            select
              id
            from
              xeros_dai_meter_collection
            WHERE
              dai_write_timestamp >= ':fromDate'
              AND dai_write_timestamp <= ':toDate'
              AND machine_id in ( :machineIds )
          )
      ORDER BY id
SQL;

      $sqlParsed = $this->u->replaceFilters($sql, $filters);
      $data = $conn->fetchAll($sqlParsed);

      return $data;
    }
}