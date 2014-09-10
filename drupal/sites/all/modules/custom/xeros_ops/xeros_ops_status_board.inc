<?php

function status_board() {

  $module_name = 'xeros_ops';
  $module_path = drupal_get_path('module', $module_name);

  drupal_add_js(array(
      $module_name => array(
        'modulePath' => $module_path,
      )
    ),
  'setting');

//  drupal_add_css($module_path . '/js/jquery.countdown/jquery.countdown.css');

  // We are overriding some theme styles, so we are going to load this last
  // This is a little janky.  Ideally the theme should be refactored to be specific to it's pages
  drupal_add_css($module_path . '/css/ops.css', array( 'group' => CSS_THEME, 'weight' => 1) );

  drupal_add_js($module_path . '/js/moment-with-locales.js');
//  drupal_add_js($module_path . '/js/handlebars.js');
  drupal_add_js($module_path . '/js/jquery.countdown/jquery.plugin.min.js');
  drupal_add_js($module_path . '/js/jquery.countdown/jquery.countdown.min.js');
  drupal_add_js($module_path . '/js/ff-utils.js');
  drupal_add_js($module_path . '/js/ops.js');

  $services = array();
  $services['status'] = variable_get('ops_service_status');
  $services['history'] = variable_get('ops_service_history');

  $json_services =
  drupal_add_js('Drupal.settings.services = ' . json_encode($services), 'inline');

  $output = "";

  return $output;
}

