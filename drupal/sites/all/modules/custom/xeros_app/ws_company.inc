<?php

function ws_company($companyId) {

  $company = node_load($companyId);

  echo json_encode($company);

}