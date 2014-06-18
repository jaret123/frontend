<?php

function classification_listing($machine_id = NULL) {
  $output =  '<div>This is the classification listing for machine: ' . $machine_id . '</div>';

  $classification_set = select_by_machine($machine_id);

  if (count($classification_set) > 0) {

//    foreach ($classification_set as $i => $row) {
//      array_push($classification_set[$i], '<a href="/config/machine/classification/edit/' . $location_id . '/' . $row['machine_id'] . '/' . $row['machine_classification_id'] . '">Edit</a>');
//    }
    // Make a table
    $header = array(
      t('Name'),
      t('Machine Classification ID'),
      t('Machine ID'),
      t('Classification ID'),
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

/**
 * @param $machine_id
 *
 * @return array
 *
 * Get the data and format it
 */
function select_by_machine($machine_id) {

  $select = db_select('xeros_machine_classification', 'mc');
  $select->leftJoin('xeros_classification', 'c', 'mc.classification_id = c.classification_id');
  $select->fields('c', array(
      'name'
    ));
  $select->fields('mc', array(
      'machine_classification_id',
      'machine_id',
      'classification_id',
    ));

  if ($machine_id != NULL) {
    $select->condition('mc.machine_id', $machine_id);
  }

  $select->orderBy('mc.classification_id');

  $entries = $select->execute()->fetchAll(PDO::FETCH_ASSOC);

  //
  // Structure the data for the table
  //
  $rows = array();
  if (!empty($entries)) {
    foreach ($entries as $id => $row) {
      // Add data to the cells
      foreach ($row as $key => $col) {
        $rows[$row['machine_classification_id']]['data'][$key] = array(
          'data' => check_plain($col),
          'class' => check_plain($key)
        );
        // Add the data as data attributes on the row as a convenience for the js events
        $rows[$row['machine_classification_id']]['data-' . $key] = $col;
      }
    }
  }

  return $rows;
}