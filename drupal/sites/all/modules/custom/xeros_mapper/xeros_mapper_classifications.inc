<?php


require_once drupal_get_path('module', 'xeros_admin') . '/db/machine_classification.inc';

function classification_listing($machine_id = NULL) {
  $output =  '<div>This is the classification listing for machine: ' . $machine_id . '</div>';

  $mc = new machine_classification();

  $mc->id = $machine_id;

  $classification_set = $mc->select_by_machine($machine_id);

  $cu = new chemical_usage;

//  foreach ( $classification_set as $id => $c) {
//    $cu_rows = $cu->select($c['machine_classification_id']);
//    // For the ajax callbacks we are going to have to let the chemical usage delete button be
//    // aware of it's parent container ids (classification index)
//    foreach ($cu_rows as $j => $v) {
//      $cu_rows[$j]['classification_set_index'] = $id;
//      $cu_rows[$j]['chemical_usage_set_index'] = $j;
//    }
//    $classification_set[$id]['chemical_usage_set'] = $cu_rows;
//  }

  if (count($classification_set) > 0) {

//    foreach ($classification_set as $i => $row) {
//      array_push($classification_set[$i], '<a href="/config/machine/classification/edit/' . $location_id . '/' . $row['machine_id'] . '/' . $row['machine_classification_id'] . '">Edit</a>');
//    }
    // Make a table
    $header = array(
      t('Machine Classification ID'),
      t('Machine ID'),
      t('Classification ID'),
      t('Load Size'),
      t('Xeros Load Size'),
      t('Manual Labor Time'),
      t('Name'),
      t('Local Static Value ID'),
      t('Xeros Hot Water Usage'),
      t('Xeros Cold Water Usage'),
      t('Xeros Run Time')
//      t('Edit')
    );
    //$output .= theme('table', array('header' => $header, 'rows' => $rows));

    $r = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $classification_set
    );
    $output .= drupal_render($r);
  } else {
    drupal_set_message(t('No classifications found for this location.'));
  }

  print $output;
  drupal_exit();
}