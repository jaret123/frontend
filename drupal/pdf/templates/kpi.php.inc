<?php

// Draw Charts
$x = 110;
$y = 50;
$row_height = 40;
$row_margin = 2;

$rows = array(
  array(
    'bg_color' => array(121, 189, 181),
  ),
  array(
    'bg_color' => array(119, 184, 213),
  ),
  array(
    'bg_color' => array(244, 127, 72),
  ),
  array(
    'bg_color' => array(251, 176, 59),
  ),
);

foreach ($content->reportData as $key => $data) {
  $bg = $rows[$key]['bg_color'];

  $name = $data->name;
  // Left column
  $pdf->SetXY(10, $y + 20);
  $pdf->SetFontSize(6);

  $pdf->SetFillColor($bg[0], $bg[1], $bg[2]);
  $pdf->Cell(30, 4.5, $data->meta->title, $b, 2, 'C');

  // data Column
  $pdf->SetXY(44, $y);
  //$pdf->SetFontSize(6);
  $pdf->Cell(85, $row_height, "", $b, 2, 'C', 1);
  $pdf->SetXY(44, $y);
  $pdf->Image($content->charts->{$data->name}, NULL, NULL, 0, 0, 'png');

  //$pdf->Cell(65,29,$content->data->$name ,$b,2,'C');
  // Summary Column
  $pdf->SetXY(130, $y);
  $pdf->SetFontSize(6);
  $pdf->Cell(30, 4.5, $data->meta->title, $b, 2, 'C');
  $pdf->Cell(30, 2, '', $b, 2, 'C');
  $pdf->SetFontSize(12);
  $pdf->Cell(30, 4, '$' . $data->summaryData->cost, $b, 2, 'C');
  $pdf->SetFontSize(6);
  $pdf->Cell(30, 3, 'Actual Cost', $b, 2, 'C');
  $pdf->Cell(30, 2, '', $b, 2, 'C');
  $pdf->SetFontSize(12);
  $pdf->Cell(30, 4, '$' . $data->summaryData->cost, $b, 2, 'C');
  $pdf->SetFontSize(6);
  $pdf->Cell(30, 3, 'Potential Cost', $b, 2, 'C');
  $pdf->Cell(30, 2, '', $b, 2, 'C');
  $pdf->Cell(30, 5, $data->summaryData->savings . '%', $b, 2, 'C');
  $y += $row_height + $row_margin;
}