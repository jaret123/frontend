<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>

<!--<link rel="stylesheet" href="/sites/all/themes/xeros_theme/lib/kalendae/kalendae.css" type="text/css" charset="utf-8">-->

<div id="page-1" class="main page">
    <div class="page-container">
        <div class="container">
            <div class="kpis">
                <div class="legend">
                    <span class="swatch current"></span>
                    <span class="label">Current Consumption</span>
                    <span class="swatch xeros"></span>
                    <span class="label">Potential Consumption with Xeros</span>
                </div>
                <div id="kpis__select" class="time__select kpis__select select">
                    <span>
                        <span>Timeframe</span>
                        <select id="time-select" autofocus class="flagvisibility">
                            <option value="last30days" selected>Last 30 days</option>
                            <option value="previousMonth">Previous Month</option>
                            <option value="last6months">Last 6 Months</option>
                            <option value="yearToDate">Year to Date</option>
                            <option value="previousYear">Last Year</option>
                            <option value="custom">Custom...</option>
                        </select>
                    </span>
                    <div id="cal">
                        <div class="cal__button">
                            <div class="cal__button-submit">Get Data</div>
                            <div class="cal__button-cancel">Cancel</div>
                        </div>
                    </div>

                </div>
                <div class="template-container">

                </div>
                <div id="spinner"></div>
                <script id="page-tpl" type="text/x-handlebars-template">
                    {{#data}}
                    <div class="kpis-{{meta.cssClass}} row">
                        <div class="col col-1">
                            <div class="icon icon-{{meta.icon}}"></div>
                            <div class="col title">{{meta.title}}</div>
                        </div>
                        <div class="col col-2">
                            <div class="col kpi-chart {{name}}"></div>
                        </div>
                        <div class="col col-3">
                            <div class="col unit">{{meta.title}}&nbsp;</div>
                            <div class="col dollars actual-dollars"><span class="dollar-sign">$</span>{{isBlank summaryData.cost}}</div>
                            <div class="col saved">Actual Cost</div>
                            <div class="col border"></div>
                            <div class="col dollars potential-dollars"><span class="dollar-sign">$</span>{{isBlank summaryData.cost_xeros}}</div>
                            <div class="col saved">Potential Cost</div>
                            <div class="col percent">{{isBlank summaryData.savings}}%</div>
                            <div class="col info icon-Info"></div>
                        </div>
                    </div>
                    {{/data}}
                </script>
            </div> <!-- kpis -->

                <div class="news">
                    <h1>News</h1>
                            <a href="/news-and-press" class="view-all">View all</a>
                            <article>
                                <h3>In the News</h3>
                                <p>Eco-conscious cleaning with polymer beads, Physics Today Jan 8, 2014
                                    http://is.gd/pfgZ8S &nbsp;… <br><a
                                        href="http://www.xeroscleaning.com/in-the-news-3/" class="read-more-link">Read
                                        more</a></p>
                                <img width="73" height="100"
                                     src="http://www.xeroscleaning.com/wp-content/uploads/2013/10/web-logo1.jpg"
                                     class="attachment-thumb-home-news wp-post-image" alt="web logo" title="web logo">
                            </article>
                            <article>
                                <h3>UK Company Providing Breakthrough in Laundering Joins Sustainable Apparel
                                    Coalition</h3>
                                <p>November 11, 2013 A UK company delivering revolutionary clothes laundering technology
                                    has… <br><a
                                        href="http://www.xeroscleaning.com/uk-company-providing-breakthrough-in-laundering-joins-sustainable-apparel-coalition/"
                                        class="read-more-link">Read more</a></p>
                                <img width="100" height="100"
                                     src="http://www.xeroscleaning.com/wp-content/uploads/2013/11/SAC-Logo-100x100.jpg"
                                     class="attachment-thumb-home-news wp-post-image" alt="SAC Logo" title="SAC Logo">
                            </article>
                            <article>
                                <h3>In the News</h3>
                                <p>Forbes 10/16/2013 Xeros Greens The Business of Laundry
                                    http://www.forbes.com/sites/heatherclancy/2013/10/16/xeros-greens-the-business-of-laundry/
                                    Green Lodging News… <br><a href="http://www.xeroscleaning.com/in-the-news-2/"
                                                               class="read-more-link">Read more</a></p>
                                <img width="73" height="100"
                                     src="http://www.xeroscleaning.com/wp-content/uploads/2013/10/web-logo.jpg"
                                     class="attachment-thumb-home-news wp-post-image" alt="web logo" title="web logo">
                            </article>
                </div><!-- news -->
        </div>
    </div>

<!--    <a href="#" class="btn btn-primary download-pdf">Download PDF</a>-->
<!---->
<!--    <canvas id="drawingArea"></canvas>-->
</div>
<script>
    var reports = [
        {
            rid : 2,
            apiUrl : '/api/report/news/123/321.json',
            template : "news",
            callback : "newsCallback"
        }
    ];

</script>
<script src="/sites/all/themes/xeros_theme/lib/kalendae/kalendae.standalone.js" type="text/javascript" charset="utf-8"></script>
<script>
    var apiUrlBase = '/api/report/kpis/{{fromDate}}/{{toDate}}.json';
    var dateRange = 'last30days';




//    var closeButton = k.util.make('a', {'class': classes.closeButton}, self.containter);
//    k.addEvent(closeButton, 'click', function () {
//        this.addClass("hide");
//    });

</script>

<!-- loading spinner -->
<script src="/sites/all/themes/xeros_theme/js/spin.min.js"></script>
<!--<script src="/sites/all/themes/xeros_theme/js/scripts.js"></script>-->

<!-- Page controls -->

<script src="/sites/all/themes/xeros_theme/js/controls.js"></script>

<!-- jsPDF scripts in development mode -->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/jspdf.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/libs/FileSaver.js/FileSaver.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/libs/Blob.js/Blob.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/libs/Blob.js/BlobBuilder.js"></script>-->
<!---->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/libs/Deflate/deflate.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/libs/Deflate/adler32cs.js"></script>-->
<!---->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/jspdf.plugin.addimage.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/jspdf.plugin.from_html.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/jspdf.plugin.ie_below_9_shim.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/jspdf.plugin.sillysvgrenderer.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/jspdf.plugin.split_text_to_size.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF/jspdf.plugin.standard_fonts_metrics.js"></script>-->


<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/jspdf.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/libs/FileSaver.js/FileSaver.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/libs/Blob.js/Blob.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/libs/Blob.js/BlobBuilder.js"></script>-->
<!---->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/libs/Deflate/deflate.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/libs/Deflate/adler32cs.js"></script>-->
<!---->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/jspdf.plugin.addimage.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/jspdf.plugin.from_html.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/jspdf.plugin.ie_below_9_shim.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/jspdf.plugin.sillysvgrenderer.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/jspdf.plugin.split_text_to_size.js"></script>-->
<!--<script src="/sites/all/themes/xeros_theme/lib/jsPDF-png/jspdf.plugin.standard_fonts_metrics.js"></script>-->

<!-- Canvg for converting SVG to Canvas to PNG -->

<script src="/sites/all/themes/xeros_theme/lib/canvg-1.3/rgbcolor.js"></script>
<script src="/sites/all/themes/xeros_theme/lib/canvg-1.3/StackBlur.js"></script>
<script src="/sites/all/themes/xeros_theme/lib/canvg-1.3/canvg.js"></script>

<script src="/sites/all/themes/xeros_theme/lib/innersvg/innersvg.js"></script>
<!-- D3 -->

<script src="/sites/all/themes/xeros_theme/js/d3.min.js"></script>

<script src="/sites/all/themes/xeros_theme/js/app.js"></script>

<script src="/sites/all/themes/xeros_theme/js/chart.js" ></script>
<!--<script src="/sites/all/themes/xeros_theme/js/exportPDF.js"></script>-->

<script src="/sites/all/themes/xeros_theme/js/KpisView.js" ></script>
