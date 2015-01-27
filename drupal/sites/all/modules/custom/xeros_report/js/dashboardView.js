/**
 * Created by jason on 2/5/14.
 */
var view = {

    // change these values to change which data we display.
    // The Web service returns all the data.
    machineType : '',
    model : '',

    legendTpl : '',
    // Each report view has a slightly different data structure
    parseData : function(draw, options) {
        var self = this;

        if ( typeof options !== 'undefined') {
            // Grab the value parsed to us
            this.machineType = options.machineType;
            this.model = options.model;
        } else {
            // Grab the first valid one in the data array
            this.machineType = _.keys(app.data.options.machine_types)[0];
            // Grab the first valid model in the data set
            this.model = app.data.options.machine_types[this.machineType]['models'][0];
        }

        var ar = [
                {
                    name : 'total',
                    //modelName : this.model,
                    machineType : this.machineType,
                    meta : {
                        cssClass : "total",
                        icon : "Globe",
                        label : Drupal.t("Overall Expense"),
                        title : Drupal.t("Total Savings")
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
                    label : Drupal.t("Water Sewer"),
                    title : Drupal.t("Water Sewer")
                };
            ar[2]['meta'] = {
                cssClass : "therms",
                icon : "Thermometer",
                label : Drupal.t("Therms"),
                title : Drupal.t("Therms")
            };

        var labels = {
            'non_xeros' : {
                lineA : Drupal.t('Potential Cost'),
                lineB : Drupal.t('Actual Cost'),
                'lineA-key' : Drupal.t('Current Consumption (Non-Xeros Machines)'),
                'lineB-key' : Drupal.t('Potential Consumption with Xeros'),
                savings : Drupal.t('Potential Savings'),
                cssClass : 'non-xeros'
            },
            xeros : {
                lineA : Drupal.t('Industry Avg Cost'),
                lineB : Drupal.t('Xeros Actual Cost'),
                'lineA-key' : Drupal.t('Current Consumption (Xeros Machines)'),
                'lineB-key' : Drupal.t('Industry Benchmark (Non-Xeros Machines)'),
                savings : Drupal.t('Current Savings'),
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

                app.reportData[0].model.summary.cost += app.reportData[ij].model.summary.cost;
                app.reportData[0].model.summary.value += app.reportData[ij].model.summary.value;

                var l = app.reportData[ij].actual.chart.length,
                    d = 0;

                for (d; d < l; d++ ) {
                    if ( i == 0 ) {
                        app.reportData[0].actual.chart[d] = {
                            cost: 0,
                            date : '',
                            value: 0
                        };
                        app.reportData[0].model.chart[d] = {
                            cost: 0,
                            date : '',
                            value: 0
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

            if ( self.machineType == 'xeros') {
                // Calculate savings (model - actual)
                app.reportData[i].actual.savings = self.delta(app.reportData[i].model.summary.cost, app.reportData[i].actual.summary.cost);
                //app.reportData[i].actual.savings = -app.reportData[i].actual.savings;
            } else {

                // Calculate what you could be saving (actual - model)
                app.reportData[i].actual.savings = self.delta(app.reportData[i].actual.summary.cost, app.reportData[i].model.summary.cost);
                //app.reportData[i].actual.savings = -app.reportData[i].actual.savings;
            }

            // Add custom labels for Xeros versus non-xeros machines
            app.reportData[i].labels = labels[self.machineType];

        }

        draw(); // This does the html template draw
        self.drawLegend(labels[self.machineType]);
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
    /**
     *
     * @param base
     * @param change
     * @returns {number}
     */
    delta : function(base, change) {
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
    drawLegend : function(data) {
        var legendTpl = Handlebars.compile(jQuery("#legend-tpl").html());
        var html = legendTpl(data);
        jQuery('.legend').html(html);
    },
    initialize : function() {
        // Do any initialization unique to this view.

        FF.Controls.TimeSelect.create();
        FF.Controls.Pdf.create();
        FF.Controls.ModelSelect.init();

        app.initialize();

    },
    bindEvents : function() {

        // Bind any navigation that is on an item in a template.
    }
}
