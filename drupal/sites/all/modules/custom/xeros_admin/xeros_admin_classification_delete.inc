<?php

require_once 'db/machine_classification.inc';

/**
 * Machine ID will be added later for self service security
 *
 * @param null $machine_classification_id
 * @param null $machine_id
 *
 * @return string
 */
function classification_edit_page($machine_classification_id = NULL, $machine_id = NULL) {

  $output = '<h2>Delete Classification</h2>';

  $mc = new machine_classification();

  $mc->id = $machine_classification_id;

  $num_deleted = $mc->delete();

  if ($num_deleted > 1) {
    $output .= 'Record deleted';
  } else {
    $output .= '0 records deleted';
  }

  $output .= drupal_render($f);

  return $output;
}
