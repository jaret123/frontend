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
                          <option value="weekToDate">Week To Date</option>
                          <option value="monthToDate" selected>Month to Date</option>
                          <option value="yearToDate">Year to Date</option>
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
                    <a href="" id="download__pdf">PDF</a>
                    <form id="download__pdf-form" action="/pdf/index.php?r=consumption" method="POST" enctype="multipart/form-data" target="_blank" style="display:none">
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
                            <div class="sub-label">(Therms)</div>
                        </div>
                        <div class="col col-4">
                            <div class="label">Cycle Time</div>
                            <div class="sub-label">(Minutes)</div>
                        </div>
                        <div class="col col-5">
                            <div class="label">Chemical</div>
                            <div class="sub-label">(Ounces)</div>
                        </div>
                    </div>

                    <div class="template-container">
                        <script id="page-tpl" type="text/x-handlebars-template">
                            {{#data}}
                            <div class="row {{meta.cssClass}} {{manufacturer}} water-only-{{water_only}}" machineId={{id}}>
                                <div class="col col-1">
                                    <span class="consumption__machine {{machine_name}}">
                                        <div class="icon-Washer">
                                          <div class="icon-washer-label">
                                            {{cycles}}
                                            </div>
                                        </div>
                                        <div class="machine-label">
                                            {{machine_name}} <br/>
                                            {{manufacturer}} <br/>
                                            {{#if water_only}}
                                            <span>Water Only</span> <br/>
                                            {{else}}
                                            <!--<span>cycles: {{cycles}}</span> <br/>-->
                                            {{/if}}
                                            <span>({{size}}) </span><br/>
                                            <!-- Serial Number: {{serial_number}} -->
                                        </div>
                                        <div class="metric__message"></div>
                                    </span>
                                </div>
                                <div class="col col-2 link metric" classification="cold_water" machine="{{id}}"
                                     chart="cold_water-{{id}}">

                                    <div class="chart" name="{{id}}-cold_water"></div>
                                    <div class="delta" data="{{cold_water_delta_value}}">{{cold_water_delta_value}}%
                                    </div>
                                    <div class="arrow {{cold-water-up-or-down}}"></div>
                                    <div class="metric__message"></div>
                                </div>

                                <div class="col col-3 link metric" classification="hot_water" machine="{{id}}"
                                     chart="hot_water-{{id}}">
                                    <div class="chart" name="{{id}}-hot_water"></div>
                                    <div class="delta" data="{{hot_water_delta_value}}">{{hot_water_delta_value}}%</div>
                                    <div class="arrow {{hot-water-up-or-down}}"></div>
                                    <div class="metric__message"></div>
                                </div>

                              {{#if water_only}}
                            <div class="col col-4 metric">
                              <div>
                                Water<br/>Only<br/>&nbsp;
                              </div>
                            </div>
                                <div class="col col-5 metric">
                                  <div>
                                    Water<br/>Only<br/>&nbsp;
                                  </div>
                                </div>
                              {{else}}
                              <div class="col col-4 link metric" classification="cycle_time" machine="{{id}}"
                                   chart="cycle_time-{{id}}">
                                <div class="chart" name="{{id}}-cycle_time""></div>
                              <div class="delta" data="{{time_delta_value}}">{{time_delta_value}}%</div>
                              <div class="arrow {{cold-water-up-or-down}}"></div>
                              <div class="metric__message"></div>
                            </div>
                                <div class="col col-5 link metric" classification="chemical" machine="{{id}}"
                                     chart="chemical-{{id}}">
                                  <div class="chart" name="{{id}}-chemical""></div>
                                  <div class="delta" data="{{chemical_delta_value}}">{{chemical_delta_value}}%</div>
                                  <div class="arrow {{cold-water-up-or-down}}"></div>
                                  <div class="metric__message"></div>
                                </div>
                              {{/if}}
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
        window.reportName = 'consumption';
        window.dateRange = 'last30days';
    </script>
<?php
    $path = drupal_get_path('theme', 'xeros_theme');
    drupal_add_js($path . '/js/ConsumptionView.js', array('scope' => 'footer', 'weight' => 1, 'preprocess' => TRUE));


drupal_add_js('jQuery(document).ready(function () {
        view.initialize();
    });',
  array('type' => 'inline', 'scope' => 'footer', 'weight' => 15)
);
?>

