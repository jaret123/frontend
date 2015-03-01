var FF = FF || {};

/**
 * FF - Display
 *
 *
 * Created by jason on 10/1/14
 */
FF.Display = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.init = init;

    function updateDateRange() {
        $(".date-range__from").html(FF.User.reportSettings.dates[0]);
        $(".date-range__to").html(FF.User.reportSettings.dates[1]);
    }

    function updateHeaderDisplay() {
        $(".header__company").html(FF.User.reportSettings.company.title);
        $(".header__location").html(FF.User.reportSettings.location.title);
    }

    function init() {
        $(document).on("user:change", function(event, data) {
            if ( _.contains(data, 'location') ) {
                updateHeaderDisplay();
            }

            if  (_.contains(data, 'dates') ) {
                updateDateRange();
            }
        });
    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.Display.init);
