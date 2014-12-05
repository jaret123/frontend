/**
 * Created by jason on 2/5/14.
 */
var view = {

    // change these values to change which data we display.
    // The Web service returns all the data.
    machineType : '',
    model : '',

    legendTpl : '',

//    setOptions : function() {
//        var self = this;
//        self.machineType = 'xeros';
//        self.model = 'model_xeros';
//    },
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

        //app.reportData = app.data.data[app.machine].metrics[app.metric];

        // Industry Averages per cycle
//        var industryAverages = {
//            avg_cold_water_volume: "121.64078133",
//            avg_cold_water_cost: "1.20101627",
//            avg_hot_water_volume: "51.41446880",
//            avg_therms: "0.37381793",
//            avg_therm_cost: "0.34448701",
//            avg_chemical_strength: "17.38840517",
//            avg_chemical_cost: "1.18185205"
//        };

        //ar = app.data[self.machineType];

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
            'non_xeros' : {
                lineA : 'Actual Cost',
                lineB : 'Potential Cost',
                'lineA-key' : 'Current Consumption (Non-Xeros Machines)',
                'lineB-key' : 'Potential Consumption with Xeros',
                savings : 'Potential Savings',
                cssClass : 'non-xeros'
            },
            xeros : {
                lineA : 'Industry Avg Cost',
                lineB : 'Xeros Actual Cost',
                'lineA-key' : 'Current Consumption (Xeros Machines)',
                'lineB-key' : 'Industry Benchmark (Non-Xeros Machines)',
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
                app.reportData[0].model.summary.cost += app.reportData[ij].model.summary.cost;
                app.reportData[0].model.summary.value += app.reportData[ij].model.summary.value;

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
            if ( self.machineType ) {
                // Calculate savings
                app.reportData[i].actual.savings = -app.reportData[i].actual.savings;
            }

            // Add custom labels for Xeros versus non-xeros machines
            // TODO - make the labels a bit more descriptive
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

        app.initialize();

        jQuery('#chart-options').on('show.bs.modal', function (e) {
            // If there is no data yet, don't open
            if (_.isEmpty(app.data) || view.machineType == '' || view.model == '') {
                return e.preventDefault();
            } else {
                var els = {};
                els.chartOptions = jQuery(e.target);
                els.machineType = els.chartOptions.find('.chart-options__machine-type');
                els.model = els.chartOptions.find('.chart-options__model');

                els.machineType.val(view.machineType);
                els.model.val(view.model);

                // Only show machine type options for which we have machines
                els.machineType.find('option').addClass('hide');
                jQuery(_.keys(app.data.options)).each(function() {
                   els.machineType.find('option[value="' + this + '"]').removeClass('hide');
                });

                // Only show valid options for the model based on the machine type
                els.model.find('option').addClass('hide');
                jQuery(app.data.options[view.machineType].models).each(function() {
                   els.model.find('options[value="' + this + '"]').removeClass('hide');
                });
            }
        });

        jQuery('#chart-options .chart-options__machine-type').on('change', function(e) {
            var els = {};
            els.chartOptions = jQuery(e.target).parents('#chart-options');
            els.machineType = els.chartOptions.find('.chart-options__machine-type');
            els.model = els.chartOptions.find('.chart-options__model');

            // Use the selectedMachineType now instead of the view.machineType
            var selectedMachineType = els.machineType.val();

            // Only show valid options for the model based on the machine type
            els.model.find('option').addClass('hide');

            jQuery(app.data.options[selectedMachineType].models).each(function() {
                els.model.find('option[value="' + this.valueOf() + '"]').removeClass('hide');
            });

            var firstActiveValue = jQuery(els.model.find('option:not(.hide)')[0]).val();
            els.model.val(firstActiveValue);
        });

        //Save Compare Button
        jQuery(".chart-options__save").on('click', function() {
            var els = {};
            els.chartOptions = jQuery(this).parents('#chart-options');
            els.machineType = els.chartOptions.find('.chart-options__machine-type');
            els.model = els.chartOptions.find('.chart-options__model');

            jQuery(this).parents('#chart-options').hide();
            app.fadeReport();
            view.parseData(app.showReport, {
                machineType : els.machineType.val(),
                model : els.model.val()
            });
            console.log("saving the buttons");
        });
    },
    bindEvents : function() {

        // Bind any navigation that is on an item in a template.
    }
}
