/**
 * Created by jason on 2/5/14.
 */
var view = {

    legendTpl : '',
    // Each report view has a slightly different data structure
    parseData : function(draw) {
        var self = this;
        //app.reportData = app.data.data[app.machine].metrics[app.metric];

        // Industry Averages per cycle
        var industryAverages = {
            avg_cold_water_volume: "121.64078133",
            avg_cold_water_cost: "1.20101627",
            avg_hot_water_volume: "51.41446880",
            avg_therms: "0.37381793",
            avg_therm_cost: "0.34448701",
            avg_chemical_strength: "17.38840517",
            avg_chemical_cost: "1.18185205"
        };

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
                total : [1, 2]
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
//            {
//                name : 'chemical',
//                meta : {
//                    cssClass : "chemicals",
//                    icon : "Atom",
//                    label : "Chemical Strength",
//                    title : "Usage"
//                },
//                summaryData: {},
//                chartData : []
//            }

        ];

        var labels = {
            'non-xeros' : {
                lineA : 'Actual Cost',
                lineB : 'Potential Cost',
                'lineA-key' : 'Current Consumption',
                'lineB-key' : 'Potential Consumption with Xeros',
                savings : 'Potential Savings',
                cssClass : 'non-xeros'
            },
            xeros : {
                lineA : 'Industry Avg Cost',
                lineB : 'Xeros Actual Cost',
                'lineA-key' : 'Current Consumption',
                'lineB-key' : 'Industry Benchmark',
                savings : 'Current Savings',
                cssClass : 'xeros'
            }
        };

        app.reportData = ar;

        for ( var m in app.data.data ) {
            var mi = parseInt(m);
            app.reportData[mi + 1].summaryData = app.data.data[mi].summaryData;
            app.reportData[mi + 1].chartData = app.data.data[mi].chartData;
        }


        /**
         * Compute the Summary Data for the top chart.  We have to do this on the front end because
         * it is calculated differently based on context.
         *
         */
        // Set up the sums the sums we will calculate.  This array lists which sub arrays to add to the totals ie: [1,2,3]
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

            // Pass to template for use in conditional templates
            app.reportData[i].xeros = FF.Location.xeros();

            // Calculate savings
            app.reportData[i].summaryData.savings = self.delta(s.cost, s.cost_xeros);

            // Invert the savings if this is a xeros machine
            if ( FF.Location.xeros() ) {
                // Calculate savings
                app.reportData[i].summaryData.savings = self.delta(s.cost_xeros, s.cost);
            } else {
                // Calculate savings
                app.reportData[i].summaryData.savings = self.delta(s.cost, s.cost_xeros);
            }

            // Add custom labels for Xeros versus non-xeros machines
            app.reportData[i].labels = labels[FF.Location.machineTypes()];
        }

        draw(); // This does the html template draw
        self.drawLegend();
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
    drawLegend : function() {
        var legendTpl = Handlebars.compile(jQuery("#legend-tpl").html());
        var html = legendTpl({xeros : app.reportData[0].xeros});
        jQuery('.legend').html(html);
    },
    initialize : function() {

        // Do any initialization unique to this view.

        FF.Controls.TimeSelect.create();
        FF.Controls.Pdf.create();

        app.initialize();

    },
    bindNav : function() {
        // Bind any navigation that is on an item in a template.
    }
}
