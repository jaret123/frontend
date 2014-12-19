<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>

<div id="report-health" class="main page">
    <div class="page-container">
        <div id="consumption">
            <div class="consumption-container">
              <div class="chart-header">

              <div class="legend">
                <div class="column">
                  <span class="swatch" style="background-color: {{nonXeros.actual}}"></span>
                  <span class="label">Non-Xeros - Actual Data</span><br/>
                  <span class="swatch" style="background-color: {{xeros.model}}"></span>
                  <span class="label">Xeros - Theoretical Data</span>
                </div>
                <div class="column">
                  <span class="swatch" style="background-color: {{nonXeros.model}}"></span>
                  <span class="label">Non-Xeros - Theoretical Data</span><br/>
                  <span class="swatch" style="background-color: {{xeros.actual}}"></span>
                  <span class="label">Xeros - Actual Data</span>
                </div>
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
              </div>

                <div class="consumption__grid-container">
                    <div class="row first">
                        <div class="col col-1">
                            <div class="label">Machine</div>
                        </div>
                        <div class="col col-2">
                            <div class="label">Water Sewer</div>
                            <div class="sub-label">(in gallons)</div>
                        </div>
                        <div class="col col-3">
                            <div class="label">Energy</div>
                            <div class="sub-label">(in therms)</div>
                        </div>
<!--                        <div class="col col-4">-->
<!--                            <div class="label">Cycle Time</div>-->
<!--                            <div class="sub-label">(Minutes)</div>-->
<!--                        </div>-->
<!--                        <div class="col col-5">-->
<!--                            <div class="label">Chemical</div>-->
<!--                            <div class="sub-label">(Ounces)</div>-->
<!--                        </div>-->
                      <div class="health-wrapper">
                        <div class="col col-4">
                          <div class="label">Health, Action/Update</div>
                          <!--<div class="label">Action/Update</div> -->
                        </div>
                      </div>
                    </div>

                    <div class="template-container">
                        <script id="page-tpl" type="text/x-handlebars-template">
                            {{#each this}}
                            <div class="row {{info.cssClass}} {{info.machine_type}} water-only-{{info.water_only}}" machineId={{id}}>
                                <div class="col col-1">
                                  <div class="col__wrapper">
                                    <span class="consumption__machine {{info.machine_name}}">
                                        <div class="icon-Washer">
                                          <div class="icon-washer-label {{digits info.cycles}}">
                                            {{#if info.water_only}}
                                            {{else}}
                                                {{info.cycles}}
                                            {{/if}}
                                            </div>
                                        </div>
                                        <div class="machine-label">
                                            {{info.machine_name}} <br/>
                                           <!-- {{info.manufacturer}} <br/> -->
                                            {{#if info.water_only}}
                                            <span>Water Only</span> <br/>
                                            {{else}}
                                            <!--<span>cycles: {{cycles}}</span> <br/>-->
                                            {{/if}}
                                            <span>({{info.size}}) </span><br/>
                                            <!-- Serial Number: {{serial_number}} -->
                                        </div>
                                        <div class="metric__message"></div>
                                    </span>
                                  </div>
                                </div>
                                <div class="col col-2 metric flip-container {{delta.cold_water.cssClass}}" classification="cold_water" machine="{{id}}" chart="cold_water-{{info.machine_id}}">
                                    <div class="flipper col__wrapper">
                                        <div class="front">
                                            <div class="flipper-navbar"><div id="flipperbtn" class="flipper-navbtn flipper-openbtn fa fa-question-circle" title="Click for more information"></div></div>
                                                <div class="flipper-frontcontainer">
                                                     <div class="chart" name="{{info.machine_id}}-cold_water"></div>
                                                     <div class="delta" data="{{delta.cold_water.value}}">{{formatDeltaValue delta.cold_water.value}}</div>
                                                     <div class="thumb"></div>
                                                     <div class="metric__message"></div>
                                                </div>
                                            </div>
                                        <div class="back">
                                            <div class="flipper-navbar"><div class="flipper-navbtn flipper-closebtn fa fa-close" title="Close"></div></div>
                                           <div class="flipper-backcontainer">
                                               {{delta.cold_water.message}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col col-3 metric flip-container {{delta.therms.cssClass}}" classification="hot_water" machine="{{id}}" chart="hot_water-{{info.machine_id}}">
                                  <div class="flipper col__wrapper">
                                        <div class="front">
                                              <div class="flipper-navbar"><div class="flipper-navbtn flipper-openbtn fa fa-question-circle" title="Click for more information"></div></div>
                                              <div class="flipper-container flipper-front-container">
                                                  <div class="chart" name="{{info.machine_id}}-hot_water"></div>
                                                  <div class="delta" data="{{delta.therms.value}}">{{formatDeltaValue delta.therms.value}}</div>
                                                  <div class="thumb"></div>
                                                 <div class="metric__message"></div>
                                             </div>
                                        </div>
                                      <div class="back">
                                          <div class="flipper-navbar"><div class="flipper-navbtn flipper-closebtn fa fa-close" title="Close"></div></div>
                                          <div class="flipper-backcontainer">{{delta.therms.message}}</div>
                                      </div>
                                  </div>
                                </div>
                                  <div class="col col-4 health">
                                    <div class="col__wrapper">
                                        <div class="status_data_icon">
                                      <div class="{{actionData.action_status.class}}">
                                      </div>
                                        </div>
                                        <div class="status_data">
                                      {{#if actionData.action_title.data}}
                                      <div><strong>{{actionData.action_created}}</strong><br/> {{actionData.action_title.data}}</div>
                                      {{/if}}
                                        </div>
                                    </div>
                                  </div>
                                  <!--<div class="col col-5 action">-->

                                  <!--</div>-->
                            </div>
                            {{/each}}
                        </script>
                    </div>
                    <div id="spinner"></div>
                </div>
            </div>
        </div>
    </div>
</div>

    <script>
        window.reportName = 'health-detail';
        window.dateRange = 'last30days';
    </script>
<?php
    $path = drupal_get_path('module', 'xeros_report');
    drupal_add_js($path . '/js/healthView.js', array('scope' => 'footer', 'weight' => 5, 'preprocess' => TRUE));


drupal_add_js('jQuery(document).ready(function () {
        view.initialize();
    });',
  array('type' => 'inline', 'scope' => 'footer', 'weight' => 15)
);
?>

