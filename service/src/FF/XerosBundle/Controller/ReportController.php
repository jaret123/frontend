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

        // {id} = Report ID

        switch ($id) {
            case 1:
                $sql = sprintf("SELECT * FROM users WHERE uid = '%s'", $uid);
                $conn = $this->get('database_connection');
                $users = $conn->fetchAll($sql);

                return array ("report" => $users);
                break;
            case 2:

                return array("report" => "Report 2");
                break;
            case 3:


                $json = <<<EOT
    kpis: [
        {
            title: "Overall Cost",
            unit: "",
            actualDollars: "6,816",
            potentialDollars: "3,408",
            percent: "50",
            cssClass: "overall",
            icon: "Globe"
        },
        {
            title: "Cold Water",
            unit: "Gallons",
            actualDollars: "1,234",
            potentialDollars: "619",
            percent: "50",
            cssClass: "gallons",
            icon: "Drop"
        },
        {
            title: "Hot Water",
            unit: "Efficiency",
            actualDollars: "731",
            potentialDollars: "300",
            percent: "63",
            cssClass: "efficiency",
            icon: "Thermometer"
        },
        {
            title: "Cycle Time",
            unit: "Labor",
            actualDollars: "63",
            potentialDollars: "38",
            percent: "34",
            cssClass: "labor",
            icon: "Clock"
        },
        {
            title: "Chemicals",
            unit: "Usage",
            actualDollars: "637",
            potentialDollars: "318",
            percent: "45",
            cssClass: "chemicals",
            icon: "Atom"
        },
    ]
EOT;
                return array("report" => json_decode($json));

                break;
        }
    }
} 