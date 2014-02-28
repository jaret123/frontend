/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    // In this function we re-organize the data feed if need be and do some summary calcs
    parseData : function(draw) {
        self = this;

        var reportLabels = {
            "cold_water": [
                "Gallons",
                "Load Size",
                "Gallons Per Pound",
                "Cost Per Pound",
                "Water Reduction",
                "Cost Reduction"
            ],
            "hot_water": [
                "Gallons",
                "Load Size",
                "Gallons Per Pound",
                "Cost Per Pound",
                "Water Reduction",
                "Cost Reduction"
            ],
            "total_water": [
                "Gallons",
                "Load Size",
                "Gallons Per Pound",
                "Cost Per Pound",
                "Water Reduction",
                "Cost Reduction"
            ],
            "cycle_time": [
                "Total Cycle Time",
                "Load Size",
                "Labor Cost",
                "Cost Per Pound",
                "Cycle Time Reduction",
                "Cost Reduction"
            ],
            "chemical": [
                "Total Ounces",
                "Load Size",
                "Ounces Per Pound",
                "Cost Per Pound",
                "Chemical Reduction",
                "Cost Reduction"
            ]
    };

        // TODO Change this to a concat of the three arrays we care about.
        app.reportData = app.data.data[app.machine].metrics[app.metric];
        app.reportData.labels = reportLabels[app.reportData.id];

        app.reportData.machine_name = app.data.data[app.machine].name;
        app.reportData.machine_id = app.data.data[app.machine].machine_id;
        app.reportData.serial_number = app.data.data[app.machine].serial_number;
        app.reportData.size = app.data.data[app.machine].size;

        for ( i in app.reportData.classifications ) {
            var d = app.reportData.classifications[i];
            for ( j in d.data ) {
                var d1 = d.data[j];
                app.reportData.classifications[i].data[j].delta_one = self.percentDelta(d1.value_three, d1.xeros_value_three);
                app.reportData.classifications[i].data[j].delta_two = self.valueDelta(d1.value_three, d1.xeros_value_three);
            }
        }
        draw();
    },
    percentDelta : function(a, b) {
        if ( b == 0 || typeof(b) == "undefined") {
            return 0
        } else {
            return parseInt( 100 * ( ( parseFloat(a) - parseFloat(b) ) / parseFloat(a) ), 10);
        }

    },
    valueDelta : function(a, b) {
        if ( typeof(a) == "undefined" || typeof(b) == "undefined" ) {
            return 0;
        } else {
            return ( parseFloat(a) - parseFloat(b) );
        }
    },
    initialize : function() {
        controls.createReportSelect();
        controls.createTimeSelect();
    }
}

view.initialize();