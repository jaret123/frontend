jQuery(document).ready(function () {
    console.log("ready!");

    function consumptionDetailsCallback(data) {
        createDropDown("#consumption-details-select");
        createDropDown("#report-select", function () {
            showSection();
            //console.log("Do Nothing");
        });

        jQuery("#report-select").on("change", function (event) {
            event.preventDefault();
            alert(jQuery(this).text());
        });
    }

    // Load the templates for each report on the page
    for (var i = 0; i < reports.length; i++) {
        var r = reports[i];
        loadTemplate(r.template, r.apiUrl, window[r.callback])
    }

    var ql = 400;

    function showPage(box) {
        // Hide active
        jQuery("div").stop();
        if (jQuery("div.active").length > 0) {
            jQuery("div.active").removeClass("active").animate({ opacity: 0 }, ql, function () {
                fadeBoxIn(box);
            });
        } else {
            fadeBoxIn(box);
        }
    }

    function showSection() {
        // TODO: Dirty, need to clean this up.
        var section_index = jQuery("#report-select").val() - 1;
        var section = [
            'cold', 'hot', 'total', 'cycle', 'chem'
        ];

        jQuery(".section-wrapper").hide();
        jQuery("#section-" + section[section_index]).show();

    }

    function fadeBoxIn(box) {
        var h = box.height() + 40;
        // Resize the container and fade in the new box
        jQuery(".page-wrapper").animate({ "height": h}, ql, function () {
            box.addClass("active").animate({opacity: 1}, ql);
        });
    }

    function loadTemplate(templateName, apiUrl, callback) {

        // Make sure callback is a function
        if (arguments.length == 3) { // if only two arguments were supplied
            if (Object.prototype.toString.call(callback) == "[object Function]") {
                var c = callback;
            }
        }

        // Load the template file from the directory
        var filename = "/sites/all/themes/xeros_theme/ms-templates/" + templateName + ".html";

        // Get the data, merge the template, then callback
        jQuery.ajax({
            url: apiUrl,
            dataType: 'json',
            success: function (data) {
                jQuery.get(filename,
                    function (template) {
                        var html = Mustache.to_html(template, data);
                        jQuery('#' + templateName).html(html);
                        if (typeof c != "undefined") {
                            c(data);
                        }
                    },
                    'text');
            }
        })
    }
});