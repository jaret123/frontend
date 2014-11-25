/**
 * Created by jason on 2/5/14.
 */
var view = {

    // change these values to change which data we display.
    // The Web service returns all the data.
    machineType : 'non-xeros',
    model : 'model_xeros',

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



        ar = app.data[self.machineType];

        var ar = [
                {
                    name : 'total',
                    //modelName : this.model,
                    machineType : this.machineType,
                    meta : {
                        cssClass : "total",
                        icon : "Globe",
                        label : "Overall Expense",
                        title : "Total Savings"
                    },
                    actual: {
                        summary : {
                            cost : 0,
                            value : 0
                        },
                        chart : []
                    },
                    model_xeros : {
                        summary : {
                            cost : 0,
                            value : 0
                        },
                        chart : []
                    },
                    model_xeros_simple : {
                        summary : {
                            cost : 0,
                            value : 0
                        },
                        chart : []
                    },
                    model_non_xeros_simple : {
                        summary : {
                            cost : 0,
                            value : 0
                        },
                        chart : []
                    },
                    total : [1, 2]
                },
                app.data[self.machineType]['cold-water'],
                app.data[self.machineType]['therms']
            ];

            ar[1]['meta'] = {
                    cssClass : "cold-water",
                    icon : "Drop",
                    label : "Water Sewer",
                    title : "Water Sewer"
                };
            ar[2]['meta'] = {
                cssClass : "therms",
                icon : "Thermometer",
                label : "Therms",
                title : "Therms"
            };

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

        for ( i in app.reportData ) {
            app.reportData[i].model = app.reportData[i][this.model];
        }

        /**
         * Compute the Summary Data for the top chart.  We have to do this on the front end because
         * it is calculated differently based on context.
         *
         */

        var d = app.data[this.machineType];

        // Set up the sums the sums we will calculate.  This array lists which sub arrays to add to the totals ie: [1,2,3]
        var sums = app.reportData[0].total;

        // For each of the values in the summary.total add them.
        for (var i in sums ) {

            var ij = sums[i];
            if ( self.isValidSummaryData(app.reportData[ij].actual.summary) ) {
                app.reportData[0].actual.summary.cost += app.reportData[ij].actual.summary.cost ;
                app.reportData[0].actual.summary.value += app.reportData[ij].actual.summary.value ;

                // TODO: Test what model to use for this calc
                app.reportData[0].model.cost += app.reportData[ij].model.cost;
                app.reportData[0].model.value += app.reportData[ij].model.value;

                var l = app.reportData[ij].actual.chart.length,
                    d = 0;

                for (d; d < l; d++ ) {
                    if ( i == 0 ) {
                        app.reportData[0].actual.chart[d] = {
                            cost: 0,
                            date : '',
                            value: 0,
                        };
                        app.reportData[0].model.chart[d] = {
                            cost: 0,
                            date : '',
                            value: 0,
                        };
                    }
                    var x = app.reportData[ij].actual.chart[d];

                    // TODO: Test what model to use
                    var y = app.reportData[ij].model.chart[d];

                    // TODO: We can take either cost or value out of the chart (review what is being charted)
                    app.reportData[0].actual.chart[d].cost += self.pInt(x.cost);
                    app.reportData[0].model.chart[d].cost += self.pInt(y.cost);
                    app.reportData[0].actual.chart[d].value += self.pInt(x.value);
                    app.reportData[0].model.chart[d].value += self.pInt(y.value);
                    app.reportData[0].actual.chart[d]["date"] = x["date"];
                    app.reportData[0].model.chart[d]["date"] = y["date"];
                }

            }
        }

        for ( i in app.reportData ) {

            // Pass to template for use in conditional templates
            //app.reportData[i].xeros = FF.Location.xeros();

            // Calculate savings
            app.reportData[i].actual.savings = self.delta(app.reportData[i].actual.summary.cost, app.reportData[i].model.summary.cost);

            // Invert the savings if this is a xeros machine
            if ( FF.Location.xeros() ) {
                // Calculate savings
                app.reportData[i].actual.savings = -app.reportData[i].actual.savings;
            }

            // Add custom labels for Xeros versus non-xeros machines
            // TODO - make the labels a bit more descriptive
            app.reportData[i].labels = labels[FF.Location.machineTypes()];

        }

        draw(); // This does the html template draw
        self.drawLegend();
        self.drawCharts();
        self.bindEvents();
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
             typeof(summaryData.value) === "undefined"  ) {
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
            // TODO - Put in the actual data and the model we want to use then draw
            chart.data = {
                meta : app.reportData[i].meta,
                labels : app.reportData[i].labels,
                actual : app.reportData[i].actual,
                model : app.reportData[i][this.model],
                machineType : this.machineType
            }
            if (self.isValid(chart.data.actual.chart)) {
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
    bindEvents : function() {
        jQuery( ".dashboard-gear" ).click(function() {
            console.log("gear clicked");
            jQuery('.lightbox-content').show();
            jQuery('.header__logo').css('z-index', 0);
            jQuery('.black_overlay').show();
        });

        jQuery(".lightbox-closebtn,#compare-cancelbtn").click(function() {
            jQuery('.lightbox-content').hide();
            jQuery('.black_overlay').hide();
            jQuery('.header__logo').css('z-index', 10);

        });
        //Save Compare Button
        jQuery("#compare-savebtn").click(function() {
            console.log("saving the buttons")
           alert('in bindEvents in DashboardView');
        });



        // Bind any navigation that is on an item in a template.
    }
}
