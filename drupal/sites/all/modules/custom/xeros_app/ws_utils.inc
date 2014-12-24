<?php

class WsUtils {

  /**
   * @param $string
   * @param $filters
   *
   * @return mixed
   *
   * replaceFilters is a private function to help build the report SQL used below
   */
  function replaceFilters($string, $filters) {
    // TODO: Check for SQL injection
    foreach ($filters as $k => $v) {
      $string = str_replace($k, $v, $string);
    }
    return $string;
  }

  /**
   *
   * Array of location IDs the current logged in user has access to
   *
   * return array()
   */
  function user_access_locations() {

    $locations = array();

    if ( user_access('xeros view all locations') ) {
      // Load all locations that are active in the system

      $query = new EntityFieldQuery();

      $query->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', 'location')
        ->propertyCondition('status', NODE_PUBLISHED);

      $result = $query->execute();

      if (isset($result['node'])) {
        $locations = array_keys($result['node']);
      }
    } else {
      // Load only the locations associated with the user

      $user = user_load($GLOBALS['user']->uid);

      foreach ($user->field_location['und'] as $key => $value) {
        array_push($locations, $value['target_id']);
      }
    }

    return $locations;
  }


  function machines_by_location($location_ids) {

    $sql = 'select machine_id from xeros_machine where location_id in (:location_ids)';

    $sql = $this->replaceFilters($sql, array(':location_ids' => implode(",", $location_ids)));

    $query = db_query($sql);

    $machine_ids = $query->fetchCol('machine_id');

    return $machine_ids;
  }

}