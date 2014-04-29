<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 4/26/14
 * Time: 12:33 PM
 */

require_once('db/location.inc');
require_once('xeros_admin_machines.inc');
/**
 * @param null $company_id
 *
 * @return string
 */
function location_listing($company_id = NULL) {

  $output =  '<div>This is the location listing page for company: ' . $company_id . '</div>';

  $location = new location();

  $location->fields = array(
    'company_id',
    'location_id',
    'location_name'
  );

  // TODO: If Xeros Admin, then show all the locations grouped by company

  $rows = $location->select_by_company($company_id);

  if (count($rows) > 0) {
    foreach ($rows as $i => $row) {
      $data[$i]['company_id'] = $row->field_company['und'][0]['target_id'];
      $company = node_load($data[$i]['company_id']);
      $data[$i]['company_name'] = $company->title;
      $data[$i]['location_id'] = $row->nid;
      $data[$i]['location_name'] = $row->title;
      $data[$i]['link'] =  '<a href="/config/location/edit/' . $row->nid . '">Edit</a>';
    }

    // Make a table
    $header = array(
      t('Company ID'),
      //t('Company Name'),
      t('Location ID'),
      t('Location Name'),
      t('Edit')
    );

    $r = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $data
    );

    $output .= drupal_render($r);
  } else {
    drupal_set_message(t('No locations found.'));
  }

  return $output;
}

function location_edit_page($function_call = NULL, $location_id = NULL) {

  if ($location_id != NULL) {
    $location = node_load($location_id);
    $company = node_load($location->field_company['und'][0]['target_id']);
  }
  $output = '';
  $output = '<a href="/config/locations">Back to location listing</a> <br />';
  $output .= 'Function: ' . $function_call . '<br />';
  $output .= 'Company: ' . $company->title . '<br />';
  $output .= 'Location: ' . $location->title . '<br />';

  $vars = array();
  $vars['location'] = $location;
  $vars['company'] = $company;

  if( ! function_exists("node_page_edit")) {
    include_once(drupal_get_path('module', 'node') . '/node.pages.inc');
  }

  $f = drupal_get_form('location_form', $vars);

  $output .= drupal_render($f);

  $output .= machine_listing($location->nid);



  return $output;
}

