var FF = FF || {};

FF.Controls = FF.Controls || {};

/**
 * FF - Controls-ModelSelect.js
 *
 *
 * Created by jason on 12/4/14
 */
FF.Controls.ModelSelect = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.init = init;

    pub.updateModel = updateModel;

    var labels = {
        machine_types : {
            xeros : "Xeros",
            non_xeros : "Non Xeros"
        },
        models : {
            model_xeros : "Xeros benchmark based on classifications",
            model_xeros_simple : "Xeros benchmark based on total water sewer usage",
            model_non_xeros_simple : "Non-Xeros benchmark based on Industry Averages"
        }
    }
    function save() {
        els.chartOptions.hide();

        app.fadeReport();
        setTimeout(function() {
            view.parseData(app.showReport, {
                machineType : els.machineType.val(),
                model : els.model.val()
            });
            $('body').removeClass('modal-open');
        }, 300);

        console.log("saving the buttons");

    }

    function show(e) {

        // If there is no data yet, don't open
        if (_.isEmpty(app.data) || view.machineType == '' || view.model == '') {

            return e.preventDefault();
        } else {
            showMachineTypes(e);
            updateModel(e, true);
        }
    }

    function showMachineTypes(e) {
        els.model.val(view.model);

        // Only show machine type options for which we have machines

        var machineOptions = {};
        _.each( _.keys(app.data.options.machine_types) , function(machine_type)  {
            machineOptions[machine_type] = {
                name : labels.machine_types[machine_type]
            };
        });

        var options = els.optionsTemplate( {'data' : machineOptions } );
        els.machineType.html(options);
        els.machineType.val(view.machineType);

        els.model.val(view.model);

        // Only show machine type options for which we have machines

        var machineOptions = {};
        _.each( _.keys(app.data.options.machine_types) , function(machine_type)  {
            machineOptions[machine_type] = {
                name : labels.machine_types[machine_type]
            };
        });

        var options = els.optionsTemplate( {'data' : machineOptions } );
        els.machineType.html(options);
        els.machineType.val(view.machineType);

        FF.Controls.Dropdown.create('#machineType', updateModel);
    };

    function updateModel(e, calledFromInit) {

        if ( typeof calledFromInit == "undefined" ) {
            calledFromInit = false;
        }

        var modelOptions = {};
        var selectedMachineType = els.machineType.val();
        _.each(app.data.options.machine_types[selectedMachineType].models, function(model) {
           modelOptions[model] = {
               name : labels.models[model]
           }
        });

        var options = els.optionsTemplate( { 'data' : modelOptions } );
        els.model.html(options);
        if (calledFromInit) {
            els.model.val(view.model);
        } else {
            els.model.val(_.keys(modelOptions)[0]);
        }

        FF.Controls.Dropdown.create('#model');

    }

    function init() {

        els.chartOptions = $('#chart-options');
        els.machineType = els.chartOptions.find('.chart-options__machine-type');
        els.model = els.chartOptions.find('.chart-options__model');
        els.optionsTemplate = Handlebars.compile($("#machine-options-tpl").html());
        els.chartOptions.on('show.bs.modal', show);

        //els.machineType.on('change', updateModel);


        //Save Compare Button
        $(".chart-options__save").on('click', save);
        
    }

    return pub;
})(jQuery);
