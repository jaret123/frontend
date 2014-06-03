<?php

require_once('db/company.inc');


function company_listing() {

  $output = '<div>This is the listing of all active companies</div>';

  $company = new company();

  $company->fields = array(
    'company_id',
    'company_name'
  );

  $rows = $company->select_all();

  $header = array(
    t('Company ID'),
    t('Company Name'),
    t('Edit'),
    t('Locations')
  );



  if (count($rows) > 0) {
    foreach ($rows as $i => $row) {
      $data[$i]['company_id'] = $row->nid;
      $data[$i]['company_name'] = $row->title;
      $data[$i]['link'] = '<a href="/node/' . $row->nid . '/edit">Edit</a>';
      $data[$i]['locations'] = '<a href="/config/locations/' . $row->nid . '">Locations</a>';
    }
  }

  $r = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $data,
    '#empty' => 'No active companies found for this filter'
  );

  $output .= drupal_render($r);

  $output .= '<div><a href="/node/add/company">+ Add another company</a></div>';

  return $output;
}