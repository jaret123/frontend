/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    parseData : function(draw) {
        var self = this;
        //app.reportData = app.data.data[app.machine].metrics[app.metric];

        app.reportData = app.data;

        self.getActionData(function(actionData) {

            for ( i in app.reportData) {
                var machineId = parseInt(app.reportData[i].info.machine_id, 10);

                 app.reportData[i].water_only = parseInt(app.reportData[i].info.water_only, 10);

                // TODO: Double check this logic is lined up correctly

                if ( app.reportData[i].water_only === 1 ) {
                    app.reportData[i].cycles = 'water only';
                    if (app.reportData[i].info.machine_type == 'xeros') {
                        app.reportData[i].model = app.reportData[i].model_non_xeros_simple;
                    } else {
                        app.reportData[i].model = app.reportData[i].model_xeros_simple;
                    }
                } else {
                    if (app.reportData[i].info.machine_type == 'xeros') {
                        app.reportData[i].model = app.reportData[i].model_xeros_simple;
                    } else {
                        app.reportData[i].model = app.reportData[i].model_xeros;
                    }
                }
                app.reportData[i].actionData = actionData[machineId];
            }


            draw(); // This does the html template draw

            self.drawCharts();
            self.bindNav();
        })
    },
    getActionData : function(callback) {
        // Get the action data
        jQuery.ajax({
            url: '/actions/json',
            dataType: 'json',
            success: function (data) {
                console.log("data retrieved: " + 'actions/json');
                // Append the data and finish this function
                if (typeof callback == "function") {
                    callback(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Ajax Error: " + textStatus + " -- " + errorThrown + "--" + jqXHR);
                jQuery(app.err).addClass("active");
                jQuery(app.err).html("Oops, something happened with the actions service.  Please contact your system administrator.");
            }
        });
    },
    isValid : function(arr) {
        var isValid = true;

        for ( i in arr ) {
            if ( isNaN(arr[i]) ) {
                isValid = false;
                return isValid;
                // Break out because the whole array is invalid if one value is
            }
        }
        return isValid;
    },
    drawCharts : function() {
        var self = this;
        var total = 0;

        // Get the max value of each metric for each machine so that the charts on the screen
        // are relative to each other

        // TODO: Refactor candidate

        var c = [],
            h = [],
            t = [],
            tm = [],
            ch = [],
            domainMultiple = 1.1; // Use this value to keep the values from maxing out

        for ( i in app.reportData ) {
            var row = app.reportData[i];

            c.push(parseInt(row.actual.cold_water));
            c.push(parseInt(row.model.cold_water));

            h.push(parseInt(row.actual.therms));
            h.push(parseInt(row.model.therms));

//            tm.push(parseInt(row.actual.time));
//            tm.push(parseInt(row.model.time));
//
//            ch.push(parseInt(row.actual.chemical));
//            ch.push(parseInt(row.model.chemical));
        }


        for ( i in app.reportData ) {
            var row = app.reportData[i];
            chart.data = [];
            chart.selector = "";
            chart.colors = ["#999", "#0086bd"];
            chart.classes = ["base", "xeros"];

            // Cold Water
            chart.selector = "[chart=cold_water-" + row.info.machine_id + "] .chart";
            chart.data = [parseInt(row.actual.cold_water), parseInt(row.model.cold_water), d3.max(c) * domainMultiple];
            if ( self.isValid(chart.data) ) {
                chart.drawBar();
            }

            // Hot Water
            chart.selector = "[chart=hot_water-" + row.info.machine_id + "] .chart";
            chart.data = [parseInt(row.actual.therms), parseInt(row.model.therms), d3.max(h) * domainMultiple];
            if ( self.isValid(chart.data) ) {
                chart.drawBar();
            }
        }


        jQuery(".metric").each(function() {
//            var d =  jQuery(this).find(".delta").attr("data");
//            // Hide charts with errors
//            if (typeof d == "undefined" || d == "" )
//            {
//                jQuery(this).find(".chart, .delta").hide();
//                jQuery(this).find(".metric__message").html("No Readings<br/> Found");
//                jQuery(this).removeClass("link");
//            } else { // Perform some other decorations
//                var d = parseInt(jQuery(this).find(".delta").attr("data"));
//                if ( d < 0 ) {
//                    jQuery(this).find(".arrow").addClass("up");
//                } else {
//                    jQuery(this).find(".arrow").addClass("down")
//                }
//            }

        });

    },
    initialize : function() {
        //createDropDown();
        app.initialize();
        FF.Controls.TimeSelect.create();
    },
    bindNav : function() {
//        jQuery('.water-only-0 .link').unbind().click(function (event) {
//            event.preventDefault();
//            var classification,
//                machine_id;
//
//            classification = jQuery(this).attr("classification");
//            machine_id = jQuery(this).attr("machine");
//            // TODO: Move to user settings
//            FF.User.setReportMetric(classification);
//
//            document.location.href = 'consumption-details#' + machine_id + "+" + FF.User.reportSettings.metric + "+" + FF.User.reportSettings.timeSelect + ',' + FF.User.reportSettings.dates.toString();
//        });
    }
}
