<?php

function service($service_name, $machineIds) {
  error_reporting(E_ALL);
  ini_set('display_errors', 'on');

  $services = array();
  $services['status'] = variable_get('ops_service_status');
  $services['history'] = variable_get('ops_service_history');

  $options = array(
    'http' => array(
      'header' => "Content-type: application/json; charset=utf-8",
      'method' => 'POST',
      'content' => '[' . $machineIds . ']',
    ),
  );

  $request_context = stream_context_create($options);
  $result = file_get_contents($services[$service_name], false, $request_context);
  echo($result);
}


//Failed to connect to DAC
//Machine inactive
//Machine active