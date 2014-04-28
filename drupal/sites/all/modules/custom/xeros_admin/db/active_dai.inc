<?php

/**
 * Active_DAI class
 */

require_once 'orm_absract.inc';

class active_dai extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_active_dai';
    $this->key = 'active_dai_id';
  }
}