var controls = {
    showSpinner: function () {
        var opts = {
            lines: 15, // The number of lines to draw
            length: 32, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 30, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 0.7, // Rounds per second
            trail: 93, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: true, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
    },
    createDropDown: function (selector, callback) {
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

        options.each(function () {
            // TODO: Need to figure out how to update the link to the machine
            source_dl.find(" dd ul").append('<li><a href="#">' +
                jQuery(this).text() + '<span class="value">' +
                jQuery(this).val() + '</span></a></li>');
        });

        source_dl.find("dt a").click(function (event) {
            event.preventDefault();
            source_dl.find("dd ul").toggle();
        });

        jQuery(document).bind('click', function (e) {
            var jQueryclicked = jQuery(e.target);
            if (!jQueryclicked.parents().hasClass("dropdown"))
                jQuery(".dropdown dd ul").hide();
        });

        source_dl.find("ul li a").click(function (event) {
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
    },
    createReportSelect : function() {
        createDropDown("#report-select", function (event) {
            app.metric = jQuery(event.target).find("span.value").html();
            window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
        });
    },
    createTimeSelect : function() {
        createDropDown("#time-select", function () {
            app.dateRange = jQuery(event.target).find("span.value").html();
            // Refresh data
            app.dataRefresh = 1;
            window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
        });
    },
    createMachineNav : function() {
        // Machine navigation
        jQuery("#machine").find(".caret-left-wrapper").click(function () {
            if (app.machine > 1) {
                app.machine = app.machine - 1;
            }
            window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
        })

        jQuery("#machine").find(".caret-right-wrapper").click(function () {
            if (app.machine < app.machineMax) {
                app.machine = parseInt(app.machine) + parseInt(1);
            }
            window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
        })
    },
    initialize : function() {
        // We can call all of these because the jQuery selectors will just return an empty result if the element
        // is not on the page.
        //this.showSpinner();
        this.createReportSelect();
        this.createTimeSelect();
    }
}

// Initialize
controls.initialize();

