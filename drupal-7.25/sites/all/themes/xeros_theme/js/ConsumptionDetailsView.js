/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    parseData : function(callback) {
        app.reportData = app.data.data[app.machine].metrics[app.metric];
        callback();
    },
    initialize : function() {

    }
}

//view.initialize();