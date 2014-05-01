<?php

/**
 * Generic database object Class
 *
 * Location is a node_type
 * Location_profile is a table
 */

abstract class orm_abstract {

  protected $table = NULL; // Table name
  protected $key = NULL; // Table Key field
  public $id = NULL; // ID of the record to update
  public $fields = array(); // Fields to return in a select

  public function select($id = NULL) {

    $select = db_select($this->table, 'a');
    $select->fields('a', $this->fields);
    if ($id != NULL) {
      $select->condition('a.' . $this->key, $id);
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

    if ($this->id != NULL) {
      $num_updated = db_update($this->table)
        ->fields($this->fields)
        ->condition($this->key, $this->id)
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

      if ($this->id != NULL) {
        $num_updated = db_merge($this->table)
          ->key(array($this->key => $this->id))
          ->fields($this->fields)
          ->execute();
      } else {
        $num_updated = db_insert($this->table)
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