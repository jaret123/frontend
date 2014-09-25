var FF = FF || {};

/**
 * FF - Error
 *
 *
 * Created by jason on 9/24/14
 */
FF.Error = (function ($) {

    var pub = {};

    // Public functions/objects
    pub.init = init;

    /**
     * Report errors (In place of console log)
     * @param e
     */
    function error(e, message, status) {

        if (status == 'log') {
            _gaq.push([
                'trackevent',
                'Application Log',
                message,
                '',
                true
            ])
        }
        if (status == 'error') {
            _gaq.push([
                '_trackEvent',
                'JavaScript Error',
                e.message,
                e.filename + ':  ' + e.lineno,
                true
            ]);
        }

    }

    function init() {
        // Track basic JavaScript errors
        window.addEventListener('error', function(e) {
            _gaq.push([
                '_trackEvent',
                'JavaScript Error',
                e.message,
                e.filename + ':  ' + e.lineno,
                true
            ]);
        });

        // Track AJAX errors (jQuery API)
        $(document).ajaxError(function(e, request, settings) {
            _gaq.push([
                '_trackEvent',
                'Ajax error',
                settings.url,
                e.result,
                true
            ]);
        });
    }

    return pub;
})(jQuery);

FF.Error.init();
