<?php

require_once('db/dai_meter_collection_detail.inc');

function dai_meter_collection_detail($collection_id) {

  $output =  '';

  $dai_meter_collection_detail = new dai_meter_collection_detail();

  $rows = $dai_meter_collection_detail->select_by_collection_id($collection_id);

  $header = array(
    t('id'),
    t('duration'),
    t('meter_type'),
    t('meter_value'),
    t('timestamp'),
    t('collection_id')
  );

  $r = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
    '#empty' => 'No cycles found for this filter'
  );

  $output .= drupal_render($r);

  print $output;
  drupal_exit();
  //return $output;
}