function location_form($form, &$form_state, $vars) {

  $form_state['values']['company_id'] = $vars['company']->nid;
  $form_state['values']['location_id'] = $vars['location']->nid;
  $form_state['values']['location_name'] = $vars['location']->title;

  $form['#tree'] = TRUE;

  // Hidden fields for processing between validate and submit
  $form['location_id'] = array(
    '#type' => 'hidden',
    '#default_value' => !empty($form_state['values']['location_id']) ? $form_state['values']['location_id'] : NULL,
  );

  $form['company_id'] = array(
    '#type' => 'hidden',
    '#default_value' => !empty($form_state['values']['location_id']) ? $form_state['values']['location_id'] : NULL,
  );

  //Visible fields
  $form['location_name'] = array(
    '#type' => 'textfield',
    '#title' => 'Location Name',
    '#default_value' => !empty($form_state['values']['location_name']) ? $form_state['values']['location_name'] : NULL,
  );

  $form['location_profile'] = location_profile($vars);

  $form['labor_profile'] = labor_profile($vars);

  $form['chemical_profiles'] = array(
    '#type' => 'fieldset',
    '#title' => t('Chemical Profile Information'),
    '#description' => t('Location specific values used for chemicals for this location'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  for ($i = 0; $i < 5; $i++) {
    $form['chemical_profiles'][] = chemical_profile($vars);
  }

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  return $form;
}

function location_profile($vars) {

// Location values
  $location_profile = array(
    '#type' => 'fieldset',
    '#title' => t('Location Profile Values'),
    '#description' => t('Location specific values used for calculations for this location'),

    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    'water_volume_unit' => array(
      '#title' => 'Water Volume Unit',
      '#description' => 'What unit is the water measured in (gallons or liters)',
      '#type' => 'select',
      '#options' => drupal_map_assoc(array('gallons', 'liters'))
    ),
    'chemical_volume_unit' => array(
      '#title' => 'Chemical Volume Unit',
      '#description' => 'What unit are the chemicals measured in (ouncs, grams)',
      '#type' => 'select',
      '#options' => drupal_map_assoc(array('ounces', 'grams'))
    ),
    'water_meter_rate' => array(
      '#title' => 'Water Meter Rate',
      '#description' => "Rate the water meter detects a pulse.  Currently .1 for all installed water meters",
      '#type' => 'textfield'
    ),
    'temperature_rise_spring' => array(
      '#title' => 'Temperature Rise Spring',
      '#description' => "Constant which is used in the therms calculation.  The temperature difference between water coming in the building and the temperature of hot water",
      '#type' => 'textfield'
    ),
    'temperature_rise_summer' => array(
      '#title' => 'Temperature Rise Summer',
      '#description' => "Constant which is used in the therms calculation.  The temperature difference between water coming in the building and the temperature of hot water",
      '#type' => 'textfield'
    ),
    'temperature_rise_fall' => array(
      '#title' => 'Temperature Rise Fall',
      '#description' => "Constant which is used in the therms calculation.  The temperature difference between water coming in the building and the temperature of hot water",
      '#type' => 'textfield'
    ),
    'temperature_rise_winter' => array(
      '#title' => 'Temperature Rise Winter',
      '#description' => "Constant which is used in the therms calculation.  The temperature difference between water coming in the building and the temperature of hot water",
      '#type' => 'textfield'
    ),
    'heating_efficiency' => array(
      '#title' => 'Heating Efficiency',
      '#description' => "",
      '#type' => 'textfield'
    ),
    'thermal_conversion' => array(
      '#title' => 'Thermal Conversion',
      '#description' => "",
      '#type' => 'textfield'
    ),
    'cost_per_therm' => array(
      '#title' => 'Cost per Therm',
      '#description' => 'Analyst entered calculation based on the heating bill for the location',
      '#type' => 'textfield'
    ),
    'cost_per_gallon' => array(
      '#title' => 'Cost per gallon',
      '#description' => 'Analyst entered calculation based on the utility bill for the location',
      '#type' => 'textfield'
    )
  );

  return $location_profile;
}

function labor_profile($vars) {

  $labor_profile = array(
    '#type' => 'fieldset',
    '#title' => t('Labor Profile Values'),
    '#description' => t('Labor specific values used for calculations for this location'),

    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    'labor_profile_id' => array(
      '#type' => 'hidden',
      '#default_value' => ''
    ),
    'ops_hourly_rate' => array(
      '#title' => 'Operations Hourly Rate',
      '#description' => 'Analyst entered calculation based on location\'s hourly rate of operations',
      '#type' => 'textfield'
    ),
  );

  return $labor_profile;
}

function chemical_profile($vars) {
  $chemical_profile = array(
    '#type' => 'fieldset',
    '#title' => t('Chemical Profile: ' . 'Name'),
    '#description' => t('Location specific values used for chemicals for this location'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    'chemical_profile_id' => array(
      '#type' => 'hidden',
      '#default_value' => ''
    ),
    'chemical_type' => array(
      '#title' => 'Chemical Type',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => ''
    ),
    'supplier' => array(
      '#title' => 'Supplier',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => ''
    ),
    'material_type' => array(
      '#title' => 'Material Type',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => ''
    ),
    'unit' => array(
      '#title' => 'Unit',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => ''
    ),
    'unit_cost' => array(
      '#title' => 'Unit Cost',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => ''
    ),
    'xeros_unit_cost' => array(
      '#title' => 'Xeros Unit Cost',
      '#description' => 'Cost of Xeros Chemicals are included in Xeros lease.  Set to 0 by default',
      '#type' => 'hidden',
      '#default_value' => ''
    ),
  );

  return $chemical_profile;
}