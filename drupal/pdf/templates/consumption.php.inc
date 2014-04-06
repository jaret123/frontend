<?php

$pdf->SetXY(10, 10);
$pdf->SetFontSize(6);

$label = array(
  array('Machine', ""),
  array('Cold Water', '(Gallons)'),
  array('Hot Water','(Therms)'),
  array('Cycle Time','(Minutes)'),
  array('Chemical','(Ounces)')
);

$col_width = ($pdf->w - $pdf->lMargin - $pdf->rMargin) / 5 ;

$b = $pdf->border;

// Header Row
$pdf->SetXY($pdf->lMargin, 50);
$x = $pdf->GetX();
foreach ( $label as $i => $v ) {
  if ( $i == 0 ) {
    $pdf->style("label-large bold");
    $pdf->Cell($col_width, 8, $v[0], $b, 2, 'C');
  } else {
    $pdf->style("label-large bold");
    $pdf->Cell($col_width, 4, $v[0], $b, 2, 'C');
    $pdf->style("normal label-medium");
    $pdf->Cell($col_width, 4, $v[1], $b, 2, 'C');
  }
  $x += $col_width;
  $pdf->SetXY($x, 50);
}

$y = 60;

$row_height = 30;
$row_margin = 3;
$col_padding = array(7, 0, 0, 8); // T,R,B,L

// Row
foreach ($content->reportData->data as $key => $data) {

  $logo = "Machine Logo";
  $bg_color = "white-bg-color"; //array(255,255,255);
  $machine_icon = "templates/machine-icon.png";

  if ( strtolower($data->machine_name) == 'xeros' ) {
    $logo = "Xeros Logo";
    $bg_color = "xeros-bg-color"; //array(211, 239, 252);
    $machine_icon = "templates/machine-icon-xeros.png";
  }


  $x = $pdf->lMargin;
  $pdf->SetXY($x, $y);

  $pdf->SetDash(1.1, .8);
  $pdf->hr($pdf->contentWidth);
  $pdf->SetDash();

  // Row background
  $pdf->style($bg_color);
  $pdf->space(0, $row_margin/2);
  $pdf->Cell($col_width * 5, $row_height, "", $b, 2, 'C', true);

  $y += $row_margin/2;

  // Column 1
  $pdf->SetXY($x, $y + $row_margin);

  $pdf->space(0, 4);
  $pdf->Cell($col_width/2, $row_height,
    $pdf->Image($machine_icon,$pdf->GetX() + 2, $pdf->GetY(), 14, 16, 'png'),
    $b, 2, 'C');

  $pdf->SetXY($x + $col_width/2, $y + $row_margin);
  $pdf->space(0, 2);
  $pdf->style("label-large");
  $pdf->Cell($col_width/2, 6, $data->machine_name, $b, 2, 'C');
  $pdf->Cell($col_width/2, 6, "(" . $data->size . ")", $b, 2, 'C');
  $pdf->style("label-small");
  $pdf->Cell($col_width/2, 5, $data->serial_number, $b, 2, 'C');
  $pdf->Cell($col_width/2, 5, "Cycles: " . $data->cycles, $b, 2, 'C');

  $x += $col_width;
  $pdf->SetXY($x, $y);

  // Column 2
  $pdf->Image($content->charts->{($key+1) . "-cold_water"}, $pdf->GetX() + $col_padding[3], $pdf->GetY() + $col_padding[0], 0, 0, 'png');
  $pdf->space(0, $row_height - 8);
  $s = (string)$data->cold_water_delta_value . "% ";
  $sl = $pdf->GetStringWidth($s);
  $pdf->Cell($sl + ($col_width-$sl)/2, 4, $s, $b, 0, 'R');
  $pdf->Image($pdf->arrow($data->cold_water_delta_value), null, $pdf->GetY() - .5, 0, 0, 'png');

  $x += $col_width;
  $pdf->SetXY($x, $y);

  // Column 3
  $pdf->Image($content->charts->{($key+1) . "-chemical"}, $pdf->GetX() + $col_padding[3], $pdf->GetY() + $col_padding[0], 0, 0, 'png');
  $pdf->space(0, $row_height - 8);
  $s = (string)$data->chemical_delta_value . "% ";
  $sl = $pdf->GetStringWidth($s);
  $pdf->Cell($sl + ($col_width-$sl)/2, 4, $s, $b, 0, 'R');
  $pdf->Image($pdf->arrow($data->chemical_delta_value), null, $pdf->GetY() - .5, 0, 0, 'png');

  $x += $col_width;
  $pdf->SetXY($x, $y);

  // Column 4
  // Note - The clock chart is positioned differently than the bar charts
  $pdf->Image($content->charts->{($key+1) . "-cycle_time"}, $pdf->GetX(), $pdf->GetY() - 6, 0, 0, 'png');
  $pdf->space(0, $row_height - 8);
  $s = (string)$data->time_delta_value . "% ";
  $sl = $pdf->GetStringWidth($s);
  $pdf->Cell($sl + ($col_width-$sl)/2, 4, $s, $b, 0, 'R');
  $pdf->Image($pdf->arrow($data->time_delta_value), null, $pdf->GetY() - .5, 0, 0, 'png');

  $x += $col_width;
  $pdf->SetXY($x, $y);

  // Column 5
  $pdf->Image($content->charts->{($key+1) . "-chemical"}, $pdf->GetX() + $col_padding[3], $pdf->GetY() + $col_padding[0], 0, 0, 'png');
  $pdf->space(0, $row_height - 8);
  $s = (string)$data->chemical_delta_value . "% ";
  $sl = $pdf->GetStringWidth($s);
  $pdf->Cell($sl + ($col_width-$sl)/2, 4, $s, $b, 0, 'R');
  $pdf->Image($pdf->arrow($data->chemical_delta_value), null, $pdf->GetY() - .5, 0, 0, 'png');


  $pdf->space(0, $row_margin/2);
  $y += $row_height + $row_margin;

}

