var FF = FF || {};

FF.Controls = FF.Controls || {};

/**
 * FF - Controls.Dropdown
 *
 *
 * Created by jason on 10/1/14
 */
FF.Controls.Dropdown = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.create = create;

    function create(selector, callback) {
        // Select list
        var source = $(selector);
        // Currently selected
        var selected = source.find("option[value=" + source.val() + "]");
        // Options
        var options = $("option", source);
        // New fancy dropdown
        var targetId = $(selector).attr('id') + "__dl";

        // Append the new fancy dropdown
        $(source).after('<dl id=' + targetId + ' class="dropdown" select-list="' + selector + '"></dl>');

        // Select the new fancy dropdown
        var source_dl = $("#" + targetId);

        // Append the caret
        source_dl.append('<dt><a href="#">' + selected.text() +
            '<span class="caret-down"></span><span class="value">' + selected.val() +
            '</span></a></dt>')
        source_dl.append('<dd><ul></ul></dd>')

        // Append the options
        options.each(function () {
            source_dl.find(" dd ul").append('<li><a href="#">' +
                $(this).text() + '<span class="value">' +
                $(this).val() + '</span></a></li>');
        });

        // Override the A link default action and add a display toggle
        source_dl.find("dt a").click(function (event) {
            event.preventDefault();
            source_dl.find("dd ul").toggle();
        });

        // Bind a click event to the document to automatically close the drop down
        $(document).bind('click', function (e) {
            var $clicked = $(e.target);
            if (!$clicked.parents().hasClass("dropdown"))
            //$("#cal").removeClass("show");
                $(".dropdown dd ul").hide();
        });

        // Bind a click event to the link to update the select list and call a callback function
        source_dl.find("ul li a").click(function (event) {
            event.preventDefault();
            // Update display

            var text = $(this).html() + '<span class="caret-down"></span>';
            source_dl.find("dt a").html(text);
            source_dl.find("dd ul").hide();

            var click_value = $(this).find("span.value").html();
            $(source_dl.attr("select-list")).val(click_value);

            if (Object.prototype.toString.call(callback) == "[object Function]") {
                callback(event);
            }
        });
    }

    return pub;
})(jQuery);
