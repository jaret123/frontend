// The main router of the report app

var app = {

    // TODO: Need to store the report filters in the session to handle page to page transitions
    apiUrl: "/api/report/consumptionDetails/2013-11-10/2013-12-20.json",
    machine: 1, // Initial machine when there is no hash
    metric: "cold_water", // Initial metric when there is no hash
    dateRange: "last_30_day", // Initial date range
    tpl: {}, // Our page template
    dataRefresh: 1,
    reportData: {},
    data: {}, // Any event that wants new data should flag dataRefresh to be 1
    machineMax: 5,

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


     //   } else if (hash_array[2] != window.dataRange)  {
     //       self.getData();

        } else {
            //alert('hash' );
            hash_array = hash.substr(1).split("+");
            self.machine = hash_array[0];
            self.metric = hash_array[1];
        }
        self.showReport();
        console.log(hash.substr(1).split("+"));
    },

    showReport: function () {
        var self = this;
        // Self data
        self.reportData = self.data.data[self.machine].metrics[self.metric];
        var html = self.tpl(self.reportData);
        jQuery('#page-container').html(html);
        controls.createMachineNav();
    },

//    // Navigation that needs to be bound after a report is rendered because the elements are in the client template
//    bindNavigation: function () {
//        var self=this;
//        // Machine navigation
//        jQuery("#machine").find(".caret-left-wrapper").click(function () {
//            if (self.machine > 1) {
//                self.machine = self.machine - 1;
//            }
//            window.location.hash = self.machine + "+" + self.metric + "+" + self.dateRange;
//        })
//
//        jQuery("#machine").find(".caret-right-wrapper").click(function () {
//            if (self.machine < self.machineMax) {
//                self.machine = parseInt(self.machine) + parseInt(1);
//            }
//            window.location.hash = self.machine + "+" + self.metric + "+" + self.dateRange;
//        })
//    },

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