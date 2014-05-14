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
require_once('db/company.inc');
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

  $output .= '<div><a href="/config/location/add">+ Add another location</a></div>';
  return $output;

  return $output;
}


function location_edit_page($function_call = NULL, $location_id = NULL) {

  $output = '';
  $output = '<a href="/config/locations">Back to location listing</a> <br />';

  if ( !in_array($function_call, array('edit', 'add')) || ($function_call == 'edit' && $location_id == NULL )) {
    $output .= 'Page not found';
  } else {

    $output .= 'Function: ' . $function_call . '<br />';

    $vars = array();
    $vars['#function_call'] = $function_call;
    $vars['location'] = array();
    $vars['company'] = array();

    $lp = new location_profile();
    $labor = new labor_profile();

    $vars['location_profile'] = array();

    $vars['labor_profile'] = array();

    if ( $function_call == 'edit' ) {
      // Load company and location
      $location = node_load($location_id);
      $company = node_load($location->field_company['und'][0]['target_id']);

      $vars['location'] = $location;
      $vars['company'] = $company;

      $output .= 'Company: ' . $company->title . '<br />';
      $output .= 'Location: ' . $location->title . '<br />';

      $vars['location_profile'] = $lp->select_by_location($location_id);

      $vars['labor_profile'] = $labor->select_by_location($location_id);

      $chemical_profile = new chemical_profile();

      $vars['chemical_profiles'] = $chemical_profile->select_by_location($location_id);

    } else {

      $output .= 'Company: New<br />';
      $output .= 'Location: New<br />';
    }

    $f = drupal_get_form('location_form', $vars);

    $output .= drupal_render($f);

    if ( $function_call == 'edit' ) {
      $output .= machine_listing($location->nid);
    }
  }
  return $output;
}

function location_form($form, &$form_state, $vars) {

  if (empty($form_state['#vars'])) {
    $form_state['values']['company_id'] = isset($vars['company']->nid) ? $vars['company']->nid : NULL;
    $form_state['values']['location_id'] = isset($vars['location']->nid) ? $vars['location']->nid : NULL;
    $form_state['values']['location_name'] = isset($vars['location']->title) ? $vars['location']->title : NULL;
    $form_state['values']['location_profile'] = isset($vars['location_profile'][0]) ? $vars['location_profile'][0] : array();
    $form_state['#vars'] = $vars;
  }

  $form['#tree'] = TRUE;

  // Hidden fields for processing between validate and submit
  $form['location_id'] = array(
    '#type' => 'hidden',
    '#default_value' => !empty($form_state['values']['location_id']) ? $form_state['values']['location_id'] : NULL,
  );

  if ( $form_state['#vars']['#function_call'] == 'add') {

    $c = new company;
    $companies = $c->select_all();
    $company_options = array();

    $company_options[0] = '-- Select a Company --';
    foreach ( $companies as $id => $row ) {
      $company_options[$id] = $row->title;
    }

    $form['company_id'] = array(
      '#title' => 'Company',
      '#type' => 'select',
      '#options' => $company_options,
    );
  } else {
    $form['company_id'] = array(
      '#type' => 'hidden',
      '#default_value' => !empty($form_state['values']['location_id']) ? $form_state['values']['location_id'] : NULL,
    );
  }


  //Visible fields
  $form['location_name'] = array(
    '#type' => 'textfield',
    '#title' => 'Location Name',
    '#default_value' => !empty($form_state['values']['location_name']) ? $form_state['values']['location_name'] : NULL,
  );

  $form['location_profile'] = location_profile($form_state['values']['location_profile']);

  $form['labor_profile'] = labor_profile($vars['labor_profile']);

  if ( $form_state['#vars']['#function_call'] == 'edit' ) {
    $form['chemical_profiles'] = array(
      '#type' => 'fieldset',
      '#title' => t('Chemical Profile Information'),
      '#description' => t('Location specific values used for chemicals for this location'),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
      '#prefix' => '<div id="chemical-profiles-fieldset-wrapper">',
      '#suffix' => '</div>'
    );

    foreach ($form_state['#vars']['chemical_profiles'] as $i => $row) {
      $row = $form_state['#vars']['chemical_profiles'][$i];
      $row['#index'] = $i;
      $form['chemical_profiles'][$i] = chemical_profile($row);
    }

    // Adds "Add another chemical profile" button
    $form['chemical_profiles']['add'] = array(
      '#type' => 'submit',
      '#value' => t('Add another chemical'),
      '#name' => 'add-chemical',
      '#ff-process' => 'add',
      '#submit' => array('chemical_profile_add'),
      '#attributes' => array(
        'action' => 'add-chemical-profile',
      ),
      '#ajax' => array(
        'callback' => 'chemical_profile_add_callback',
        'wrapper' => 'chemical-profiles-fieldset-wrapper',
      ),
    );
  }

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
  if ($form_state['values']['company_id'] == 0) {
    form_set_error('company_id', ('Company ID required'));
  }
  //drupal_set_message('Validation run');
}

