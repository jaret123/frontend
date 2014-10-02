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
    pub.error = error;

    /**
     * Report errors (In place of console log)
     * @param e
     */
    function error(e, message, status) {

        if (status == 'log') {
            ga.send(
                'send',
                'event',
                'Application Log', // category
                message, // action
                '', // label
                1 // count
            )
        }
        if (status == 'error') {
            ga.send(
                'send',
                'event',
                'error', // category
                e.message , // action
                + e.filename + ':  ' + e.lineno,    // label
                1
            );
        }

    }

    function init() {
        // Example 1:

// Prevent error dialogs from displaying -which is the window's normal
// behavior- by overriding the default event handler for error events that
// go to the window.
        window.onerror = null;

// Example 2:

        var gOldOnError = window.onerror;
// Override previous handler.
        window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
            if (gOldOnError)
            // Call previous handler.
                return gOldOnError(errorMsg, url, lineNumber);

            // Just let default handler run.
            return false;
        }

        // Track basic JavaScript errors
        window.addEventListener('error', function(e) {
            ga.send(
                'send',
                'event',
                'error', // category
                e.message , // action
                + e.filename + ':  ' + e.lineno,    // label
                1
            );
        });

        // Track AJAX errors (jQuery API)
        $(document).ajaxError(function(e, request, settings) {
            ga.send(
                'send',
                'event',
                'ajax error', // category
                settings.url , // action
                e.result,    // label
                '',
                1
            );
        });
    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.Error.init);
