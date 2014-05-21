<?php

namespace FF\XerosBundle\Utils;

class Utils {

    /**
     * @return array
     *
     * userRole tests for the session ID in the site cookies and checks to see if it matches
     * an authenticated Drupal session.   If it does, then the user can access the web services
     */

    // TODO: filter machine IDs by the requested company and location
    public function getUserRole($conn, $locationId)
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
            // Get user Session token
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

                // Get the user role
                $sql = <<<SQL
                select
                    r.name
                from
                    users as u
                    left join users_roles as ur
                        on u.uid = ur.uid
                    left join role as r
                        on ur.rid = r.rid
                where u.uid = :uid
SQL;
                $sqlParsed = $this->replaceFilters($sql, array("uid" => $user[0]['uid']));
                $roles = array();
                $roles = $conn->fetchAll($sqlParsed);

                $xerosAdmin = False;

                foreach($roles as $key => $role) {
                    if ($role["name"] == "xeros admin") {
                        $xerosAdmin = True;
                        break;
                    }
                }

                $userRole = array ("uid" => $user[0]['uid'], "role" => 'role', "location" => 'location');

                // If user is xerosAdmin and if they passed a location id
                if ( $xerosAdmin && $locationId <> null ) {

                    // Get machines associated with the location in the session value sessionLocation
                    $sql = <<<SQL

                    select machine_id, serial_number, fc.field_company_target_id as company_id, fl.field_location_target_id as location_id from
                            xeros_machine as xm
                            left join field_data_field_company as fc
                              on xm.machine_id = fc.entity_id and fc.entity_type = 'data_xeros_machine'
                            left join field_data_field_location as fl
                              on xm.machine_id = fl.entity_id and fl.entity_type = 'data_xeros_machine'
                    where fl.field_location_target_id = :location_id
SQL;
                    $sqlParsed = $this->replaceFilters($sql, array("location_id" => $locationId));
                    $machineData = $conn->fetchAll($sqlParsed);
                    foreach ( $machineData as $record ) {
                        $userRole["machine_ids"][] = $record["machine_id"];
                    }

                // Else use the user's own company and location
                } else {
                    // Get the company and location from their user settings

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

  public function getStaticValue($conn, $name) {

    $sql = <<<SQL
                select
                    `value`
                from
                    xeros_static_values
                where `name` = ':_name'
SQL;

    $sqlParsed = $this->replaceFilters($sql, array("_name" => $name));

    $value = $conn->fetchColumn($sqlParsed, array(1), 0);

    return $value;

  }
}