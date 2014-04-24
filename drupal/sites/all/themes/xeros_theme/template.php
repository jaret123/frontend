<?php
/**
 * @file
 * Contains the theme's functions to manipulate Drupal's default markup.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728096
 */


/**
 * Override or insert variables into the maintenance page template.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("maintenance_page" in this case.)
 */
/* -- Delete this line if you want to use this function
function xeros_theme_preprocess_maintenance_page(&$variables, $hook) {
  // When a variable is manipulated or added in preprocess_html or
  // preprocess_page, that same work is probably needed for the maintenance page
  // as well, so we can just re-use those functions to do that work here.
  xeros_theme_preprocess_html($variables, $hook);
  xeros_theme_preprocess_page($variables, $hook);
}
// */

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

  // The body tag's classes are controlled by the $classes_array variable. To
  // remove a class from $classes_array, use array_diff().
  //$variables['classes_array'] = array_diff($variables['classes_array'], array('class-to-remove'));

    $path = drupal_get_path('theme', 'xeros_theme');
    drupal_add_js($path . '/js/underscore-min.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/spin.min.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/lib/kalendae/kalendae.standalone.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/controls.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/lib/canvg-1.3/rgbcolor.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/lib/canvg-1.3/StackBlur.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/lib/canvg-1.3/canvg.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/d3.min.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/app.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/chart.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
}


// */

/**
 * Override or insert variables into the page templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("page" in this case.)
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

    if ( array_search('xeros admin', $vars['user']->roles) <> null ) {
        $s = xeros_get_companies($vars);
        // TODO: Test for existence of app
        if ( array_search('xeros admin', $vars['user']->roles) <> null  ) {
            drupal_add_js('app.companies = ' . json_encode($s), array('type' => 'inline', 'scope' => 'footer', 'weight' => 1));
        }
        $vars['user']->show_admin_bar = 1;

    } else {
        $vars['user']->show_admin_bar = 0;
    }
//  $variables['sample_variable'] = t('Lorem ipsum.');
}
// */



/**
 * Override or insert variables into the node templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("node" in this case.)
 */
/* -- Delete this line if you want to use this function
function xeros_theme_preprocess_node(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');

  // Optionally, run node-type-specific preprocess functions, like
  // xeros_theme_preprocess_node_page() or xeros_theme_preprocess_node_story().
  $function = __FUNCTION__ . '_' . $variables['node']->type;
  if (function_exists($function)) {
    $function($variables, $hook);
  }
}
// */

/**
 * Override or insert variables into the comment templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("comment" in this case.)
 */
/* -- Delete this line if you want to use this function
function xeros_theme_preprocess_comment(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the region templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("region" in this case.)
 */
/* -- Delete this line if you want to use this function
function xeros_theme_preprocess_region(&$variables, $hook) {
  // Don't use Zen's region--sidebar.tpl.php template for sidebars.
  //if (strpos($variables['region'], 'sidebar_') === 0) {
  //  $variables['theme_hook_suggestions'] = array_diff($variables['theme_hook_suggestions'], array('region__sidebar'));
  //}
}
// */

/**
 * Override or insert variables into the block templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
/* -- Delete this line if you want to use this function
function xeros_theme_preprocess_block(&$variables, $hook) {
  // Add a count to all the blocks in the region.
  // $variables['classes_array'][] = 'count-' . $variables['block_id'];

  // By default, Zen will use the block--no-wrapper.tpl.php for the main
  // content. This optional bit of code undoes that:
  //if ($variables['block_html_id'] == 'block-system-main') {
  //  $variables['theme_hook_suggestions'] = array_diff($variables['theme_hook_suggestions'], array('block__no_wrapper'));
  //}
}
// */
