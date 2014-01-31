var app = {

    apiUrl: "/api/report/consumptionDetails/2013-11-10/2013-12-20.json",

    machine: "1",
    metric: "cold_water",
    tpl: {},

    registerEvents: function() {
        var self = this;

        // Register routing listener
        jQuery(window).on('hashchange', jQuery.proxy(this.route, this));

    },

    route: function() {
        var self = this;
        var hash = window.location.hash;
        var hash_array = [];
        //var data = [];
        // If no hash - set data to defaults
        if (!hash) {
            //alert('defaults');
            console.log(hash.substr(1).split("+"));
        } else {
            //alert('hash' );
            hash_array = hash.substr(1).split("+");
            self.machine = hash_array[0];
            self.metric = hash_array[1];
            window.machine = self.machine;
            window.metric = self.metric;
            self.showReport();
            console.log(hash.substr(1).split("+"));
        }
    },

    showReport: function() {
        var self = this;
        var reportData = {};
        // Load the template file from the directory
//        var filename = "/sites/all/themes/xeros_theme/ms-templates/consumption-details.html";

        reportData = self.data.data[self.machine].metrics[self.metric];
        console.log(reportData);


                var html = self.tpl(reportData);
                //var html = Mustache.to_html(template, data);
                jQuery('#page-container').html(html);
//                        if (typeof c != "undefined") {
//                            c(data);
//                        }


    },

    showHome: function() {
        alert('Hello');
    },

    getData: function() {
        var self = this;

        self.tpl = Handlebars.compile(jQuery("#page-tpl").html());
        // Get the data, merge the template, then callback
        jQuery.ajax({
            url: this.apiUrl,
            dataType: 'json',
            success: function (data) {
                self.data = data;
                self.showReport();
                self.registerEvents();
            }
        })
    },

    initialize: function() {
        var self = this;
        this.getData();

        //self.showHome();
    }
}


app.initialize();