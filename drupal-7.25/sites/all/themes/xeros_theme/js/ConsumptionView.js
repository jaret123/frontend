/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    parseData : function(draw) {
        var self = this;
        //app.reportData = app.data.data[app.machine].metrics[app.metric];
        app.reportData = app.data;
        draw();
        self.drawCharts();
        self.bindNav();
    },
    drawCharts : function() {

        var total = 0;

        for ( i in app.data.data ) {
            var row = app.data.data[i];
            if ( row.time_value > total ) {
                total = row.time_value;
            };
            if ( row.time_xeros_value > total ) {
                total = row.time_xeros_value;
            }
        }

        // Just so that the largest circle is only 2/3's full
        total = total * 1.5;

        for ( i in app.data.data ) {
            var row = app.data.data[i];
            chart.data = [];
            chart.selector = "";
            chart.colors = ["#999", "#0086bd"];
            chart.classes = ["base", "xeros"];

            // Cold Water
            chart.selector = "[chart=cold_water-" + row.id + "] .chart";
            chart.data = [parseInt(row.cold_water_value), parseInt(row.cold_water_xeros_value)];
            chart.drawBar();

            // Hot Water
            chart.selector = "[chart=hot_water-" + row.id + "] .chart";
            chart.data = [parseInt(row.hot_water_value), parseInt(row.hot_water_xeros_value)];
            chart.drawBar();

            // Total Water
            chart.selector = "[chart=total_water-" + row.id + "] .chart";
            chart.data = [parseInt(row.total_water_value), parseInt(row.total_water_xeros_value)];
            chart.drawBar();

            // Cycle Time
            // TODO: Normalize per cycle?
            chart.selector = "[chart=cycle_time-" + row.id + "] .chart";
            chart.data = [parseInt(row.time_value), parseInt(row.time_xeros_value), total];
            chart.drawDonut();

            // Chemical
            chart.selector = "[chart=chemical-" + row.id + "] .chart";
            chart.data = [parseInt(row.chemical_value), parseInt(row.chemical_value)];
            chart.drawBar();

        }

        // Hide charts with errors
        jQuery(".metric").each(function() {
            var d =  jQuery(this).find(".delta").attr("data");
            if (typeof d == "undefined" || d == "" )
            {
                jQuery(this).find(".chart, .delta").hide();
                jQuery(this).find(".metric__message").html("No Readings<br/> Found");
                jQuery(this).removeClass("link");
            }
        });
        //        var data = [1000, 12];
//        var pct = "15%";
//        //var colors = ["#999", "#0086bd"];
    },
    initialize : function() {

    },
    bindNav : function() {
        jQuery('.consumption__machine, .link').click(function (event) {
            var classification = jQuery(this).attr("classification");
            var machine_id = jQuery(this).attr("machine");
            event.preventDefault();
            console.log(jQuery(this).attr("classification"));
            document.location.href = 'consumption-details#' + machine_id + "+" + classification;
        });
    }
}

// Initialize
view.initialize();