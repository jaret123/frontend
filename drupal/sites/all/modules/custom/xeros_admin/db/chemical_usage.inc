<?php

/**
 * Classification Class
 */

//require_once 'orm_abstract.inc';

/**
 * Class chemical_usage
 *
 * chemical_usage has a compound key (machine_classification_id and chemical_profile_id)
 *
 * So, we need to override all the base functions of the abstract class
 */
class chemical_usage {

  // Both of these fields are needed to update the record
  /**
   * @var null
   */
  public $machine_classification_id = NULL;

  /**
   * @var null
   */
  public $chemical_profile_id = NULL;


  function __construct() {
    $this->table = 'xeros_chemical_usage';
    $this->key = NULL;
  }

  /**
   * Select by either or both
   *
   * @param null $machine_classification_id
   * @param null $checical_profile_id
   *
   * @return array
   */
  public function select($machine_classification_id = NULL, $chemical_profile_id = NULL) {

    $select = db_select($this->table, 'a');
    $select->leftJoin('xeros_chemical_profile', 'cp', 'a.chemical_profile_id = cp.chemical_profile_id');
    $select->fields('a');
    $select->fields('cp');

    if ($machine_classification_id != NULL) {
      $select->condition('a.machine_classification_id', $machine_classification_id);
    }
    if ($chemical_profile_id != NULL) {
      $select->condition('a.chemical_profile_id', $chemical_profile_id);
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

  public function update() {
    try {
      $num_updated = 0;

      if ($this->machine_classification_id != NULL && $this->chemical_profile_id != NULL) {
        $num_updated = db_update($this->table)
          ->fields($this->fields)
          ->condition('machine_classification_id', $this->machine_classification_id)
          ->condition('chemical_profile_id', $this->chemical_profile_id)
          ->execute();
      }
      return $num_updated;
    }
    catch (Exception $e) {
      watchdog_exception('type', $e);
    }
  }

  public function merge() {
    try {
      $num_updated = 0;

      if ($this->machine_classification_id != NULL && $this->chemical_profile_id != NULL) {
        $num_updated = db_merge($this->table)
          ->key(array(
                     'machine_classification_id' => $this->machine_classification_id,
                     'chemical_profile_id' => $this->chemical_profile_id
                ))
          ->fields($this->fields)
          ->execute();
      }
      return $num_updated;
    }
    catch (Exception $e) {
      watchdog_exception('type', $e);
    }
  }

  public function delete() {
    try {
      $num_deleted = 0;
      if ($this->machine_classification_id != NULL && $this->chemical_profile_id != NULL) {
        $num_deleted = db_delete($this->table)
          ->condition('machine_classification_id', $this->machine_classification_id)
          ->condition('chemical_profile_id', $this->chemical_profile_id)
          ->execute();
      }
      return $num_deleted;
    }
    catch (Exception $e) {
      watchdog_exception('type', $e);
    }
  }
}