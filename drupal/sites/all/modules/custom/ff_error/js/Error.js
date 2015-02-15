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
    function error(e, message, status, display) {

        // By default, display errors
        if (typeof(display)==='undefined') display = true;

        $.ajax({
            url: errorService,
            data: errorData,
            dataType: 'json',
            success: function () {
                if (display) {
                    displayErrors();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Ajax Error: " + textStatus + " -- " + errorThrown + "--" + jqXHR);
            }
        })
    }

    /**
     * Private method to display errors to the screen
     */
    function displayErrors() {
        els.errorMessage.append('<div>' + message + '</div>');
    }

    function init() {

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

            error(error, msg, status, false);

            var suppressErrorAlert = true;
            // If you return true, then error alerts (like in older versions of
            // Internet Explorer) will be suppressed.
            return suppressErrorAlert;

        }

        // Track basic JavaScript errors
        window.addEventListener('error', function(e) {
            errorData.module = 'General Error';
            errorData.errorMessage = e.error.message;
            errorData.url = e.error.url;
            errorData.severity = 1;
            errorData.errorCode = e.error.errorCode;

            error(error, e.error.message, e.error.errorCode, false);

            //alert('window error');
        });

        // Track AJAX errors (jQuery API)
        $(document).ajaxError(function(event, request, settings, thrownError) {
            errorData.module = 'Ajax Error';
            errorData.errorMessage = request.responseText;
            errorData.url = settings.url;
            errorData.severity = 1;
            errorData.errorCode = request.status;

            error(error, request.responseText, request.status, false);

            //alert('ajax error');
        });
    }

    return pub;
})(jQuery);

jQuery(document).ready(FF.Error.init);
