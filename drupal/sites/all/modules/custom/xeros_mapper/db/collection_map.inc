<?php

/**
 * Classification Class
 */

require_once dirname(__FILE__) . '/../../xeros_admin/db/orm_abstract.inc';

class collection_map extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_collection_map';
    $this->key = 'collection_map_id';
  }

  function select_by_machine_id($machine_id) {

    $select = db_select($this->table, 'a');
    $select->fields('a', $this->fields);
    $select->condition('a.machine_id', $machine_id);

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