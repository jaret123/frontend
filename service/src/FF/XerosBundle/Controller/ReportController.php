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
     * @Route("/report/{id}/{start}/{end}.{_format}")
     */
    public function reportAction($id, $start, $end)
    {
        var_dump("input params", $id, $start, $end);

        $sql = sprintf("SELECT * FROM User WHERE id = '%s'", $id);
        $conn = $this->get('database_connection');
        $users = $conn->fetchAll($sql);

        return array ("users" => $users);
    }

} 