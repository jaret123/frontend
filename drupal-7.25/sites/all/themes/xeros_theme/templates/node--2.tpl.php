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
                <div class="kpis__select select">
                    <span>
                        <span>Timeframe</span>
                        <select id="time-select" autofocus class="flagvisibility">
                            <option value="last30days">Last 30 days</option>
                            <option value="previousMonth">Previous Month</option>
                            <option value="last6months" selected>Last 6 Months</option>
                            <option value="yearToDate">Year to Date</option>
                            <option value="previousYear">Last Year</option>
                            <option value="custom">Custom...</option>
                        </select>
                    </span>
                </div>

                <div class="template-container">
                    <div id="spinner"></div>
                </div>
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
                            <div class="col dollars actual-dollars"><span class="dollar-sign">$</span>{{summaryData.cost}}</div>
                            <div class="col saved">Actual Cost</div>
                            <div class="col border"></div>
                            <div class="col dollars potential-dollars"><span class="dollar-sign">$</span>{{summaryData.cost_xeros}}</div>
                            <div class="col saved">Potential Cost</div>
                            <div class="col percent">{{summaryData.savings}}%</div>
                            <div class="col info icon-Info"></div>
                        </div>
                    </div>
                    {{/data}}
                </script>
            </div> <!-- kpis -->

            <div id="news" class="news">...</div> <!-- news -->
        </div>
    </div>
</div>
<script src="/sites/all/themes/xeros_theme/js/scripts.js"></script>
<script>
    var reports = [
        {
            rid : 1,
            apiUrl : '/api/report/kpis/2013-12-01/2013-12-07.json',
            template : "kpis",
            callback : "kpiCallback"
        },
        {
            rid : 2,
            apiUrl : '/api/report/news/123/321.json',
            template : "news",
            callback : "newsCallback"
        }
    ];

    function kpiCallback(data) {
        for ( row in data.data ) {
            chart.data = data.data[row];
            chart.drawKPI();
        }
        createDropDown("#kpi-select");
        console.log(data.data);

    }
    jQuery(document).ready(function () {
        console.log("ready!");

        // Load the templates for each report on the page
        for (var i = 0; i < reports.length; i++) {
            var r = reports[i];
            loadTemplate(r.template, r.apiUrl, window[r.callback])
        }

    });


</script>

<script>
    var apiUrlBase = '/api/report/kpis/{{fromDate}}/{{toDate}}.json';
    var dateRange = 'last6months';
</script>


<script src="/sites/all/themes/xeros_theme/js/spin.min.js"></script>
<script src="/sites/all/themes/xeros_theme/js/scripts.js"></script>
<script src="/sites/all/themes/xeros_theme/js/controls.js"></script>
<script src="/sites/all/themes/xeros_theme/js/app.js"></script>
<script src="/sites/all/themes/xeros_theme/js/d3.min.js"></script>
<script src="/sites/all/themes/xeros_theme/js/chart.js" ></script>
<script src="/sites/all/themes/xeros_theme/js/KpisView.js" ></script>