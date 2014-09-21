var FF = FF || {};

/**
 * FF - User
 *
 *
 * Created by jason on 9/21/14
 */
FF.User = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.init = init;
    pub.setReportCompany = setReportCompany;
    pub.setReportLocation = setReportLocation;
    pub.setReportDateRange = setReportDateRange;
    pub.setReportMetric = setReportMetric;

//    self.fromDate = self.sessionDateRange[0];
//    self.toDate = self.sessionDateRange[1];

    // These settings are set by the user and saved in cookies
    pub.reportSettings = {
        dateRange : '', // monthToDate||custom,fromdate,todate
        dates: ['', ''],
        timeSelect : 'monthToDate',
        company : {
            id: 0,
            title: ''
        },
        location : {
            id: 0,
            title: ''
        },
        metric : ''
    };

    // These settings are set in Drupal
    pub.location = {
        id: 0,
        title: 'No location assigned'
    };

    pub.company = {
        id: 0,
        title: 'No company assigned'
    };


    function setReportCompany(companyId, callback) {
        if ( typeof companyId == "number" ) {
            pub.reportSettings.company.id = companyId;
            pub.reportSettings.company.title = app.companies[companyId].name;
//            FF.Company.getCompany(companyId, function() {
//                pub.reportSettings.company.title = FF.Company.company.title;
//                saveCookie();
//                if (typeof callback == "function") {
//                    callback();
//                }
//            });
            saveCookie();
            if (typeof callback == "function") {
                callback();
            };
        } else {
            console.log('Invalid companyID passed to setReportCompany');
        }
    }
    function setReportLocation(locationId, callback) {
        if ( typeof locationId == "number" ) {
            pub.reportSettings.location.id = locationId;
            pub.reportSettings.location.title = app.companies[pub.reportSettings.company.id].location[locationId].name;
//            FF.Location.getLocation(locationId, function() {
//                pub.reportSettings.location.title = FF.Location.location.title;
//                saveCookie();
//                if ( typeof callback == "function") {
//                    callback();
//                }
//            });
            saveCookie();
            if ( typeof callback == "function") {
                callback();
            }
        } else {
            console.log('Invalid locationId passed to setReportLocation');
        }
    }

    /**
     *
     * custom,fromdate,todate
     * monthtoDate
     * weekly
     *
     * @param dateRange
     */
    function setReportDateRange(dateRange) {
        if ( typeof dateRange == 'string') {
            var dr = dateRange.split(",");
            var dateRange = [];
            pub.reportSettings.timeSelect = dr[0];
            // Custom Date Range
            if ( dr[0] === "custom" ) {
                dateRange[0] = dr[1];
                // If we only selected one value in the date range selector, then set the second param to the first
                if ( typeof(dr[2]) == "undefined" ) {
                    dateRange[1] = dr[1];
                } else {
                    dateRange[1] = dr[2];
                }
                // Time Select
            } else {
                dateRange = [ dr[1], dr[2] ];
            }
            pub.reportSettings.dates = dateRange;
            saveCookie();
        } else {
            console.log('Invalid dates passed to report date range', dateRange);
        }
    }
    function setReportMetric(metric) {
        if ( typeof metric == "string" ) {
            pub.reportSettings.metric = metric;
            saveCookie();
        } else {
            console.log('Invalid metric passed to metric.')
        }

    }

    function saveCookie() {
        if ( pub.reportSettings.dateRange.length > 0 ) {
            document.cookie = 'sessionDateRange=' + pub.reportSettings.dateRange.toString();
        }
        if ( pub.reportSettings.timeSelect !== '' ) {
            document.cookie = 'sessionTimeSelect=' + pub.reportSettings.timeSelect;
        }
        if ( pub.reportSettings.company.id !== 0 ) {
            document.cookie = 'sessionCompany=' + pub.reportSettings.company.id;
        }
        if ( pub.reportSettings.location.id !== 0 ) {
            document.cookie = 'sessionLocation=' + pub.reportSettings.location.id;
        }
        if ( pub.reportSettings.metric !== '' ) {
            document.cookie = 'sessionMetric=' + pub.reportSettings.metric;
        }
        if ( pub.reportSettings.dates[0] !== "" && pub.reportSettings.dates[1] !== "") {
            document.cookie = 'sessionDates=' + pub.reportSettings.dates.toString();
        }
    };

    function getCookie() {
        var c = document.cookie.split(";");
        for ( i in c ) {
            var kv = c[i].trim().split("=");
            if ( kv[0] == "sessionDateRange" ) {
                var daterange = kv[1].split(",");
                if (typeof daterange == "object") {
                    pub.reportSettings.dateRange = daterange;
                }
            }
            if (kv[0] == "sessionTimeSelect") {
                var timeSelect = kv[1];
                if ( typeof timeSelect == "string" && timeSelect.length > 0) {
                    pub.reportSettings.timeSelect = timeSelect;
                }
            }
            if (kv[0] == "sessionCompany") {
                var companyId = parseInt(kv[1], 10);
                if ( typeof companyId == "number") {
                    pub.reportSettings.company.id = companyId;
                }

            }
            if (kv[0] == "sessionLocation") {
                var locationId = parseInt(kv[1], 10)
                if ( typeof locationId == "number") {
                    pub.reportSettings.location.id = locationId;
                }
            }
            if (kv[0] == "sessionDates") {
                var dates = kv[1];
                if ( typeof dates == "string") {
                    pub.reportSettings.dates = dates.split(',');
                }
            }
        };
    };

    function init(callback) {
        // See if there is anything in the user's cookies
        getCookie();

        // If the settings in the cookies are blank, then load from the user's settings.
        if (pub.reportSettings.company.id == "" || typeof pub.reportSettings.company == "undefined") {
            pub.setReportCompany(pub.company.id);
        }
        if (pub.reportSettings.location.id == "" || typeof pub.reportSettings.location == "undefined" ) {
            pub.setReportLocation(pub.location.id);
        }
//
//        if (typeof(app.companies) !== 'undefined') {
//            controls.adminMenuControls();
//            controls.createCompanySelect();
//            //controls.createLocationSelect();
//        }
        callback();
    }

    return pub;
})(jQuery);

