/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    parseData : function(callback) {
        var self = this;
        //app.reportData = app.data.data[app.machine].metrics[app.metric];
        app.reportData = app.data;
        callback();
        self.bindNav();
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