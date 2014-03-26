/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    parseData : function(draw) {
        var self = this;
        //app.reportData = app.data.data[app.machine].metrics[app.metric];


        var ar;
        ar = [
            {
                name : 'Summary',
                meta : {
                    cssClass : "overall",
                    icon : "Globe",
                    label : "Overall Expense",
                    title : "Total Savings"
                },
                summaryData: {
                    'cost': 0,
                    'cost_xeros': 0,
                    'value': 0,
                    'value_xeros': 0
                },
                chartData : [],
                total : [1, 2, 3]
            },
            {
                name : 'cold-water',
                meta : {
                    cssClass : "gallons",
                    icon : "Drop",
                    label : "Gallons",
                    title : "Cold Water"
                },
                summaryData: {},
                chartData : []
            },
            {
                name : 'hot-water',
                meta : {
                    cssClass : "efficiency",
                    icon : "Thermometer",
                    label : "Efficiency",
                    title : "Hot Water"
                },
                summaryData: {},
                chartData : []
            },
            {
                name : 'chemical',
                meta : {
                    cssClass : "chemicals",
                    icon : "Atom",
                    label : "Chemical Strength",
                    title : "Usage"
                },
                summaryData: {},
                chartData : []
            }

        ];

        app.reportData = ar;

        for ( var m in app.data.data ) {
            var mi = parseInt(m);
            app.reportData[mi + 1].summaryData = app.data.data[mi].summaryData;
            app.reportData[mi + 1].chartData = app.data.data[mi].chartData;
        }

        var sums = app.reportData[0].total;

        // For each of the values in the summary.total add them.
        for (var i in sums ) {

            var ij = sums[i];
            if ( self.isValidSummaryData(app.reportData[ij].summaryData) ) {
                app.reportData[0].summaryData.cost += parseInt(app.reportData[ij].summaryData.cost, 10) ;
                app.reportData[0].summaryData.cost_xeros += parseInt(app.reportData[ij].summaryData.cost_xeros, 10);
                app.reportData[0].summaryData.value += parseInt(app.reportData[ij].summaryData.value, 10) ;
                app.reportData[0].summaryData.value_xeros += parseInt(app.reportData[ij].summaryData.value_xeros, 10) ;

                var l = app.reportData[ij].chartData.length,
                    d = 0;

                for (d; d < l; d++ ) {
                    if ( i == 0 ) {
                        app.reportData[0].chartData[d] = {
                            cost: 0,
                            cost_xeros: 0,
                            date : '',
                            value: 0,
                            value_xeros: 0
                        };
                    }
                    var x = app.reportData[ij].chartData[d];
                    app.reportData[0].chartData[d].cost += self.pInt(x.cost);
                    app.reportData[0].chartData[d].cost_xeros += self.pInt(x.cost_xeros);
                    app.reportData[0].chartData[d].value += self.pInt(x.value);
                    app.reportData[0].chartData[d].value_xeros += self.pInt(x.value_xeros);
                    app.reportData[0].chartData[d]["date"] = x["date"];

                }

            }
        }
        for ( i in app.reportData ) {
            s = app.reportData[i].summaryData;
            app.reportData[i].summaryData.savings = self.delta(s.cost, s.cost_xeros);
        }

        draw(); // This does the html template draw
        self.drawCharts();
        self.bindNav();
        //exportPDF.init();
    },
    pInt : function(value) {

        if ( value == "" ) {
            return 0;
        } else {
            return parseInt(value, 10);
        }
    },
    delta : function(base, change) { // TODO: Move to a utility library
        var delta = 0;

        if ( base == 0) {
            delta = 0;
        } else {
            delta = parseInt(((parseInt(base, 10) - parseInt(change, 10)) / parseInt(base, 10)) * 100);
        }
        return delta;
    },
    isValidSummaryData : function( summaryData ) {
       isValid = true;

        if ( typeof(summaryData.cost) === "undefined" ||
             typeof(summaryData.cost_xeros) === "undefined" ||
             typeof(summaryData.value) === "undefined" ||
             typeof(summaryData.value_xeros) === "undefined" ) {
            isValid = false;
            return isValid;
        }

        return isValid;
    },
    isValid : function(arr) {
        // Test the chart data array
        var isValid = true;

        if ( arr.length === 0 ) {
            isValid = false;
            return isValid;
        }

        return isValid;
    },
    drawCharts : function() {
        var self = this;
        chart.data = [];
        for ( i in app.reportData ) {
            chart.data = app.reportData[i];
            if (self.isValid(chart.data.chartData)) {
                chart.drawKPI();
            } else {
                jQuery(".kpi-chart." + app.reportData[i].name).html("No readings");
            }
        }
    },
    showNews: function() {
      var self = this;

    },
    initialize : function() {
        // Do any initialization unique to this view.
        app.initialize();
        controls.createTimeSelect();
        controls.createExport();

        if (app.sessionCompany == "") {
            app.sessionCompany = app.user.field_company['und'][0].target_id;
        }
        if (app.sessionLocation == "") {
            app.sessionLocation = app.user.field_location['und'][0].target_id;
        }

        if (typeof(app.companies) !== 'undefined') {
            controls.adminMenuControls();
            controls.createCompanySelect();
            //controls.createLocationSelect();
        }

        // Demo of the alerts functionality;
//        var alertDelay = 1000;
//        window.setTimeout(
//            function() {
//                jQuery(".alerts").delay(alertDelay).toggleClass("alerts__active");
//            },
//            2000);
//        jQuery(".alerts").click(function() {
//            jQuery(this).toggleClass("alerts__active");
//        });
    },
    bindNav : function() {
        // Bind any navigation that is on an item in a template.
    }
}

// Initialize
view.initialize();