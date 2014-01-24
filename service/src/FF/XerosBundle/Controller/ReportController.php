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
        //var_dump("input params", $id, $start, $end);

        // Temp location for loading data
        // TODO: Don't hard code this URL
        $dir = "/Users/jason/dev/ELYXOR/xeros/service/src/FF/XerosBundle/Resources/data/";

        // {id} = Report ID
        switch ($id) {
            case "users":
                $sql = sprintf("SELECT * FROM users WHERE uid = '%s'", $uid);
                $conn = $this->get('database_connection');
                $users = $conn->fetchAll($sql);

                return array ("report" => $users);
                break;
            case "kpis":
                $json = file_get_contents($dir . "kpis.json");
                break;
            case "consumption":
                $json = file_get_contents($dir . "consumption.json");
                break;
            case "consumptionDetails":
                $json = file_get_contents($dir . "consumption.json");
                break;
            case "news":
                $json = file_get_contents($dir . "news.json");
                break;
        }

        $ar = json_decode($json, true);
        return array ("data" => $ar);
    }
} 