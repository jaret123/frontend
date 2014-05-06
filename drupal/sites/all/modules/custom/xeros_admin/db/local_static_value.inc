<?php

require_once 'orm_abstract.inc';

class local_static_value extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_local_static_values';
    $this->key = 'local_static_values_id';
  }

  // TODO: Double check field names
  public function select_by_classification($classification_id = NULL) {

    $select = db_select('xeros_local_static_value', 'lsv');

    $select->fields('lsv');

    if ($classification_id != NULL) {
      $select->condition('lsv.classification_id', $classification_id);
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