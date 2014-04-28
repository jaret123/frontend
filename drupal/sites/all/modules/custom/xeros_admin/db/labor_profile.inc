<?php

require_once 'orm_abstract.inc';

class labor_profile extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_labor_profile';
    $this->key = 'labor_profile_id';
  }
}