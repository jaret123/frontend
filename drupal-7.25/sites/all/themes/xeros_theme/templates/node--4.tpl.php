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
            <select id="consumption-details-select" autofocus class="flagvisibility">
                <option value="1">Last 30 days</option>
                <option value="2">Previous Month</option>
                <option value="3" selected>Last 6 Months</option>
                <option value="4">Year to Date</option>
                <option value="5">Last Year</option>
                <option value="6">Custom...</option>
            </select>
        </span>
                </div>

                <div id="page-container">
                    <div id="spinner"></div>
        <script id="page-tpl" type="text/x-handlebars-template">

                <div class="line"></div>
                <div class="container">
                    <div class="machine">
                        <div class="icon-Washer"></div>
                        {{this.name}}<br/>
                        {{this.machine_id}}
                        <div><span class="caret-left"></span><span class="caret-right"></span></div>
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
    <script src="/sites/all/themes/xeros_theme/js/spin.min.js"></script>
    <script>
        jQuery(document).ready(function() {
            var opts = {
                lines: 15, // The number of lines to draw
                length: 32, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 30, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 0.7, // Rounds per second
                trail: 93, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };
            var target = document.getElementById('spinner');
            var spinner = new Spinner(opts).spin(target);
        });
    </script>
    <script src="/sites/all/themes/xeros_theme/js/scripts.js"></script>
    <script>
        // TODO: Figure out the right time to update this global
        var machine = 1,
            metric = "cold_water";
        createDropDown("#consumption-details-select");
        createDropDown("#report-select", function () {
            var h = app.machine + "+" + "hot_water";
            window.location.hash = h;
            console.log("hash: " + h + "  app: " + app.machine);
            //console.log("Do Nothing");
        });

        function consumptionDetailsCallback(data) {
            createDropDown("#consumption-details-select");
            createDropDown("#report-select", function () {
                showSection();
                //console.log("Do Nothing");
            });

            jQuery("#report-select").on("change", function (event) {
                event.preventDefault();
                alert(jQuery(this).text());
            });
        }
    </script>
    <script src="/sites/all/themes/xeros_theme/js/consumptionDetails.js"></script>

