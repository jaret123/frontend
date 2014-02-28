<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 2/27/14
 * Time: 1:34 PM
 */

namespace FF\XerosBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FF\XerosBundle\Utils\Utils;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\Annotations\View;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class DiagController extends Controller {

    private $u;
    private $filters;
    private $conn;
    /**
     * @return array
     * @View()
     * @Route("/diag/{machineId}/{fromDate}/{toDate}.{_format}")
     *
     * reportAction handles the routing of request to the functions below
     * reportName maps to a function call below and fromDate adn toDate are
     * SQL formatted dates ('YYYY-MM-DD')
     */
    public function diagDataAction($machineId, $fromDate, $toDate)
    {
        $this->u = new Utils();
        $this->conn = $this->get('database_connection');
        $this->filters = array(
            'machineId' => $machineId,
            'fromDate' => $fromDate,
            'toDate' => $toDate
        );

        // Machines
        $sql = <<<SQL
            select * from xeros_machine where machine_id = :machineId;
SQL;
        $data["config"]["xeros_machine"] = $this->getData($sql);

        // Classifications
        $sql = <<<SQL
            select * from xeros_machine_classification where machine_id = :machineId;
SQL;
        $data["config"]["xeros_machine_classification"] = $this->getData($sql);

        // Local Static Value
        $sql = <<<SQL
            select * from xeros_xeros_local_static_value where classification_id;
SQL;
        $data["config"]["xeros_xeros_local_static_value"] = $this->getData($sql);

        // Readings
        $sql = <<<SQL
            select * from xeros_dai_meter_actual
            where
              machine_id = :machineId
              and reading_timestamp >= ':fromDate'
              and reading_timestamp <= ':toDate'
SQL;
        $data["readings"]["xeros_dai_meter_actual"] = $this->getData($sql);


        //$ar = json_decode($json, true);
        return array ("data" => $data);

    }

    private function getData($sql) {

        $sqlParsed = $this->u->replaceFilters($sql, $this->filters);
        return $this->conn->fetchAll($sqlParsed);

    }
}