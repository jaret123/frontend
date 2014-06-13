<?php

require_once('db/collection_map.inc');

function cycle_listing_page($machine_id) {

  $output =  '<div>This is the cycle listing page for machine: ' . $machine_id . '</div>';

  $collection_map = new collection_map();

  $rows = $collection_map->select_by_machine_id($machine_id);

  $header = array(
    t('Collection Map ID'),
    t('Machine ID'),
    t('Classification ID')
  );

  $r = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
    '#empty' => 'No cycles found for this filter'
  );

  $output .= drupal_render($r);

//  $machine = new machine();
//
//  $machine->fields = array(
//    'machine_id', 'serial_number', 'manufacturer', 'location_id'
//  );
//  $rows = $machine->select($location_id, $machine_id);
//
//  if (count($rows) > 0) {
//
//    foreach ($rows as $i => $row) {
//      array_push($rows[$i], '<a href="/config/machine/' . $row['location_id'] . '/edit/' . $row['machine_id'] . '">Edit</a>');
//    }
//    // Make a table
//    $header = array(
//      t('Machine ID'),
//      t('Serial Number'),
//      t('Manufacturer'),
//      t('Location ID'),
//      t('Edit')
//    );
//    //$output .= theme('table', array('header' => $header, 'rows' => $rows));
//
//    $r = array(
//      '#theme' => 'table',
//      '#header' => $header,
//      '#rows' => $rows
//    );
//    $output .= drupal_render($r);
//  } else {
//    drupal_set_message(t('No machines found for this location.'));
//  }
//
//  $output .= '<div><a href="/config/machine/' . $location_id . '/add">Add another machine</a></div>';
  return $output;
}