/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    parseData : function(draw) {
        var self = this;
        //app.reportData = app.data.data[app.machine].metrics[app.metric];

        app.reportData = app.data;

        for ( i in app.reportData.data) {
            app.reportData.data[i].chemical_delta_value = self.delta(app.reportData.data[i].chemical_value, app.reportData.data[i].chemical_xeros_value);
            app.reportData.data[i].cold_water_delta_value = self.delta(app.reportData.data[i].cold_water_value, app.reportData.data[i].cold_water_xeros_value);
            app.reportData.data[i].hot_water_delta_value = self.delta(app.reportData.data[i].hot_water_value, app.reportData.data[i].hot_water_xeros_value);
            app.reportData.data[i].time_delta_value = self.delta(app.reportData.data[i].time_value, app.reportData.data[i].time_xeros_value);
            app.reportData.data[i].water_only = parseInt(app.reportData.data[i].water_only, 10);

            if ( app.reportData.data[i].water_only === 1 ) {
                app.reportData.data[i].cycles = 'water only';
            }
        }
        draw(); // This does the html template draw

        self.drawCharts();
        self.bindNav();
    },
    delta : function(base, change) {

        var delta = 0;
        // BUG - Divide by zero throws NaN

        if ( parseInt(base, 10)  === 0 ) {
            delta = ' - ';
        } else {
            delta = parseInt(((parseInt(base, 10) - parseInt(change, 10)) / parseInt(base, 10)) * 100);
        }
        return delta;
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

        for ( i in app.data.data ) {
            var row = app.data.data[i];

            c.push(parseInt(row.cold_water_value));
            c.push(parseInt(row.cold_water_xeros_value));

            h.push(parseInt(row.hot_water_value));
            h.push(parseInt(row.hot_water_xeros_value));

            tm.push(parseInt(row.time_value));
            tm.push(parseInt(row.time_xeros_value));

            ch.push(parseInt(row.chemical_value));
            ch.push(parseInt(row.chemical_xeros_value));
        }


        for ( i in app.data.data ) {
            var row = app.data.data[i];
            chart.data = [];
            chart.selector = "";
            chart.colors = ["#999", "#0086bd"];
            chart.classes = ["base", "xeros"];

            // Cold Water
            chart.selector = "[chart=cold_water-" + row.id + "] .chart";
            chart.data = [parseInt(row.cold_water_value), parseInt(row.cold_water_xeros_value), d3.max(c) * domainMultiple];
            if ( self.isValid(chart.data) ) {
                chart.drawBar();
            }

            // Hot Water
            chart.selector = "[chart=hot_water-" + row.id + "] .chart";
            chart.data = [parseInt(row.hot_water_value), parseInt(row.hot_water_xeros_value), d3.max(h) * domainMultiple];
            if ( self.isValid(chart.data) ) {
                chart.drawBar();
            }

            // Cycle Time
            // TODO: Normalize per cycle?
            chart.selector = "[chart=cycle_time-" + row.id + "] .chart";
            chart.data = [parseInt(row.time_value), parseInt(row.time_xeros_value), d3.max(tm) * domainMultiple];
            if ( self.isValid(chart.data) ) {
                chart.drawDonut();
            }

            // Chemical
            chart.selector = "[chart=chemical-" + row.id + "] .chart";
            chart.data = [parseInt(row.chemical_value), parseInt(row.chemical_xeros_value), d3.max(ch) * domainMultiple];
            if ( self.isValid(chart.data) ) {
                chart.drawBar();
            }
        }


        jQuery(".metric").each(function() {
            var d =  jQuery(this).find(".delta").attr("data");
            // Hide charts with errors
            if (typeof d == "undefined" || d == "" )
            {
                jQuery(this).find(".chart, .delta").hide();
                jQuery(this).find(".metric__message").html("No Readings<br/> Found");
                jQuery(this).removeClass("link");
            } else { // Perform some other decorations
                var d = parseInt(jQuery(this).find(".delta").attr("data"));
                if ( d < 0 ) {
                    jQuery(this).find(".arrow").addClass("up");
                } else {
                    jQuery(this).find(".arrow").addClass("down")
                }
            }

        });
        //        var data = [1000, 12];
//        var pct = "15%";
//        //var colors = ["#999", "#0086bd"];
    },
    initialize : function() {
        //createDropDown();
        app.initialize();
        controls.createTimeSelect();
        controls.createExport();

        if (app.sessionCompany == "") {
            app.sessionCompany = app.user.field_company['und'][0].target_id;
        }
        if (app.sessionLocation == "") {
            app.sessionLocation = app.user.field_location['und'][0].target_id;
        }

        if (typeof(app.companies) !== 'undefined') {
            controls.adminMenuControls();
            controls.createCompanySelect();
            //controls.createLocationSelect();
        }
    },
    bindNav : function() {
        jQuery('.water-only-0 .link').click(function (event) {
            event.preventDefault();
            var classification,
                machine_id,
                date_range;

            classification = jQuery(this).attr("classification");
            machine_id = jQuery(this).attr("machine");
            app.sessionMetric = classification;

            if ( app.sessionTimeSelect == "custom" ) {
                date_range = app.sessionTimeSelect + "," + app.sessionDateRange;
            } else {
                date_range = app.sessionTimeSelect;
            }
            app.saveCookie();
            document.location.href = 'consumption-details#' + machine_id + "+" + classification + "+" + date_range;
        });
    }
}

// Initialize
view.initialize();