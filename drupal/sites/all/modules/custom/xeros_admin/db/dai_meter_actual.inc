<?php

require_once 'orm_abstract.inc';

// TODO: This needs to be refactored to load the location and comany nodes.

/**
 * Class location
 */
class dai_meter_actual extends orm_abstract {
  function __construct() {
    $this->table = 'xeros_dai_meter_actual';
    $this->key = 'dai_meter_actual_id';
  }

  public function select_by_classification_id($classification_id = NULL) {

    $select = db_select($this->table, 'a');
    $select->fields('a', $this->fields);
    $select->condition('a.classification_id', $classification_id);

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