<?php

// Draw Charts
$x = 110;
$y = 50;
$row_height = 40;
$row_margin = 3;

$rows = array(
  array(
    'bg_color' => array(121, 189, 181),
    'icon' => '15mm_globe.png',
    'icon_text' => '\e600'
  ),
  array(
    'bg_color' => array(119, 184, 213),
    'icon' => '15mm_water-drop.png',
    'icon_text' => '\e600'
  ),
  array(
    'bg_color' => array(244, 127, 72),
    'icon' => '15mm_thermometer.png',
    'icon_text' => '\e600'
  ),
  array(
    'bg_color' => array(251, 176, 59),
    'icon' => '15mm_chemical.png',
    'icon_text' => '\e600'
  ),
);

// Add some Unicode font (uses UTF-8)
$pdf->AddFont('Icon', '', 'xeros-icon.ttf', true);

$x = $pdf->GetX();
$y = $pdf->GetY();

$y = $y + 13;

// Left X of each column
$cols = array(25, 54, 145);

foreach ($content->reportData as $key => $data) {

  $pdf->style("normal");

  $bg = $rows[$key]['bg_color'];
  $icon = "templates/" . $rows[$key]['icon'];
  $icon_text = $rows[$key]['icon_text'];

  $pdf->SetDash(1,.7);
  $pdf->SetLineWidth(0.1);

  $pdf->SetFillColor($bg[0], $bg[1], $bg[2]);

  $name = $data->name;

  $pdf->SetXY($cols[0], $y);
  $pdf->hr(160);

  //
  // Left column
  //
  $pdf->SetXY($cols[0], $y + 10);
  $pdf->style("label-large");
  $pdf->space(7,0);
  $pdf->Image($icon, $pdf->GetX() - 1.5, NULL, 15, 15, 'png');
  $pdf->SetXY($cols[0], $y + 15);
  $pdf->Cell($cols[0], 30, $data->meta->title, $b, 2, 'C');

  //
  // data Column
  //
  $pdf->SetXY($cols[1], $y + $row_margin/2);
  //$pdf->SetFontSize(6);
  $pdf->Cell(85, $row_height, "", $b, 2, 'C', 1);
  $pdf->SetXY($cols[1], $y);
  $pdf->Image($content->charts->{$data->name}, NULL, NULL, 0, 0, 'png');

  //
  // Summary Column
  //

  $h1 = 8;
  $h2 = 4;
  $w = 30;

  // Draw the box
  $pdf->SetXY($cols[2] - 6, $y + $row_margin/2);
  $pdf->SetDash();
  $pdf->SetDrawColor($bg[0], $bg[1], $bg[2]);
  $pdf->Cell(40, 40, '', 'TRB', 0);
  $pdf->style("outlineColor");

  // Put in the content
  $pdf->SetXY($cols[2], $y + 1);

  $pdf->numberFormat($data->summaryData->cost, $w, $h1, array( $font["h2"] * .7, $font["h2"] ));

  $pdf->SetX($cols[2]);
  $pdf->style("label-medium");
  $pdf->Cell($w, $h2, 'Actual Cost', $b, 2, 'C');

  $pdf->SetDash(1, .7);
  $pdf->space(0, 1);
  $pdf->hr($w);
  $pdf->space(0,1);

  $pdf->numberFormat($data->summaryData->cost, $w, $h1, array( $font["h2"] * .7, $font["h2"] ));

  $pdf->SetX($cols[2]);
  $pdf->style("label-medium");
  $pdf->Cell($w, $h2, 'Potential Cost', $b, 2, 'C');

  $pdf->space(0, .8);
  $pdf->hr($w);
  $pdf->space(0,.8);

  $pdf->style("h2");
  $pdf->Cell($w, $h1, $data->summaryData->savings . '%', $b, 2, 'C');

  $pdf->style("label-medium");
  $pdf->Cell($w, $h2, 'Potential Savings', $b, 2, 'C');


  $y += $row_height + $row_margin;
}
