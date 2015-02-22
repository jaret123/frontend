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
        // Register routing listener
        jQuery(window).on('hashchange', jQuery.proxy(this.route, this));
    },

    setApiUrl: function () {
        app.apiUrl = '/ws/' +
            app.reportName + '/' +
            FF.User.reportSettings.location.id + '/' +
            FF.User.reportSettings.dates[0] + '/' +
            FF.User.reportSettings.dates[1]
        ;
    },

    route: function () {
        var self = this;

        var error = false;

        jQuery(app.err).removeClass("active");

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
                    FF.Location.getLocation(hashArray[3], self.routeCallback);
                    return; // Break here because we just called the rest of this in a callback.
                }
            }
        }
        if ( !error ) {
            self.routeCallback();
        }
    },
    routeCallback: function() {

        // if dataRefresh equals 1, then go to the web service again and get new data

        // Test the location
        FF.Location.getLocation(FF.User.reportSettings.location.id);

        if ( FF.Location.machines.length == 0 ) {
            jQuery(app.err).addClass("active");
            jQuery(app.err).html("This location has no active machines.");
            return;
        }


        if ( FF.User.reportSettings.location.id !== '' && FF.User.reportSettings.company.id !== '' ) {
            if ( app.dataRefresh == 1 ) {
                app.setApiUrl();
                app.fadeReport();
                app.getData();
            } else {
                view.parseData(app.showReport);
            }
        } else {
            jQuery(app.err).addClass("active");
            jQuery(app.err).html("This user has not been assigned a company or a location.");
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
        jQuery('.template-container').addClass("fade");
        jQuery('#spinner').show();
    },

    getData: function () {
        var self = this;
        // Get the data then go to routing
        jQuery.ajax({
            url: self.apiUrl,
            dataType: 'json',
            success: function (data) {
                console.log("data retrieved: " + self.apiUrl);
                self.data = data;
                self.dataRefresh = 0;
                self.route();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Ajax Error: " + textStatus + " -- " + errorThrown + "--" + jqXHR);
                jQuery(app.err).addClass("active");
                jQuery(app.err).html("<div>Oops, something happened with the data service.  Please contact your system administrator.</div>");
            }
        })
    },
    /**
     * Listen for a change to user and update the hash when it changes
     */
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

        document.addEventListener('CustomEventUserChange', function () {
            // Don't change if the company changes.  We want to wait for the location to change
            if ( !_.contains(FF.User.changed, 'company')) {
                self.updateHash();
            }
        });

        FF.User.setReportLocation(FF.User.reportSettings.location.id);
        // Build the apiUrl
        FF.Location.getLocation(FF.User.reportSettings.location.id, function() {
            self.registerEvents();
            // Do the things that get values from the template (window)
            self.apiUrlBase = window.apiUrlBase;
            self.route();
        });
    }
}
