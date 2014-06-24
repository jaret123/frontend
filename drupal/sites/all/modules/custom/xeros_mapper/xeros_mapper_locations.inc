<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 4/26/14
 * Time: 12:33 PM
 */

require_once( drupal_get_path('module', 'xeros_admin') . '/db/location.inc' );

/**
 * @param null $company_id
 *
 * @return string
 */
function location_listing($company_id = NULL) {

  $output =  '<div>This is the location listing page for company: ' . $company_id . '</div>';

  $output .= '<div><a href="/config/mapper/company">< Back to company list</a></div>';

  $location = new location();

  $location->fields = array(
    'company_id',
    'location_id',
    'location_name'
  );

  // TODO: If Xeros Admin, then show all the locations grouped by company

  $rows = $location->select_by_company($company_id);

  if (count($rows) > 0) {
    foreach ($rows as $i => $row) {
      $data[$i]['company_id'] = $row->field_company['und'][0]['target_id'];
      $company = node_load($data[$i]['company_id']);
      $data[$i]['company_name'] = $company->title;
      $data[$i]['location_id'] = $row->nid;
      $data[$i]['location_name'] = $row->title;
      $data[$i]['link'] =  '<a href="/config/mapper/dai_meter_collection/' . $company_id . '/' . $row->nid . '">Remap Unknown Cycles</a>';
    }

    // Make a table
    $header = array(
      t('Company ID'),
      t('Company Name'),
      t('Location ID'),
      t('Location Name'),
      t('')
    );

    $r = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $data,
      '#empty' => 'No active locations found for this filter'
    );

    $output .= drupal_render($r);
  } else {
    drupal_set_message(t('No locations found.'));
  }

  return $output;
}