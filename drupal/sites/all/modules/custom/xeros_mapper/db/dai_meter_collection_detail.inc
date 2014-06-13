<?php

require_once dirname(__FILE__) . '/../../xeros_admin/db/orm_abstract.inc';

class dai_meter_collection_detail extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_dai_meter_collection_detail';
    $this->key = 'id';
  }

  function select_by_collection_id($collection_id) {

    $select = db_select($this->table, 'a');
    $select->fields('a', $this->fields);
    $select->condition('a.collection_id', $collection_id);

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