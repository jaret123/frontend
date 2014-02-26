<?php
// require tFPDF

  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past

require_once('./tfpdf/tfpdf.php');

// map FPDF to tFPDF so FPDF_TPL can extend it
class FPDF extends tFPDF
{
    /**
     * "Remembers" the template id of the imported page
     */
    protected $_tplIdx;

    /**
     * Draw a background on
     */
//    public function Header()
//    {
//        if (is_null($this->_tplIdx)) {
//            $this->setSourceFile("dash-template.pdf");
//            $this->_tplIdx = $this->importPage(1);
//        }
//        $size = $this->useTemplate($this->_tplIdx, 0, 0, 0);
//
//        $this->SetFont('DejaVu', 'B', 16);
//        $this->SetTextColor(0);
//        $this->SetXY($this->lMargin, 5);
//
//        $text = 'tFPDF (v' . tFPDF_VERSION . ') and FPDI (v'
//            . FPDI_VERSION . ')';
//        $this->Cell(0, $size['h'], $text);
//        $this->Ln();
//    }

    // use the background template
    public function AddPage($orientation='', $size='') {
        parent::AddPage($orientation,$size);
        $this->setSourceFile('dash-template-final-small.pdf');
        $template = $this->ImportPage(1);
        $this->useTemplate($template);
    }
}

// just require FPDI afterwards
require_once('./FPDI-1.4.4/fpdi.php');

// initiate PDF
$pdf = new FPDI();

$b = 0; // Show borders on cells

// Load the dynamice content from the post
$content = json_decode(utf8_encode($_POST['content']));
//
//$content["t"]
//    "title" => "Operational Health Dashboard",
//    "legend" => array(
//        "Current Consumption",
//        "Potential Consumption with Xeros"
//    ),
//    "charts" => array(
//        array(
//            "name" => "TOTAL SAVINGS",
//            "value" => 438,
//            "label" => "Actual Cost",
//            "value2" => 182,
//            "label2" => "Potential Cost",
//            "delta" => 58
//        ),
//        array(
//            "name" => "WATER COST",
//            "value" => 222,
//            "label" => "Actual Cost",
//            "value2" => 182,
//            "label2" => "Potential Cost",
//            "delta" => 58
//        ),
//        array(
//            "name" => "Total Savings",
//            "value" => 54,
//            "label" => "Actual Cost",
//            "value2" => 182,
//            "label2" => "Potential Cost",
//            "delta" => 58
//        ),
//        array(
//            "name" => "Total Savings",
//            "value" => 321,
//            "label" => "Actual Cost",
//            "value2" => 182,
//            "label2" => "Potential Cost",
//            "delta" => 58
//        ),
//        array(
//            "name" => "Total Savings",
//            "value" => 100,
//            "label" => "Actual Cost",
//            "value2" => 182,
//            "label2" => "Potential Cost",
//            "delta" => 58
//        )
//    ),
//    "news" => array(
//        array(
//            "title" => "In the News",
//            "copy" => "Eco-conscious cleaning with polymer beads",
//            "image" => "Image"
//        ),
//        array(
//            "title" => "In the News",
//            "copy" => "Eco-conscious cleaning with polymer beads",
//            "image" => "Image"
//        ),
//        array(
//            "title" => "In the News",
//            "copy" => "Eco-conscious cleaning with polymer beads",
//            "image" => "Image"
//        )
//    )
//);
// Add some Unicode font (uses UTF-8)
$pdf->AddFont('Lato', '', 'Lato-lig.ttf', true);
//$pdf->AddFont('Lato', 'B', 'Lato-lig.ttf', true);

// add a page
//$pdf->AddPage();

//$pageCount = $pdf->setSourceFile("dash-template.pdf");
//$tplIdx = $pdf->importPage(1, '/MediaBox');
//
//$pdf->addPage();
//$pdf->useTemplate($tplIdx, 0, 0, 0);

