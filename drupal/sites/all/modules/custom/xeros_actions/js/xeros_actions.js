jQuery.extend({

    getQueryParameters : function(str) {
        return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    }

});

var FF = FF || {};

/**
 * FF - xeros_actions
 *
 *
 * Created by jason on 11/5/14
 */
FF.xeros_actions = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.init = init;


    function init() {
        //alert('Hello');
        var params = $.getQueryParameters();

        if ( typeof params.machine_id !== "undefined") {
            jQuery('#edit-field-machine-entity-reference-und').val(params.machine_id);
            jQuery('.form-item-field-machine-entity-reference-und').css('display', 'none');
        }
    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.xeros_actions.init);


