<?php

/**
 *  Machine class
 */

require_once 'orm_abstract.inc';

class machine extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_machine';
    $this->key = 'machine_id';
  }

  /** Override the base function because we want multiple filters */
  public function select($location_id = NULL, $machine_id = NULL) {

    $select = db_select('xeros_machine', 'm');
    $select->fields('m', $this->fields);
    if ($location_id <> NULL) {
      $select->condition('m.location_id', $location_id);
    }
    if ($machine_id <> NULL) {
      $select->condition('m.machine_id', $machine_id);
    };

    $entries = $select->execute()->fetchAll(PDO::FETCH_ASSOC);
    $rows = array();
    if (!empty($entries)) {
      foreach ($entries as $entry) {
        // Sanitize the data before handing it off to the theme layer.
        $rows[] = array_map('check_plain', $entry);
      }
    }
    return $rows;
  }
}