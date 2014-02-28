<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>

<div id="page-2" class="main page">
    <div class="page-container">
        <div id="consumption">
            <div class="consumption-container">
                <div class="legend">
                    <span class="swatch current"></span>
                    <span class="label">Current Consumption</span>
                    <span class="swatch xeros"></span>
                    <span class="label">Potential Consumption with Xeros</span>
                </div>
                <div class="kpis__select time__select">
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
                    Download<a href="" id="download__csv">Excel</a>
<!--                    <a href="" id="download__pdf">PDF</a>-->
                    <form id="download__pdf-form" action="/pdf/index.php" method="POST" enctype="multipart/form-data" target="_blank" style="display:none">
                        <textarea id="download__pdf-form-data" name="content">json string</textarea>
                    </form>
                </div>
                <div class="data-range">
                    Report Date Range <span class="date-range__from"></span> to <span class="date-range__to"></span>
                </div>


                <div class="consumption__grid-container">
                    <div class="row first">
                        <div class="col col-1">
                            <div class="label">Machine</div>
                        </div>
                        <div class="col col-2">
                            <div class="label">Cold Water</div>
                            <div class="sub-label">(Gallons)</div>
                        </div>
                        <div class="col col-3">
                            <div class="label">Hot Water</div>
                            <div class="sub-label">(Energy/Pound)</div>
                        </div>
                        <div class="col col-4">
                            <div class="label">Total Water</div>
                            <div class="sub-label">(Energy/Pound)</div>
                        </div>
                        <div class="col col-5">
                            <div class="label">Cycle Time</div>
                            <div class="sub-label">(Minutes)</div>
                        </div>
                        <div class="col col-6">
                            <div class="label">Chemical</div>
                            <div class="sub-label">(Ounces/Pound)</div>
                        </div>
                    </div>

                    <div class="template-container">
                        <script id="page-tpl" type="text/x-handlebars-template">
                            {{#data}}
                            <div class="row {{meta.cssClass}} {{machine_name}}" machineId={{id}}>
                                <div class="col col-1">
                                    <span class="consumption__machine {{machine_name}}">
                                        <div class="icon-Washer"></div>
                                        <div class="machine-label">{{machine_name}} <br/> ({{size}}) <br/> <span class="small">{{serial_number}}</span> </div>
                                        <div class="metric__message"></div>
                                    </span>
                                </div>
                                <div class="col col-2 link metric" classification="cold_water" machine="{{id}}"
                                     chart="cold_water-{{id}}">

                                    <div class="chart"></div>
                                    <div class="delta" data="{{cold_water_delta_value}}">{{cold_water_delta_value}}%
                                    </div>
                                    <div class="arrow {{cold-water-up-or-down}}"></div>
                                    <div class="metric__message"></div>
                                </div>

                                <div class="col col-3 link metric" classification="hot_water" machine="{{id}}"
                                     chart="hot_water-{{id}}">
                                    <div class="chart"></div>
                                    <div class="delta" data="{{hot_water_delta_value}}">{{hot_water_delta_value}}%</div>
                                    <div class="arrow {{hot-water-up-or-down}}"></div>
                                    <div class="metric__message"></div>
                                </div>
                                <div class="col col-4 link metric" classification="total_water" machine="{{id}}"
                                     chart="total_water-{{id}}">
                                    <div class="chart"></div>
                                    <div class="delta" data="{{total_water_delta_value}}">{{total_water_delta_value}}%
                                    </div>
                                    <div class="arrow {{total-water-up-or-down}}"></div>
                                    <div class="metric__message"></div>
                                </div>
                                <div class="col col-5 link metric" classification="cycle_time" machine="{{id}}"
                                     chart="cycle_time-{{id}}">
                                    <div class="chart"></div>
                                    <div class="delta" data="{{time_delta_value}}">{{time_delta_value}}%</div>
                                    <div class="arrow {{cold-water-up-or-down}}"></div>
                                    <div class="metric__message"></div>
                                </div>

                                <div class="col col-6 link metric" classification="chemical" machine="{{id}}"
                                     chart="chemical-{{id}}">
                                    <div class="chart"></div>
                                    <div class="delta" data="{{chemical_delta_value}}">{{chemical_delta_value}}%</div>
                                    <div class="arrow {{cold-water-up-or-down}}"></div>
                                    <div class="metric__message"></div>
                                </div>
                            </div>
                            {{/data}}
                        </script>
                    </div>
                    <div id="spinner"></div>
                </div>
            </div>
        </div>
    </div>
</div>

    <script>
        var apiUrlBase = '/api/report/consumption/{{fromDate}}/{{toDate}}.json';
        var dateRange = 'last30days';
    </script>
<?php
    $path = drupal_get_path('theme', 'xeros_theme');
    drupal_add_js($path . '/js/ConsumptionView.js', array('scope' => 'footer', 'weight' => 1, 'preprocess' => TRUE));
?>

