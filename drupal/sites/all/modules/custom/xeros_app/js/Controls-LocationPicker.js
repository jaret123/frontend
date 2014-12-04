var FF = FF || {};

/**
 * FF - Controls-AdminMenu
 *
 *
 * Created by jason on 10/1/14
 */
FF.Controls.LocationPicker = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.init = init;

    function create() {
        // Display the Admin menu if it exists
        //els.AdminMenu.find('.location-picker__button').on('click')
        $(".location-picker .location-picker__button").click(function(e) {
            $(".location-picker").toggleClass("open");
            $(".location-picker__button").html("Menu");
            $(".open .location-picker__button").html("Close");
        });
        app.options_tpl = Handlebars.compile($("#options-tpl").html());
    }

    function init() {

        els.AdminMenu = $('.location-picker');

        // If the user is a Xeros Admin then the list of companies will
        // be put into the app namespace.
        // This is not a security hole, because access is checked again on the
        // backend any time you query data

        if (typeof(context.companies) !== 'undefined') {
            if (els.AdminMenu.length > 0) {
                // Render the admin menu
                create();
                // Create the company select in it.
                FF.Controls.CompanySelect.create();
            }
        }
    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.Controls.LocationPicker.init);
