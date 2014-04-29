<?php

require_once 'orm_abstract.inc';

// TODO: This needs to be refactored to load the location and comany nodes.

/**
 * Class location
 */
class location extends orm_abstract {
  function __construct() {
    $this->table = 'xeros_location';
    $this->key = 'location_id';
  }

  public function select_by_company($company_id = NULL) {

    $select = db_select($this->table, 'a');
    $select->fields('a', $this->fields);
    if ($company_id <> NULL) {
      $select->condition('a.company_id', $company_id);
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