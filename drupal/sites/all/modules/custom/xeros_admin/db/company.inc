<?php


/**
 * Class company
 */
class company {

  public function select_all() {

    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'company')
      ->propertyCondition('status', 1);

    $result = $query->execute();

    if (isset($result['node'])) {
      $rows_nids = array_keys($result['node']);
      $rows = entity_load('node', $rows_nids);
    }
    return $rows;
  }

}