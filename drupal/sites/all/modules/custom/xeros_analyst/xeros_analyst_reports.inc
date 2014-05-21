<?php


function analyst_reports_page() {

  $to_date = new DateTime();

  $to_date_formatted = $to_date->format('Y-m-d');

  $from_date = new DateTime();
  $from_date->add(date_interval_create_from_date_string('-30 days'));

  $from_date_formatted = $from_date->format('Y-m-d');


  $output =  '<h3>This is the listing of analyst reports</h3>';

  $output .= '<div>DAI Meter Actual - Last 30 Days - <a href="/api/analyst/reportDAIMeterActual/' . $from_date_formatted . '/' . $to_date_formatted . '">Download</a></div>';

  $output .= '<div>DAI Meter Collection - Last 30 Days - <a href="/api/analyst/reportDAIMeterCollection/' . $from_date_formatted . '/' . $to_date_formatted . '">Download</a></div>';

  $output .= '<div>DAI Meter Collection Detail - Last 30 Days - <a href="/api/analyst/reportDAIMeterCollectionDetail/' . $from_date_formatted . '/' . $to_date_formatted . '">Download</a></div>';

  return $output;
}
