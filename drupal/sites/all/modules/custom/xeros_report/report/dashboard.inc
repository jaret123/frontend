<?php

include_once drupal_get_path('module', 'xeros_report') . '/load_base_js.php';

function report_dashboard() {

  load_base_js(array(), '');

  return theme('xeros_report_dashboard_template');
  //return "Hello World";
}