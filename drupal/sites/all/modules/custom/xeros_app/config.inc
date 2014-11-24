<?php

function config_static_values() {

  $projects = entity_load('xeros_static_values', array(1));
  dpm($projects);
  return 'Some string';
}