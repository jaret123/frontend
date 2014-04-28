<?php

/**
 * Classification Class
 */

require_once 'orm_abstract.inc';

class classification extends orm_abstract {

  function __construct() {
    $this->table = 'classification';
    $this->key = 'classification_id';
  }

}