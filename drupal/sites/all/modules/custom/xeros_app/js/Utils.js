var FF = FF || {};

/**
 * FF - Utils
 *
 *
 * Created by Ron Kozlowski  on 12/06/2015
 */
FF.Utils = (function ($) {
    var pub = {};

    pub.msieVersion = function() {

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');

        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        if (trident > 0) {
            // IE 11 (or newer) => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        // other browser
        return false;

    }

    // Public functions/objects
    pub.init = init;

    function init() {

    }

    return pub;
})(jQuery);

//TODO put below into UTils - RK

function checkNested(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments),
        obj = args.shift();

    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
}

// var test = {level1:{level2:{level3:'level3'}} };

// checkNested(test, 'level1', 'level2', 'level3'); // true


