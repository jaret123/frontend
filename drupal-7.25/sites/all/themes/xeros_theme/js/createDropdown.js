/**
 * Created by jason on 1/2/14.
 */
function createDropDown(selector, callback){
    var source = jQuery(selector);
    var selected = source.find("option[selected]");
    var options = jQuery("option", source);
    var targetId = jQuery(selector).attr('id') + "__dl";

    jQuery(source).after('<dl id=' + targetId + ' class="dropdown" select-list="' + selector + '"></dl>');

    var source_dl = jQuery("#" + targetId);

    source_dl.append('<dt><a href="#">' + selected.text() +
        '<span class="caret-down"></span><span class="value">' + selected.val() +
        '</span></a></dt>')
    source_dl.append('<dd><ul></ul></dd>')

    options.each(function(){
        // TODO: Need to figure out how to update the link to the machine
        source_dl.find(" dd ul").append('<li><a href="#">' +
            jQuery(this).text() + '<span class="value">' +
            jQuery(this).val() + '</span></a></li>');
    });

    source_dl.find("dt a").click(function(event) {
        event.preventDefault();
        source_dl.find("dd ul").toggle();
    });

    jQuery(document).bind('click', function(e) {
        var jQueryclicked = jQuery(e.target);
        if (! jQueryclicked.parents().hasClass("dropdown"))
            jQuery(".dropdown dd ul").hide();
    });

    source_dl.find("ul li a").click(function(event) {
        event.preventDefault();
        // Update display

        var text = jQuery(this).html();
        source_dl.find("dt a").html(text);
        source_dl.find("dd ul").hide();
        jQuery(source_dl.attr("select-list")).val(jQuery(this).find("span.value").html());

        // Go do something
        if (Object.prototype.toString.call(callback) == "[object Function]") {
            callback(event);
        }
    });
}