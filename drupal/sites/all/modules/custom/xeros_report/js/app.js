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
        jQuery(window).on('hashchange', jQuery.proxy(this.route, this));

        /**
         * Listen for a change to user.js and if it changes update the hash
         */
        jQuery( document).on("user:change", function(event, data) {
            // Don't change if the company changes.  We want to wait for the location to change
            if ( !_.contains(data, 'company')) {
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
     * Read the hash and update the page based on the data in the hash
     */
    route: function (callback) {
        var self = this;

        var error = false;

        FF.Error.hide();

        var hash = window.location.hash;
        // hashArray =
        //  0 - Machine
        //  1 - Metric
        //  2 - Date Range (comma delimited)
        //  3 - Location ID
        var hashArray = hash.substr(1).split("+");

        // Remove any error messages from the page
        jQuery(app.err).removeClass("active");

        // If no hash
        if (!hash) {
            self.setApiUrl();
        // If there is a hash
        } else {
            /**
             *
             * Hash is #<machineid> + <metricname> + <custom,fromdate,todate||timeselect> + <locationId>
             */
            hashArray = hash.substr(1).split("+");
            if (hashArray.length > 1) {
                // Machine
                // TODO: Might move to User.reportSettings
                if ( hashArray[0].length > 0) {
                    app.machine = hashArray[0];
                } else {
                    // Throw error, now machines defined
                    error = true;
                    jQuery(app.err).addClass("active");
                    jQuery(app.err).html("<div>This location does not have any active machines.</div>");
                    return;
                }
                // Metric
                if ( hashArray[1].length > 0 ) {
                    FF.User.setReportMetric(hashArray[1]);
                }
                // Date Range
                // custom,fromdate,todate||timeselect
                if ( hashArray[2].length > 0 ) {
                    FF.User.setReportDateRange(hashArray[2]);
                }
                // Location Id
                if ( typeof(hashArray[3]) !== 'undefined' && hashArray[3].length > 0 )  {
                    var locationId = hashArray[3];
                    FF.User.setReportLocation(parseInt(locationId, 10));
                    FF.Location.getLocation(hashArray[3], function() {
                        self.routeCallback(callback);
                    });
                    return; // Break here because we just called the rest of this in a callback.
                }
            }
        }
        if ( !error ) {
            self.routeCallback(callback);
        }
    },
    routeCallback: function(callback) {

        app.fadeReport();
        // if dataRefresh equals 1, then go to the web service again and get new data

        // Test the location
        FF.Location.getLocation(FF.User.reportSettings.location.id);

        if ( FF.Location.machines.length == 0 ) {
            FF.Error.set("This location has no active machines.");
            return;
        }
        if ( FF.User.reportSettings.location.id !== '' && FF.User.reportSettings.company.id !== '' ) {
            if ( app.dataRefresh == 1 ) {
                app.setApiUrl();
                app.getData();
            } else {
                view.parseData(app.showReport);
            }
        } else {
            FF.Error.set("This user has not been assigned a company or a location.");
            return;
        }

        if (typeof(callback) === 'function') {
            callback();
        }
    },

    // This is going to be passed as a function to the view
    showReport: function () {
        FF.Controls.Spinner.hide();
        var html = app.tpl(app.reportData);
        jQuery('.template-container').html(html).removeClass("fade");
        FF.Controls.MachineNav.create();
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
        }
    },
    initialize: function () {
        var self = this;
        self.reportName = window.reportName;
        // Sometimes the summary data comes back empty when we don't have readings yet.

        self.tpl = Handlebars.compile(jQuery("#page-tpl").html());



        /**
         * Draw the report for the first time
         */
        FF.User.setReportLocation(FF.User.reportSettings.location.id);

        FF.Location.getLocation(FF.User.reportSettings.location.id, function() {
            // Do the things that get values from the template (window)
            self.apiUrlBase = window.apiUrlBase;
            self.route(function() {
                // After drawing the report for the first time register the listeners
                self.registerEvents();
            });
        });
    }
}
