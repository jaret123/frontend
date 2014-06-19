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
    'classification_id' => 'Classification ID',
    'id' => 'ID',
    'dai_write_timestamp' => 'Time Stamp',
    'machine_identifier' => 'Machine Identifier',
    'dai_meter_actual_id' => 'DAI Meter Actual ID',
    'run_time' => 'Run Time',

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

  $form['classify-collection_id'] = array(
    '#type' => 'hidden',
    '#default_value' => '',
    '#attributes' => array('id' => 'classify-collection_id')
  );

  $form['classify-classification_id'] = array(
    '#type' => 'hidden',
    '#default_value' => '',
    '#attributes' => array('id' => 'classify-classification_id')
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

  // Submit classification
  if ( $form_state['triggering_element']['#id'] ) {

    $collection_id = $form_state['values']['classify-collection_id'];
    $classification_id = $form_state['values']['classify-classification_id'];

    // create curl resource
    $ch = curl_init();

    $output = call_service($ch, classify($collection_id, $classification_id), 'classify');

    $output = call_service($ch, unmatch($collection_id), 'unmatch');

    $output = call_service($ch, match($collection_id), 'match');

    // close curl resource to free up system resources
    curl_close($ch);

  } else {
    // Remap all selected fields in the form
    foreach ($form_state['values']['table'] as $collection_id) {
      if ($collection_id != 0) {
        // Process selected record

        // create curl resource
        $ch = curl_init();

        call_service($ch, unmatch($collection_id), 'unmatch');

        call_service($ch, match($collection_id), 'match');

        // close curl resource to free up system resources
        curl_close($ch);


        //TODO: Can we do a quick animation on the form rows after updating (add a class - newly updated>);
      } else {
        // Do nothing
      }
    }
  }



  return $form;
}

function classify($collection_id, $classification_id) {
  return 'http://' . $_SERVER['HTTP_HOST'] . '/xsvc/rs/classify/' . $collection_id . '/' . $classification_id;
}

function unmatch($collection_id) {
  return 'http://' . $_SERVER['HTTP_HOST'] . '/xsvc/rs/unmatch/' . $collection_id;
}

function match($collection_id) {
  return 'http://' . $_SERVER['HTTP_HOST'] . '/xsvc/rs/match/' . $collection_id;
}


function call_service(&$ch, $url, $call) {

  // set url
  curl_setopt($ch, CURLOPT_URL, $url);

  //return the transfer as a string
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // $output contains the output string
  $output = curl_exec($ch);

  // Success - we a 200 message, then log and continue, else quit.
  if ( curl_getinfo( $ch, CURLINFO_HTTP_CODE ) == 200 )  {
    // watchdog('xeros_mapper', $output, WATCHDOG_INFO); -- There is a bug in one of the services, so we are not going to test for a 200
  // Error
  } else {
    //watchdog('xeros_mapper', curl_error($ch), WATCHDOG_NOTICE); -- There is a bug in the service so we are not checking status
    //form_set_error('Error: ' . $url . ' ' . $call); -- There is a bug in the service so we are not checking status
  }

  // Complete
  watchdog('xeros_mapper', 'complete - url - ' . $url, WATCHDOG_NOTICE);
  watchdog('xeros_mapper', 'complete - response-code - ' . curl_getinfo( $ch, CURLINFO_HTTP_CODE ) , WATCHDOG_NOTICE);
  watchdog('xeros_mapper', 'complete - curl_error - ' . curl_error($ch) , WATCHDOG_NOTICE);
  watchdog('xeros_mapper', 'complete - output - ' . $output, WATCHDOG_NOTICE);

  drupal_set_message('Records updated');

  curl_reset($ch);

  return $output;
}

function dai_meter_collection($id) {

  $output =  '<div>This is the dai_meter_collection listing page</div>';


  $f = drupal_get_form('dai_meter_collection_form', $id);

  $output .= drupal_render($f);

  return $output;
}