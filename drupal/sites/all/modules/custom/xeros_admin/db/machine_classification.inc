<?php

require_once 'orm_abstract.inc';
require_once 'chemical_usage.inc';
require_once 'dai_meter_actual.inc';

class machine_classification extends orm_abstract {
  function __construct() {
    $this->table = 'xeros_machine_classification';
    $this->key = 'machine_classification_id';
  }

  // TODO: How are we going to handle this.  It has a compound key.

  public function select_detail($machine_classification_id = NULL) {

    $select = db_select('xeros_machine_classification', 'mc');
    $select->leftJoin('xeros_classification', 'c', 'mc.classification_id = c.classification_id');
    $select->leftJoin('xeros_xeros_local_static_value', 'lsv', 'c.classification_id = lsv.classification_id');
    $select->fields('c');
    $select->fields('mc');
    $select->fields('lsv');

    $select->condition('mc.machine_classification_id', $machine_classification_id);

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
    $select->leftJoin('xeros_xeros_local_static_value', 'lsv', 'c.classification_id = lsv.classification_id');
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

  /**
   * Cascading delete
   * Not implemented yet
   *
   * @param $machine_classification_id
   *
   * @return DatabaseStatementInterface|int|void
   */
  public function delete() {

    $children_records = true;
    try {
      // Check to see if there are dai_meter_actual readings with this classification_id.
      // If there are, then this method considers these records to be locked and won't do anything.
      // We want additional validation further up in order to do that.


      // Delete chemical_usage

      // Delete chemical_unit

      //
    }
    catch (Exception $e) {
      watchdog_exception('type', $e);
    }

    // Delete machine_classification
    try {
      $num_deleted = 0;
      if ($this->id != NULL) {
        $num_deleted = db_delete($this->table)
          ->condition($this->key, $this->id)
          ->execute();
      }
      return $num_deleted;
    }
    catch (Exception $e) {
      watchdog_exception('type', $e);
    }
  }
}