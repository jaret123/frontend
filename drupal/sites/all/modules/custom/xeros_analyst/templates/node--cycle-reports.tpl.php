<div id="report-dashboard" class="main page">
    <div class="page-container">
        <div class="container">

            <?php print theme('block_date_range', array()); ?>
            <?php print theme('block_location_picker', array()); ?>

            <script id="report-list-template" type="text/x-handlebars-template">
                <div class="reports__grid-container">
                    <div class="row first">
                        {{#each data}}
                        <div class="report-block col">
                            <h3>{{title}}</h3>
                            <h5>Filter Unknowns</h5>
                            <select id="unknown_select_{{@index}}" autofocus="" class="flagvisibility">
                                <option value="0">All Cycles</option>
                                <option value="1">No Unknowns</option>
                                <option value="2">Only Unknowns</option>
                            </select>
                            {{#if exceptionFilter}}
                            <h5>Filter By Exception Type</h5>
                            <select id="exception_select_{{@index}}" autofocus="" class="flagvisibility">
                                <option value="-1">All Cycles</option>
                                <option value="0">No Exceptions</option>
                                <option value="-2">All Exceptions</option>
                                <option value="10">Cold Water Exceptions</option>
                                <option value="20">Hot Cold Exceptions</option>
                                <option value="30">Runtime Exceptions</option>
                                <option value="40">Low Water Exceptions</option>
                                <option value="50">High Water Exceptions</option>
                                <option value="60">All Water Exceptions</option>
                                <option value="100">Unprocessed Cycles</option>
                            </select>
                            {{/if}}
                            {{#if checkbox}}
                            <br/>
                            <input type="checkbox" id="manufacturer_checkbox" {{checkedIf
                            this.manufacturerBool}}>Manufacturer Values
                            <br/>
                            {{/if}}
                            <div>
                                <a href="../xsvc/rs/report/query?{{reportTypeQuery reportType}}company={{company}}&fromDate={{from_date}}&toDate={{to_date}}&exception={{exception}}&unknown={{unknown}}&manufacturer={{manufacturer}}">By
                                    Company</a></div>
                            <div>
                                <a href="../xsvc/rs/report/query?{{reportTypeQuery reportType}}location={{location}}&fromDate={{from_date}}&toDate={{to_date}}&exception={{exception}}&unknown={{unknown}}&manufacturer={{manufacturer}}">By
                                    Location</a></div>
                            <div class="machine-block">
                                <div class="machine-list-open">Machines<i class="fa fa-chevron-down"></i></div>
                                <div class="machine-output">
                                    {{#each ../machines}}
                                    <div>
                                        <a href="../xsvc/rs/report/query?{{reportTypeQuery ../reportType}}machine={{id}}&fromDate={{../from_date}}&toDate={{../to_date}}&exception={{../exception}}&unknown={{../unknown}}&manufacturer={{../manufacturer}}">{{name}}
                                            - {{serial}}</a></div>
                                    {{/each}}
                                </div>
                            </div>
                        </div>
                        {{/each}}
                    </div>
                    <div class="row row-2">
                        <div class="connectivity-block col first">
                            <h3>Connectivity Reports</h3>

                            <div><a href="../xsvc/rs/status_gaps?fromDate={{getFromDate}}&toDate={{getToDate}}">Offline
                                    Report (with Dates)</a></div>
                            <div><a href="../xsvc/rs/status_gaps">Offline
                                    Report (All Time)</a></div>
                            <div><a href="../xsvc/rs/last_log">Last Log Report</a></div>
                        </div>
                    </div>
                </div>
            </script>
            <div class="row row-3">

                <div id="output" class="output-block col col-1 ">...</div>
            </div>
        </div>
        <script id="report-machine-list-template" type="text/x-handlebars-template">
        </script>
    </div>
</div>

<?php
$path = drupal_get_path('module', 'xeros_analyst');
drupal_add_js($path . '/js/analystView.js', array('scope' => 'footer', 'weight' => 5, 'preprocess' => FALSE));

?>