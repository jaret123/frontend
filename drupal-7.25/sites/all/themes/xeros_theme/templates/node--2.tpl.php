<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>
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
                <div class="download">
                    Download<a href="" id="download__csv">Excel</a><a href="" id="download__pdf">PDF</a>
                    <form id="download__pdf-form" action="/pdf/index.php" method="POST" enctype="multipart/form-data" target="_blank" style="display:none">
                        <textarea id="download__pdf-form-data" name="content">json string</textarea>
                    </form>
                </div>
                <div class="data-range">
                    Report Date Range <span class="date-range__from"></span> to <span class="date-range__to"></span>
                </div>
                <div class="template-container">

                </div>
                <div id="spinner"></div>
                <script id="page-tpl" type="text/x-handlebars-template">
                    {{#each this}}
                    <div class="kpis-{{meta.cssClass}} row">
                        <div class="col col-1">
                            <div class="icon icon-{{meta.icon}}"></div>
                            <div class="col title">{{meta.title}}</div>
                        </div>
                        <div class="col col-2">
                            <div class="col kpi-chart chart {{name}}" name="{{name}}"></div>
                        </div>
                        <div class="col col-3">
                            <div class="col unit">{{meta.title}}&nbsp;</div>
                            <div class="col dollars actual-dollars"><span class="dollar-sign">$</span>{{toLocaleString summaryData.cost}}</div>
                            <div class="col saved">Actual Cost</div>
                            <div class="col border"></div>
                            <div class="col dollars potential-dollars"><span class="dollar-sign">$</span>{{toLocaleString summaryData.cost_xeros}}</div>
                            <div class="col saved">Potential Cost</div>
                            <div class="col percent">{{toLocaleString summaryData.savings}}%</div>
                            <div class="col info icon-Info"></div>
                        </div>
                    </div>
                    {{/each}}
                </script>
            </div> <!-- kpis -->

            <div class="news">
                <?php print render(block_get_blocks_by_region('sidebar_first'));?>
            </div>
<!--                <div class="news">-->
<!--                    <h1>News</h1>-->
<!--                            <a href="/news-and-press" class="view-all">View all</a>-->
<!--                            <article>-->
<!--                                <h3>In the News</h3>-->
<!--                                <p>Eco-conscious cleaning with polymer beads, Physics Today Jan 8, 2014-->
<!--                                    http://is.gd/pfgZ8S &nbsp;… <br><a-->
<!--                                        href="http://www.xeroscleaning.com/in-the-news-3/" class="read-more-link">Read-->
<!--                                        more</a></p>-->
<!--                                <img width="73" height="100"-->
<!--                                     src="http://www.xeroscleaning.com/wp-content/uploads/2013/10/web-logo1.jpg"-->
<!--                                     class="attachment-thumb-home-news wp-post-image" alt="web logo" title="web logo">-->
<!--                            </article>-->
<!--                            <article>-->
<!--                                <h3>UK Company Providing Breakthrough in Laundering Joins Sustainable Apparel-->
<!--                                    Coalition</h3>-->
<!--                                <p>November 11, 2013 A UK company delivering revolutionary clothes laundering technology-->
<!--                                    has… <br><a-->
<!--                                        href="http://www.xeroscleaning.com/uk-company-providing-breakthrough-in-laundering-joins-sustainable-apparel-coalition/"-->
<!--                                        class="read-more-link">Read more</a></p>-->
<!--                                <img width="100" height="100"-->
<!--                                     src="http://www.xeroscleaning.com/wp-content/uploads/2013/11/SAC-Logo-100x100.jpg"-->
<!--                                     class="attachment-thumb-home-news wp-post-image" alt="SAC Logo" title="SAC Logo">-->
<!--                            </article>-->
<!--                            <article>-->
<!--                                <h3>In the News</h3>-->
<!--                                <p>Forbes 10/16/2013 Xeros Greens The Business of Laundry-->
<!--                                    http://www.forbes.com/sites/heatherclancy/2013/10/16/xeros-greens-the-business-of-laundry/-->
<!--                                    Green Lodging News… <br><a href="http://www.xeroscleaning.com/in-the-news-2/"-->
<!--                                                               class="read-more-link">Read more</a></p>-->
<!--                                <img width="73" height="100"-->
<!--                                     src="http://www.xeroscleaning.com/wp-content/uploads/2013/10/web-logo.jpg"-->
<!--                                     class="attachment-thumb-home-news wp-post-image" alt="web logo" title="web logo">-->
<!--                            </article>-->
<!--                </div><!-- news -->-->
        </div>
    </div>

<!--    <a href="#" class="btn btn-primary download-pdf">Download PDF</a>-->
<!---->
    <canvas id="drawingArea" style="display:none;"></canvas>
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
<script>
    var apiUrlBase = '/api/report/kpis/{{fromDate}}/{{toDate}}.json';
    var dateRange = 'last30days';

//    var closeButton = k.util.make('a', {'class': classes.closeButton}, self.containter);
//    k.addEvent(closeButton, 'click', function () {
//        this.addClass("hide");
//    });

</script>
<?php
    $path = drupal_get_path('theme', 'xeros_theme');
    drupal_add_js($path . '/js/KpisView.js', array('scope' => 'footer', 'weight' => 1, 'preprocess' => FALSE));
?>