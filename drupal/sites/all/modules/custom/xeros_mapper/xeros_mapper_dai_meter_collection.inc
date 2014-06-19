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

function unmatch($collection_id) {
  return 'http://' . $_SERVER['HTTP_HOST'] . '/xsvc/rs/unmatch/' . $collection_id;
}

function match($collection_id) {
  return 'http://' . $_SERVER['HTTP_HOST'] . '/xsvc/rs/match/' . $collection_id;
}

function dai_meter_collection_form_submit(&$form, &$form_state ) {

  $output = 'Hello';

  foreach ($form_state['values']['table'] as $collection_id) {
    if ($collection_id != 0) {
      // Process selected record

      // create curl resource
      $ch = curl_init();

      // set url
      curl_setopt($ch, CURLOPT_URL, unmatch($collection_id));

      //return the transfer as a string
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      // $output contains the output string
      $output = curl_exec($ch);

      // If we get a 200 message, then log and continue, else quit.
      if ( curl_getinfo( $ch, CURLINFO_HTTP_CODE ) == 200 )  {
        watchdog('xeros_mapper', $output, WATCHDOG_INFO);
      } else {
        watchdog('xeros_mapper', curl_error($ch), WATCHDOG_NOTICE);
        form_set_error('Collection ID: ' . $collection_id . ' could not be unmapped, check the logs.');
      }

      curl_reset($ch);
      // TODO: Add error checking based on message in or curl response.

      // set url
      curl_setopt($ch, CURLOPT_URL, match($collection_id));

      //return the transfer as a string
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      // $output contains the output string
      $output = curl_exec($ch);

      watchdog('xeros_mapper', $output, WATCHDOG_INFO);

      // TODO: Add error checking based on message in or curl response.

      // close curl resource to free up system resources
      curl_close($ch);

      // If we get a 200 message, then log and continue, else quit.
      if ( curl_getinfo( $ch, CURLINFO_HTTP_CODE ) == 200 )  {
        watchdog('xeros_mapper', $output, WATCHDOG_INFO);
      } else {
        watchdog('xeros_mapper', curl_error($ch), WATCHDOG_NOTICE);
        form_set_error('Collection ID: ' . $collection_id . ' could not be mapped, check the logs.');
      }

      //TODO: Can we do a quick animation on the form rows after updating (add a class - newly updated>);
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