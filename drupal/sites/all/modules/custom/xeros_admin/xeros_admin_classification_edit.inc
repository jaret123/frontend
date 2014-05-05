<?php
require_once('db/machine.inc');
require_once('db/machine_classification.inc');
require_once('db/chemical_usage.inc');
require_once('db/chemical_profile.inc');

/**
 * @param null $machine_classification_id
 * @param null $function_call
 * @param null $machine_id
 *
 * @return string
 */
function classification_edit_page($machine_classification_id = NULL, $machine_id = NULL) {

  $output = '';
  $mc = new machine_classification();

  $mc->id = $machine_classification_id;

  $vars = $mc->select_detail($mc->id);

  $cu = new chemical_usage;

    $cu_rows = $cu->select($vars[0]['machine_classification_id']);
    // For the ajax callbacks we are going to have to let the chemical usage delete button be
    // aware of it's parent container ids (classification index)
    foreach ($cu_rows as $j => $v) {
      $cu_rows[$j]['chemical_usage_set_index'] = $j;
    }
    $vars['chemical_usage_set'] = $cu_rows;

  $output = '<h2>Classification</h2>';

  $f = drupal_get_form('classification_edit_form', $vars);

  $output .= drupal_render($f);

  return $output;
}

function classification_edit_form($form, &$form_state, $vars) {
  // Each classification
  // Track using #vars
  if (empty($form_state['#vars'])) {
    // Initialize values based on database.  These will only get used the first time the page is rendered.
    // After that the input values from $form_state will be used.
    $form_state['values']['chemical_usage_set'] = $vars['chemical_usage_set'];
    // Save this for reference in the form_state so each sub form can access it, even on callback.
    $form_state['#vars'] = $vars;
  }
  $form['classification']['settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Settings'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['classification']['settings'] = array_merge($form['classification']['settings'] , classification($form, $form_state, $form_state['#vars'][0]));

  $form['chemical_usage_set'] = array(
    '#type' => 'fieldset',
    '#title' => t('Chemicals'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#prefix' => '<div id="chemical-usage-set-wrapper">',
    '#suffix' => '</div>'
  );

  foreach ($form_state['#vars']['chemical_usage_set'] as $j => $jrow) {
    $chemical_type = !empty($jrow['chemical_type']) ? $jrow['chemical_type'] : 'New';
    $form['chemical_usage_set'][$j] = array(
      '#type' => 'fieldset',
      '#title' => t('Chemical: ' . $chemical_type),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );
    $jrow['chemical_usage_set_index'] = $j;
    $form['chemical_usage_set'][$j] = array_merge($form['chemical_usage_set'][$j], chemical_usage($form, $form_state, $jrow));
  }

    // Adds "Add another chem usage per classification" button
    $form['chemical_usage_set']['add'] = array(
      '#type' => 'submit',
      '#value' => 'add-chemical',
      '#id' => 'add-chemical',
      '#name' => 'add-chemical',
      '#ff-process' => 'add',
      '#submit' => array('chemical_usage_add'),
      '#ajax' => array(
        'callback' => 'chemical_usage_add_callback',
        'wrapper' => 'chemical-usage-set-wrapper',  // Need to add an index
      ),
      '#attributes' => array(
        'action' => 'add-chemical',
      )
    );

  return $form;
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

function classification_add($form, &$form_state) {
  // Chemical profile add will pick up the add in location_form.

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

//function classification_delete($form, &$form_state) {
//  // Everything in $form_state is persistent, so we'll just use
//  // $form_state['add_name']
//  $index = $form_state['triggering_element']['#parents'][1];
//
//  // TODO: Double check this.
//  $c = new classification();
//
//  $c->id = $form_state['values']['classification_set'][$index]['classification_id'];
//  $num_deleted = $c->delete();
//
//  if ($num_deleted == 1) {
//    // Delete the form element
//    unset($form['classification_set'][$index]);
//    unset($form_state['values']['classification_set']['index']);
//  }
//
//  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
//  $form_state['rebuild'] = TRUE;
//}

function classification_add_callback($form, $form_state) {
  return $form['classification_set'];
}


function chemical_usage($form, &$form_state, $row) {
  $chem_map = function($value) {
    return array($value['chemical_profile_id'] => $value['chemical_type']);
    //return $value['chemical_type'];
  };

//  $ar = array_map($chem_map, $form_state['#vars']['chemical_profile_set']);
//
//  foreach ($ar as $i => $value) {
//    foreach ($value as $j => $v) {
//      $chem_ar[$j] = $v;
//    }
//  }

  if (empty($row['chemical_type'])) {
    $row['chemical_type'] = '';
  }
  if (empty($row['supplier'])) {
    $row['supplier'] = '';
  }
  if (empty($row['material_type'])) {
    $row['material_type'] = '';
  }
  if (empty($row['unit'])) {
    $row['unit'] = '';
  }

  $uniqid = uniqid();

  $chemical_usage = array(
    'machine_classification_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($row['machine_classification_id']) ? $row['machine_classification_id'] : '',
    ),
    'chemical_profile_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($row['chemical_profile_id']) ? $row['chemical_profile_id'] : '',
    ),
    'chemical_type' => array(
      '#type' => 'markup',
      '#markup' => 'Chemical Type: ' . $row['chemical_type'] . '<br />',
    ),
    'supplier' => array(
      '#type' => 'markup',
      '#markup' => 'Supplier: ' . $row['supplier'] . '<br />',
    ),
    'material_type' => array(
      '#type' => 'markup',
      '#markup' => 'Material Type: ' . $row['material_type'] . '<br />',
    ),
    'unit' => array(
      '#type' => 'markup',
      '#markup' => 'Unit: ' . $row['unit']  . '<br />',
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
    // Delete chemical
    'delete' => array(
      '#type' => 'submit',
      '#value' => 'delete-' . $uniqid,
      '#id' => 'delete-' . $uniqid,
      '#name' => 'delete-' . $uniqid,
      //'#default_value' => $vars['#index'],
      '#submit' => array('chemical_usage_delete'),
      '#ff-process' => 'delete',
      '#ajax' => array(
        'callback' => 'chemical_usage_add_callback',
        'wrapper' => 'chemical-usage-set-wrapper',
      ),
      '#attributes' => array(
        'data-chemical_profile_id' => !empty($row['chemical_profile_id']) ? $row['chemical_profile_id'] : 0,
        'data-chemical_usage_set' => $row['chemical_usage_set_index'],
      )
    )
  );

  return $chemical_usage;
}

function chemical_usage_add($form, &$form_state) {
  // Chemical profile add will pick up the add in location_form.
  $attrs = $form_state['triggering_element']['#attributes'];

  // Add a new set
  $form_state['#vars']['chemical_usage_set'][] = array();

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

function chemical_usage_delete($form, &$form_state) {

  $attrs = $form_state['triggering_element']['#attributes'];

  // Instantiate the object
  $cu = new chemical_usage();

  // Delete the record
//  $cu->chemical_profile_id = $attrs['data-chemical_profile_id'];
//  $cu->machine_classification_id = $attrs['data-machine_classification_id'];
  //$num_deleted = $cu->delete();

  //if ($num_deleted == 1 || $attrs['data-chemical_profile_id'] == 0) {
  // Delete the form element
  //unset($form['classification_set'][$attrs['data-classification_set']]['chemical_usage_set'][$attrs['data-chemical_usage_set']]);
  unset($form_state['#vars']['chemical_usage_set'][$attrs['data-chemical_usage_set']]);
  //}

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

function chemical_usage_add_callback($form, $form_state) {
  //$classification_set = $form_state['clicked_button']['#attributes']['data-classification_set'];
  return $form['chemical_usage_set'];
}

