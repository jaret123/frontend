<?php

/**
* Default definition of 'myimporter'
*/
function ff_utils_feeds_importer_default() {

  // Import all exported views

  $export = array();

  $files = file_scan_directory(drupal_get_path('module', 'ff_utils'). '/feeds', '/.feed/');
  foreach ($files as $filepath => $file) {
    require $filepath;
    if (isset($feeds_importer)) {
      $export[$feeds_importer->id] = $feeds_importer;
    }
  }

  return $export;
}