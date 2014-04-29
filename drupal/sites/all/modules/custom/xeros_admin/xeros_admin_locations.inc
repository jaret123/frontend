<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 4/26/14
 * Time: 12:33 PM
 */

require_once('db/location.inc');

/**
 * @param null $company_id
 *
 * @return string
 */
function location_listing($company_id = NULL) {

  $output =  '<div>This is the location listing page for company: ' . $company_id . '</div>';

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
      array_push($rows[$i], '<a href="/config/location/edit/' . $row['location_id'] . '">Edit</a>');
    }

    // Make a table
    $header = array(
      t('Company ID'),
      //t('Company Name'),
      t('Location ID'),
      t('Location Name'),
      t('Edit')
    );

    $r = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows
    );

    $output .= drupal_render($r);
  } else {
    drupal_set_message(t('No locations found.'));
  }

  return $output;
}

function location_form($form, &$form_state, $vars) {

  // Location values
  $sections['local_static_value'] = array(
    '#type' => 'fieldset',
    '#title' => t('Xeros Static Values'),
    '#description' => t('Xeros static values for this classification'),

    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#tree' => TRUE,
    'xeros_local_static_value_id' => array(
      '#title' => 'Unique ID',
      '#type' => 'markup',
      '#markup' => '<div>Unique ID from database</div>'
    ),
    'classification_id' => array(
      '#title' => 'unique classification',
      '#type' => 'hidden'
    ),
    'hot_water_gallons' => array(
      '#title' => 'Hot Water Gallons',
      '#description' => 'Always 0 (Xeros does not use Hot Water)',
      '#type' => 'textfield'
    ),
    'cold_water_gallons' => array(
      '#title' => 'Cold Water',
      '#description' => "How much water a Xeros machine uses for the same classification",
      '#type' => 'textfield'
    ),
    'run_time' => array(
      '#title' => 'Run Time',
      '#description' => "How long a Xeros machine runs for the same classification",
      '#type' => 'textfield'
    ),
  );

  $sections['chemical_profile'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#tree' => TRUE,
    'chemical_profile_id' => array(
      '#type' => 'hidden',
      '#name' => 'Chemical Profile ID',
      '#description' => "Primary Key",
    ),
    'chemical_type' => array(
      '#type' => 'textfield',
      '#name' => 'Chemical Type',
      '#description' => "Name of Chemical",
    ),
    'supplier' => array(
      '#type' => 'textfield',
      '#name' => 'Supplier',
      '#description' => "Name of Supplier",
    ),
    'material_type' => array(
      '#type' => 'textfield',
      '#name' => 'Material Type',
      '#description' => "Liquid, Powder, Bead, etc.",
    ),
    'unit' => array(
      '#type' => 'textfield',
      '#name' => 'Measurement Unit',
      '#description' => "The Unit the chemical is measured in (Ounces or Grams)",
    ),
    'unit_cost' => array(
      '#type' => 'textfield',
      '#name' => 'Cost per Unit',
      '#description' => "",
    ),
    'location_id' => array(
      '#type' => 'hidden',
      '#name' => 'Location ID',
      '#description' => "",
    ),
    'xeros_unit_cost' => array(
      '#type' => 'textfield',
      '#name' => 'Xeros Cost Per Unit',
      '#description' => "Cost per unit of xeros provided chemical (this is generally 0 because Xeros provides chemicals with machine lease.",
    ),
  );

  $sections['labor_profile'] = array(
    '#type' => 'fieldset',
    '#description' => 'There may be more than one chemical used per machine and classification',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#tree' => TRUE,
    'labor_profile_id' => array(
      '#type' => 'hidden',
      '#name' => 'Labor Profile ID',
      '#description' => '',
    ),
    'ops_hourly_rate' => array(
      '#type' => 'textfield',
      '#name' => 'Average hourly rate of labor',
      '#description' => '',
    ),
    'location_id' => array(
      '#type' => 'hidden',
      '#name' => 'Location ID',
      '#description' => '',
    ),
  );
}