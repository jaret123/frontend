var FF = FF || {};

/**
 * FF - Location
 *
 *
 * Created by jason on 9/18/14
 */
FF.Location = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.init = init;

    /**
     * Public properties
     * @type {{}}
     */
    pub.location = {};

    pub.machines = [];

    /**
     * Public methods
     */
    pub.getLocation = getLocation;
    pub.machineTypes = machineTypes;
    pub.xeros = xeros;

    function getLocation(locationId, callback) {
        jQuery.ajax({
            url: '/ws/location/' + locationId,
            success: function(d) {
                pub.location = d;
                getMachineIds(locationId, callback);
            },
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json'
        });
    }

    function machineTypes() {
        // TODO: This needs to test for BOTH, not just the first element.
        if ( checkNested(pub.location, 'field_machine_types', 'und', 0) ) {
            return pub.location.field_machine_types['und'][0].value;
        } else {
            return 'non-xeros';
        }
    }

    function getMachineIds(locationId, callback) {
        jQuery.ajax({
            url: '/ws/location/' + locationId + '/machines',
            success: function(d) {
                pub.machines = d;
                if ( pub.machines.length == 0 ) {
                    FF.Error.set('Location.getMachineIds', 'This location has no active machines.', null, true);
                }
                if ( typeof(callback) == 'function') {
                    callback();
                }

            },
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json'
        });
    }

    function xeros() {
        if ( checkNested(pub.location, 'field_machine_types', 'und', 0) ) {
            if ( pub.location.field_machine_types['und'][0].value == 'xeros' ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function init() {

    }

    return pub;
})(jQuery);
