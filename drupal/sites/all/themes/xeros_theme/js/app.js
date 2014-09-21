// The main router of the report app

var app = {

    defaults : {
        timeSelect : "monthToDate"
    },
    apiUrlBase: "",
    apiUrl: "",
    machine: 0, // Initial machine when there is no hash
    metric: "", // Initial metric when there is no hash
    tpl: {}, // Our page template
    dataRefresh: 1,
    reportData: {},
    data: {}, // Any event that wants new data should flag dataRefresh to be 1

    date : new Date(), // The current date
    dateRange : ["", ""], // SQL formatted date ranges "2013-11-01", "2013-12-02"
    dateRanges : {
        weekToDate : ["", ""],
        monthToDate : ["", ""],
        yearToDate : ["", ""],
        custom : ["", ""]
    }, // Available date ranges
    location : "",
    sessionDateRange : [], // The apps current date range
    sessionTimeSelect : "",
    sessionMetric : "",
    sessionCompany : "",
    sessionLocation : "",
    err : jQuery(".error-messages"),

    sqlDate : function(d) {
        // date needs to be a native js date object (new Date())
        var sqlDate = "";
        sqlDate = "" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        return sqlDate;
    },

    createDateRanges : function() {
        self = this;
        console.log("app.createDateRanges");
        var fromDate = new Date();
        var toDate = new Date();

        // Year to date
        fromDate.setMonth(0);
        fromDate.setDate(1);
        app.dateRanges.yearToDate = [
            app.sqlDate(fromDate),
            app.sqlDate(toDate)
        ];
        console.log(app.dateRanges.yearToDate);
        // Month to date
        fromDate = new Date();
        fromDate.setDate(1);
        app.dateRanges.monthToDate = [
            app.sqlDate(fromDate),
            app.sqlDate(toDate)
        ]

        // Week to date
        fromDate = new Date();
        fromDate.setDate(toDate.getDate() - toDate.getDay());
        app.dateRanges.weekToDate = [
            app.sqlDate(fromDate),
            app.sqlDate(toDate)
        ]
    },

    registerEvents: function () {
        var self = this;
        // Register routing listener
        jQuery(window).on('hashchange', jQuery.proxy(this.route, this));
    },

    setApiUrl: function () {
        var fromDate,
            toDate;
        if (FF.User.reportSettings.timeSelect == "custom") {
                fromDate = FF.User.reportSettings.dates[0];
                toDate = FF.User.reportSettings.dates[1];
        } else {
            fromDate = app.dateRanges[FF.User.reportSettings.timeSelect][0];
            toDate = app.dateRanges[FF.User.reportSettings.timeSelect][1];
        }
        app.apiUrl = '/api/report/' +
            app.reportName + '/' +
            fromDate + '/' +
            toDate + '/' +
            FF.User.reportSettings.location.id + '.json'
        ;
    },

    route: function () {
        var self = this;
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

            // If there is no value in the session, then use the app default.
            if ( FF.User.reportSettings.dateRange.length === 0 ) {
                FF.User.setReportDateRange(self.defaults.timeSelect + ',' + self.dateRanges[self.defaults.timeSelect].toString());
            }
            // Build the apiUrl
            self.setApiUrl();
        // If there is a hash
        } else {
            /**
             *
             * Hash is #<machineid>+<metricname>+<custom,fromdate,todate||timeselect>+<locationId>
             */
            hashArray = hash.substr(1).split("+");
            if (hashArray.length > 1) {
//              FF.User.setReportCompany(hashArray[0]);
                app.machine = hashArray[0];
                // Metric
                if ( hashArray[1].length > 1 ) {
                    FF.User.setReportMetric(hashArray[1]);
                }
                // Date Range
                // fromdate,todate,custom||timeselect
                if ( hashArray[2].length > 1 ) {
                    FF.User.setReportDateRange(hashArray[2]);
                }
                // Location Id
                if ( typeof(hashArray[3]) !== 'undefined' && hashArray[3].length > 1 )  {
                    var locationId = hashArray[3];
                    FF.User.setReportLocation(parseInt(locationId, 10));
                    FF.Location.getLocation(hashArray[3], self.routeCallback);
                    return; // Break here because we just called the rest of this in a callback.
                }
            }
        }
        self.routeCallback();
    },
    routeCallback: function() {
        console.log(FF.Location.machineTypes(), FF.Location.location.nid, FF.Location.location.title);
        controls.setCsvLink();
        controls.setDateRangeDisplay();

        // if dataRefresh equals 1, then go to the web service again and get new data
        if ( app.dataRefresh == 1 ) {
            app.setApiUrl();
            app.fadeReport();
            app.getData();
        } else {
            view.parseData(app.showReport);
        }
    },

    // This is going to be passed as a function to the view
    showReport: function () {
        controls.hideSpinner();
        var html = app.tpl(app.reportData);
        jQuery('.template-container').html(html).removeClass("fade");
        controls.createMachineNav();
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
                jQuery(app.err).html("Oops, something happened with the data service.  Please contact your system administrator.");
            }
        })
    },
    numberWithCommas: function (x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    },
    initialize: function () {
        var self = this;

        self.reportName = window.reportName;
        // Sometimes the summary data comes back empty when we don't have readings yet.

        Handlebars.registerHelper("formatMoney", function(value, decPlaces, thouSeparator, decSeparator) {
            if ( typeof(value) === "undefined" )  {
                return 0
            } else {
                var n = value,
                decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 0 : decPlaces,
                decSeparator = decSeparator == undefined ? "." : decSeparator,
                thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
                sign = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
                return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
            }
        });

        Handlebars.registerHelper("isBlank", function(value) {
            if ( typeof(value) === "undefined" )  {
                return 0
            } else {
                return value;
            }
        });

        Handlebars.registerHelper("toLocaleString", function(value, dec) {
            if ( typeof(value) === "undefined" )  {
                return 0
            } else {
                var d = parseInt(dec);
                if ( typeof(d) !== "number" ) {
                    dec = 0;
                }
                var t = parseFloat(value);
                t = t.toFixed(dec);
                //t = parseFloat(t);
                t = app.numberWithCommas(t);
                return t;
            }
        });

        Handlebars.registerHelper("waterOnly", function(water_only) {
            return ( water_only === "1" || water_only === 1 );
        });


        self.tpl = Handlebars.compile(jQuery("#page-tpl").html());

        self.createDateRanges();
        self.registerEvents();
        // Do the things that get values from the template (window)
        self.apiUrlBase = window.apiUrlBase;


        controls.initialize();
        self.route();

    }
}
