<?php

include_once drupal_get_path('module', 'xeros_report') . '/load_base_js.php';

function analyst_cycle_reports_page()
{

    load_base_js(array(), '');
    return theme('xeros_analyst_cycle_reports_template');
    //return "Hello World";
}

function _date($date)
{

    $date = new DateTime($date);

    return $date->format('Y-m-d');

}

function _replace_filters($string, $filters)
{
    foreach ($filters as $k => $v) {
        $string = str_replace('{{' . $k . '}}', $v, $string);
    }
    return $string;
}