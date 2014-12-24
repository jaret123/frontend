<?php

include_once drupal_get_path('module', 'xeros_report') . '/load_base_js.php';

function report_health() {

  load_base_js(array(), '');

  return theme('xeros_report_health_template');
}