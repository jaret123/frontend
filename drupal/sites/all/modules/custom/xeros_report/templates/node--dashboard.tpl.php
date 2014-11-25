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
                <div  class="dashboard-gear fa fa-gear"></div>
              <div class="chart-header">
<!-- TODO: Turn this into a handlebar template and switch it out based on the machine type -->

              <div class="legend">
              </div>
              <script id="legend-tpl" type="text/x-handlebars-template">
                {{#if xeros }}
                  <span class="swatch current actual"></span>
                  <span class="label">Current Consumption (Xeros)</span><br/>
                  <span class="swatch xeros model"></span>
                  <span class="label">Industry Average Consumption (Non Xeros)</span>
                {{else}}
                  <span class="swatch current"></span>
                  <span class="label">Current Consumption (Non Xeros)</span><br/>
                  <span class="swatch xeros model"></span>
                  <span class="label">Potential Consumption with Xeros</span>
                {{/if}}

              </script>
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
        <div class="lightbox lightbox-content">
            <div class="lightbox-header">Select Data to Compare <div class="lightbox-closebtn fa fa-close"></div></div>
            <div class="lightbox-body">
                <div id="selector1" class="compare_selectors">
                <span>Data Set One</span>
                <select id="time-select" autofocus class="">
                    <option value="xeros_actual">Xeros Actual</option>
                    <option value="non_zeros_actual">Non_Xeros Actual</option>
                    <option value="model_xeros_simple">Xeros Static Data</option>
                    <option value="model_non_s _actual">Non Xeros Static Data</option>
                </select>
                </div>
                <div id="selector1" class="compare_selectors">
                <span>Data Set Two</span>
                <select id="compare-select2" autofocus class="">
                    <option value="xeros_actual">Xeros Actual</option>
                    <option value="non_zeros_actual">Non_Xeros Actual</option>
                    <option value="model_xeros_simple">Xeros Static Data</option>
                    <option value="model_non_s_actual">Non Xeros Static Data</option>
                </select>
                </div>
            </div>
            <div class="lightbox-footer">
                <div id="compare">
                    <div class="compare__buttons">
                        <div id="compare-savebtn" class="compare__button compare__button-submit">Save</div>
                        <div id="compare-cancelbtn" class="compare__button compare__button-cancel">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="lightbox black_overlay"></div>
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

<script src="<?php print drupal_get_path('theme', 'xeros_theme'); ?>/data/news.js"></script>
