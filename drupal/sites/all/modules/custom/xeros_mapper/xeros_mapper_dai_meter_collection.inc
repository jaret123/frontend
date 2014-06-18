<?php

require_once('db/dai_meter_collection.inc');

/**
 * @param $id
 *
 * @return mixed
 *
 * Table form with all the dai_meter_collection readings.
 *
 * Enable filtering by unmapped and unknown by default
 * Add /all as an option for filtering as well as date ranges (possibly date range)
 *
 * Create a link to the mappings from the admin config
 *
 * TODO: Add the validation and submission parameters.
 */
function dai_meter_collection_form($id) {

  drupal_add_js(array('xeros_mapper' => array('basePath' => drupal_get_path('module', 'xeros_mapper'))), 'setting');

  $dai_meter_collection = new dai_meter_collection();

  $rows = $dai_meter_collection->select_by_location($id);

  $comment_field = array(
    '#type' => 'textfield',
    '#default_value' => '',
    '#title' => 'Comment',
    '#title_display' => 'invisible',
    '#name' => 'comment_field'
  );

  $controls_field = array(
    '#type' => 'item',
    '#title' => '',
    '#markup' => '
      <span class="expand">Show Details</span>
    '
  );

  // TODO - We need the machine ID on this query
  $header = array(
    'id' => 'ID',
    'dai_write_timestamp' => 'Time Stamp',
    'machine_identifier' => 'Machine Identifier',
    'location_identifier' => 'Location ID',
    'dai_meter_actual_id' => 'DAI Meter Actual ID',
    'run_time' => 'Run Time',
    'classification_id' => 'Classification ID',
    'machine_id' => 'Machine ID',
    'controls' => 'Actions'
  );

  $options = array();

  // We need to put an id on each row for the form.
  foreach ($rows as $row) {
    foreach ($row as $key => $col) {
      // Do nothing
      $options[$row['id']][$key] = array(
        'data' => $col,
        'class' => $key,
      );
    }

    $options[$row['id']]['controls'] = array('data'=>$controls_field);

  }

  $form['table'] = array(
    '#type' => 'tableselect',
    '#header' => $header,
    '#options' => $options,
    //'#empty' => t('No records found'),
  );

  $form['pager'] = array('#markup' => theme('pager'));

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );

  $form['#attached']['js'] = array(
    drupal_get_path('module', 'xeros_mapper') . '/js/script.js',

  );

  $form['#attached']['css'] = array(
    drupal_get_path('module', 'xeros_mapper') . '/css/style.css',
  );

  return $form;
}

function dai_meter_collection_form_submit(&$form, &$form_state ) {

  $output = 'Hello';

  foreach ($form_state['values']['table'] as $field) {
    if ($field != 0) {
      // Process selected record
    } else {
      // Do nothing
    }
  }

  return $form;
}

function dai_meter_collection($id) {

  $output =  '<div>This is the dai_meter_collection listing page</div>';


  $f = drupal_get_form('dai_meter_collection_form', $id);

  $output .= drupal_render($f);

  return $output;
}