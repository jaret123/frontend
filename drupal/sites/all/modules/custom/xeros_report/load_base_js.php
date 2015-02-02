<?php

function load_base_js($variables, $hook) {
  $path = drupal_get_path('module', 'xeros_app');

  // Libraries common to all modules
  drupal_add_js(drupal_get_path('theme', 'xeros_theme') . '/js/bootstrap/modal.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js(drupal_get_path('theme', 'xeros_theme') . '/js/bootstrap/tooltip.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/underscore-min.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/alertFallback.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/Format.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/handlebars.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/HandlebarsHelpers.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/kalendae/kalendae.standalone.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/spin.min.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/canvg-1.3/rgbcolor.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/canvg-1.3/StackBlur.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/canvg-1.3/canvg.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/libs/d3.min.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));

  // Custom controls
  drupal_add_js($path . '/js/Controls.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/Controls-Dropdown.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/Controls-TimeSelect.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/Controls-CompanySelect.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/Controls-ReportSelect.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/Controls-MachineNav.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/Controls-Spinner.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  drupal_add_js($path . '/js/Controls-Pdf.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));

  // Utility modules common to all drupal modules
  drupal_add_js($path . '/js/Utils.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
//  drupal_add_js($path . '/js/Error.js', array('scope' => 'footer', 'weight' => 100, 'preprocess' => TRUE));

  // Custom app code for logged in users only
  $company = (object) array('nid' => '""', 'title' => '');
  $location = (object) array('nid' => '""', 'title' => '');

  // If user is logged in (0 is anonymous)
  if ( user_is_logged_in() ) {

    $uid = $GLOBALS['user']->uid;

    $u = user_load($uid);

    drupal_add_js($path . '/js/Location.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/Company.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/User.js', array('scope' => 'footer', 'weight' => 10, 'preprocess' => TRUE));
    // Add display elements which are bound to the User control
    drupal_add_js($path . '/js/Display.js', array('scope' => 'footer', 'weight' => 10, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/Controls-Csv.js', array('scope' => 'footer', 'weight' => 10, 'preprocess' => TRUE));

    if ( user_access('xeros change location')) {
      drupal_add_js($path . '/js/Controls-LocationPicker.js', array('scope' => 'footer', 'weight' => 10, 'preprocess' => TRUE));
    }
    drupal_add_js($path . '/js/Controls-ModelSelect.js', array('scope' => 'footer', 'weight' => 10, 'preprocess' => TRUE));

//    $variables['user']->company = "No company assigned";
//    $variables['user']->location = "No location assigned";
//
    if (isset($u->field_company['und'][0]['target_id'])) {
      $company = node_load($u->field_company['und'][0]['target_id']);
      //$variables['user']->company = $company->title;
    }
    if (isset($u->field_location['und'][0]['target_id'])) {
      $location = node_load($u->field_location['und'][0]['target_id']);
      //$variables['user']->location = $location->title;
    }

    $path = drupal_get_path('module', 'xeros_report');

    // Custom theme code
    drupal_add_js($path . '/js/app.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
    drupal_add_js($path . '/js/chart.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));

    // This is always the user's company and location.  This can only be overridden in the User's account settings.
    drupal_add_js('jQuery(document).ready(function () {
        FF.User.company.id = ' . $company->nid . ';
        FF.User.company.title = "' . $company->title . '";
        FF.User.location.id =  ' . $location->nid . ';
        FF.User.location.title =  "' . $location->title . '";
    });',
      array('type' => 'inline', 'scope' => 'footer', 'weight' => 14)
    );
    drupal_add_js('jQuery(document).ready(function () {
        FF.User.init();
    });',
      array('type' => 'inline', 'scope' => 'footer', 'weight' => 14)
    );

    //load Xeros Exchange Module
    $path = drupal_get_path('module', 'xeros_exchange');
    // Custom theme code
    drupal_add_js($path . '/js/exchange.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
  } else {
  }
}