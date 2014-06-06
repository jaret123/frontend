<?php
require_once('db/machine.inc');
require_once('db/machine_classification.inc');
require_once('db/classification.inc');
require_once('db/chemical_usage.inc');
require_once('db/chemical_profile.inc');
require_once('db/local_static_value.inc');

function classification_add_page($location_id = NULL, $machine_id = NULL) {

  $output = '';
  $mc = new machine_classification();

//  //$mc->id = $machine_classification_id;
//
   $vars = array(
     0 => array()
   );

  $vars['location_id'] = $location_id;
  $vars['machine_id'] = $machine_id;

  $vars['function_call'] = 'add';
//
//  $cu = new chemical_usage;
//
//  $cu_rows = $cu->select($machine_classification_id);
//  // For the ajax callbacks we are going to have to let the chemical usage delete button be
//  // aware of it's parent container ids (classification index)
//  foreach ($cu_rows as $j => $v) {
//    $cu_rows[$j]['chemical_usage_set_index'] = $j;
//  }
  $vars['chemical_usage_set'] = array();

  $output = '<h2>Classification</h2>';

  $output = '<a href="/config/machine/' . $location_id . '/edit/' . $machine_id . '"> << Back to machine</a> <br />';


  $f = drupal_get_form('classification_edit_form', $vars);

  $output .= drupal_render($f);

  return $output;
}
/**
 * @param null $machine_classification_id
 * @param null $function_call
 * @param null $machine_id
 *
 * @return string
 */
