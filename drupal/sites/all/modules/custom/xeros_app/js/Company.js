var FF = FF || {};

/**
 * FF - Company
 *
 *
 * Created by jason on 9/18/14
 */
FF.Company = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.company = {};
    pub.getCompany = getCompany;

    function getCompany(companyId, callback) {
        jQuery.ajax({
            url: 'ws/company/' + companyId,
            success: function(d) {
                pub.company = d;
                if ( typeof(callback) == 'function') {
                    callback();
                }
            },
            dataType: 'json',
            type: 'GET',
            contentType: 'application/json'
        });

    }
    return pub;
})(jQuery);
