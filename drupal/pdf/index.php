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

    public $border = 0;

    public $contentWidth = 0;

    function __construct($a, $b, $c) {
      parent::__construct($a, $b, $c);
      if (isset($_COOKIE["border"]) && $_COOKIE["border"] == 1) {
        $this->border = 1;
      } else {
        $this->border = 0;
      }

      $this->contentWidth = $this->w - $this->lMargin - $this->rMargin;
    }

    // use the background template
    public function AddPage($orientation='', $size='') {
        parent::AddPage($orientation,$size);
        $this->setSourceFile('dash-template-no-icons.pdf');
        $template = $this->ImportPage(1);
        $this->useTemplate($template);

        if (isset($_COOKIE["grid"]) && $_COOKIE["grid"] == 1) {
          $this->drawGrid();
        }

        $this->Header();

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

  public function SetDash($black=null, $white=null)
  {
    if($black!==null)
      $s=sprintf('[%.3F %.3F] 0 d',$black*$this->k,$white*$this->k);
    else
      $s='[] 0 d';
    $this->_out($s);
  }

  /**
   * Move XY the number in the params
   *
   * @param $x
   * @param $y
   */
  public function space($x, $y) {

    $this->SetXY($this->GetX() + $x,$this->GetY() + $y);
    
  }

  public function style($styles) {

    $ar = explode(" ", $styles);

    foreach($ar as $style) {
      switch($style){
        case "outlineColor":
          $this->SetDrawColor(200, 200, 200);
          break;
        case "font-color-base":
          $this->SetTextColor(128, 128, 128);
          break;
        case "font-color-white":
          $this->SetTextColor(255,255,255);
          break;
        case "fill-color-blue":
          $this->SetFillColor(0, 135, 190);
          $this->SetTextColor(255,255,255);
          $this->SetDrawColor(0, 135, 190);
          break;
        case "fill-color-white":
          $this->SetFillColor(255,255,255);
          $this->SetTextColor(128,128,128);
          $this->SetDrawColor(128,128,128);
          break;
        case "h4":
          $this->SetFontSize(16);
          break;
        case "h3":
          $this->SetFontSize(20);
          break;
        case "h2":
          $this->SetFontSize(17);
          break;
        case "h1":
          $this->SetFontSize(19.5);
          break;
        case "normal":
          $this->SetFontSize(16);
          $this->SetTextColor(128,128,128);
          $this->SetFont('Lato', '', 16);
          break;
        case "bold":
          $this->SetFont('Lato', 'B');
          $this->SetTextColor(0,0,0);
          break;
        case "legend":
          $this->SetFontSize(12);
          break;
        case "label-small":
          $this->SetFontSize(9);
          break;
        case "label-medium":
          $this->SetFontSize(10);
          break;
        case "label-large":
          $this->SetFontSize(12);
          break;
        case "xeros-bg-color":
          $this->SetFillColor(239, 250, 255);
          break;
        case "white-bg-color":
          $this->SetFillColor(255,255,255);
          break;
      }
    }

  }

  function numberFormat ($value, $width, $height, $font_size = array(10, 10)) {

    $this->SetFontSize($font_size[0]);
    $unit = "$";
    $unit_width = $this->GetStringWidth($unit);

    $this->SetFontSize($font_size[1]);
    $text = number_format($value);
    $text_width = $this->GetStringWidth($text);

    $total_width = $text_width + $unit_width;
    $margin_width = ($width - $total_width) / 2;

    $this->SetFontSize($font_size[0]);
    $this->Cell($margin_width + $unit_width, $height, '$', $this->border, 0, 'R');

    $this->SetFontSize($font_size[1]);
    $this->Cell($margin_width + $text_width, $height, $text, $this->border, 2, 'L');
  }

  /**
   *
   * Draw a horizontal rule starting at the current XY
   * @param $width
   */
  public function hr($width) {
    $x = $this->GetX();
    $y = $this->GetY();

    $this->Line($x, $y, $x + $width, $y);
  }

  public function Header()
  {
// print header

    $x = 10;
    $y = 24;
    $b = $this->border;

    $this->style("outlineColor");
    $this->SetFillColor(119, 184, 213);
    $this->SetTextColor(100, 100, 100);

// Title
    $this->SetXY($x, $y);
    $this->style("h1");
    $this->Cell(30,8,$this->content->title,$b,2,'L');

    $this->SetXY($x + 3, $y + 10);
// Legend
    $this->style("label-small");

    $this->Cell(5, 3, '', 1, 0, '', false);
    $this->Cell(1, 4, '', $b, 0);
    $this->Cell(33, 4, 'Current Consumption', $b, 0, 'L');
    $this->Cell(5, 3, '', 1, 0, '', true);
    $this->Cell(1, 4, '', $b, 0);
    $this->Cell(30, 4, 'Potential Consumption', $b, 0, 'L');

// Date Range
    $reportDateRange = "Report Date Range: " . $this->content->dateRange[0] . " to " . $this->content->dateRange[1];

    $this->SetX($this->lMargin + $this->contentWidth/2);
    $this->Cell($this->contentWidth/2, 4, $reportDateRange, $b, 1, 'R');

    $this->space(0,2);

    $this->SetDash(1.7, 1.1);
    $this->hr($this->contentWidth);
    $this->SetDash();

    $this->space(0,2);

    $x = $this->GetX();
    $y = $this->GetY();
    // Footer

    $footerTop = $this->h - $this->bMargin;

    $this->SetXY(30, $footerTop + 12);
    $this->style("bold font-color-white");
    $this->Cell(30, 4, "Report provided by Xeros Cleaning", $this->border, 0, 'L', false, "http://www.xeroscleaning.com");

    $this->SetXY($this->w/2, $this->GetY());
    $this->Cell(30, 4, "CONTACT US", $this->border, 2, 'L', false);
    $this->Cell(30, 4, "1-855-XEROS NA (1-855-937-6772)", $this->border, 2, 'L', false);
    $this->Cell(30, 4, "SbeadyCareSupport@xeroscleaning.com", $this->border, 2, 'L', false);

    // Put the ascissa back;
    $this->SetXY($x, $y);
  }

  function arrow($value) {
    $return = "";
    if ( $value > 0) {
        $return = "templates/18px_down-green.png";
    } elseif ($value < 0) {
        $return = "templates/18px_up-red.png";
    } else {
        $return = "";
    }
    return $return;
  }
}

