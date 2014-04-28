<?php

require_once 'orm_abstract.inc';

/**
 * Class chemical_profile
 */
class chemical_profile extends orm_abstract {
  function __construct() {
    $this->table = 'xeros_chemical_profile';
    $this->key = 'chemical_profile_id';
  }
}