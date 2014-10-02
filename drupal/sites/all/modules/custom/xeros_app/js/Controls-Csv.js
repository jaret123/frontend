var FF = FF || {};

/**
 * FF - Controls-Csv
 *
 *
 * Created by jason on 10/1/14
 */
FF.Controls.Csv = (function ($) {

    var pub = {},
        els = {};

    var href = '';

    // Public functions/objects
    pub.init = init;

    function updateCsvLink() {
        href = "/api/csv/" + FF.User.reportSettings.dates[0] + "/" +
            FF.User.reportSettings.dates[1] + "/" +
            FF.User.reportSettings.location.id;
        $("#download__csv").attr("href", href );
    };

    function init() {
        document.addEventListener('CustomEventUserChange', function () {
            updateCsvLink();
        })
    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.Controls.Csv.init);
