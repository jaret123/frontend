<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>
<div id="page-3" class="main page">
    <div class="page-container">
        <div id="consumption-details">
            <div class="consumption-details-container">
                <div class="legend">
                    <span class="swatch current"></span>
                    <span class="label">Current Consumption</span>
                    <span class="swatch xeros"></span>
                    <span class="label">Potential Consumption with Xeros</span>
                </div>
                <div class="report__select select">
                    <span>
                        <span>Report</span>
                        <select id="report-select" autofocus class="flagvisibility">
                            <option value="cold_water">Cold Water</option>
                            <option value="hot_water">Hot Water</option>
                            <option value="total_water">Total Water</option>
                            <option value="cycle_time">Cycle Time</option>
                            <option value="chemical" selected>Chemical</option>
                        </select>
                    </span>
                </div>

                <div class="time__select select">
                <span>
                    <span>Timeframe</span>
            <select id="time-select" autofocus class="flagvisibility">
                <option value="last30days" selected>Last 30 days</option>
                <option value="previousMonth">Previous Month</option>
                <option value="last6months">Last 6 Months</option>
                <option value="yearToDate">Year to Date</option>
                <option value="lastYearToDate">Last Year</option>
                <option value="custom">Custom...</option>
            </select>
                    </span>
                </div>

                <div id="page-container" class="template-container">
                    <div id="spinner"></div>

                </div>
                    <script id="page-tpl" type="text/x-handlebars-template">

                        <div class="line"></div>
                        <div class="container">
                            <div id="machine" class="machine">
                                <div class="icon-Washer"></div>
                                {{this.name}}<br/>
                                {{this.machine_id}}
                                <div>
                                    <span class="caret-left-wrapper"> <span class="caret-left"></span> </span>
                                    &nbsp;
                                    <span class="caret-right-wrapper"> <span class="caret-right"></span> </span>
                                 </div>
                            </div>
                            {{#each classifications}}
                            <div id="section-{{id}}" class="section-wrapper {{id}}">
                                <div>

                                    <div class="row row-title {{id}}">
                                        <div class="title">
                                            {{name}}
                                        </div>
                                    </div>
                                    <div class="row row-data {{id}}">

                                        <div class="box col-1">
                                            <div class="top">
                                                <div class="label">{{data.0.value_one_label}}</div>
                                                <div class="value">{{data.0.value_one}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="label">&nbsp;</div>
                                                <div class="value">{{data.0.xeros_value_one}}</div>
                                            </div>
                                        </div>

                                        <div class="box col-2">
                                            <div class="top">
                                                <div class="label">{{data.0.value_two_label}}</div>
                                                <div class="value">{{data.0.value_two}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="label">&nbsp;</div>
                                                <div class="value">{{data.0.xeros_value_two}}</div>
                                            </div>
                                        </div>

                                        <div class="box col-3">
                                            <div class="top">
                                                <div class="label">{{data.0.value_three_label}}</div>
                                                <div class="value">{{data.0.value_three}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="label">&nbsp;</div>
                                                <div class="value">{{data.0.xeros_value_three}}</div>
                                            </div>
                                        </div>

                                        <div class="box col-4">
                                            <div class="top">
                                                <div class="label">{{data.0.value_four_label}}</div>
                                                <div class="value">{{data.0.value_four}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="label">&nbsp;</div>
                                                <div class="value">{{data.0.xeros_value_four}}</div>
                                            </div>
                                        </div>

                                        <div class="box col-5">
                                            <div class="blue top">
                                                <div class="label"></div>
                                                <div class="value"></div>
                                            </div>
                                            <div class="blue bottom">
                                                <div class="label"></div>
                                                <div class="left-arrow"><span class="caret-left"></span></div>
                                            </div>
                                        </div>
                                        <div class="box col-6">
                                            <div class="blue top">
                                                <div class="label">{{data.0.delta_one_label}}</div>
                                                <div class="value">{{data.0.delta_one}}%</div>
                                            </div>
                                            <div class="blue bottom">
                                                <div class="label">{{data.0.delta_two_label}}</div>
                                                <div class="value">{{data.0.delta_two}}</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            {{/each}}
                        </div>
                        </div>

                    </script>
            </div>
        </div>
    </div>
</div>

<script>
    var apiUrlBase = '/api/report/consumptionDetails/{{fromDate}}/{{toDate}}.json';
    var dateRange = 'last6months';
</script>
<script src="/sites/all/themes/xeros_theme/js/spin.min.js"></script>
<script src="/sites/all/themes/xeros_theme/js/scripts.js"></script>
<script src = "/sites/all/themes/xeros_theme/js/controls.js" ></script>
<script src = "/sites/all/themes/xeros_theme/js/app.js" ></script>
<script src = "/sites/all/themes/xeros_theme/js/ConsumptionDetailsView.js" ></script>
