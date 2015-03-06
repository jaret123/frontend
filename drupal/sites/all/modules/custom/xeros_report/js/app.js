// The main router of the report app


var app = {

    apiUrlBase: "",
    apiUrl: "",
    machine: 0, // Initial machine when there is no hash

    tpl: {}, // Our page template
    dataRefresh: 1,
    reportData: {},
    data: {}, // Any event that wants new data should flag dataRefresh to be 1

    date : new Date(), // The current date

    err : jQuery(".error-messages"),

    registerEvents: function () {
        var self = this;

        /**
         * Listen to changes in the hash.  If the hash changes, then update the report
         */
        jQuery(window).on('hashchange', function() {
            app.readHash();
            app.route();
        });

        /**
         * Listen for a change to user.js and if it changes update the hash
         */
        jQuery(document).on("user:change", function(event, data, eventContext) {
            // Don't change if the company changes.  We want to wait for the location to change
            if ( eventContext == 'company:select' || eventContext == 'hash:refresh') {
                // Do nothing if we only updated the company or this was a hash:refresh in which case we don't want to loop.
            } else {
                self.updateHash();
            }
        })
    },

    setApiUrl: function () {
        app.apiUrl = '/ws/' +
            app.reportName + '/' +
            FF.User.reportSettings.location.id + '/' +
            FF.User.reportSettings.dates[0] + '/' +
            FF.User.reportSettings.dates[1]
        ;
    },

    /**
     * Read the hash
     */
    readHash: function(state) {

        if (typeof(state) === 'undefined') {
            state = 'refresh';
        }

        var hash = window.location.hash;

        var hashArray = hash.substr(1).split("+");

        /**
         * Parse the hash
         *
         * Hash is #<machineid> +
         *          <metricname> +
         *          <custom,fromdate,todate||timeselect> +
         *          <locationId>
         */
        if (hash.length == 0) {
            return;
        } else {
            var values = {};
            // Machine
            if ( typeof(hashArray[0] !== 'undefined') ) {
                app.machine = hashArray[0];
            } else {
                app.machine = 0;
            }
            // Metric
            if ( typeof(hashArray[1] !== 'undefined') ) {
                if (state == 'init') {
                    values.metric = hashArray[1];
                }
            }
            // Date Range
            // custom,fromdate,todate||timeselect
            if ( typeof(hashArray[2] !== 'undefined') ) {
                    values.dateRanges = hashArray[2];
            }
            // Location Id
            if ( typeof(hashArray[3]) !== 'undefined' )  {
                var locationId = hashArray[3];
                values.location = parseInt(locationId, 10);
            }
            if ( values !== {} ) {
                FF.User.setValues(values, 'hash:' + state);
            }
        }
    },

    /**
     * Read the hash and update the page based on the data in the hash
     */
    route: function (callback) {
        var self = this;

        var error = false;

        FF.Error.hide();

        // Test the location
        FF.Location.getLocation(FF.User.reportSettings.location.id, function() {
            if ( FF.Location.machines.length == 0 ) {
                FF.Error.set("app.route", "This location has no active machines.");
                FF.Controls.Spinner.hide();
            } else if ( FF.User.reportSettings.location.id == '' || FF.User.reportSettings.company.id == '' ) {
                FF.Error.set("app.route", "This user has not been assigned a company or a location.");
                FF.Controls.Spinner.hide();
            } else {
                if ( app.dataRefresh == 1 ) {
                    app.setApiUrl();
                    app.getData();
                } else {
                    view.parseData(app.showReport);
                }
            }
            if (typeof(callback) === 'function') {
                callback();
            }
        });
    },

    // This is going to be passed as a function to the view
    showReport: function () {
        FF.Controls.Spinner.hide();
        var html = app.tpl(app.reportData);
        jQuery('.template-container').html(html).removeClass("fade");
        //FF.Controls.MachineNav.create();
    },

    fadeReport: function () {
        FF.Controls.Spinner.show();
        jQuery('.template-container').addClass("fade");
    },

    getData: function () {
        var self = this;
        // Get the data then go to routing
        jQuery.ajax({
            url: self.apiUrl,
            dataType: 'json',
            success: function (data) {
                self.data = data;
                self.dataRefresh = 0;
                self.route();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                FF.Error.set('app.getData', 'Oops, something happened with the data service.  Please contact your system administrator.', errorThrown, true);
            }
        })
    },

    updateHash: function() {
        var hash = app.machine + "+" +
            FF.User.reportSettings.metric + "+" +
            FF.User.reportSettings.timeSelect + "," + FF.User.reportSettings.dates.toString() + "+" +
            FF.User.reportSettings.location.id;

        // If the newly created hash has changed, then update the hash
        // Protect us from an infinite loop.
        if (window.location.hash !== hash) {
            window.location.hash = hash;
            app.fadeReport();
        }
    },
    initialize: function () {
        var self = this;
        /**
         * Get the report name for using in the URL for the webservice
         */
        self.reportName = window.reportName;

        FF.Controls.Spinner.show();
        jQuery('.template-container').addClass("fade");

        /**
         * Load the template
         */
        self.tpl = Handlebars.compile(jQuery("#page-tpl").html());

        /**
         * Read the hash if there is one.  If there is a hash then we will override the user's settings
         * assuming that someone has sent the user a report to review.
         *
         * This will override the User settings if the initial URL has a hash.
         */
        self.readHash('init');

        /**
         * Draw the report for the first time
         */

        // Do the things that get values from the template (window)
        self.apiUrlBase = window.apiUrlBase;

        self.route(function() {
            // After drawing the report for the first time register the listeners
            self.registerEvents();
        });

    }
}
