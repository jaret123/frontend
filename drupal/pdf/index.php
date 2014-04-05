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

    // use the background template
    public function AddPage($orientation='', $size='') {
        parent::AddPage($orientation,$size);
        $this->setSourceFile('dash-template.pdf');
        $template = $this->ImportPage(1);
        $this->useTemplate($template);
    }

  public function drawGrid() {
    $size = .5;
    $gridsize = 10;
    $this->SetDrawColor(200,200,200);
    for ($x = 1; $x <= 20; $x++) {
      for ($y = 1; $y <= 30; $y++) {
        $_x = $x * $gridsize;
        $_y = $y * $gridsize;
        $this->Line($_x - $size, $_y, $_x + $size, $_y);
        $this->Line($_x, $_y - $size, $_x, $_y + $size);
      }
    }
  }
}

// just require FPDI afterwards
require_once('./FPDI-1.4.4/fpdi.php');

// initiate PDF
$pdf = new FPDI();

$b = 0; // Show borders on cells

// Load the dynamice content from the post
$content = json_decode(utf8_encode($_POST['content']));

// Add some Unicode font (uses UTF-8)
$pdf->AddFont('Lato', '', 'Lato-Lig.ttf', true);


$pdf->AddPage("portrait", "letter");
$pdf->SetFont('Lato','',10);

$pdf->drawGrid();

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
$reportDateRange = "Report Date Range: " . $content->dateRange[0] . " to " . $content->dateRange[1];
$pdf->Cell(30, 4, $reportDateRange, $b, 0, 'L');

if (isset($_GET['r'])) {
  $report = $_GET['r'];
}

include_once("templates/" . $report . ".php.inc");

$pdf->Output('doc.pdf', 'I');