// just require FPDI afterwards
require_once('./FPDI-1.4.4/fpdi.php');

// Page in is in mm -- 215.9 wide, by 279.4 = 8.5 x 11 inches
// initiate PDF
$pdf = new FPDI("P", "mm", "letter");


// Shortcut so we don't have to write $this_border so much;
$b = $pdf->border;

// Set page break distance from bottom
$pdf->SetAutoPageBreak(false, 30);

// Load the dynamic content from the post
$content = json_decode(utf8_encode($_POST['content']));
$pdf->content = $content;

// Note - Don't add all the fonts.  They all get embedded in the PDF wether you use them or not.
// Add some Unicode font (uses UTF-8)
// Hairline
$pdf->AddFont('Lato-100', '', 'Lato-Hai.ttf', true);

// Regular
$pdf->AddFont('Lato', '', 'Lato-Lig.ttf', true);

// Bold
$pdf->AddFont('Lato', 'B', 'Lato-Reg.ttf', true);

// Really Bold
$pdf->AddFont('Lato-700', '', 'Lato-Bol.ttf', true);
//

$pdf->SetFont('Lato','',10);

$pdf->AddPage("portrait", "letter");


$font["h4"] = 16;
$font["h3"] = 20;
$font["h2"] = 17;
$font["h1"] = 19.5;
$font["legend"] = 12;
$font["label"] = array(9, 10, 12);



if (isset($_GET['r'])) {
  $report = $_GET['r'];
}

include_once("templates/" . $report . ".php.inc");

$pdf->Output('doc.pdf', 'I');