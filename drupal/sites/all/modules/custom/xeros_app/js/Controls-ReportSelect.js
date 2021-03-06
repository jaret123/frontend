var FF = FF || {};

FF.Controls = FF.Controls || {};

/**
 * FF - Controls-ReportSelect
 *
 *
 * Created by jason on 10/1/14
 */
FF.Controls.ReportSelect = (function ($) {

    var pub = {};

    // Public functions/objects
    pub.create = create;

    function create() {
        $("#report-select").val(FF.User.reportSettings.metric);
        FF.Controls.Dropdown.create("#report-select", function (event) {
            var metric = $(event.target).find("span.value").html();
            FF.User.setValues({ metric: metric }, 'metric:select');
        });
    }

    return pub;
})(jQuery);
