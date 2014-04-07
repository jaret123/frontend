/**
 * Created by jason on 2/5/14.
 */
var view = {

    // Each report view has a slightly different data structure
    // In this function we re-organize the data feed if need be and do some summary calcs
    parseData : function(draw) {
        self = this;

        var reportLabels = {
            "cold_water": [
                "Gallons",
                "Load Size",
                "Gallons Per Pound",
                "Cost Per Pound",
                "Water Usage Reduction",
                "Cost Per Pound Reduction"
            ],
            "hot_water": [
                "Gallons",
                "Load Size",
                "Therms Per Pound",
                "Cost Per Pound",
                "Therms Usage Reduction",
                "Cost Per Pound Reduction"
            ],
            "total_water": [
                "Gallons",
                "Load Size",
                "Gallons Per Pound",
                "Cost Per Pound",
                "Water Usage Reduction",
                "Cost Per Pound Reduction"
            ],
            "cycle_time": [
                "Total Cycle Time",
                "Load Size",
                "Labor Cost",
                "Cost Per Pound",
                "Cycle Time Reduction",
                "Cost Per Pound Reduction"
            ],
            "chemical": [
                "Total Ounces",
                "Load Size",
                "Ounces Per Pound",
                "Cost Per Pound",
                "Chemical Usage Reduction",
                "Cost Per Pound Reduction"
            ]
    };

        app.reportData = app.data.data[app.machine].metrics[app.metric];
        app.reportData.labels = reportLabels[app.reportData.id];

        app.reportData.machine_name = app.data.data[app.machine].name;
        app.reportData.machine_id = app.data.data[app.machine].machine_id;
        app.reportData.serial_number = app.data.data[app.machine].serial_number;
        app.reportData.size = app.data.data[app.machine].size;


        for ( i in app.reportData.classifications ) {
            var d = app.reportData.classifications[i];
            for ( j in d.data ) {
                var d1 = d.data[j];
                app.reportData.classifications[i].data[j].delta_one = view.percentDelta(d1.value_three, d1.xeros_value_three);
                app.reportData.classifications[i].data[j].delta_two = view.valueDelta(d1.value_four, d1.xeros_value_four);
            }
        }

        var sortable = [];
        for ( var classification in app.reportData.classifications ) {
            sortable.push(app.reportData.classifications[classification])
        }
        sortable.sort(view.classificationCompare);

        app.reportData.classifications = sortable;

        draw();
    },
    classificationCompare : function(a,b) {
        if (a.name.toLowerCase().substr(0,7) === "unknown")
            return -1;
        if (parseInt(a.classification_id, 10) < parseInt(b.classification_id, 10))
            return -1;
        if (parseInt(a.classification_id, 10) > parseInt(b.classification_id, 10))
            return 1;
        return 0;
    },
    percentDelta : function(a, b) {
        if ( ( a == 0 || typeof(a) == "undefined)")
            && ( b == 0 || typeof(b) == "undefined") ) {
            return 0;
        } else if ( b == 0 || typeof(b) == "undefined") {
            return 100
        } else {
            return parseInt( 100 * ( ( parseFloat(a) - parseFloat(b) ) / parseFloat(a) ), 10);
        }

    },
    valueDelta : function(a, b) {
        if ( typeof(a) == "undefined" || typeof(b) == "undefined" ) {
            return 0;
        } else {
            return ( parseFloat(a) - parseFloat(b) );
        }
    },
    initialize : function() {
        app.initialize();
        controls.createReportSelect();
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
        }

    }
}

view.initialize();