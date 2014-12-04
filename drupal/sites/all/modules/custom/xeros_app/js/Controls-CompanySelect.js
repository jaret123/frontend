var FF = FF || {};

FF.Controls = FF.Controls || {};
/**
 * FF - Controls.CompanySelect
 *
 *
 * User Interface controls (date pickers, company/location picker, etc)
 * Created by jason on 10/1/14
 */
FF.Controls.LocationSelect = (function ($) {

    var pub = {};

    pub.create = create;
    pub.update = update;

    function create() {
        FF.Controls.Dropdown.create("#location-select", function (event) {
            var locationId = parseInt($(event.target).find("span.value").html(), 10);
            app.dataRefresh = 1; // TODO: Should we let something else manage this?
            FF.User.setReportLocation(locationId, self.setHeaderDisplay);
        });
    };

    function update(locations, selected) {
        var opts;
        if ( locations.data != "" ) {
            opts = app.options_tpl( locations );
            $("#location-select").html(opts);
        }
        if ( typeof(selected) != 'undefined' ) {
            $("#location-select").val(selected);
        }
        // Remove the location select and rebuild it
        $("#location-select__dl").remove();
        create();
    };

    return pub;
})(jQuery);


FF.Controls.CompanySelect = (function ($) {

    var pub = {};

    // Public functions/objects
    pub.create = create;

    function create() {
        var opts = app.options_tpl( {'data' : context.companies } );
        $("#company-select").html(opts);
        $("#company-select").val(FF.User.reportSettings.company.id);

        FF.Controls.Dropdown.create("#company-select", function (event) {
            FF.User.setReportCompany(parseInt($(event.target).find("span.value").html(), 0));
            FF.Controls.LocationSelect.update({'data' : context.companies[FF.User.reportSettings.company.id].location });
        });
        var locations = {data : ""};
        if ( FF.User.reportSettings.company.id !== 0 ) {
            locations.data = context.companies[FF.User.reportSettings.company.id].location;
            FF.Controls.LocationSelect.update(locations, FF.User.reportSettings.location.id);
        }
    };

    return pub;
})(jQuery);



