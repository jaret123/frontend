var FF = FF || {};

/**
 * FF - Error
 *
 *
 * Created by jason on 9/24/14
 */
FF.Error = (function ($) {

    var els = {};

    var pub = {};

    var listen = false;

    // Public functions/objects
    pub.init = init;
    pub.set = set;
    pub.hide = hide;
    pub.errorData = errorData;


    var errorService = '/ws/error';

    var errorData = {
        module : '',
        errorCode : '',
        errorMessage : '',
        severity : '', // Integer from 0 to 7
        url : '' // Url generating the error
    }


    /**
     * Report errors (In place of console log)
     *
     * Public method to send captured errors to GA
     *
     * @param e
     */
    function set(e, message, status, display) {

        // By default, display errors
        if (typeof(display)==='undefined') display = true;

        if (display) {
            displayError(e, message, status);
        }

        /**
         * Send error to Drupal Watchdog
         */
        //$.ajax({
        //    url: errorService,
        //    data: errorData,
        //    dataType: 'json',
        //    success: function () {
        //        if (display) {
        //            displayErrors();
        //        }
        //    },
        //    error: function (jqXHR, textStatus, errorThrown) {
        //        console.log("Ajax Error: " + textStatus + " -- " + errorThrown + "--" + jqXHR);
        //    }
        //})
    }

    /**
     * Private method to display errors to the screen
     */
    function displayError(e, message, status) {
        els.errorMessage.append('<div>' + message + '</div>');
        els.errorMessage.addClass("active");
    }

    function hide() {
        els.errorMessage.html('');
        els.errorMessage.removeClass('active');
    }

    function registerListeners() {
        // Override previous handler.
        window.onerror = function myErrorHandler(msg, url, line, col, error) {

            // Note that col & error are new to the HTML 5 spec and may not be
            // supported in every browser.  It worked for me in Chrome.
            var extra = !col ? '' : '\ncolumn: ' + col;
            extra += !error ? '' : '\nerror: ' + error;

            // You can view the information in an alert to see things working like this:
            // alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

            // Report this error via ajax so you can keep track
            // of what pages have JS issues

            errorData.module = 'General Error';
            errorData.errorMessage = msg;
            errorData.url = url;
            errorData.severity = 1;
            errorData.errorCode = error;

            setError(error, msg, status, false);

            var suppressErrorAlert = true;
            // If you return true, then error alerts (like in older versions of
            // Internet Explorer) will be suppressed.
            return suppressErrorAlert;

        }

        // Track basic JavaScript errors
        window.addEventListener('error', function(e) {
            errorData.module = 'General Error';
            errorData.errorMessage = '';
            errorData.url = e.error.url;
            errorData.severity = 1;
            errorData.errorCode = '';

            setError('Error', e.error.message, e.error.errorCode, false);

            //alert('window error');
        });

        // Track AJAX errors (jQuery API)
        $(document).ajaxError(function(event, request, settings, thrownError) {
            errorData.module = 'Ajax Error';
            errorData.errorMessage = '';
            errorData.url = '';
            errorData.severity = 1;
            errorData.errorCode = '';

            console.log('Error', request.responseText, request.status, false);

            //alert('ajax error');
        });
    }
    function init() {

        els.errorMessage = jQuery(".error-messages");

        els.errorMessage.html('');

        /**
         * Optional configuration to capture all javascript and ajax errors
         */
        if ( listen ) {
            registerListeners();
        }

    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.Error.init);
