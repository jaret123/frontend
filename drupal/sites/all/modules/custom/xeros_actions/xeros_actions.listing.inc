<?php

function action_listing($format = NULL) {
  if ($format == 'json') {
    action_listing_service();
  } else {
    $output = action_listing_table();
    return $output;
  }
}

function action_listing_table() {

  if ( !user_access('xeros actions edit') ) {
    $output =  '<div>Access denied</div>';
    return $output;
  }

  $output =  '<div>This is the action listing</div>';

  $entity_items = get_actions();

  $rows = array();

  foreach ($entity_items as $eid => $entity) {
    $add_link = l('Add', 'node/add/action', array('query' => array(drupal_get_destination(), 'machine_id' => $eid)));

    if ( isset($entity['action_items']) ) {
      $arv = array_values($entity['action_items']);
      $most_recent_action = array_shift($arv);

      $edit_link = l('Edit', 'node/' . $most_recent_action->nid . '/edit', array('query' => drupal_get_destination()));

      $rows[] = array(
        'company' => $entity['company_name'],
        'location' => $entity['location_name'],
        'machine_id' => $entity['machine_name'],
        'action_status' => array(
          'data' => '',
          'class' => 'status status-' . $most_recent_action->field_status['und'][0]['value']
        ),
        'action_title' => array(
          'data' => $most_recent_action->title,
          'class' => 'title'
        ),
        'action_body' => !empty($most_recent_action->body) ? $most_recent_action->body['und'][0]['value'] : '',
        'action_created' => format_date($most_recent_action->created, 'short'),
        'link' =>  $edit_link . '&nbsp; &nbsp;' . $add_link
      );
    } else {
      $rows[] = array(
        'company' => $entity['company_name'],
        'location' => $entity['location_name'],
        'machine_id' => $entity['machine_name'],
        'action_status' => '',
        'action_title' => '',
        'action_body' => '',
        'action_created' => '',
        'link' => '<span class="disabled">Edit</span>' . '&nbsp; &nbsp;' . $add_link,

      );
    }
  }



  // Make a table
  $header = array(
    t('Company'),
    t('Location'),
    t('Machine ID'),
    t('Status'),
    t('Action'),
    t('Action Notes'),
    t('Created'),
    ''
  );

  foreach ($rows as $key => $row) {
    $company[$key]  = $row['company'];
    $location[$key] = $row['location'];
  }

// Sort the data with volume descending, edition ascending
  array_multisort($company, SORT_ASC, $location, SORT_ASC, $rows);
  
  $r = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
    '#empty' => 'No active locations found for this filter'
  );


  $output .= drupal_render($r);
//  } else {
//    drupal_set_message(t('No locations found.'));
//  }
//
//  $output .= '<div><a href="/config/location/add">+ Add another location</a></div>';

  return $output;
}

function action_listing_service() {
  $entity_items = get_actions();

  $rows = array();

  foreach ($entity_items as $eid => $entity) {

    if ( isset($entity['action_items']) ) {
      $most_recent_action = array_shift(array_values($entity['action_items']));

      $rows[$eid] = array(
        'machine_id' => $eid,
        'action_status' => array(
          'data' => $most_recent_action->field_status['und'][0]['value'],
          'class' => 'status status-' . $most_recent_action->field_status['und'][0]['value']
        ),
        'action_title' => array(
          'data' => $most_recent_action->title,
          'class' => 'title'
        ),
        'action_body' => $most_recent_action->body['und'][0]['value'],
        'action_created' => format_date($most_recent_action->created, 'short'),
      );
    } else {
      $rows[$eid] = array(
        'machine_id' => $eid,
        'action_status' => '',
        'action_title' => '',
        'action_body' => '',
        'action_created' => '',
      );
    }
  }

  echo json_encode($rows);
}

function get_actions() {

  //dpm(entity_get_info()); //gets a list of all defined entities
  //dpm(field_info_fields()); //gets a list of all defined fields

  $query = new EntityFieldQuery();
  $entities = $query->entityCondition('entity_type', 'machine_entity')
    ->execute();

  $select = db_select('xeros_machine', 'm');
  $select->fields('m');

  $machines = $select->execute()->fetchAll(PDO::FETCH_ASSOC);


//  if (!empty($entities['machine_entity'])) {
//    $eids = array_keys($entities['machine_entity']);
//    $entity_items = entity_load('machine_entity', $eids);
//  };

  //dpm($entity_items);

  $results = array();
  // Foreach machine, get the actions, company, and location
  foreach ( $machines as $id => $entity ) {
    $machine_id = $entity['machine_id'];
    $results[$machine_id] = $entity;
    // Actions
    $query = new EntityFieldQuery();
    $entities = $query->entityCondition('entity_type', 'node', '=')
      ->propertyCondition('type', 'action', '=')
      ->fieldCondition('field_machine_entity_reference', 'target_id', $machine_id, '=')
      ->propertyOrderBy('created', 'DESC')
      ->range(0,1)
      ->execute();
    if (!empty($entities['node'])) {
      $eids = array_keys($entities['node']);
      $node_items = node_load_multiple($eids);

      //dpm(array($eid => $node_items));
      $results[$machine_id]['action_items'] = $node_items;
    }

    // Location
    $location = node_load($entity['location_id']);

    // Company
    $company = node_load($location->field_company['und'][0]['target_id']);

    $results[$machine_id]['location_name'] = $location->title;
    $results[$machine_id]['company_name'] = $company->title;

  }
  //dpm($entity_items);

  return $results;
}