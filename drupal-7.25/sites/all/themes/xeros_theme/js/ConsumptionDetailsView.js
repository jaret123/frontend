/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    // In this function we re-organize the data feed if need be and do some summary calcs
    parseData : function(draw) {
        self = this;

        var reportLabels = {
            "cold_water" : ["Water Reduction"],
            "hot_water" : ["Water Reduction"],
            "total_water" : ["Water Reduction"],
            "cycle_time" : ["Cycle Time Reduction"],
            "chemical" : ["Chemical Reduction"]
        };

        app.reportData = app.data.data[app.machine].metrics[app.metric];
        app.reportData.machine_name = app.data.data[app.machine].name;
        app.reportData.machine_id = app.data.data[app.machine].machine_id;
        app.reportData.serial_number = app.data.data[app.machine].serial_number;

        for ( i in app.reportData.classifications ) {
            var d = app.reportData.classifications[i];
            for ( j in d.data ) {
                var d1 = d.data[j];
                app.reportData.classifications[i].data[j].delta_one = self.percentDelta(d1.value_three, d1.xeros_value_three);
                app.reportData.classifications[i].data[j].delta_one_label = reportLabels[app.reportData.id];
                app.reportData.classifications[i].data[j].delta_two = self.valueDelta(d1.value_three, d1.xeros_value_three);
            }
        }
        draw();
    },
    percentDelta : function(a, b) {
        return parseInt( 100 * ( ( parseFloat(a) - parseFloat(b) ) / parseFloat(a) ), 10);
    },
    valueDelta : function(a, b) {
        return ( parseFloat(a) - parseFloat(b) );
    },
    initialize : function() {
        controls.createReportSelect();
        controls.createTimeSelect();
    }
}

view.initialize();