function classification_edit_page($location_id = NULL, $machine_id = NULL, $machine_classification_id = NULL) {

  $output = '';
  $mc = new machine_classification();

  $mc->id = $machine_classification_id;

  $vars = $mc->select_detail($mc->id);

  $vars['location_id'] = $location_id;
  $vars['machine_id'] = $machine_id;

  $vars['function_call'] = 'edit';

  $cu = new chemical_usage;

    $cu_rows = $cu->select($machine_classification_id);
    // For the ajax callbacks we are going to have to let the chemical usage delete button be
    // aware of it's parent container ids (classification index)
    foreach ($cu_rows as $j => $v) {
      $cu_rows[$j]['chemical_usage_set_index'] = $j;
    }
    $vars['chemical_usage_set'] = $cu_rows;

  $output = '<h2>Classification Edit Page</h2>';

  $output .= '<a href="/config/machine/' . $location_id . '/edit/' . $machine_id . '"> << Back to machine</a> <br />';

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
  $form = array(
    '#tree' => TRUE,
    ''
  );

  $form['classification']['settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Settings'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['classification']['settings'] = array_merge($form['classification']['settings'] , classification($form, $form_state, $form_state['#vars'][0]));

  //if ( $vars['function_call'] == 'edit') {

    $form['chemical_usage_set'] = array(
      '#type' => 'fieldset',
      '#title' => t('Chemicals'),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
      '#prefix' => '<div id="chemical-usage-set-wrapper">',
      '#suffix' => '</div>'
    );

    foreach ($form_state['#vars']['chemical_usage_set'] as $j => $jrow) {
      $chemical_type = isset($form_state['values']['chemical_usage_set'][$j]['chemical_type']) ? $form_state['values']['chemical_usage_set'][$j]['chemical_type'] : 'New';
      $form['chemical_usage_set'][$j] = array(
        '#type' => 'fieldset',
        '#title' => 'Chemical: ' . $chemical_type,
        '#collapsible' => TRUE,
        '#collapsed' => FALSE,
      );
      $jrow['chemical_usage_set_index'] = $j;
      $form['chemical_usage_set'][$j] = array_merge($form['chemical_usage_set'][$j], chemical_usage($form, $form_state, $jrow));
    }

    // Adds "Add another chem usage per classification" button
    $form['chemical_usage_set']['add'] = array(
      '#type' => 'submit',
      '#value' => 'Add Another Chemical',
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

 // }
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => 'Save',
      '#id' => 'save-classification',
      '#name' => 'save-classification',
      '#ff-process' => 'save-classification'
    );

  return $form;
}

// TODO: Create the validate methods
function classification_edit_form_validate($form, &$form_state) {

  $errors = 0;

  // Validation rules

  // If there were errors, set error
  if ($errors > 0) {
    form_set_error('Save', 'Called validate');
  }
}

// TODO: Create the submit method
function classification_edit_form_submit($form, &$form_state) {

  // #vars contains the array or references we want, but query the form_state fields for the actual values
  // in case they have been updated.
  $vars = $form_state['#vars'];

  try {
  // If new
    if ( $form_state['values']['classification']['settings']['machine_classification_id'] == '') {

      $machine_id = $form_state['#vars']['machine_id'];
      $location_id = $form_state['#vars']['location_id'];
       // save the classification - get the id
      $c = new classification();
      $f = array(
        'name',
        'classification_id'
      );
      foreach($f as $field) {
        $c->fields[$field] = $form_state['values']['classification']['settings'][$field];
      }
      $classification_id = $c->insert();

      // save the machine classification_id
      // save the machine_classification
      $mc = new machine_classification();

      $mc->fields['machine_id'] = $machine_id;
      $mc->fields['classification_id'] = $classification_id;
      $f = array(
        'load_size',
        'xeros_load_size',
        'unload_time'
      );
      foreach($f as $field) {
        $mc->fields[$field] = $form_state['values']['classification']['settings'][$field];
      }

      $machine_classification_id = $mc->insert();

      // save the local static values

      $lsv = new local_static_value();

      $lsv->fields['classification_id'] = $classification_id;
      $lsv->fields['hot_water_gallons'] = $form_state['values']['classification']['settings']['hot_water_gallons'];
      $lsv->fields['cold_water_gallons'] = $form_state['values']['classification']['settings']['cold_water_gallons'];
      $lsv->fields['run_time'] = $form_state['values']['classification']['settings']['run_time'];

      $xeros_local_static_value_id = $lsv->insert();

      // save the chemicals
      $cu = new chemical_usage();

      foreach( $vars['chemical_usage_set'] as $i => $row ) {

        $cu->machine_classification_id = $machine_classification_id;
        $cu->chemical_profile_id = $form_state['values']['chemical_usage_set'][$i]['chemical_profile_id'];

        $cu->fields['strength'] = $form_state['values']['chemical_usage_set'][$i]['strength'];
        $cu->fields['xeros_strength'] = $form_state['values']['chemical_usage_set'][$i]['xeros_strength'];

        $cu->merge();
      }

    // Else update an existing record
    } else {

      // save the machine_classification
      $mc = new machine_classification();
      $mc->id = $form_state['values']['classification']['settings']['machine_classification_id'];

      $f = array(
        'load_size',
        'xeros_load_size',
        'unload_time'
      );
      foreach($f as $field) {
        $mc->fields[$field] = $form_state['values']['classification']['settings'][$field];
      }

      $mc->merge();

      // save the classification

      $c = new classification();
      $c->id = $form_state['#vars'][0]['classification_id'];

      $f = array(
        'name'
      );
      foreach($f as $field) {
        $c->fields[$field] = $form_state['values']['classification']['settings'][$field];
      }

      $c->merge();

      // save the local_static_values

      $lsv = new local_static_value();
      $lsv->id = $form_state['values']['classification']['settings']['xeros_local_static_value_id'];

      // We are not including the classification_id in the update because we can't change the chem usage setting to another
      // classification in the UI.
      $f = array(
        'hot_water_gallons',
        'cold_water_gallons',
        'run_time'
      );
      foreach($f as $field) {
        $lsv->fields[$field] = $form_state['values']['classification']['settings'][$field];
      }

      $lsv->merge();

      // save the chemicals

      $cu = new chemical_usage();

      foreach( $vars['chemical_usage_set'] as $i => $row ) {
        $cu->machine_classification_id = $form_state['values']['chemical_usage_set'][$i]['machine_classification_id'];
        $cu->chemical_profile_id = $form_state['values']['chemical_usage_set'][$i]['chemical_profile_id'];

        $cu->fields['strength'] = $form_state['values']['chemical_usage_set'][$i]['strength'];
        $cu->fields['xeros_strength'] = $form_state['values']['chemical_usage_set'][$i]['xeros_strength'];

        $cu->merge();
      }
            // If new, then insert

      drupal_set_message('Classification and Chemicals Updated');
    }

    $form_state['redirect'] = 'config/machine/' . $form_state['#vars']['location_id'] . '/edit/' . $form_state['#vars']['machine_id'];

  }
  catch (Exception $e) {
    watchdog_exception('type', $e);
    form_set_error('exception', $e);
  }
  // Don't need to deal with deletes, they are deleted during the ajax calls
}

function classification($form, &$form_state, $row) {

  if (!empty($row['classification_id'])) {
    $classification_id = $row['classification_id'];
  } else {
    $classification_id = '';
  }

  $classification = array(
    'name' => array(
      '#title' => 'Classification Name',
      '#description' => 'What type of laundry is in this classification',
      '#type' => 'textfield',
      '#default_value' => !empty($row['name']) ? $row['name'] : '',
      '#required' => TRUE,
    ),
    'machine_classification_id' => array(
      '#title' => 'Machine Classification ID',
      '#type' => 'hidden',
      '#default_value' => !empty($row['machine_classification_id']) ? $row['machine_classification_id'] : '',
    ),
    'classification_id' => array(
      '#title' => 'Classification ID',
      '#type' => 'textfield',
      '#default_value' => $classification_id,
      '#required' => TRUE,
    ),
    'load_size' => array(
      '#title' => 'Load Size',
      '#description' => 'How many pounds are loaded into the machine for this classification',
      '#type' => 'textfield',
      '#default_value' => !empty($row['load_size']) ? $row['load_size'] : '',
      '#required' => TRUE,
    ),
    'xeros_load_size' => array(
      '#title' => 'Xeros Load Size',
      '#description' => 'How many pounds are loaded into a Xeros machine for this classification',
      '#type' => 'textfield',
      '#default_value' => !empty($row['xeros_load_size']) ? $row['xeros_load_size'] : '',
      '#required' => TRUE,
    ),
    'unload_time' => array(
      '#title' => 'Manual Labor Time',
      '#description' => 'How long does it take to load and unload the machine after the cycle -- this is used in the run time calculation.',
      '#type' => 'textfield',
      '#default_value' => !empty($row['unload_time']) ? $row['unload_time'] : '',
      '#required' => TRUE,
    ),
    'xeros_local_static_value_id' => array(
      '#type' => 'hidden',
      '#default_value' => !empty($row['xeros_local_static_value_id']) ? $row['xeros_local_static_value_id'] : NULL,
    ),
    'hot_water_gallons' => array(
      '#type' => 'textfield',
      '#title' => 'Xeros hot water usage',
      '#description' => 'The model data for hot water usage for this type of laundry on a comparable Xeros machine',
      '#default_value' => !empty($row['hot_water_gallons']) ? $row['hot_water_gallons'] : NULL,
      '#required' => TRUE,
    ),
    'cold_water_gallons' => array(
      '#type' => 'textfield',
      '#title' => 'Xeros cold water usage',
      '#description' => 'The model data for cold water usage for this type of laundry on a comparable Xeros machine',
      '#default_value' => !empty($row['cold_water_gallons']) ? $row['cold_water_gallons'] : NULL,
      '#required' => TRUE,
    ),
    'run_time' => array(
      '#type' => 'textfield',
      '#title' => 'Xeros run time',
      '#description' => 'The model data for run time for this type of laundry on a comparable Xeros machine',
      '#default_value' => !empty($row['run_time']) ? $row['run_time'] : NULL,
      '#required' => TRUE,
    )
  );

  if ( $form_state['#vars']['function_call'] == 'edit') {
    $classification['classification_id'] = array(
      '#title' => 'Classification ID',
      '#type' => 'markup',
      '#markup' => '<div>Classification ID<br/><strong> ' . $classification_id . '</strong></div>',
    );
  } else {

  }
  //    'classification_id' => array(
//      '#title' => 'Classification ID',
//      '#type' => 'markup',
//      '#markup' => '<div>Classification ID: ' . $classification_id . '</div>',
//    ),
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

  if (empty($row['machine_classification_id'])) {
    $row['machine_classification_id'] = 0;
  }
  if (empty($row['chemical_profile_id'])) {
    $row['chemical_profile_id'] = 0;
  }
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
  if (empty($row['strength'])) {
    $row['strength'] = '';
  }
  if (empty($row['xeros_strength'])) {
    $row['xeros_strength'] = '';
  }

  $uniqid = uniqid();

  $chemical_usage = array(
    'machine_classification_id' => array(
      '#type' => 'hidden',
      '#default_value' => $row['machine_classification_id'],
    ),
    'chemical_type' => array(
      '#type' => 'hidden',
      '#default_value' => $row['chemical_type'],
    ),
    'chemical_profile_id' => array(
      '#title' => 'Chemical Type',
      '#type' => 'select',
      '#options' => chemical_profiles($form_state['#vars']['location_id']),
      '#default_value' => $row['chemical_profile_id'],
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
//      '#name' => 'strength-' . $uniqid ,
      '#description' => 'Number of units (Oz or Grams) per cycle in this classification',
      '#default_value' => $row['strength'],
    ),
    'xeros_strength' => array(
      '#type' => 'textfield',
      '#title' => 'Xeros Strength',
//      '#name' => 'xeros-strength-' . $uniqid ,
      '#description' => 'Estimated number of units (Oz or Grams) per cycle in this classification',
      '#default_value' => $row['xeros_strength'],
    ),
    // Delete chemical
    'delete' => array(
      '#type' => 'submit',
      '#value' => 'Delete',
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
        'data-machine_classification_id' => $row['machine_classification_id'],
        'data-chemical_profile_id' => $row['chemical_profile_id'],
        'data-chemical_usage_set' => $row['chemical_usage_set_index'],
      )
    )
  );

  return $chemical_usage;
}

