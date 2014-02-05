// The main router of the report app

var app = {

    // TODO: Need to store the report filters in the session to handle page to page transitions
    apiUrl: "",
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
        // This is a little funky, but we are going to let the view inherit our showReport method - sort of
        view.parseData(self.showReport);
        console.log(hash.substr(1).split("+"));
    },

    // This is going to be passed as a function to the view
    showReport: function () {
        var html = app.tpl(app.reportData);
        jQuery('.template-container').html(html);
        controls.createMachineNav();
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

    initialize: function (apiUrl) {
        var self = this;

        self.apiUrl = apiUrl;

        self.tpl = Handlebars.compile(jQuery("#page-tpl").html());
        console.log("template loaded");
        self.registerEvents();
        self.getData();
    }
}

app.initialize(window.apiUrl);