<?php


function load_base_js($variables, $hook) {
    $path = drupal_get_path('module', 'xeros_exchange');
    // Custom theme code
    drupal_add_js($path . '/js/exchange.js', array('scope' => 'footer', 'weight' => -1, 'preprocess' => TRUE));
}