function chemical_usage_add($form, &$form_state) {
  // Chemical profile add will pick up the add in location_form.
  $attrs = $form_state['triggering_element']['#attributes'];

  // Add a new set to the array (set to NULL when it's a new machine classification)
  $form_state['#vars']['chemical_usage_set'][] = array(
    'machine_classification_id' => isset($form_state['#vars'][0]['machine_classification_id']) ? $form_state['#vars'][0]['machine_classification_id'] : NULL,
  );

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

function chemical_usage_delete($form, &$form_state) {

  $attrs = $form_state['triggering_element']['#attributes'];

  // If this is an actual record and not one just a form field that was created delete it.
  if ( $attrs['data-chemical_profile_id'] != 0 && $attrs['data-machine_classification_id']) {
    // Instantiate the object
    $cu = new chemical_usage();

    // Delete the record
    $cu->chemical_profile_id = $attrs['data-chemical_profile_id'];
    $cu->machine_classification_id = $attrs['data-machine_classification_id'];

    $num_deleted = $cu->delete();

    if ($num_deleted > 0) {
      drupal_set_message($num_deleted . ' Chemical Deleted');
    } else {
      drupal_set_message('No records found in the database to delete.  Check error log.');
    }
  }

  // Regardless, we will remove the field set.
  unset($form_state['#vars']['chemical_usage_set'][$attrs['data-chemical_usage_set']]);

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

function chemical_usage_add_callback($form, $form_state) {
  //$classification_set = $form_state['clicked_button']['#attributes']['data-classification_set'];
  return $form['chemical_usage_set'];
}

function chemical_profiles($location_id) {

  $chemical_profiles_select = array();

  $cp = new chemical_profile();

  $chem_profiles = $cp->select_by_location($location_id);

  $chemical_profiles_select[0] = '- select chemical type -';

  foreach( $chem_profiles as $i => $value ) {
    $chemical_profiles_select[$value['chemical_profile_id']] = $value['chemical_type'];
  }
  return $chemical_profiles_select;
}