$pdf->AddPage("portrait", "letter");
$pdf->SetFont('Lato','',10);


//$pdf->SetFont('Lato', '', 16);
//$pdf->SetTextColor(128,128,128);
//
////$pdf->Write(8, 'Hello ' . $content->name);
//
//// Select a standard font (uses windows-1252)
//$pdf->SetFont('Lato', '', 16);
//$pdf->Ln(15);
//$pdf->Write(5, 'Operational Health Dashboard');
//
//

// print header

$x = 10;
$y = 24;

// Title
$pdf->SetXY($x, $y);
$pdf->SetFontSize(14);
$pdf->Cell(30,8,'Operational Health Dashboard',$b,2,'L');

$pdf->SetXY($x + 3, $y + 10);
// Legend
$pdf->SetFontSize(8);
$pdf->SetDrawColor(200, 200, 200);
$pdf->SetFillColor(119, 184, 213);
$pdf->Cell(5, 3, '', 1, 0, '', false);
$pdf->Cell(1, 4, '', $b, 0);
$pdf->Cell(30, 4, 'Current Consumption', $b, 0, 'L');
$pdf->Cell(5, 3, '', 1, 0, '', true);
$pdf->Cell(1, 4, '', $b, 0);
$pdf->Cell(30, 4, 'Potential Consumption', $b, 0, 'L');

// Date Range
$reportDateRange = "Report Date Range: 2014-01-01 to 2014-2-01";
$pdf->Cell(30, 4, $reportDateRange, $b, 0, 'L');


// Draw Charts
$x = 110;
$y = 50;

foreach ( $content->data as $chart ) {

    $name = $chart->name;
    // Left column
    $pdf->SetXY(10, $y + 20);
    $pdf->SetFontSize(6);
    $pdf->Cell(30,4.5,$chart->meta->title,$b,2,'C');
    // Chart Column
    $pdf->SetXY(44, $y);
    //$pdf->SetFontSize(6);
    $pdf->Image($content->chart->$name, null, null, 65, 0, 'png');

    //$pdf->Cell(65,29,$content->chart->$name ,$b,2,'C');
    // Summary Column
    $pdf->SetXY($x,$y);
    $pdf->SetFontSize(6);
    $pdf->Cell(30,4.5,$chart->meta->title,$b,2,'C');
    $pdf->Cell(30,2,'',$b,2,'C');
    $pdf->SetFontSize(12);
    $pdf->Cell(30,4,'$' . $chart->summaryData->cost, $b,2,'C');
    $pdf->SetFontSize(6);
    $pdf->Cell(30,3,'Actual Cost',$b,2,'C');
    $pdf->Cell(30,2,'',$b,2,'C');
    $pdf->SetFontSize(12);
    $pdf->Cell(30,4,'$' . $chart->summaryData->cost, $b,2,'C');
    $pdf->SetFontSize(6);
    $pdf->Cell(30,3,'Potential Cost',$b,2,'C');
    $pdf->Cell(30,2,'',$b,2,'C');
    $pdf->Cell(30,5,$chart->summaryData->savings . '%',$b,2,'C');
    $y += 34;
}

// Draw News
$x = 147;
$y = 41;

$w = 40;
$h = 5;

$pdf->SetXY($x, $y);

$pdf->SetFontSize(14);
$pdf->Cell($w,$h,'News',$b,2,'L');


//$y = 50;
//foreach ( $content["news"] as $news ) {
//    $pdf->SetXY($x, $y);
//    $pdf->SetFontSize(9);
//    $pdf->Cell($w,$h,'Title',$b,2,'L');
//    $pdf->SetFontSize(6);
//    $pdf->Cell($w,$h * 5,'Copy',$b,2,'L');
//    $pdf->SetXY($x + $w, $y);
//    $pdf->Cell($w / 2,$h * 3,'Image',$b,2,'R');
//    $y += 38;
//}

$pdf->Output('doc.pdf', 'I');