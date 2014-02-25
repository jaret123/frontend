<?php
// require tFPDF

require_once('./tfpdf/tfpdf.php');

// map FPDF to tFPDF so FPDF_TPL can extend it
class FPDF extends tFPDF
{
    /**
     * "Remembers" the template id of the imported page
     */
    protected $_tplIdx;

    /**
     * Draw an imported PDF logo on every page
     */
    public function Header()
    {
        if (is_null($this->_tplIdx)) {
            $this->setSourceFile("logo.pdf");
            $this->_tplIdx = $this->importPage(1);
        }
        $size = $this->useTemplate($this->_tplIdx, 130, 5, 60);

        $this->SetFont('DejaVu', 'B', 16);
        $this->SetTextColor(0);
        $this->SetXY($this->lMargin, 5);

        $text = 'tFPDF (v' . tFPDF_VERSION . ') and FPDI (v'
            . FPDI_VERSION . ')';
        $this->Cell(0, $size['h'], $text);
        $this->Ln();
    }
}

// just require FPDI afterwards
require_once('./FPDI-1.4.4/fpdi.php');

// initiate PDF
$pdf = new FPDI();

// Load the dynamice content from the post
$content = json_decode(utf8_encode($_POST['content']));

// Add some Unicode font (uses UTF-8)
$pdf->AddFont('DejaVu', '', 'DejaVuSansCondensed.ttf', true);
$pdf->AddFont('DejaVu', 'B', 'DejaVuSansCondensed-Bold.ttf', true);

// add a page
$pdf->AddPage();

$pdf->SetFont('DejaVu', '', 14);

$pdf->Write(8, 'Hello ' . $content->name);

// Load a UTF-8 string from a file and print it
$txt = file_get_contents('HelloWorld.txt', true);
$pdf->Write(8, $txt);

// Select a standard font (uses windows-1252)
$pdf->SetFont('Arial', '', 14);
$pdf->Ln(10);
$pdf->Write(5, 'The file uses font subsetting.');

$pdf->Output('doc.pdf', 'I');