<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 4/26/14
 * Time: 12:33 PM
 */

require_once('db/location.inc');
require_once('db/location_profile.inc');
require_once('db/labor_profile.inc');
require_once('db/chemical_profile.inc');
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
      t('Company Name'),
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

  $lp = new location_profile();

  $vars['location_profile'] = $lp->select_by_location($location_id);

  $labor = new labor_profile();

  $vars['labor_profile'] = $labor->select_by_location($location_id);

  $chemical_profile = new chemical_profile();

  $vars['chemical_profiles'] = $chemical_profile->select_by_location($location_id);

//  if( ! function_exists("node_page_edit")) {
//    include_once(drupal_get_path('module', 'node') . '/node.pages.inc');
//  }

  $f = drupal_get_form('location_form', $vars);

  $output .= drupal_render($f);

  $output .= machine_listing($location->nid);

  return $output;
}

function location_form($form, &$form_state, $vars) {

  $form_state['values']['company_id'] = $vars['company']->nid;
  $form_state['values']['location_id'] = $vars['location']->nid;
  $form_state['values']['location_name'] = $vars['location']->title;
  $form_state['values']['location_profile'] = $vars['location_profile'];

  if (empty($form_state['#vars'])) {
    $form_state['#vars'] = $vars;
  }

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

  $form['location_profile'] = location_profile($form_state['values']['location_profile']);

  $form['labor_profile'] = labor_profile($vars['labor_profile']);

  $form['chemical_profiles'] = array(
    '#type' => 'fieldset',
    '#title' => t('Chemical Profile Information'),
    '#description' => t('Location specific values used for chemicals for this location'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#prefix' => '<div id="chemical-profiles-fieldset-wrapper">',
    '#suffix' => '</div>'
  );

  if (empty($form_state['#count']['chemical_profiles'])) {
    $form_state['#count']['chemical_profiles'] = count($vars['chemical_profiles']);
  }


  if ( !empty($form_state['triggering_element']['#ff-process']) ) {
    $action = $form_state['triggering_element']['#ff-process'];
    if ($action == 'delete') {
      $index = $form_state['triggering_element']['#default_value'];
      unset($form_state['#vars']['chemical_profiles'][$index]);
    } elseif ($action == 'add') {
      $form_state['#vars']['chemical_profiles'][] = array();
    }
  }

    foreach ($form_state['#vars']['chemical_profiles'] as $i => $row) {
      $row = $form_state['#vars']['chemical_profiles'][$i];
      $row['#index'] = $i;
      $form['chemical_profiles'][$i] = chemical_profile($row);
    }

  // Adds "Add another name" button
  $form['chemical_profiles']['add'] = array(
    '#type' => 'submit',
    '#value' => t('Add another chemical'),
    '#ff-process' => 'add',
    '#submit' => array('chemical_profile_add'),
    '#ajax' => array(
      'callback' => 'chemical_profile_add_callback',
      'wrapper' => 'chemical-profiles-fieldset-wrapper',
    ),
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  return $form;
}

function location_form_validate($form, &$form_state) {
  $location_name = $form_state['values']['location_name'];
  if ($location_name && ($location_name == 'ERROR')) {
    form_set_error('serial_number', t('Location name invalid'));
  }
  drupal_set_message('Validation run');
}

function location_form_submit($form, &$form_state) {

  // Update Location

  $l = new location();
  $l->id = $form_state['values']['location_id'];

  $f = array(
    'location_id',
    'location_name'
  );


  foreach( $f as $field ) {
    $l->fields[$field] = $form_state['values'][$field];
  }

  $l->merge();

  // Update Location Profile Values

  $lp = new location_profile();
  $lp->id = $form_state['values']['location_id'];

  $f = array(
    'water_volume_unit',
    'chemical_volume_unit',
    'water_meter_rate',
    'temperature_rise_spring',
    'temperature_rise_summer',
    'temperature_rise_fall',
    'temperature_rise_winter',
    'heating_efficiency',
    'thermal_conversion',
    'cost_per_therm',
    'cost_per_gallon'
  );
  foreach($f as $field) {
    $lp->fields[$field] = $form_state['values']['location_profile'][$field];
  }

  $lp->merge();

  // Update Chemical Profiles Values

  $cp = new chemical_profile();

  $f = array(
    'chemical_type',
    'supplier',
    'material_type',
    'unit',
    'unit_cost',
    'xeros_unit_cost'
  );

  $cp->fields['location_id'] = (int)$form_state['values']['location_id'];

  foreach( $form_state['values']['chemical_profiles'] as $i => $chemical_profile) {
    if ( $i != 'add') {

      if ( $chemical_profile['chemical_profile_id'] == '' ) {
        $chemical_profile['chemical_profile_id'] = NULL;
      }

      $cp->id = $chemical_profile['chemical_profile_id'];

      foreach($f as $field) {
        $cp->fields[$field] = $chemical_profile[$field];
      }

      $cp->merge();
    }
  }

  // Update Labor Profile Values

  $labor_p = new labor_profile();

  $f = array(
    'ops_hourly_rate',
  );

  $labor_p->id = $form_state['values']['labor_profile']['labor_profile_id'];
  $labor_p->fields['location_id'] = $form_state['values']['location_id'];

  foreach($f as $field) {
    $labor_p->fields[$field] = $form_state['values']['labor_profile'][$field];
  }

  $labor_p->merge();

  drupal_set_message(t('The form has been submitted.'));
  $form_state['rebuild'] = TRUE;
}

function location_profile($vars) {

  $lp = $vars[0];
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
      '#options' => drupal_map_assoc(array('gallons', 'liters')),
      '#default_value' => !empty($lp['water_volume_unit']) ? $lp['water_volume_unit'] : 'gallons',
    ),
    'chemical_volume_unit' => array(
      '#title' => 'Chemical Volume Unit',
      '#description' => 'What unit are the chemicals measured in (ouncs, grams)',
      '#type' => 'select',
      '#options' => drupal_map_assoc(array('ounces', 'grams')),
      '#default_value' => !empty($lp['chemical_volume_unit']) ? $lp['chemical_volume_unit'] : 'ounces',
    ),
    'water_meter_rate' => array(
      '#title' => 'Water Meter Rate',
      '#description' => "Rate the water meter detects a pulse.  Currently .1 for all installed water meters",
      '#type' => 'textfield',
      '#default_value' => !empty($lp['water_meter_rate']) ? $lp['water_meter_rate'] : '',
    ),
    'temperature_rise_spring' => array(
      '#title' => 'Temperature Rise Spring',
      '#description' => "Constant which is used in the therms calculation.  The temperature difference between water coming in the building and the temperature of hot water",
      '#type' => 'textfield',
      '#default_value' => !empty($lp['temperature_rise_spring']) ? $lp['temperature_rise_spring'] : 0,
    ),
    'temperature_rise_summer' => array(
      '#title' => 'Temperature Rise Summer',
      '#description' => "Constant which is used in the therms calculation.  The temperature difference between water coming in the building and the temperature of hot water",
      '#type' => 'textfield',
      '#default_value' => !empty($lp['temperature_rise_summer']) ? $lp['temperature_rise_summer'] : 0,
    ),
    'temperature_rise_fall' => array(
      '#title' => 'Temperature Rise Fall',
      '#description' => "Constant which is used in the therms calculation.  The temperature difference between water coming in the building and the temperature of hot water",
      '#type' => 'textfield',
      '#default_value' => !empty($lp['temperature_rise_fall']) ? $lp['temperature_rise_fall'] : 0,
    ),
    'temperature_rise_winter' => array(
      '#title' => 'Temperature Rise Winter',
      '#description' => "Constant which is used in the therms calculation.  The temperature difference between water coming in the building and the temperature of hot water",
      '#type' => 'textfield',
      '#default_value' => !empty($lp['temperature_rise_winter']) ? $lp['temperature_rise_winter'] : 0,
    ),
    'heating_efficiency' => array(
      '#title' => 'Heating Efficiency',
      '#description' => "",
      '#type' => 'textfield',
      '#default_value' => !empty($lp['heating_efficiency']) ? $lp['heating_efficiency'] : 0,
    ),
    'thermal_conversion' => array(
      '#title' => 'Thermal Conversion',
      '#description' => "",
      '#type' => 'textfield',
      '#default_value' => !empty($lp['thermal_conversion']) ? $lp['thermal_conversion'] : 0,
    ),
    'cost_per_therm' => array(
      '#title' => 'Cost per Therm',
      '#description' => 'Analyst entered calculation based on the heating bill for the location',
      '#type' => 'textfield',
      '#default_value' => !empty($lp['cost_per_therm']) ? $lp['cost_per_therm'] : 0,
    ),
    'cost_per_gallon' => array(
      '#title' => 'Cost per gallon',
      '#description' => 'Analyst entered calculation based on the utility bill for the location',
      '#type' => 'textfield',
      '#default_value' => !empty($lp['cost_per_gallon']) ? $lp['cost_per_gallon'] : 0,
    )
  );

  return $location_profile;
}

