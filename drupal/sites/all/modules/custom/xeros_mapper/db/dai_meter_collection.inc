<?php

require_once dirname(__FILE__) . '/../../xeros_admin/db/orm_abstract.inc';

class dai_meter_collection extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_dai_meter_collection';
    $this->key = 'id';
  }

}