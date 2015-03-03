/**
 * Created by Jason on 1/31/15.
 */
var FF = FF || {};

/**
 * FF - User
 *
 *
 * Created by jason on 9/21/14
 */
FF.analystView = (function ($) {

    var pub = {},
        els = {};

    var exceptionFilter = 0;
    var hbsTemplate;
    var unknownFilters = [0, 0, 0];
    var manufacturerChecked = [false, false, false];

    // Public functions/objects
    pub.init = init;
    // Public Functions

    var reports = {
        data: [
            {
                title: 'Cycle Reports',
                exceptionFilter: true
            },
            {
                title: 'DAQ Continuous Monitoring Reports',
                reportType: 'compare',
                checkbox: true
            },
            {
                title: 'Combined DAQ and EK Reports',
                reportType: 'ek',
                exceptionFilter: true
            }
        ]
    };

    var machines = [];

    function getMachines(location_id, callback) {
        $.ajax({
            url: '/ws/machine/' + location_id,
            dataType: 'json',
            success: function (data) {
                console.log("data retrieved: " + 'ws/machine/' + location_id);
                // Append the data and finish this function
                if (typeof callback == "function") {
                    callback(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Ajax Error: " + textStatus + " -- " + errorThrown + "--" + jqXHR);
                $(app.err).addClass("active");
                $(app.err).html("Oops, something happened, no machines were found.  Please contact your system administrator.");
            }
        });
    }

    // Private Functions

    function updateLinks() {

        for (i = 0; i < reports.data.length; i++) {
            reports.data[i].from_date = FF.User.reportSettings.dates[0];
            reports.data[i].to_date = FF.User.reportSettings.dates[1];
            reports.data[i].company = FF.User.reportSettings.company.id;
            reports.data[i].location = FF.User.reportSettings.location.id;
            reports.data[i].timeSelect = FF.User.reportSettings.timeSelect;
            reports.data[i].exception = exceptionFilter;
            reports.data[i].unknown = unknownFilters[i];
            reports.data[i].manufacturer = manufacturerChecked[i] ? 1 : 0;
            reports.data[i].manufacturerBool = manufacturerChecked[i];
        }

        getMachines(FF.User.reportSettings.location.id, function (data) {
            machines = [];
            for (var i = 0; i < data.length; i++) {
                machines[i] = {};
                machines[i].name = data[i].machine_name;
                machines[i].serial = data[i].serial_number;
                machines[i].id = data[i].machine_id;
            }
            reports.machines = machines;

            els.output.html(hbsTemplate(reports));

            bindEvents();

            $("#unknown_select_0").val(unknownFilters[0]);
            $("#unknown_select_1").val(unknownFilters[1]);
            $("#unknown_select_2").val(unknownFilters[2]);
            $("#exception_select_0").val(exceptionFilter[0]);
            $("#exception_select_2").val(exceptionFilter[2]);

            FF.Controls.Dropdown.create("#unknown_select_0", function (event) {
                unknownFilters[0] = parseInt($(event.target).find("span.value").html(), 0);
                updateLinks();
            });
            FF.Controls.Dropdown.create("#unknown_select_1", function (event) {
                unknownFilters[1] = parseInt($(event.target).find("span.value").html(), 0);
                updateLinks();
            });
            FF.Controls.Dropdown.create("#unknown_select_2", function (event) {
                unknownFilters[2] = parseInt($(event.target).find("span.value").html(), 0);
                updateLinks();
            });

            FF.Controls.Dropdown.create("#exception_select_0", function (event) {
                exceptionFilter[0] = parseInt($(event.target).find("span.value").html(), 0);
                updateLinks();
            });

            FF.Controls.Dropdown.create("#exception_select_2", function (event) {
                exceptionFilter[2] = parseInt($(event.target).find("span.value").html(), 0);
                updateLinks();
            });
        });
    }

    function bindEvents() {
        var machineOpen = $('.machine-list-open');
        var manufacturerCheckbox = $('#manufacturer_checkbox');

        manufacturerCheckbox.change(function () {
            manufacturerChecked[1] = this.checked;
            updateLinks();
        });

        machineOpen.on('click', function (obj) {
            jQuery(this).parents('.machine-block').toggleClass('active');
        });
    }

    // Init
    function init() {

        FF.Controls.TimeSelect.create();

        els.template = $("#report-list-template");

        var source = $(els.template).html();

        hbsTemplate = Handlebars.compile(source);

        els.output = $('#output');

        // Update the links when the page is first drawn
        updateLinks();

        // Update the links when the User data changes
        jQuery(document).on('user:change', function (event, data, eventContext) {
            if (typeof data !== 'undefined' && !_.contains(data, 'company')) {
                updateLinks();
            }
        });
    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.analystView.init);

Handlebars.registerHelper("reportTypeQuery", function (reportType) {
    if (typeof reportType !== 'undefined') {
        return 'type=' + reportType + '&';
    }
    else {
        return '';
    }
});
