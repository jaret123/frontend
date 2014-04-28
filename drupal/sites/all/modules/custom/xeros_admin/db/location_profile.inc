<?php

require_once 'orm_abstract.inc';

class location_profile extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_location_profile';
    $this->key = 'location_profile_id';
  }
}