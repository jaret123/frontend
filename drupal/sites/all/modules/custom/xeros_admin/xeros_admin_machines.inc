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
/**
 * Page callback for use with most of the menu entries. The arguments it
 * receives determine what it outputs.
 *
 * @param $content
 *   The base content to output.
 * @param $arg1
 *   First additional argument from the path used to access the menu
 * @param $arg2
 *   Second additional argument.
 */
function machine_listing($location_id = NULL, $machine_id = NULL) {
  $output =  '<div>This is the machine listing page for location: ' . $location_id . '</div>';

  $machine = new machine();

  $machine->fields = array(
                      'machine_id', 'serial_number', 'manufacturer'
                   );
  $rows = $machine->select($location_id, $machine_id);

  if (count($rows) > 0) {

    foreach ($rows as $i => $row) {
      array_push($rows[$i], '<a href="/config/machine/' . $location_id . '/edit/' . $row['machine_id'] . '">Edit</a>');
    }
    // Make a table
    $header = array(
      t('Machine ID'),
      t('Serial Number'),
      t('Manufacturer'),
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

  $output .= '<div><a href="/config/machine/' . $location_id . '/add">Add another machine</a>';
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

  $mc = new machine_classification();

  $mc->id = $machine_id;

  $vars['classifications'] = $mc->select_by_machine($machine_id);

  $cu = new chemical_usage;

  foreach ( $vars['classifications'] as $id => $c) {
    $vars['classifications'][$id]['chemical_usage'] = $cu->select($c['machine_classification_id']);
  }

  $f = drupal_get_form('machine_form', $vars);

  $output .= drupal_render($f);

  return $output;
}
/**
 * @param $form
 * @param $form_state
 *
 * @return mixed
 */
function machine_form($form, &$form_state, $vars) {

  // Initialize values based on database.  These will only get used the first time the page is rendered.
  // After that the input values from $form_state will be used.
  $form_state['values']['machine_id'] = $vars['machine_id'];
  $form_state['values']['location_id'] = $vars['location_id'];
  $form_state['values']['serial_number']= $vars['serial_number'];
  $form_state['values']['machine_settings']['machine'] = $vars['machine'];
  $form_state['values']['classifications'] = $vars['classifications'];


  $form['header'] = array(
    '#title' => 'Form header',
    '#markup' => '<div>Configure the machine settings</div>'
  );

  $form['header'] = array(
    '#type' => 'markup',
    '#markup' => '<div>' . t("Machine ID - Unique ID of the Machine (Auto Generated)") . ': ' . $vars['machine_id'],
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

  // Visible fields
  $form['serial_number'] = array(
    '#title' => 'Machine Serial Number',
    '#type' => 'textfield',
    '#default_value' => !empty($form_state['values']['serial_number']) ? $form_state['values']['serial_number'] : '',
  );

  $form['machine_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Machine Settings'),

    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#tree' => TRUE
  );

  $form['machine_settings']['machine'] = machine_settings($form, $form_state, $vars);
  

  $form['classification_set'] = array(
    '#type' => 'fieldset',
    '#title' => t('Classifications Settings'),

    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#tree' => TRUE
  );

  foreach( $form_state['values']['classifications'] as $i => $row) {
    $form['classification_set'][$i] = array(
      '#type' => 'fieldset',
      '#title' => t('Classification: ' . $row['name']),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#tree' => TRUE,
    );
    $form['classification_set'][$i]['classification'] = classification($form, $form_state, $row);

    foreach( $form_state['values']['classifications'][$i]['chemical_usage'] as $j => $jrow) {

      $form['classification_set'][$i]['classification']['chemical_usage_set'][$j] = array(
        '#type' => 'fieldset',
        '#title' => t('Chemical Type: ' . $jrow['chemical_type']),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#tree' => TRUE,
      );
      $form['classification_set'][$i]['classification']['chemical_usage_set'][$j]['chemical_usage'] = chemical_usage($form, $form_state, $jrow);
    }
  }




  $form['submit'] = array(
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

function classification($form, &$form_state, $row) {
  
  $classification = array(
    'name' => array(
      '#title' => 'Classification Name',
      '#description' => 'What type of laundry is in this classification',
      '#type' => 'textfield',
      '#default_value' => !empty($row['name']) ? $row['name'] : '',
    ),
    'machine_classification_id' => array(
      '#title' => 'Machine Classification ID',
      '#type' => 'hidden',
      '#default_value' => !empty($row['machine_classification_id']) ? $row['machine_classification_id'] : '',
    ),
    'classification_id' => array(
      '#title' => 'Classification ID',
      '#type' => 'textfield',
      '#default_value' => !empty($row['classification_id']) ? $row['classification_id'] : '',
    ),
    'load_size' => array(
      '#title' => 'Load Size',
      '#description' => 'How many pounds are loaded into the machine for this classification',
      '#type' => 'textfield',
      '#default_value' => !empty($row['load_size']) ? $row['load_size'] : '',
    ),
    'xeros_load_size' => array(
      '#title' => 'Xeros Load Size',
      '#description' => 'How many pounds are loaded into a Xeros machine for this classification',
      '#type' => 'textfield',
      '#default_value' => !empty($row['xeros_load_size']) ? $row['xeros_load_size'] : '',
    ),
    'unload_time' => array(
      '#title' => 'Manual Labor Time',
      '#description' => 'How long does it take to load and unload the machine after the cycle -- this is used in the run time calculation.',
      '#type' => 'textfield',
      '#default_value' => !empty($row['unload_time']) ? $row['unload_time'] : '',
    ),
    'local_static_values_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($row['local_static_values_id']) ? $row['local_static_values_id'] : NULL,
    ),
    'hot_water_gallons' => array(
      '#type' => 'textfield',
      '#title' => 'Xeros hot water usage',
      '#desription' => 'The model data for hot water usage for this type of laundry on a comparable Xeros machine',
      '#default_value' => !empty($row['hot_water_gallons']) ? $row['hot_water_gallons'] : NULL,
    ),
    'cold_water_gallons' => array(
      '#type' => 'textfield',
      '#title' => 'Xeros cold water usage',
      '#desription' => 'The model data for cold water usage for this type of laundry on a comparable Xeros machine',
      '#default_value' => !empty($row['cold_water_gallons']) ? $row['cold_water_gallons'] : NULL,
    )
  );
// TODO: Run time is in the fields spreadsheet but not in the xeros_local_static_values database.
//    'run_time' => array(
//      '#type' => 'textfield',
//      '#title' => 'Xeros hot water usage',
//      '#desription' => 'The model data for hot water usage for this type of laundry on a comparable Xeros machine',
//      '#default_value' => !empty($row['run_time']) ? $row['run_time'] : NULL,
//    )

  return $classification;
}

function chemical_usage($form, &$form_state, $row) {

  $chemical_usage = array(
    'machine_classification_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($row['machine_classification_id']) ? $row['machine_classification_id'] : '',
    ),
    'chemical_profile_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($row['chemical_profile_id']) ? $row['chemical_profile_id'] : '',
    ),
    'strength' => array(
      '#type' => 'textfield',
      '#title' => 'Strength',
      '#description' => 'Number of units (Oz or Grams) per cycle in this classification',
      '#default_value' => !empty($row['strength']) ? $row['strength'] : '',
    ),
    'xeros_strength' => array(
      '#type' => 'textfield',
      '#title' => 'Xeros Strength',
      '#description' => 'Estimated number of units (Oz or Grams) per cycle in this classification',
      '#default_value' => !empty($row['xeros_strength']) ? $row['xeros_strength'] : '',
    ),
    'chemical_profile_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($row['chemical_profile_id']) ? $row['chemical_profile_id'] : '',
    ),
    'chemical_type' => array(
      '#type' => 'textfield',
      '#title' => 'Chemical Type',
      '#description' => '',
      '#default_value' => !empty($row['chemical_type']) ? $row['chemical_type'] : '',
    ),
    'supplier' => array(
      '#type' => 'textfield',
      '#title' => 'Supplier',
      '#description' => '',
      '#default_value' => !empty($row['supplier']) ? $row['supplier'] : '',
    ),
    'material_type' => array(
      '#type' => 'textfield',
      '#title' => 'Material Type',
      '#description' => '',
      '#default_value' => !empty($row['material_type']) ? $row['material_type'] : '',
    ),
    'unit' => array(
      '#type' => 'select',
      '#title' => 'Unit',
      '#description' => '',
      '#options' => drupal_map_assoc(array('oz', 'grams')),
      '#default_value' => !empty($row['unit']) ? $row['unit'] : '',
    ),
    'unit_cost' => array(
      '#type' => 'textfield',
      '#title' => 'Unit Cost',
      '#description' => 'Cost per unit',
      '#default_value' => !empty($row['unit_cost']) ? $row['unit_cost'] : '',
    ),
    'location_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($row['location_id']) ? $row['location_id'] : '',
    ),
    'xeros_unit_cost' => array(
      '#type' => 'textfield',
      '#title' => 'Xeros Unit Cost',
      '#description' => 'Note: All chemicals are included with a Xeros lease.  Enter 0',
      '#default_value' => !empty($row['xeros_unit_cost']) ? $row['xeros_unit_cost'] : '',
    ),

  );

  return $chemical_usage;
}