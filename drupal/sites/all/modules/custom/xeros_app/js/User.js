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
        dates: [], // From date and to date
        timeSelect : 'monthToDate', // Default
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

    // Create an event and dispatch it any time we successfully run a setter.
    // Create the event.
    var event = document.createEvent('Event');

    // Define that the event name.
    event.initEvent('CustomEventUserChange', true, true);

    function setReportCompany(companyId, callback) {
        if ( typeof companyId == "number" && companyId !== 0 ) {
            pub.reportSettings.company.id = companyId;
            pub.reportSettings.company.title = app.companies[companyId].name;
            document.cookie = 'sessionCompany=' + pub.reportSettings.company.id;
            updateFinish(callback);
        } else {
            console.log('Invalid companyID passed to setReportCompany');
        }
    }
    function setReportLocation(locationId, callback) {
        if ( typeof locationId == "number" && locationId !== 0 ) {
            pub.reportSettings.location.id = locationId;
            pub.reportSettings.location.title = app.companies[pub.reportSettings.company.id].location[locationId].name;
            document.cookie = 'sessionLocation=' + pub.reportSettings.location.id;
            updateFinish(callback);
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
    function setReportDateRange(dateRange, callback) {
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
                // Bug, app.dateRanges is not initialized at the beginning
                dateRange = FF.Controls.TimeSelect.dateRanges[dr[0]];
            }
            pub.reportSettings.dates = dateRange;
            // Save to cookies
            document.cookie = 'sessionTimeSelect=' + pub.reportSettings.timeSelect;
            document.cookie = 'sessionDates=' + pub.reportSettings.dates.toString();
            updateFinish(callback);
        } else {
            console.log('Invalid dates passed to report date range', dateRange);
        }
    }
    function setReportMetric(metric, callback) {
        if ( typeof metric == "string" ) {
            pub.reportSettings.metric = metric;
            document.cookie = 'sessionMetric=' + pub.reportSettings.metric;
            updateFinish(callback);
        } else {
            console.log('Invalid metric passed to metric.')
        }

    }

    function getCookie() {
        var c = document.cookie.split(";");
        for ( var i in c ) {
            var kv = c[i].trim().split("=");
            if ( kv[0] == "sessionDates" ) {
                var daterange = kv[1].split(",");
                if (typeof daterange == "object") {
                    pub.setReportDateRange(daterange);
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

            }
            if (kv[0] == "sessionLocation") {
                var locationId = parseInt(kv[1], 10)

            }

        };
        // Company ID needs to be set before locationId
        if ( typeof companyId == "number") {
            pub.setReportCompany(companyId);
            if ( typeof locationId == "number") {
                pub.setReportLocation(locationId);
            };
        };

    };

    function updateFinish(callback) {
        //saveCookie();
        console.log('Custom event dispatched');
        document.dispatchEvent(event);
        if ( typeof callback == "function") {
            callback();
        }
    };

    function init(callback) {
        // See if there is anything in the user's cookies
        getCookie();
        console.log(document.cookie);

        // If the settings in the cookies are blank, then load from the user's settings.
        if (pub.reportSettings.company.id == "" || typeof pub.reportSettings.company == "undefined") {
            pub.setReportCompany(pub.company.id);
        }
        if (pub.reportSettings.location.id == "" || typeof pub.reportSettings.location == "undefined" ) {
            pub.setReportLocation(pub.location.id);
        }
        // If the dates did not get updated by the cookies, then fire off an update based on defaults
        //debugger;
        if (pub.reportSettings.dates.length == 0) {

            pub.setReportDateRange(pub.reportSettings.timeSelect);
        }
        updateFinish(callback);

    }

    return pub;
})(jQuery);