function labor_profile($vars) {

  $lp = $vars[0];

  $labor_profile = array(
    '#type' => 'fieldset',
    '#title' => t('Labor Profile Values'),
    '#description' => t('Labor specific values used for calculations for this location'),

    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    'labor_profile_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($lp['labor_profile_id']) ? $lp['labor_profile_id'] : 0,
    ),
    'ops_hourly_rate' => array(
      '#title' => 'Operations Hourly Rate',
      '#description' => 'Analyst entered calculation based on location\'s hourly rate of operations',
      '#type' => 'textfield',
      '#default_value' => !empty($lp['ops_hourly_rate']) ? $lp['ops_hourly_rate'] : 0,
    ),
  );

  return $labor_profile;
}

function chemical_profile($vars) {
  $title = !empty($vars['chemical_type']) ? $vars['chemical_type'] : 'New';

  $chemical_profile = array(
    '#type' => 'fieldset',
    '#title' => t($title),
    '#description' => t('Location specific values used for chemicals for this location'),
    '#collapsible' => TRUE,
    '#collapsed' => $collapsed = !empty($vars['chemical_type']) ? TRUE : FALSE,
    // Set up the wrapper so that AJAX will be able to replace the fieldset.
    'chemical_profile_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($vars['chemical_profile_id']) ? $vars['chemical_profile_id'] : '',
    ),
    'chemical_type' => array(
      '#title' => 'Chemical Type',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => !empty($vars['chemical_type']) ? $vars['chemical_type'] : '',
    ),
    'supplier' => array(
      '#title' => 'Supplier',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => !empty($vars['supplier']) ? $vars['supplier'] : '',
    ),
    'material_type' => array(
      '#title' => 'Material Type',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => !empty($vars['material_type']) ? $vars['material_type'] : '',
    ),
    'unit' => array(
      '#title' => 'Unit',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => !empty($vars['unit']) ? $vars['unit'] : '',
    ),
    'unit_cost' => array(
      '#title' => 'Unit Cost',
      '#description' => '',
      '#type' => 'textfield',
      '#default_value' => !empty($vars['unit_cost']) ? $vars['unit_cost'] : '',
    ),
    'xeros_unit_cost' => array(
      '#title' => 'Xeros Unit Cost',
      '#description' => 'Cost of Xeros Chemicals are included in Xeros lease.  Set to 0 by default',
      '#type' => 'hidden',
      '#default_value' => !empty($vars['xeros_unit_cost']) ? $vars['xeros_unit_cost'] : 0,
    ),
    // Delete chemical
    'delete' => array(
      '#type' => 'submit',
      '#value' => t('Delete'),
      '#name' => t('delete-' . $vars['#index']),
      '#default_value' => $vars['#index'],
      '#submit' => array('chemical_profile_delete'),
      '#ff-process' => 'delete',
      '#ajax' => array(
        'callback' => 'chemical_profile_add_callback',
        'wrapper' => 'chemical-profiles-fieldset-wrapper',
      ),
    )
  );
  return $chemical_profile;
}


function chemical_profile_add($form, &$form_state) {
  // Chemical profile add will pick up the add in location_form.

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

function chemical_profile_delete($form, &$form_state) {
  // Everything in $form_state is persistent, so we'll just use
  // $form_state['add_name']
  $index = $form_state['triggering_element']['#parents'][1];

  // TODO: Delete the record from the database and if successful then delete the form element.
  $cp = new chemical_profile();

  $cp->id = $form_state['values']['chemical_profiles'][$index]['chemical_profile_id'];
  $num_deleted = $cp->delete();

  if ($num_deleted == 1) {
    // Delete the form element
    unset($form['chemical_profiles'][$index]);
    unset($form_state['values']['chemical_profiles']['index']);
  }

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

function chemical_profile_add_callback($form, $form_state) {
  return $form['chemical_profiles'];
}