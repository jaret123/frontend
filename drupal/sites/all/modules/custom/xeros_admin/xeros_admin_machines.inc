<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 4/26/14
 * Time: 12:33 PM
 */
require_once('db/machine.inc');
require_once('db/machine_classification.inc');
require_once('db/chemical_usage.inc');
require_once('db/chemical_profile.inc');

/**
 * @param null $location_id
 * @param null $machine_id
 *
 * @return string
 */
function machine_listing($location_id = NULL, $machine_id = NULL) {
  $output =  '<div>This is the machine listing page for location: ' . $location_id . '</div>';

  $machine = new machine();

  $machine->fields = array(
                      'machine_id', 'serial_number', 'manufacturer', 'location_id'
                   );
  $rows = $machine->select($location_id, $machine_id);

  if (count($rows) > 0) {

    foreach ($rows as $i => $row) {
      array_push($rows[$i], '<a href="/config/machine/' . $row['location_id'] . '/edit/' . $row['machine_id'] . '">Edit</a>');
    }
    // Make a table
    $header = array(
      t('Machine ID'),
      t('Serial Number'),
      t('Manufacturer'),
      t('Location ID'),
      t('Edit')
    );
    //$output .= theme('table', array('header' => $header, 'rows' => $rows));

    $r = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows
    );
    $output .= drupal_render($r);
  } else {
    drupal_set_message(t('No machines found for this location.'));
  }

  $output .= '<div><a href="/config/machine/' . $location_id . '/add">Add another machine</a></div>';
  return $output;
};

function machine_edit_page($location_id = NULL, $function_call = NULL, $machine_id = NULL) {

  $output = '';
  $output .= 'Location ID: ' . $location_id . '<br />';
  $output .= 'Function: ' . $function_call . '<br />';

  $machine = new machine();

  $rows = $machine->select($location_id, $machine_id);

  $vars = array(
    'machine_id' => $machine_id,
    'location_id' => $rows[0]['location_id'],
    'serial_number' => $rows[0]['serial_number'],
    'machine' => $rows[0]
  );

  $chem = new chemical_profile();

  // TODO - want list of unique chemicals by location - make sure what makes them unique.  Is it just the name or the
  // chemical profile id.
  $vars['chemical_profile_set'] = $chem->select_by_location($location_id);

  $mc = new machine_classification();

  $mc->id = $machine_id;



  $f = drupal_get_form('machine_form', $vars);

  $output .= drupal_render($f);

  $output .= classification_listing($machine_id, $location_id);

  return $output;
}
/**
 * @param $form
 * @param $form_state
 *
 * @return mixed
 */
function machine_form($form, &$form_state, $vars) {

  if (empty($form_state['#vars'])) {
    // Initialize values based on database.  These will only get used the first time the page is rendered.
    // After that the input values from $form_state will be used.
    $form_state['values']['machine_id'] = $vars['machine_id'];
    $form_state['values']['location_id'] = $vars['location_id'];
    $form_state['values']['serial_number']= $vars['serial_number'];
    $form_state['values']['machine_settings']['machine'] = $vars['machine'];
  // Save this for reference in the form_state so each sub form can access it, even on callback.
    $form_state['#vars'] = $vars;
  }

//  if ( !empty($form_state['triggering_element']['#ff-process']) ) {
//    $action = $form_state['triggering_element']['#ff-process'];
//    if ($action == 'delete') {
//      $classification_index = $form_state['triggering_element']['#attributes']['data-classification_set'];
//      $chemical_index = $form_state['triggering_element']['#attributes']['data-chemical_usage_set'];
////      unset($form_state['values']['classifications'][$classification_index]['chemical_usage'][$chemical_index]);
////      unset($form['classifications'][$classification_index]['chemical_usage'][$chemical_index]);
//    } elseif ($action == 'add') {
//      $classification_index = $form_state['triggering_element']['#attributes']['data-classification_set'];
//      //$c = new chemical_usage();
//      $r = array();
//      $r['chemical_usage_set_index'] = count($form_state['values']['classification_set'][$classification_index]['chemical_usage_set']);
//      $r['classification_set_index'] = $classification_index;
//      $form_state['values']['classification_set'][$classification_index]['chemical_usage_set'][] = $r;
//    }
//  }

  $form['header'] = array(
    '#title' => 'Form header',
    '#markup' => 'Configure the machine settings<br />'
  );

  $form['header'] = array(
    '#type' => 'markup',
    '#markup' => t("Machine ID - Unique ID of the Machine (Auto Generated)") . ': ' . $vars['machine_id'] . '<br />',
  );

  // Hidden fields for processing between validate and submit
  $form['machine_id'] = array(
    '#type' => 'hidden',
    '#default_value' => !empty($form_state['values']['machine_id']) ? $form_state['values']['machine_id'] : '',
  );

  $form['location_id'] = array(
    '#type' => 'hidden',
    '#default_value' => !empty($form_state['values']['location_id']) ? $form_state['values']['location_id'] : '',
  );



  $form['machine_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Machine Settings'),

    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#tree' => TRUE
  );
  // Visible fields
  $form['machine_settings']['serial_number'] = array(
    '#title' => 'Machine Serial Number',
    '#type' => 'textfield',
    '#default_value' => !empty($form_state['values']['serial_number']) ? $form_state['values']['serial_number'] : '',
  );

  $form['machine_settings'] = array_merge($form['machine_settings'], machine_settings($form, $form_state, $vars));
  

  // Classification Add Button
