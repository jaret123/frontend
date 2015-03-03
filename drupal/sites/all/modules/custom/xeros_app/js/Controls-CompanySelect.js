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
            app.dataRefresh = 1;
            FF.User.setValues({locationId : locationId}, 'location:select');
        });
    };

    function update(locations, selected) {
        var opts;
        if ( locations.data != "" ) {

            var data = _.each(locations.data, function(obj, key) {
                obj.key = parseInt(key, 0);
            });

            data = _.toArray(data);

            data = _.sortBy(data, function(obj) { return obj.name});

            opts = app.options_tpl( {data : data } );
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
        // Put the key onton each element in the array then sort the array by the key

        var data = {};

        data = context.companies;

        _.each(data, function(obj, key) {
            obj.key = parseInt(key, 0);
        });

        data = _.toArray(data);

        data = _.sortBy(data, function(obj) { return obj.name});

        var opts = app.options_tpl( {'data' : data } );
        $("#company-select").html(opts);
        $("#company-select").val(FF.User.reportSettings.company.id);

        FF.Controls.Dropdown.create("#company-select", function (event) {
            var companyId = parseInt($(event.target).find("span.value").html(), 0)
            FF.User.setValues({companyId: companyId}, 'company:select');

            var company = _.filter(data, function(obj) {
                return obj.key === companyId;
            });

            FF.Controls.LocationSelect.update({'data' : company[0].location });
        });

        var locations = {data : ""};
        if ( FF.User.reportSettings.company.id !== 0 ) {
            locations.data = context.companies[FF.User.reportSettings.company.id].location;
            FF.Controls.LocationSelect.update(locations, FF.User.reportSettings.location.id);
        }
    };

    return pub;
})(jQuery);



