/**
 * Namespace: FF
 *   Setup namespace if it has not already been setup.
 */
var FF = FF || {};

FF.Utils = FF.Utils || {};

/**
 * Class: FF.Utils
 *   Encapsulates some utility functions
 */
FF.Utils = (function($){

    /**
     * Variable: els
     *   A cache for element references
     * @type {{}}
     */
    var els = {};

    /**
     * Variable: pub
     *   Contains publicly accessible methods
     * @type {{}}
     */
    var pub = {};


    var data = {};


// Find the right method, call on correct element
    pub.launchFullscreen = function(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }

// Launch fullscreen for browsers that support it!
    //    launchFullScreen(document.documentElement); // the whole page
    //    launchFullScreen(document.getElementById("videoElement")); // any individual element



    // Whack fullscreen
    pub.exitFullscreen = function() {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }



    // Cancel fullscreen for browsers that support it!
    //exitFullscreen();


    pub.fullscreenElement = function() {
        return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    }
    pub.fullscreenEnabled = function() {
        return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
    }



    /**
     * Function: CC.Form.init
     *   Initializes header functionality
     *
     *   Returns:
     *     nothing
     */
    pub.init = function() {


    }

    return pub;

})(jQuery);


