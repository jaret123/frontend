<?php

function ws_location($locationId) {

  error_reporting(E_ALL);
  ini_set('display_errors', 'on');

  $location = node_load($locationId);

  echo json_encode($location);

}