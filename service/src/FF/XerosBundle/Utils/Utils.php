<?php

namespace FF\XerosBundle\Utils;

class Utils {

    /**
     * @return array
     *
     * userRole tests for the session ID in the site cookies and checks to see if it matches
     * an authenticated Drupal session.   If it does, then the user can access the web services
     */
    public function getUserRole($conn)
    {
        $sid = NULL;

        $userRole = array(
            'uid' => NULL,
            'company_id' => NULL,
            'location' => NULL,
            'role' => NULL,
            'machine_ids' => array()
        );

        // Is there something that looks like a Drupal Session ID
        foreach ($_COOKIE as $key => $value)
        {
            if ( substr($key, 0, 4) == 'SESS' ) {
                $sid = $value;
            }
        }

        if ( $sid === NULL ) {
            return array ("uid" => NULL);
        } else {
            // Does this session ID exist in the sessions table
            $sql = sprintf("SELECT * FROM sessions WHERE sid = '%s'", $sid);
            $user = $conn->fetchAll($sql);

            // If it does, then return user array
            if ( $user[0]['uid'] >= 0 ) {
                // Get the user company_id and location_id

                $userRole = array ("uid" => $user[0]['uid'], "role" => 'role', "location" => 'location');

                $sql = <<<SQL
                    select u.uid, u.name, u.mail, fc.field_company_target_id as company_id
                    from
                        users as u
                        left join field_data_field_company as fc
                             on u.uid = fc.entity_id
                             and fc.entity_type = 'user'
                        left join node as n
                             on fc.field_company_target_id = n.nid
                             and n.type = 'company'
                    where u.uid = :uid
SQL;
                $sqlParsed = $this->replaceFilters($sql, array("uid" => $user[0]['uid']));
                $userData = $conn->fetchAll($sqlParsed);
                // TODO : Check to make sure user had a company id
                $userRole["company_id"] = $userData[0]["company_id"];

                // Get machines associated with the company

                $sql = <<<SQL

                select machine_id, serial_number, fc.field_company_target_id as company_id, fl.field_location_target_id as location_id from
                        xeros_machine as xm
                        left join field_data_field_company as fc
                          on xm.machine_id = fc.entity_id and fc.entity_type = 'data_xeros_machine'
                        left join field_data_field_location as fl
                          on xm.machine_id = fl.entity_id and fl.entity_type = 'data_xeros_machine'
                where fc.field_company_target_id = :company_id
SQL;
                $sqlParsed = $this->replaceFilters($sql, array("company_id" => $userRole["company_id"]));
                $machineData = $conn->fetchAll($sqlParsed);
                // TODO : More error checking on this
                foreach ( $machineData as $record ) {
                    $userRole["machine_ids"][] = $record["machine_id"];
                }
            } else {
                // Access denied
                // Do nothing
            }
        }
        return $userRole;
    }

    /**
     * @param $string
     * @param $filters
     *
     * @return mixed
     *
     * replaceFilters is a private function to help build the report SQL used below
     */
    public function replaceFilters($string, $filters) {
        foreach ($filters as $k => $v) {
            $string = str_replace(':' . $k, $v, $string);
        }
        return $string;
    }

    public function arrayToString($array) {
        $string = "";
        $length = count($array);
        $i = 0;
        foreach ( $array  as $k => $v ) {
            $i = $i + 1;
            $string = $string . $v;
            if ( $i < $length ) {
                $string = $string . ", ";
            }
        }
        return $string;
    }
}