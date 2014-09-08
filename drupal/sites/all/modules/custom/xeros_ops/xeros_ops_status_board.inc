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
  drupal_add_js($module_path . '/js/handlebars.js');
  drupal_add_js($module_path . '/js/jquery.countdown/jquery.plugin.min.js');
  drupal_add_js($module_path . '/js/jquery.countdown/jquery.countdown.min.js');
  drupal_add_js($module_path . '/js/ff-utils.js');
  drupal_add_js($module_path . '/js/ops.js');

  $query = <<<SQL
    select
	m.machine_id,
	m.serial_number,
	m.manufacturer,
	m.location_id,
	coalesce(l.title, 'Unknown Location') as location_title,
	coalesce(c.title, 'Unknown Company') as company_title
from
    xeros_machine as m
left join node as l
	on m.location_id = l.nid
	and l.type = 'location'
left join field_data_field_company as lc
	on l.nid = lc.entity_id
	and lc.bundle = 'location'
left join node as c
	on lc.field_company_target_id = c.nid
	and c.type = 'company';
SQL;

  $result = db_query($query, array());

  $json_result = json_encode($result->fetchAll());

  drupal_add_js('var xerosMachines = ' . $json_result,
    'inline'
  );

  $services = array();
  $services['status'] = variable_get('ops_service_status');
  $services['history'] = variable_get('ops_service_history');

  $json_services =
  drupal_add_js('Drupal.settings.services = ' . json_encode($services), 'inline');

  $output = "";

  return $output;
}

