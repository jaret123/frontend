<?php
/**
 * Implements hook_views_default_views().
 */
function ff_utils_views_default_views() {

  // Import all exported views

  $files = file_scan_directory(drupal_get_path('module', 'ff_utils'). '/views', '/.view/');
  foreach ($files as $filepath => $file) {
    require $filepath;
    if (isset($view)) {
      $views[$view->name] = $view;
    }
  }

// return views
  return $views;
}
