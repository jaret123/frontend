<?php

$pdf->Ln();

$fillcolor = array(0, 135, 190);

$cells_json = '
    {
      "machine" : {
        "width": 30,
        "height": 10,
        "position": [0, 3]
        },
      "classification" : {
      "width": 30,
      "height": 10,
      "position": [20, 3]
      },
      "values" : [
        {
        "width": 18,
        "height": 10,
        "position": [20, 15]
      },
        {
        "width": 18,
        "height": 10,
        "position": [45, 15]
       },
        {
        "width": 30,
        "height": 10,
        "position": [70, 15]
       },
        {
        "width": 30,
        "height": 10,
        "position": [95, 15]
       }
      ],
      "summary" : {
        "width": 40,
        "height": 10,
        "position": [150, 15]
     }
     }
';

$cells = json_decode($cells_json);

$pdf->SetFillColor($fillcolor[0], $fillcolor[1], $fillcolor[2]);

$x = $pdf->GetX();
$y = $pdf->GetY();
$cols = 6;
$col_margin = ( $pdf->w - ($pdf->lMargin + $pdf->rMargin) - (
                    $cells->machine->width
                    + $cells->values[0]->width
                    + $cells->values[1]->width
                    + $cells->values[2]->width
                    + $cells->values[3]->width
                    + $cells->summary->width
                ) ) / ($cols - 1);

$row_height = 45;

// Col 0

$pdf->SetXY($x, $y);
// Machine


$l = $content->reportData->labels;

$write_page_sub_header = 1;

$xeros_machine = false;
$machine_icon = "templates/25mm_washer.png";

if ( strtolower($content->reportData->machine_name) == 'xeros') {
  $xeros_machine = false;
  $machine_icon = "templates/25mm_xeros-icon.png";
}

foreach ( $content->reportData->classifications as $i => $classification) {

  $pdf->style("normal");

  if (isset($classification->data[0])) {
    $d = $classification->data[0];

  // Column 1

  $x += $cells->machine->width + $col_margin;
  // Row Label

  if ($y > 200) {
    $pdf->AddPage();
    $write_page_sub_header = 1;
    $y = 40;
  }

  if ($write_page_sub_header == 1) {
    $pdf->style("label-large");
    $pdf->SetXY($pdf->lMargin, $y + $cells->machine->position[1]);
    $pdf->Cell($cells->machine->width, 20,
      $pdf->Image($machine_icon,$pdf->GetX() + ($cells->machine->width - 20)/2, $pdf->GetY(), 19, 20, 'png'),
      $b, 2, 'C');

    $pdf->Cell($cells->machine->width, 6, $content->reportData->machine_name, $b, 2, 'C');
    $pdf->Cell($cells->machine->width, 6, $content->reportData->serial_number, $b, 2, 'C');
//    $pdf->Cell($cells->machine->width, 4, $content->reportData->machine_id, $b, 2, 'C');
    $write_page_sub_header = 0;
  }
  $pdf->style("fill-color-white");

  $pdf->SetXY($x, $y + $cells->classification->position[1]);
  if (isset($classification->name)) {
    $n = $classification->name;
  } else {
    $n = "";
  }
  $pdf->style("h2");
  $pdf->style("bold");
  $pdf->Cell($cells->classification->width, 6, $n, $b, 2, 'L');
  $pdf->style("normal label-medium");
  $pdf->Cell($cells->classification->width, 5, 'Cycles: ' . $d->cycles, $b, 0, 'L');

  // Cell One

  $pdf->SetXY($x, $y + $cells->values[0]->position[1]);
  $pdf->style("fill-color-white label-small");
  $pdf->Cell($cells->values[0]->width, 5, $l[0], "LTR", 2, 'C');
  $pdf->style("h4");
  $pdf->Cell($cells->values[0]->width, 8, number_format($d->value_one, 0), "LR", 2, 'C');
  $pdf->style("fill-color-blue");
  $pdf->Cell($cells->values[0]->width, 13, number_format($d->xeros_value_one, 0), 1, 0, 'C', true);

  // Cell Two

  $x += $cells->values[0]->width + $col_margin;

  $pdf->SetXY($x, $y + $cells->values[1]->position[1]);
  $pdf->style("fill-color-white label-small");
  $pdf->Cell($cells->values[1]->width, 5, $l[1], "LTR", 2, 'C');
  $pdf->style("h4");
  $pdf->Cell($cells->values[1]->width, 8, $content->reportData->size, "LR", 2, 'C');
  $pdf->style("fill-color-blue");
  $pdf->Cell($cells->values[1]->width, 13, $content->reportData->size, 1, 0, 'C', true);


  // Cell Three

  $x += $cells->values[1]->width + $col_margin;


  $pdf->SetXY($x, $y + $cells->values[2]->position[1]);
  $pdf->style("fill-color-white label-small");
  $pdf->Cell($cells->values[2]->width, 5, $l[2], "LTR", 2, 'C');
  $pdf->style("h4");
  $pdf->Cell($cells->values[2]->width, 8, number_format($d->value_three, 3), "LR", 2, 'C');
  $pdf->style("fill-color-blue");
  $pdf->Cell($cells->values[2]->width, 13, number_format($d->xeros_value_three, 3), 1, 0, 'C', true);

  // Cell Four

  $x += $cells->values[2]->width + $col_margin;

  $pdf->SetXY($x, $y + $cells->values[3]->position[1]);
  $pdf->style("fill-color-white label-small");
  $pdf->Cell($cells->values[3]->width, 5, $l[3], "LTR", 2, 'C');
  $pdf->style("h4");
  $pdf->Cell($cells->values[3]->width, 8, number_format($d->value_four, 3), "LR", 2, 'C');
  $pdf->style("fill-color-blue");
  $pdf->Cell($cells->values[3]->width, 13, number_format($d->xeros_value_four, 3), 1, 0, 'C', true);

  // Summary

  $x += $cells->values[3]->width + $col_margin;

  $pdf->SetXY($x, $y + $cells->summary->position[1]);
  $pdf->style("label-small");
  $pdf->Cell($cells->summary->width, 5, $l[4], "LTR", 2, 'C', true);
  $pdf->style("h4");
  $pdf->Cell($cells->summary->width, 8, $d->delta_one . "%", "LR", 2, 'C', true);
  $pdf->style("label-small");
  $pdf->Cell($cells->summary->width, 5, $l[5], "LTR", 2, 'C', true);
  $pdf->style("h4");
  $pdf->Cell($cells->summary->width, 8, number_format($d->delta_two, 3), 1, 0, 'C', true);


//  // Print labels
//  foreach ($content->reportData->labels as $i => $value) {
//    $pdf->Cell(10, 10, $value, $b, 0, 'C');
//
//  }
//
//  $pdf->Ln();
//
//  foreach ($classification->data[0] as $j => $val) {
//    $pdf->Cell(10, 10, $val, $b, 0, 'C');
//  }


  $pdf->Ln();

  $x = $pdf->GetX();
  $y += $row_height;
  }

}