function location_form_submit($form, &$form_state) {

  if ( $form_state['#vars']['#function_call'] == 'add') {
    // Add Location

    $company_id = $form_state['values']['company_id'];
    $l = new stdClass();

    $l->type = 'location';
    $l->status = 1;
    $l->title = $form_state['values']['location_name'];
    $l->body = '';
    $l->field_company['und'][0]['target_id'] = $company_id;

    node_save($l);

    // Get the returned ID
    $location_id = $l->nid;

    // Insert Location Profile Values
    $lp = new location_profile();
    $lp->id = $location_id;

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

    $lp->insert();

    // Update Labor Profile Values

    $labor_p = new labor_profile();

    $f = array(
      'ops_hourly_rate',
    );

    $labor_p->fields['location_id'] = $location_id;

    foreach($f as $field) {
      $labor_p->fields[$field] = $form_state['values']['labor_profile'][$field];
    }

    $labor_p->insert();

    drupal_set_message('New Location Added.  Add the chemical profiles then add machines.');
  } else {
    // Update Location

    $company_id = $form_state['values']['company_id'];

    $l = node_load($form_state['values']['location_id']);

    $l->title = $form_state['values']['location_name'];
    $l->body = '';

    node_save($l);

    // Update Location Profile Values

    $lp = new location_profile();
    $lp->id = $l->nid;

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

    $cp->fields['location_id'] = (int)$l->nid;

    foreach( $form_state['#vars']['chemical_profiles'] as $i => $chemical_profile) {

      foreach($f as $field) {
        if ( $field != 'delete') {
          $cp->fields[$field] = $form_state['values']['chemical_profiles'][$i][$field];
        }
      }

      if ( $form_state['values']['chemical_profiles'][$i]['chemical_profile_id'] == '' ) {
        unset($cp->fields['chemical_profile_id']);
        $cp->insert();
      } else {
        $cp->id = $chemical_profile['chemical_profile_id'];
        $cp->merge();
      }

    }

    // Update Labor Profile Values

    $labor_p = new labor_profile();

    $f = array(
      'ops_hourly_rate',
    );

    $labor_p->id = $form_state['values']['labor_profile']['labor_profile_id'];
    $labor_p->fields['location_id'] = $l->nid;

    foreach($f as $field) {
      $labor_p->fields[$field] = $form_state['values']['labor_profile'][$field];
    }

    $labor_p->merge();

    drupal_set_message(t('Location Saved.'));

  }

  $form_state['redirect'] = 'config/location/edit/' . $form_state['values']['location_id'];
}

function location_profile($vars) {

  $lp = !empty($vars) ? $vars : array();
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
      '#default_value' => !empty($lp['water_meter_rate']) ? $lp['water_meter_rate'] : .1,
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

  $lp = !empty($vars) ? $vars[0] : array();

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
  $uniqid = uniqid();

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
      '#id' => 'delete-' . $uniqid,
      '#name' => 'delete-' . $uniqid,
      '#default_value' => $vars['#index'],
      '#submit' => array('chemical_profile_delete'),
      '#ff-process' => 'delete',
      '#attributes' => array(
        'data-chemical_profile_index' => $vars['#index'],
      ),
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

  $attrs = $form_state['triggering_element']['#attributes'];

  // Add a new chemical profile to the array
  $form_state['#vars']['chemical_profiles'][] = array(
    'location_id' => $form_state['#vars']['location']->nid
  );

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

function chemical_profile_delete($form, &$form_state) {
  // Everything in $form_state is persistent, so we'll just use
  // $form_state['add_name']
  $attrs = $form_state['triggering_element']['#attributes'];
  $index = $attrs['data-chemical_profile_index'];

  // TODO: Delete the record from the database and if successful then delete the form element.
  $cp = new chemical_profile();

  $cp->id = $form_state['values']['chemical_profiles'][$index]['chemical_profile_id'];
  $num_deleted = $cp->delete();

  if ($num_deleted == 1) {
    drupal_set_message('Chemical profile deleted');
  } else {
    drupal_set_message('Delete', 'No records found in the database to delete.  Check error log.');
  }

  // Regardless we will delete the form array since it might have been newly created.
  unset($form_state['#vars']['chemical_profiles'][$index]);
  unset($form_state['values']['chemical_profiles'][$index]);
  unset($form['chemical_profiles'][$index]);

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

function chemical_profile_add_callback($form, $form_state) {
  return $form['chemical_profiles'];
}