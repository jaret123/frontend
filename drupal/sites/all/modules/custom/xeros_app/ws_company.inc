<?php

function ws_company($companyId) {

  error_reporting(E_ALL);
  ini_set('display_errors', 'on');

  $company = node_load($companyId);

  echo json_encode($company);

}