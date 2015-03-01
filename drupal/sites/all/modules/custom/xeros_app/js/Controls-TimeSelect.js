var FF = FF || {};

FF.Controls = FF.Controls || {};
/**
 * FF - Controls
 *
 *
 * User Interface controls (date pickers, company/location picker, etc)
 * Created by jason on 10/1/14
 */
FF.Controls.TimeSelect = (function ($) {

    var pub = {};

    // Public functions/objects
    pub.create = create;
    pub.init = init;


    var dateRanges = {
        weekToDate : ["", ""],
        monthToDate : ["", ""],
        yearToDate : ["", ""],
        custom : ["", ""] // Custom isn't used.  It remains uninitialized
    }

    pub.dateRanges = dateRanges;

    function createDateRanges() {
        var fromDate = new Date();
        var toDate = new Date();

        // Year to date
        fromDate.setMonth(0);
        fromDate.setDate(1);
        dateRanges.yearToDate = [
            FF.Format.sqlDate(fromDate),
            FF.Format.sqlDate(toDate)
        ];

        // Month to date
        fromDate = new Date();
        fromDate.setDate(1);
        dateRanges.monthToDate = [
            FF.Format.sqlDate(fromDate),
            FF.Format.sqlDate(toDate)
        ]

        // Week to date
        fromDate = new Date();
        fromDate.setDate(toDate.getDate() - toDate.getDay());
        dateRanges.weekToDate = [
            FF.Format.sqlDate(fromDate),
            FF.Format.sqlDate(toDate)
        ]
    };

    function create() {
        $("#time-select").val(FF.User.reportSettings.timeSelect.toString());
        FF.Controls.Dropdown.create('#time-select', function(event) {
            //controls.createDropDown("#time-select", function (event) {

            var click_value = $(event.target).find("span.value").html();

            // This is specific to the time select
            if ( click_value === "custom") {
                // Show the custom date range picker
                $("#cal").addClass("show");
            } else {
                // Go do something
                $("#cal").removeClass("show");
                // Refresh data
                app.dataRefresh = 1;
                // Just pass the time select
                FF.User.setReportDateRange(click_value);
            }
        });

        // Add the calendar picker
        // Note, there is a dependency on the Kalendae Library
        var k = new Kalendae({
            attachTo:document.getElementById("cal"),
            months:3,
            mode:'range',
            direction: "today-past",
            selected:[Kalendae.moment().subtract({M:2}), Kalendae.moment().subtract({D:1})]
        });

        // Bind the custom calendar link
        $(".cal__button-submit").unbind().click(function (e) {
            $("#cal").removeClass("show");
            // Set date range
            var click_value = 'custom,' + k.getSelectedAsText();
            // Refresh data
            app.dataRefresh = 1;
            FF.User.setReportDateRange(click_value);  // Pass custom,fromDate,toDate -- toDate is optional
        });

        $(".cal__button-cancel").unbind().click(function (e) {
            $("#cal").removeClass("show");
        });
    }

    function init() {
        createDateRanges();
    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.Controls.TimeSelect.init);
