/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    parseData : function(draw) {
        app.reportData = app.data.data[app.machine].metrics[app.metric];
        app.reportData.machine_name = app.data.data[app.machine].name;
        app.reportData.machine_id = app.data.data[app.machine].machine_id;
        app.reportData.serial_number = app.data.data[app.machine].serial_number;
        draw();
    },
    initialize : function() {

    }
}

view.initialize();