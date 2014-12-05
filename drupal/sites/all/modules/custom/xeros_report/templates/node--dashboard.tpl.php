<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>
<div id="report-dashboard" class="main page">

    <div class="page-container">
        <div class="container">
            <div class="kpis">
              <div class="chart-header">

              <div class="legend">
              </div>
              <script id="legend-tpl" type="text/x-handlebars-template">
                <div class="legend__wrapper {{cssClass}}"</div>
                  <span class="swatch current actual"></span>
                  <span class="label">{{lineA-key}}</span><br/>
                  <span class="swatch model"></span>
                  <span class="label">{{lineB-key}}</span>
              </script>
                <div  class="dashboard-gear" data-toggle="modal" data-target="#chart-options"><i class="fa fa-gear"></i>Select Data</div>

                <!-- End template -->
                  <div id="kpis__select" class="time__select kpis__select select">
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
  <!--                    Download<a href="" id="download__csv">Excel</a>-->
  <!--                    <a href="" id="download__pdf">PDF</a>-->
  <!--                    <form id="download__pdf-form" action="/pdf/index.php?r=kpi" method="POST" enctype="multipart/form-data" target="_blank" style="display:none">-->
  <!--                        <textarea id="download__pdf-form-data" name="content">json string</textarea>-->
  <!--                    </form>-->
                  </div>
                  <div class="data-range">
                      Report Date Range <span class="date-range__from"></span> to <span class="date-range__to"></span>
                  </div>
                </div>
                <div class="template-container">

                </div>
                <div id="spinner"></div>
                <script id="page-tpl" type="text/x-handlebars-template">
                    {{#each this}}
                    <div class="kpis-{{meta.cssClass}} {{labels.cssClass}} row">
                        <div class="col col-1">
                            <div class="icon icon-{{meta.icon}}"></div>
                            <div class="col title">{{meta.title}}</div>
                        </div>
                        <div class="col col-2">
                            <div class="col kpi-chart chart {{name}}" name="{{name}}"></div>
                        </div>
                        <div class="col col-3">
                          <div class="col dollars actual-dollars"><span class="dollar-sign">$</span>{{toLocaleString actual.summary.cost}}</div>
                          <div class="col saved">{{labels.lineB}}</div><!-- TODO: Put this in the array being passed in and change based on machine type -->
                          <div class="col border"></div>
                          <div class="col dollars potential-dollars"><span class="dollar-sign">$</span>{{toLocaleString model.summary.cost}}</div>
                          <div class="col saved">{{labels.lineA}}</div>
                          <div class="col border"></div>
                          <div class="col percent">{{toLocaleString actual.savings}}%</div>
                          <div class="col saved">{{labels.savings}}</div>
                        </div>
                    </div>
                    {{/each}}
                </script>
            </div> <!-- kpis -->

            <div class="news">
<!--                <div class="alerts"><div class="copy">Alerts</div></div>-->

                <?php
                $news_block = block_get_blocks_by_region('sidebar_first');
                print render($news_block);
                ?>
            </div>
          <div class="news__gradient"></div>
        </div>


  </div>

  <div class="modal fade" id="chart-options">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
          <h4 class="modal-title">Select Data to Compare</h4>
        </div>
        <div class="modal-body">
          <div id="dataset1-box">
            <label for="machineType">Do you want to look at Xeros or Non-Xeros machines?</label>
            <select id="machineType" class="chart-options__machine-type">
              <option value="">-select machine type-</option>
            </select>
          </div>
          <label for="model">What data do you want to compare to?</label>
          <select id="model" class="chart-options__model" autofocus="">
            <option value="">-select model-</option>
          </select>
        </div>
        <script id="machine-options-tpl" type="text/x-handlebars-template">
          <option value="0">-select-</option>
          {{#each data}}
          <option value="{{@key}}">{{this.name}}</option>
          {{/each}}
        </script>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary chart-options__save">Save changes</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
</div>
</div>

<script>
  // url of the webservice
    window.reportName = 'dashboard';
</script>
<?php
    $path = drupal_get_path('module', 'xeros_report');
    drupal_add_js($path . '/js/dashboardView.js', array('scope' => 'footer', 'weight' => 5, 'preprocess' => FALSE));

  drupal_add_js('jQuery(document).ready(function () {
          view.initialize();
      });',
    array('type' => 'inline', 'scope' => 'footer', 'weight' => 15)
  );

?>