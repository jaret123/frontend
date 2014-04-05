<?php

$pdf->SetXY(10, 10);
$pdf->SetFontSize(6);

$label = array(
  'Machine',
  'Cold Water',
  '(Gallons)',
  'Hot Water',
  '(Therms)',
  'Cycle Time',
  '(Minutes)',
  'Chemical',
  '(Ounces)'
);

foreach ( $label as $v ) {
  $pdf->Cell(60, 4.5, $v, $b, 1, 'C');
}
foreach ($content->reportData->data as $key => $data) {

  foreach ($data as $i => $value) {
    $pdf->Cell(60, 4.5, $value, $b, 1, 'C');
  }
}

foreach ( $content->charts as $name => $chart) {
  $pdf->Image($chart, NULL, NULL, 0, 0, 'png');
}