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
                            <option value="cold_water" selected>Cold Water</option>
                            <option value="hot_water">Hot Water</option>
                            <option value="total_water">Total Water</option>
                            <option value="cycle_time">Cycle Time</option>
                            <option value="chemical">Chemical</option>
                        </select>
                    </span>
                </div>

                <div class="time__select select">
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
                    <div id="cal">
                        <div class="cal__button">
                            <div class="cal__button-submit">Get Data</div>
                            <div class="cal__button-cancel">Cancel</div>
                        </div>
                    </div>
                </div>
                <div class="download">
                    Download<a href="" id="download__csv">Excel</a>
                    <!--                    <a href="" id="download__pdf">PDF</a>-->
                    <form id="download__pdf-form" action="/pdf/index.php" method="POST" enctype="multipart/form-data" target="_blank" style="display:none">
                        <textarea id="download__pdf-form-data" name="content">json string</textarea>
                    </form>
                </div>
                <div class="data-range">
                    Report Date Range <span class="date-range__from"></span> to <span class="date-range__to"></span>
                </div>


                <div id="page-container" class="template-container">

                </div>
                <div id="spinner"></div>
                    <script id="page-tpl" type="text/x-handlebars-template">

                        <div class="line"></div>
                        <div class="container">
                            <div id="machine" class="machine">
                                <div class="icon-Washer"></div>
                                {{this.machine_name}}<br/>
                                {{this.serial_number}}<br/>
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
                                                <div class="value">{{toLocaleString data.0.value_one}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="label">&nbsp;</div>
                                                <div class="value">{{toLocaleString data.0.xeros_value_one}}</div>
                                            </div>
                                        </div>

                                        <div class="box col-2">
                                            <div class="top">
                                                <div class="label">{{data.0.value_two_label}}</div>
                                                <div class="value">{{toLocaleString data.0.value_two}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="label">&nbsp;</div>
                                                <div class="value">{{toLocaleString data.0.xeros_value_two}}</div>
                                            </div>
                                        </div>

                                        <div class="box col-3">
                                            <div class="top">
                                                <div class="label">{{data.0.value_three_label}}</div>
                                                <div class="value">{{toLocaleString data.0.value_three}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="label">&nbsp;</div>
                                                <div class="value">{{toLocaleString data.0.xeros_value_three}}</div>
                                            </div>
                                        </div>

                                        <div class="box col-4">
                                            <div class="top">
                                                <div class="label">{{data.0.value_four_label}}</div>
                                                <div class="value">{{toLocaleString data.0.value_four}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="label">&nbsp;</div>
                                                <div class="value">{{toLocaleString data.0.xeros_value_four}}</div>
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
                                                <div class="value">{{toLocaleString data.0.delta_one}}% </div>
                                            </div>
                                            <div class="blue bottom">
                                                <div class="label">Cost Reduction</div>
                                                <div class="value">{{toLocaleString data.0.delta_two}} &nbsp;</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            {{else}}
                            <div id="" class="section-wrapper">
                                <div>

                                    <div class="row row-title">
                                        No Data for this machine
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
    var dateRange = 'last30days';
</script>
<?php
    $path = drupal_get_path('theme', 'xeros_theme');
    drupal_add_js($path . '/js/ConsumptionDetailsView.js', array('scope' => 'footer', 'weight' => 1, 'preprocess' => TRUE));
?>
