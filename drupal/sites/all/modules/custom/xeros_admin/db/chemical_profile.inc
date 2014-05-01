<?php

require_once 'orm_abstract.inc';

/**
 * Class chemical_profile
 */
class chemical_profile extends orm_abstract {
  function __construct() {
    $this->table = 'xeros_chemical_profile';
    $this->key = 'chemical_profile_id';
  }

  function select_by_location($location_id = NULL) {

    $select = db_select($this->table, 'a');
    $select->fields('a', $this->fields);
    if ($location_id <> NULL) {
      $select->condition('a.location_id', $location_id);
    }

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