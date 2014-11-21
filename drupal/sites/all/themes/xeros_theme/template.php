<?php
/**
 * @file
 * Contains the theme's functions to manipulate Drupal's default markup.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728096
 */

/**
 * Override or insert variables into the html templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("html" in this case.)
 */
function xeros_theme_preprocess_html(&$variables, $hook) {
  $variables['path_to_xeros_theme'] = drupal_get_path('theme', 'xeros_theme');

  $path = drupal_get_path('theme', 'xeros_theme');

  // Custom theme code
    drupal_add_js($path . '/js/app.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/chart.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
}

/**
 * Override or insert variables into the page templates.
 *
 *   An array of variables to pass to the theme template.
 *
 * @param $vars
 * @param $hook
 *
 * The name of the template being rendered ("page" in this case.)
 */
function xeros_theme_preprocess_page(&$vars, $hook) {

    // Select all the companies and all the child locations and add to page
    // as array or JSON object

  $user = user_load($vars["user"]->uid);

  if (isset($user->field_company['und'][0]['target_id'])) {
    $company = node_load($user->field_company['und'][0]['target_id']);
    $user->company = array(
      'id' => $company->nid,
      'name' => $company->title
    );
  }
  if (isset($user->field_location['und'][0]['target_id'])) {
    $location = node_load($user->field_location['und'][0]['target_id']);
    $user->location = array(
      'id' => $location->nid,
      'name' => $location->title
    );
  }

  unset($user->pass);

  drupal_add_js('app.user = ' . json_encode($user), array('type' => 'inline', 'scope' => 'footer', 'weight' => 1));

  if ( user_is_logged_in() ) {
      $s = xeros_get_companies($vars);
      drupal_add_js('app.companies = ' . json_encode($s), array('type' => 'inline', 'scope' => 'footer', 'weight' => 1));
      $vars['user']->show_admin_bar = 1;
  } else {
      $vars['user']->show_admin_bar = 0;
  }
}
