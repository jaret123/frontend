<?php

/**
 * Classification Class
 */

require_once 'orm_abstract.inc';

class classification extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_classification';
    $this->key = 'classification_id';
  }

}