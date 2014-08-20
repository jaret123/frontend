<?php


function analyst_reports_page() {

  // Start Date for when we started collecting data
  $origin_date = '2013-09-01';
  $to_date = new DateTime();

  $to_date_formatted = $to_date->format('Y-m-d');

  $from_date_formatted = _date('-30 days');

  $output =  '<h3>This is the listing of analyst reports</h3>';

  $output .= '<h4>DAI Meter Actual</h4>';


  $report_links = '<div><a href="/api/analyst/{{report_name}}/' . _date('')  . '/' . _date('') . '">Today</a></div>';
  $report_links .= '<div><a href="/api/analyst/{{report_name}}/' . _date('-1days') . '/' . _date('-1days') . '">Yesterday</a></div>';
  $report_links .= '<div><a href="/api/analyst/{{report_name}}/' . _date('last sunday') . '/' . _date('') . '">This Week</a></div>';
  $report_links .= '<div><a href="/api/analyst/{{report_name}}/' . date('Y-m-01') . '/' . _date('') . '">This Month</a></div>';
  $report_links .= '<div><a href="/api/analyst/{{report_name}}/' . date('Y-01-01') . '/' . _date('') . '">This Year</a></div>';
  $report_links .= '<div><a href="/api/analyst/{{report_name}}/' . $origin_date . '/' . _date('') . '">All Time</a></div>';

  $output .= _replace_filters($report_links, array('report_name' => 'reportDAIMeterActual'));

  $output .= '<h4>DAI Meter Collection</h4>';
  $output .= _replace_filters($report_links, array('report_name' => 'reportDAIMeterCollection'));


  $output .= '<h4>DAI Meter Collection Detail</h4>';
  $output .= _replace_filters($report_links, array('report_name' => 'reportDAIMeterCollectionDetail'));

    $output .= '<h4>Xeros Cycle</h4>';
    $output .= _replace_filters($report_links, array('report_name' => 'reportXerosCycle'));

  return $output;
}

function _date($date) {

  $date = new DateTime($date);

  return $date->format('Y-m-d');

}

function _replace_filters($string, $filters) {
  foreach ($filters as $k => $v) {
    $string = str_replace('{{' . $k . '}}', $v, $string);
  }
  return $string;
}