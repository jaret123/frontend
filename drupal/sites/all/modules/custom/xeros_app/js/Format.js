var FF = FF || {};

/**
 * FF - Format
 *
 *
 * Created by jason on 10/1/14
 */
FF.Format = (function ($) {

    var pub = {},
        els = {};

    pub.pad = function(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    pub.numberWithCommas = function (x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    pub.sqlDate = function(d) {
        // d needs to be a native js date object (new Date())
        var _sqlDate = "" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        return _sqlDate;
    };

    pub.toLocaleString = function(value,dec) {

        var d = parseInt(dec);
        if ( typeof(d) !== "number" ) {
            dec = 0;
        }
        var t = parseFloat(value);
        t = t.toFixed(dec);
       //var b =  Math.round(value*(Math.pow(10,dec)))/Math.pow(10,dec);
      //  console.log(value,b);
        //t = parseFloat(t);
        t = FF.Format.numberWithCommas(t);
      // b = FF.Format.numberWithCommas(b);
      // console.log(t);
        //console.log(b);
        return t;
    }

    pub.HealthtoLocaleString = function(value,dec) {
        var b =  Math.round(value*(Math.pow(10,dec)))/Math.pow(10,dec);
        b = FF.Format.numberWithCommas(b);
        return b;
    }
    // Public functions/objects
    pub.init = init;


    function init() {

    }

    return pub;
})(jQuery);