//  $form['classification_set']['add'] = array(
//    '#type' => 'submit',
//    '#value' => t('Add another classification'),
//    '#ff-process' => 'add',
//    '#submit' => array('classification_add'),
//    '#ajax' => array(
//      'callback' => 'classification_add_callback',
//      'wrapper' => 'classification-set-wrapper',  // Need to add an index
//    ),
//  );

  $form['machine_settings']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  return $form;
}

function machine_form_validate($form, &$form_state) {
  $serial_number = $form_state['values']['serial_number'];
  if ($serial_number && ($serial_number == 'ERROR')) {
    form_set_error('serial_number', t('Serial Number invalid'));
  }
}

function machine_form_submit($form, &$form_state) {

  $machine = new machine();

  $machine->id = $form_state['values']['machine_id'];

  $f = array(
    'machine_id',
    'serial_number',
    'location_id'
  );

  foreach ($f as $field) {
    $machine->fields[$field] = $form_state['values'][$field];
  };

  $f = array(
    'manufacturer',
    'model',
    'size',
    'steam',
    'fuel_type',
    'machine_type',
    'cold_water_meter_type',
    'door_lock_meter_type',
    'hot_water_meter_type',
    'start_time_offset',
    'stop_time_offset',
    'machine_identifier',
    'door_lock_duration_match_variance',
    'sensor_start_match_variance',
    'duration_match_variance',
    'ignore_meter_type',
    'unknown_class'
  );

  foreach ($f as $field) {
    $machine->fields[$field] = $form_state['values']['machine_settings']['machine'][$field];
  }

  $machine->merge();

  drupal_set_message(t('The form has been submitted.'));
  $form_state['rebuild'] = TRUE;
}

