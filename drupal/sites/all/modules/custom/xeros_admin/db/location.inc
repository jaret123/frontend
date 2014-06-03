<?php

require_once 'orm_abstract.inc';

// TODO: This needs to be refactored to load the location and comany nodes.

/**
 * Class location
 */
class location  {

  function __construct() {
    $this->table = 'xeros_location';
    $this->key = 'location_id';
  }

  public function select_by_company($company_id = NULL) {

    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'location')
      ->propertyCondition('status', 1);

    if ($company_id != NULL) {
      $query->fieldCondition('field_company', 'target_id', (int)$company_id, '=');
    }

    $result = $query->execute();

    if (isset($result['node'])) {
      $rows_nids = array_keys($result['node']);
      $rows = entity_load('node', $rows_nids);
    } else {
      $rows = entity_load('node', array());
    }
    return $rows;
  }

}