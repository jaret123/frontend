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
                <div class="alerts"><div class="copy">Alerts</div></div>

                <?php
                $news_block = block_get_blocks_by_region('sidebar_first');
                print render($news_block);
                ?>
            </div>
        </div>
    </div>
    <canvas id="drawingArea" style="display:none;"></canvas>
</div>

<script>
    var apiUrlBase = '/api/report/kpis/{{fromDate}}/{{toDate}}.json';
    var dateRange = 'last30days';
</script>
<?php
    $path = drupal_get_path('theme', 'xeros_theme');
    drupal_add_js($path . '/js/KpisView.js', array('scope' => 'footer', 'weight' => 1, 'preprocess' => FALSE));
?>