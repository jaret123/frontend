<?php

include_once (drupal_get_path('module', 'xeros_admin') . '/db/location_profile.inc');

function ws_location($location_id) {

  $location = node_load($location_id);

  echo json_encode($location);

}

function ws_location_machines($location_id) {

  $u = new WsUtils();

  $l = $u->user_access_locations();

  // Kick the person out if they don't have access
  if ( !user_is_logged_in() ) {
    return "Access Denied";
  }

  $machine_ids = $u->machines_by_location(array($location_id));

  print json_encode($machine_ids);
}