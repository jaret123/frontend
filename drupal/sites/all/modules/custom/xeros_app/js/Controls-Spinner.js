var FF = FF || {};

FF.Controls = FF.Controls || {};
/**
 * FF - Controls-Spinner
 *
 *
 * Created by jason on 10/1/14
 */
FF.Controls.Spinner = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.show = show;
    pub.hide = hide;

    var opts = {
        lines: 10, // The number of lines to draw
        length: 20, // The length of each line
        width: 4, // The line thickness
        radius: 10, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 30, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: ['#77B8D5', '#0B7FB0'], // #rgb or #rrggbb or array of colors
        speed: 0.7, // Rounds per second
        trail: 93, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
//            top: 'auto', // Top position relative to parent in px
//            left: 'auto' // Left position relative to parent in px
    };

    function show() {
        var spinner = new Spinner(opts).spin($('#spinner'));
    }

    function hide() {
        $('#spinner').hide();
    }


    return pub;
})(jQuery);
