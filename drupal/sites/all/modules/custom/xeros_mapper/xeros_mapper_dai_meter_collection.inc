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
function dai_meter_collection_form($form, &$form_state, $location_id) {

  drupal_add_js(array('xeros_mapper' => array('basePath' => drupal_get_path('module', 'xeros_mapper'))), 'setting');

  $dai_meter_collection = new dai_meter_collection();

  $rows = $dai_meter_collection->select_by_location($location_id);

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
      <span class="button expand sensors__show">Sensors</span>
      <span class="button close sensors__hide inactive">Close</span>
    '
  );

  // TODO - We need the machine ID on this query
  $header = array(
    'classification_id' => array(
      'data' => 'Classification ID',
      'class' => 'first classification_id_header',
    ),
    'id' => array(
      'data' => 'ID',
      'class' => 'id',
    ),
    'dai_write_timestamp' => 'Time Stamp',
    'machine_identifier' => 'Machine Identifier',
    'dai_meter_actual_id' => 'DAI Meter Actual ID',
    'run_time' => 'Run Time',
    'machine_id' => 'Machine ID',
    'controls' => array(
      'data' => '&nbsp;',
      'class' => 'last controls',
  ),
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

  $form['dai-meter-collection'] = array(
    '#type' => 'tableselect',
    '#header' => $header,
    '#options' => $options,
    '#name' => 'dai-meter-collection',
    '#attributes' => array('class' => array('dai-meter-collection')),
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

  $form['pager'] = array('#markup' => theme('pager', array('quantity' => 5)));

  $form['edit-submit'] = array(
    '#type' => 'submit',
    '#value' => t('Reclassify Selected'),
    '#name' => 'default-submit'
  );

  $form['classify-submit'] = array(
    '#type' => 'submit',
    '#value' => t('Re-classify'),
    '#name' => 'classify-submit'
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
  if ( $form_state['triggering_element']['#id'] == 'edit-classify-submit') {

    $collection_id = $form_state['values']['classify-collection_id'];
    $classification_id = $form_state['values']['classify-classification_id'];

    $dai_meter_actual_id = $form['dai-meter-collection']['#options'][$collection_id]['dai_meter_actual_id']['data'];

    // create curl resource
    $ch = curl_init();

    $output .= call_service($ch, classify($collection_id, $classification_id), 'classify');

    $output .= call_service($ch, unmatch($collection_id), 'unmatch');

    $output .= call_service($ch, match($collection_id), 'match');

    $output .= call_xeros_cycle_delete($dai_meter_actual_id);

    // TODO - refresh the data in the report

    // call_refresh_report_data($dai_meter_actual_id)
    //$output .= call_refresh_report_data($)

    // close curl resource to free up system resources
    curl_close($ch);

  } else {
    // Remap all selected fields in the form
    foreach ($form_state['values']['dai-meter-collection'] as $collection_id) {
      if ($collection_id != 0) {
        // Process selected record

        $dai_meter_actual_id = $form['dai-meter-collection']['#options'][$collection_id]['dai_meter_actual_id']['data'];

        // create curl resource
        $ch = curl_init();

        call_service($ch, unmatch($collection_id), 'unmatch');

        call_service($ch, match($collection_id), 'match');

        $output .= call_xeros_cycle_delete($dai_meter_actual_id);

        // close curl resource to free up system resources
        curl_close($ch);

        //TODO: Can we do a quick animation on the form rows after updating (add a class - newly updated>);
      } else {
        // Do nothing
      }
    }
  }

  $output .= call_xeros_cycle_refresh();

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

function call_xeros_cycle_delete($dai_meter_actual_id) {

  try {
    // Get the Drupal database connection and change the statement class to PDOStatement.
    // Save the current class for cleanup later.
    $conn = Database::getConnection();
    $saved_class = $conn->getAttribute(PDO::ATTR_STATEMENT_CLASS);
    $conn->setAttribute(PDO::ATTR_STATEMENT_CLASS, array('PDOStatement'));

    // Prepare the statement and bind params
    $statement = $conn->prepare("Call sp_xeros_cycle_delete(?)");

    $op_status = $statement->bindParam(1, $dai_meter_actual_id, PDO::PARAM_INT | PDO::PARAM_INPUT_OUTPUT);

    // Execute the statement and reset the connection's statement class to the original.
    $exec_result = $statement->execute();
    $conn->setAttribute(PDO::ATTR_STATEMENT_CLASS, $saved_class);

  }
  catch (Exception $e) {
    watchdog_exception('call_xeros_cycle_delete', $e);
  }
  return;


}

function call_xeros_cycle_refresh() {

  try {
    // Get the Drupal database connection and change the statement class to PDOStatement.
    // Save the current class for cleanup later.
    $conn = Database::getConnection();
    $saved_class = $conn->getAttribute(PDO::ATTR_STATEMENT_CLASS);
    $conn->setAttribute(PDO::ATTR_STATEMENT_CLASS, array('PDOStatement'));

    // Prepare the statement and bind params
    $statement = $conn->prepare("Call sp_refresh_report_data('DIFF', null)");

    // Execute the statement and reset the connection's statement class to the original.
    $exec_result = $statement->execute();
    $conn->setAttribute(PDO::ATTR_STATEMENT_CLASS, $saved_class);
  }
  catch (Exception $e) {
    watchdog_exception('call_xeros_cycle_refresh', $e);
  }

  return;
}

function dai_meter_collection($company_id, $location_id) {

  $output =  '<div>This is the dai_meter_collection listing page</div>';

  $output .= '<div><a href="/config/mapper/location/' . $company_id . '" >< Back to location list</a></div>';

  $f = drupal_get_form('dai_meter_collection_form', $location_id);

  $output .= drupal_render($f);

  return $output;
}