<?php

require_once('db/collection_map_detail.inc');

function collection_map_detail($mapping_id) {

  $output =  '';
  $output .= '<tr data-id="' . $mapping_id . '"><td></td><td colspan="8">';
  $collection_map_detail = new collection_map_detail();

  $rows = $collection_map_detail->select_by_mapping_id($mapping_id);

  $header = array(
    t('meter_type'),
	t('duration'),
	t('start_time'),
	t('mapping_id')
  );

  $r = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
    '#empty' => 'No cycles found for this filter'
  );

  $output .= drupal_render($r);

  $output .= '</td></tr>';

  print $output;
  drupal_exit();
  //return $output;
}