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
                            <option value="last30days" selected>Last 30 days</option>
                            <option value="previousMonth">Previous Month</option>
                            <option value="last6months">Last 6 Months</option>
                            <option value="yearToDate">Year to Date</option>
                            <option value="previousYear">Last Year</option>
<!--                            <option value="custom">Custom...</option>-->
                        </select>
                    </span>
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
    var dateRange = 'last6months';
</script>


<script src="/sites/all/themes/xeros_theme/js/spin.min.js"></script>
<script src="/sites/all/themes/xeros_theme/js/scripts.js"></script>
<script src="/sites/all/themes/xeros_theme/js/controls.js"></script>
<script src="/sites/all/themes/xeros_theme/js/app.js"></script>
<script src="/sites/all/themes/xeros_theme/js/d3.min.js"></script>
<script src="/sites/all/themes/xeros_theme/js/chart.js" ></script>
<script src="/sites/all/themes/xeros_theme/js/KpisView.js" ></script>