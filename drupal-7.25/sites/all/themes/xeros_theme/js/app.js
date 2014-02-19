// The main router of the report app

var app = {
    apiUrlBase: "",
    apiUrl: "",
    machine: 1, // Initial machine when there is no hash
    metric: "cold_water", // Initial metric when there is no hash
    tpl: {}, // Our page template
    dataRefresh: 1,
    reportData: {},
    data: {}, // Any event that wants new data should flag dataRefresh to be 1
    machineMax: 2, //TODO: This needs to be made dynamic

    date : new Date(), // The current date
    sessionDateRange : [], // The apps current date range
    sessionTimeSelect : "",
    sessionMetric : "cold_water",
    dateRange : ["", ""], // SQL formatted date ranges "2013-11-01", "2013-12-02"
    dateRanges : {
        last30days : this.dateRange,
        previousMonth : this.dateRange,
        previousYear : this.dateRange,
        last6months : this.dateRange,
        yearToDate : this.dateRange,
        lastYearToDate : this.dateRange,
        custom : this.dateRange
    }, // Available date ranges
    sqlDate : function(d) {
        // date needs to be a native js date object (new Date())
        var sqlDate = "";
        sqlDate = "" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        return sqlDate;
    },
    createDateRanges : function() {
        self = this;

        var today = new Date(),
            year = today.getFullYear(),
            month = today.getMonth(),
            day = today.getDate();

        var fromDate = new Date();
        var toDate = new Date();

        // last 30 days
        console.log(self);
        fromDate.setDate(self.date.getDate() - 30);
        toDate.setDate(self.date.getDate());
        self.dateRanges.last30days = [
            self.sqlDate(fromDate),
            self.sqlDate(toDate)
        ];

        // last month
        fromDate = new Date();
        toDate = new Date();

        // First day of last month
        fromDate.setMonth(self.date.getMonth() - 1);
        fromDate.setDate(1);

        // First day of this month - one day = last day of last month
        toDate.setMonth(self.date.getMonth());
        toDate.setDate(1-1);
        // Last day of last month
        self.dateRanges.previousMonth = [
            self.sqlDate(fromDate),
            self.sqlDate(toDate)
        ];

        // Last 6 months

        fromDate = new Date();
        toDate = new Date();

        fromDate.setMonth(self.date.getMonth() - 7);
        fromDate.setDate(1);

        toDate.setMonth(self.date.getMonth())
        toDate.setDate(1-1);
        // Last day of last month
        self.dateRanges.last6months = [
            self.sqlDate(fromDate),
            self.sqlDate(toDate)
        ];

        // Year to date

        fromDate = new Date();
        toDate = new Date();

        fromDate.setMonth(0);
        fromDate.setDate(1);

        // Do nothing to toDate;
        self.dateRanges.yearToDate = [
            self.sqlDate(fromDate),
            self.sqlDate(toDate)
        ];

        // Previous year

        fromDate = new Date();
        toDate = new Date();

        fromDate.setYear(self.date.getFullYear() - 1);
        fromDate.setMonth(0);
        fromDate.setDate(1);

        //toDate.setYear(self.date.getYear() - 1);
        toDate.setMonth(0);
        toDate.setDate(0);

        // Do nothing to toDate;
        self.dateRanges.previousYear = [
            self.sqlDate(fromDate),
            self.sqlDate(toDate)
        ];


        // Last Year To Date

        fromDate = new Date();
        toDate = new Date();

        fromDate.setYear(self.date.getFullYear() - 1);
        fromDate.setMonth(0);
        fromDate.setDate(1);

        toDate.setYear(self.date.getFullYear() - 1);
        //toDate.setMonth(0);
        //toDate.setDate(0);

        // Do nothing to toDate;
        self.dateRanges.lastYearToDate = [
            self.sqlDate(fromDate),
            self.sqlDate(toDate)
        ];
    },
    saveCookie : function() {
        self = this;
        document.cookie = "sessionDateRange=" + self.sessionDateRange;
        document.cookie = "sessionMetric=" + self.sessionMetric;
        document.cookie = "sessionTimeSelect=" + self.sessionTimeSelect;
    },
    getCookie : function() {
        self = this;
        var c = document.cookie.split(";");
        for ( i in c ) {
            var kv = c[i].trim().split("=");
            if ( kv[0] == "sessionDateRange" ) {
                self.sessionDateRange = kv[1].split(",");
            }
            if (kv[0] == "sessionMetric") {
                self.sessionMetric = kv[1];
            }
            if (kv[0] == "sessionTimeSelect") {
                self.sessionTimeSelect = kv[1];
            }
            console.log(kv);
        };
        console.log(c);
    },
    registerEvents: function () {
        var self = this;
        // Register routing listener
        jQuery(window).on('hashchange', jQuery.proxy(this.route, this));
    },
    setApiUrl: function () {
        self = this;
        self.apiUrl = self.apiUrlBase.replace("{{fromDate}}", self.sessionDateRange[0]);
        self.apiUrl = self.apiUrl.replace("{{toDate}}", self.sessionDateRange[1]);
    },
    route: function () {
        var self = this;
        var hash = window.location.hash;
        var hashArray = hash.substr(1).split("+");
        //var data = [];
        // If no hash - set data to defaults
        if (!hash) {

        } else {
            //alert('hash' );
            hashArray = hash.substr(1).split("+");
            if (hashArray.length > 1) {
                self.machine = hashArray[0];
                if ( hashArray[1].length > 1 ) {
                    self.metric = hashArray[1];
                    self.sessionMetric = hashArray[1];
                }
                if ( hashArray[2].length > 1 ) {
                    // If this is a custom date range, then we take the date range out of the URL and store
                    // sessionTimeSelect as custom
                    if ( hashArray[2].substr(0,6) === "custom" ) {
                        var dr = hashArray[2].split(",");
                        self.sessionDateRange = [ dr[1], dr[2] ];
                        self.sessionTimeSelect = dr[0];
                        console.log(dr);
                    } else {
                        self.sessionDateRange = self.dateRanges[hashArray[2]];
                        self.sessionTimeSelect = hashArray[2];
                    }

                }
            }
        }
        // This is a little funky, but we are going to let the view inherit our showReport method - sort of
        self.saveCookie();
        // if dataRefresh equals 1, then go to the web service again and get new data
        if ( app.dataRefresh == 1 ) {
            self.setApiUrl();
            //controls.showSpinner();
            app.fadeReport();
            app.getData();
        } else {
            view.parseData(self.showReport);
            //console.log(hash.substr(1).split("+"));
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
                console.log("data retrieved");
                console.log(app.apiUrl);
                console.log(data);
                self.data = data;
                self.dataRefresh = 0;
                //self.showReport();
                self.route();
            }
        })
    },

    initialize: function () {
        var self = this;

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
            };
        });

        Handlebars.registerHelper("isBlank", function(value) {
            if ( typeof(value) === "undefined" )  {
                return 0
            } else {
                return value;
            };
        });

        Handlebars.registerHelper("toLocaleString", function(value) {
            if ( typeof(value) === "undefined" )  {
                return 0
            } else {
                return parseInt(value, 10).toLocaleString();
            };
        })

        controls.showSpinner();
        //self.hideReport();
        // Do the things that have no dependencies
        self.createDateRanges();
        self.tpl = Handlebars.compile(jQuery("#page-tpl").html());
        self.registerEvents();

        // Do the things that get values from the template (window)
        self.apiUrlBase = window.apiUrlBase;
        // Initialize the date ranges for the report
        self.sessionDateRange = self.dateRanges[window.dateRange];

        // If there is a cookie set, override the default settings
        self.getCookie();

        // Build the apiUrl

        self.setApiUrl();
        self.getData();


        //self.sessionDateRange = this.dateRanges.last30days;
        //self.sessionMetric = "hot_water";
        //self.saveCookie();

    }
}

app.initialize();