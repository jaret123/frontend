/**
 * Created by jason on 2/5/14.
 */
var colors = {
    blueOne : "rgba(0,135,190,1)",
    orange: "rgba(255,185,67,.65)",
    yellow : "rgba(255,185,67,1)",
    blueTwo : "rgba(0,135,190,.65)"
};

var view = {


    barColor : {
       xeros : {
           actual : colors.blueOne,
           model : colors.blueTwo,
           modelSimple : colors.blueTwo
       },
        nonXeros : {
            actual : colors.yellow,
            model : colors.orange
        }
    },
    // Each report view has a slightly different data structure
    parseData : function(draw) {
        var self = this;
        //app.reportData = app.data.data[app.machine].metrics[app.metric];

        app.reportData = app.data;

        self.getActionData(function(actionData) {

            for ( i in app.reportData) {

                var cssClass = [];

                var machineId = parseInt(app.reportData[i].info.machine_id, 10);

                var machineType = app.reportData[i].info.machine_type;

                app.reportData[i].water_only = parseInt(app.reportData[i].info.water_only, 10);


                /**
                 * This is the logic to pick the default comparison and to list what comparisons are available.
                 */
                app.reportData[i].delta = {
                    cold_water : {},
                    therms : {}
                }

                // Machine Type Xeros
                if (machineType == 'xeros') {
                    app.reportData[i].actual.barColor = self.barColor.xeros.actual;
                    cssClass.push("xeros");
                    cssClass.push("model-non-xeros");
                    cssClass.push("model-non-xeros-simple");
                    // Compare Xeros machine to non-xeros calculations
                    app.reportData[i].model = app.reportData[i].model_non_xeros_simple;
                    app.reportData[i].model.barColor = self.barColor.nonXeros.model;
                } else {
                    app.reportData[i].actual.barColor = self.barColor.nonXeros.actual;
                    cssClass.push("non-xeros");
                    // Comparison for Non Xeros machines
                    if (app.reportData[i].water_only == 1) {
                        cssClass.push("model-xeros");
                        cssClass.push("model-xeros-simple");
                        // If water only, then use the model_xeros_simple calculations
                        app.reportData[i].model = app.reportData[i].model_xeros_simple;
                        app.reportData[i].model.barColor = self.barColor.xeros.modelSimple;
                    } else {
                        // If we have cycle data, then use the full Xeros model that is based on classifications
                        app.reportData[i].model = app.reportData[i].model_xeros;
                        app.reportData[i].model.barColor = self.barColor.xeros.model;
                        cssClass.push("model-xeros");
                    }
                }

                if ( app.reportData[i].water_only === 1 ) {
                    cssClass.push("water-only");
                    app.reportData[i].cycles = 'water only';
                } else {

                }

                app.reportData[i].delta.cold_water = self.calculateDelta(app.reportData[i].actual.cold_water, app.reportData[i].model.cold_water, app.reportData[i].info.machine_type, 'gallons of water');

                app.reportData[i].delta.therms = self.calculateDelta(app.reportData[i].actual.therms, app.reportData[i].model.therms, app.reportData[i].info.machine_type, 'therms');

                app.reportData[i].info.cssClass = cssClass.join(" ");

                // Append the actionData
                app.reportData[i].actionData = actionData[machineId];
            }


            draw(); // This does the html template draw

            self.drawCharts();

            jQuery('.row:not(.first)').each(function() {
                var rowHeight = jQuery(this).height();


                var cols = jQuery(this).find('.col');
                cols.each(function() {
                    var colHeight = jQuery(this).height();
                    jQuery(this).css('margin-top', (rowHeight - colHeight) / 2 );
                });
            });

            self.bindEvents();
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
    updateLegend : function() {
        var self = this;

        var legendTemplate = Handlebars.compile(jQuery("#report-health .legend").html());
        var html = legendTemplate(view.barColor);
        jQuery('#report-health .legend').html(html).removeClass("fade");
    },
    calculateDelta : function(actual, model, machineType, metric) {

        var message = '';

        // percent difference
        var delta = 0;

        // absolute difference
        var diff = 0;

        if ( machineType == 'xeros') {
            numerator = parseInt(actual, 10);
            denominator = parseInt(model, 10);
        } else {
            numerator = parseInt(model, 10);
            denominator = parseInt(actual, 10);
        }


        // BUG - Divide by zero throws NaN

        // Divide by 0
        if ( denominator === 0 ) {
            if ( numerator === 0 ) {
                delta = 0;
            } else {
                delta = 100;
            }
        } else {
            delta = parseInt(((denominator - numerator) / denominator) * 100);
        }

        diff = parseInt(denominator - numerator);

        var cssClass = '';
        // TODO: Ron - double check this logic.
        if ( delta > 0 ) {
            cssClass = 'positive'
            if ( machineType == 'xeros') {
                message = 'Because you are using a Xeros machine you used ' + diff + ' less ' + metric;
            } else {
                message = 'If you were using a Xeros machine you would have used ' + diff + ' less ' + metric;
            }
        } else if ( delta < 0 ) {
            cssClass = 'negative'
            if ( machineType == 'xeros') {
                message = 'Because you are using a Xeros machine you used ' + diff + ' more ' + metric;
            } else {
                message = 'If you were using a Xeros machine you would have used ' + diff + ' more ' + metric;
            }
        } else {
            cssClass = 'equal'
            if ( machineType == 'xeros') {
                message = 'You used the same amount of ' + metric + ' in your Xeros machine as the industry average.';
            } else {
                message = 'You used the same amount of ' + metric + ' in your Non-Xeros machine as you would with a Xeros machine.';
            }
        }


        return {
            value : delta,
            cssClass : cssClass,
            message : message
        }
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

        // Calculate the domains
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

            if (row.info.machine_type == 'xeros') {

                chart.colors = [row.actual.barColor, row.model.barColor];
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

            } else {

                chart.colors = [row.actual.barColor, row.model.barColor];
                chart.classes = ["base", "non-xeros"];

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
        view.updateLegend();
    },
    bindEvents : function() {
        /*
        Controls for the Flipping action for Water Sewer and Therms
        @author Ron Kozlowski
         */
        jQuery( ".flipper-openbtn" ).click(function() {
            jQuery(this).parents('.flip-container').addClass("hover");
        });
        jQuery( ".flipper-closebtn" ).click(function() {
            jQuery(this).parents('.flip-container').removeClass("hover");
        });
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



