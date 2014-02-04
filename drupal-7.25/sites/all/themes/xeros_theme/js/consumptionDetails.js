jQuery(document).ready(function () {
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


// TODO: Figure out the right time to update this global
var machine = 1,
    metric = "cold_water",
    dateRange = 'last_30_days',
    machineMax = 5; // TODO: Get this from the data set

createDropDown("#report-select", function (event) {

    window.metric = jQuery(event.target).find("span.value").html();

    window.location.hash = window.machine + "+" + window.metric + "+" + window.dateRange;

});
createDropDown("#time-select", function () {

    window.dateRange = jQuery(event.target).find("span.value").html();
    app.dataRefresh = 1;
    // Refresh data
    window.location.hash = window.machine + "+" + window.metric + "+" + window.dateRange;

    // Then in the callback, update the hash

    // Redraw report
    //window.location.hash = window.machine + "+" + window.metric + "+" + window.dateRange;


})


var app = {

    apiUrl: "/api/report/consumptionDetails/2013-11-10/2013-12-20.json",

    machine: 1, // Initial machine when there is no hash
    metric: "cold_water", // Initial metric when there is no hash
    dateRange: "last_30_day", // Initial date range
    tpl: {}, // Our page template
    dataRefresh: 1,
    reportData: {},
    data: {}, // Any event that wants new data should flag dataRefresh to be 1

    registerEvents: function () {
        var self = this;

        // Register routing listener
        jQuery(window).on('hashchange', jQuery.proxy(this.route, this));

    },

    route: function () {
        var self = this;
        var hash = window.location.hash;
        var hash_array = hash.substr(1).split("+");
        //var data = [];
        // If no hash - set data to defaults
        if (!hash) {


        } else if (hash_array[2] != window.dataRange)  {
            getData();

        } else {
            //alert('hash' );
            hash_array = hash.substr(1).split("+");
            self.machine = hash_array[0];
            self.metric = hash_array[1];
            window.machine = self.machine;
            window.metric = self.metric;
        }
        self.showReport();
        console.log(hash.substr(1).split("+"));
    },

    showReport: function () {
        var self = this;
        // Self data
        self.reportData = self.data.data[self.machine].metrics[self.metric];
        var html = self.tpl(reportData);
        jQuery('#page-container').html(html);
        self.bindNavigation();
    },

    // Navigation that needs to be bound after a report is rendered because the elements are in the client template
    bindNavigation: function () {
        // Machine navigation
        jQuery("#machine").find(".caret-left-wrapper").click(function () {
            if (window.machine > 1) {
                window.machine = window.machine - 1;
            }
            window.location.hash = window.machine + "+" + window.metric + "+" + window.dateRange;
        })

        jQuery("#machine").find(".caret-right-wrapper").click(function () {
            if (window.machine < window.machineMax) {
                window.machine = parseInt(window.machine) + parseInt(1);
            }
            window.location.hash = window.machine + "+" + window.metric + "+" + window.dateRange;
        })
    },

    getData: function () {
        var self = this;
        // Get the data then go to routing
        jQuery.ajax({
            url: this.apiUrl,
            dataType: 'json',
            success: function (data) {
                console.log("data retrieved");
                self.data = data;
                self.dataRefresh = 0;
                //self.showReport();
                self.route();
            }
        })
    },

    initialize: function () {
        var self = this;
        self.tpl = Handlebars.compile(jQuery("#page-tpl").html());
        console.log("template loaded");
        self.registerEvents();
        self.getData();
    }
}

app.initialize();