<?php

require_once('db/dai_meter_collection.inc');

function dai_meter_collection($id) {

  $output =  '<div>This is the dai_meter_collection listing page</div>';

  $dai_meter_collection = new dai_meter_collection();

  $rows = $dai_meter_collection->select($id);

  $header = array(
    t('id'),
    t('dai_write_timestamp'),
    t('dai_identifier'),
    t('machine_identifier'),
    t('location_identifier'),
    t('collection_map_id'),
    t('machine_id'),
    t('file_create_timestamp'),
    t('file_upload_timestamp'),
    t('olson_timezone_id'),
    t('dai_meter_actual_id')
  );

  $r = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
    '#empty' => 'No records found for this filter'
  );

  $output .= drupal_render($r);

  return $output;
}