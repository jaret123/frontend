<?php

require_once 'orm_abstract.inc';

class machine_classification extends orm_abstract {
  function __construct() {
    $this->table = 'xeros_machine_classification';
    $this->key = 'machine_classification_id';
  }

  // TODO: How are we going to handle this.  It has a compound key.

  /**
   * Override select to select on machine_id instead of machine_classification_id so we always
   * get a set of classifications for a machine.
   *
   * @param null $machine_id
   *
   * @return array
   */
  public function select_by_machine($machine_id = NULL) {

    $select = db_select('xeros_machine_classification', 'mc');
    $select->leftJoin('xeros_classification', 'c', 'mc.classification_id = c.classification_id');
    $select->leftJoin('xeros_local_static_values', 'lsv', 'c.classification_id = lsv.classification');
    $select->fields('c');
    $select->fields('mc');
    $select->fields('lsv');

    if ($machine_id != NULL) {
      $select->condition('mc.machine_id', $machine_id);
    }

    $select->orderBy('mc.classification_id');

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