function machine_settings($form, &$form_state, $vars) {
  
  // Form state values
  $fsv = !empty($form_state['values']['machine_settings']['machine']) ? $form_state['values']['machine_settings']['machine'] : NULL;

  $machine_settings = array();
  $machine_settings['manufacturer'] = array(
    '#title' => 'Manufacturer',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['manufacturer']) ? $fsv['manufacturer'] : '',
  );

  $machine_settings['model'] = array(
    '#title' => 'Model',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['model']) ? $fsv['model'] : '',
  );

  $machine_settings['size'] = array(
    '#title' => 'Maximum Load Size',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['load_size']) ? $fsv['load_size'] : '',
  );

  $machine_settings['steam'] = array(
    '#title' => 'Connected to Steam?',
    '#description' => 'Check if the machine is connected to steam, leave black if not.',
    '#type' => 'checkbox',
    '#default_value' => !empty($fsv['steam']) ? (int)$fsv['steam'] : 0,
  );

  $machine_settings['fuel_type'] = array(
    '#title' => 'Fuel Type',
    '#description' => 'Gas or Electric',
    '#type' => 'select',
    '#options' => array(t('Gas'), t('Electric')),
    '#default_value' => !empty($fsv['fuel_type']) ? $fsv['fuel_type'] : '',
  );

  $machine_settings['machine_type'] = array(
    '#title' => 'Machine Type',
    '#description' => 'Washer or Dryer',
    '#type' => 'select',
    '#options' => drupal_map_assoc(array(t('Washer'), t('Dryer'))),
    '#default_value' => !empty($fsv['machine_type']) ? $fsv['machine_type'] : 'Washer',
  );

  $machine_settings['cold_water_meter_type'] = array(
    '#title' => 'Cold Water Meter',
    '#description' => 'Which meter is the cold water?',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['cold_water_meter_type']) ? $fsv['cold_water_meter_type'] : '',
  );

  $machine_settings['hot_water_meter_type'] = array(
    '#title' => 'Hot Water Meter',
    '#description' => 'Which WM is the Hot Water',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['hot_water_meter_type']) ? $fsv['hot_water_meter_type'] : '',
  );

  $machine_settings['door_lock_meter_type'] = array(
    '#title' => 'Door Lock Sensor',
    '#description' => 'Which Sensor is the Door Lock',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['door_lock_meter_type']) ? $fsv['door_lock_meter_type'] : '',
  );

  $machine_settings['start_time_offset'] = array(
    '#title' => 'Start Time Offset',
    '#description' => 'Offset to add time before a cycle (i.e. if the machine door locks, but does not start for 1 minute)',
    '#type' => 'textfield'
  );

  $machine_settings['stop_time_offset'] = array(
    '#title' => 'Stop Time Offset',
    '#description' => 'Offset to add after a cycle',
    '#type' => 'textfield'
  );

  $machine_settings['machine_identifier'] = array(
    '#title' => 'Machine Identifier',
    '#description' => 'Standard Washer or Xeros - used to match collection data from DAI',
    '#type' => 'textfield'
  );

  $machine_settings['door_lock_duration_match_variance'] = array(
    '#title' => 'Door Lock Duration Match Variance',
    '#description' => 'Variance in the door lock timing to accept in a match',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['door_lock_duration_match_variance']) ? $fsv['door_lock_duration_match_variance'] : 1,
  );

  $machine_settings['sensor_start_match_variance'] = array(
    '#title' => 'Sensor Start Match Variance',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['sensor_start_match_variance']) ? $fsv['sensor_start_match_variance'] : '',
  );

  $machine_settings['duration_match_variance'] = array(
    '#title' => 'Duration Match Variance',
    '#type' => 'textfield',
    '#default_value' => !empty($fsv['duration_match_variance']) ? $fsv['duration_match_variance'] : '',
  );

  $machine_settings['ignore_meter_type'] = array(
    '#title' => 'Meters to Ignore',
    '#type' => 'textfield',
    '#description' => 'Meter(s) to ignore when mapping (i.e. Formula Reset for Xeros, or extra sensors that are connected for future measurements that are not yet implemented.)'
  );

  $machine_settings['unknown_class'] = array(
    '#title' => 'Unknown class number',
    '#type' => 'textfield',
    '#description' => 'What classification (collection_map_id to be precise) to use when a cycle fails to map for this machine (generally set to 1)',
    '#default_value' => !empty($fsv['unknown_class']) ? $fsv['unknown_class'] : '',
  );

  // Active DAI Fields
  $machine_settings['active_dai_id'] = array(
    '#default_value' => !empty($fsv['active_dai_id']) ? $fsv['active_dai_id'] : 0,
    '#type' => 'hidden',
  );

  $machine_settings['dry_smart'] = array(
    '#title' => 'Dry smart',
    '#description' => 'Is this machine a dry smart. (Reserved for future use)',
    '#type' => 'select',
    '#options' => array(t('No'), t('Yes')),
    '#default_value' => !empty($fsv['dry_smart']) ? $fsv['dry_smart'] : 0,
  );

  $machine_settings['machine_profile_id'] = array(
    '#type' => 'hidden',
    '#default_value' => !empty($fsv['machine_profile_id']) ? $fsv['machine_profile_id'] : 0,
  );

  $machine_settings['dai_identifier'] = array(
    '#type' => 'textfield',
    '#title' => 'DAI Identifier',
    '#description' => 'Name of DAI, needs to match DAI configuration.',
    '#default_value' => !empty($fsv['dai_identifier']) ? $fsv['dai_identifier'] : ''
  );

  return $machine_settings;
}

function classification_listing($machine_id = NULL, $location_id = NULL) {
  $output =  '<div>This is the classification listing for machine: ' . $machine_id . '</div>';

  $mc = new machine_classification();

  $mc->id = $machine_id;

  $classification_set = $mc->select_by_machine($machine_id);

  $cu = new chemical_usage;

  foreach ( $classification_set as $id => $c) {
    $cu_rows = $cu->select($c['machine_classification_id']);
    // For the ajax callbacks we are going to have to let the chemical usage delete button be
    // aware of it's parent container ids (classification index)
    foreach ($cu_rows as $j => $v) {
      $cu_rows[$j]['classification_set_index'] = $id;
      $cu_rows[$j]['chemical_usage_set_index'] = $j;
    }
    $classification_set[$id]['chemical_usage_set'] = $cu_rows;
  }

  if (count($classification_set) > 0) {

    foreach ($classification_set as $i => $row) {
      array_push($classification_set[$i], '<a href="/config/machine/classification/edit/' . $location_id . '/' . $row['machine_id'] . '/' . $row['machine_classification_id'] . '">Edit</a>');
    }
    // Make a table
    $header = array(
      t('Machine Classification ID'),
      t('Machine ID'),
      t('Classification ID'),
      t('Load Size'),
      t('Xeros Load Size'),
      t('Manual Labor Time'),
      t('Name'),
      t(''),
      t(''),
      t('Xeros Hot Water Usage'),
      t('Xeros Cold Water Usage'),
      t('Edit')
    );
    //$output .= theme('table', array('header' => $header, 'rows' => $rows));

    $r = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $classification_set
    );
    $output .= drupal_render($r);
  } else {
    drupal_set_message(t('No machines found for this location.'));
  }

  $output .= '<div><a href="/config/machine/classification/add/' . $location_id . '/' . $machine_id . '">Add another classification</a></div>';
  return $output;
}
