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
                chartData : []

            }
        ];

        app.reportData = ar.concat(app.data.data);

        for (var i = 1; i < 4; i++) {
            if ( self.isValidSummaryData(app.reportData[i].summaryData) ) {
                app.reportData[0].summaryData.cost += parseInt(app.reportData[i].summaryData.cost, 10) ;
                app.reportData[0].summaryData.cost_xeros += parseInt(app.reportData[i].summaryData.cost_xeros, 10);
                app.reportData[0].summaryData.value += parseInt(app.reportData[i].summaryData.value, 10) ;
                app.reportData[0].summaryData.value_xeros += parseInt(app.reportData[i].summaryData.value_xeros, 10) ;

                var l = app.reportData[i].chartData.length,
                    d = 0;



                for (d; d < l; d++ ) {
                    if ( i == 1 ) {
                        app.reportData[0].chartData[d] = {
                            cost: 0,
                            cost_xeros: 0,
                            date : '',
                            value: 0,
                            value_xeros: 0
                        };
                    }
                    var x = app.reportData[i].chartData[d];
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
        controls.createTimeSelect();
        controls.createExport();
    },
    bindNav : function() {
        // Bind any navigation that is on an item in a template.
    }
}

// Initialize
view.initialize();