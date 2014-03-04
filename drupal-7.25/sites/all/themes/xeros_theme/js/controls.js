var controls = {

    machines : [],
    showSpinner: function () {
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
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
    },
    hideSpinner: function () {
        var target = document.getElementById('spinner');
        jQuery(target).hide();
    },
    createDropDown: function (selector, callback) {
        var source = jQuery(selector);
        var selected = source.find("option[value=" + source.val() + "]"); //source.val(); //source.find("option[selected]");
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
                //jQuery("#cal").removeClass("show");
                jQuery(".dropdown dd ul").hide();
        });

        source_dl.find("ul li a").click(function (event) {
            event.preventDefault();
            // Update display

            var text = jQuery(this).html() + '<span class="caret-down"></span>';
            source_dl.find("dt a").html(text);
            source_dl.find("dd ul").hide();

            var click_value = jQuery(this).find("span.value").html();
            jQuery(source_dl.attr("select-list")).val(click_value);

            if (Object.prototype.toString.call(callback) == "[object Function]") {
                callback(event);
            }
        });
    },
    createReportSelect : function() {
        var self = this;
        jQuery("#report-select").val(app.sessionMetric);
        //jQuery("#report-select").val("hot_water");
        self.createDropDown("#report-select", function (event) {
            app.metric = jQuery(event.target).find("span.value").html();
            window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
        });
    },
    createTimeSelect : function() {
        var self = this;
        jQuery("#time-select").val(app.sessionTimeSelect);
        self.createDropDown("#time-select", function (event) {

            var click_value = jQuery(event.target).find("span.value").html();

            // This is specific to the time select - TODO: Refactor if we add more controls
            if ( click_value === "custom") {
                // Show the custom date range picker
                jQuery("#cal").addClass("show");
            } else {
                // Go do something
                jQuery("#cal").removeClass("show");
                app.dateRange = jQuery(event.target).find("span.value").html();
                // Refresh data
                app.dataRefresh = 1;
                window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
            }
        });

        // Add the calendar picker
        var k = new Kalendae({
            attachTo:document.getElementById("cal"),
            months:3,
            mode:'range',
            direction: "today-past",
            selected:[Kalendae.moment().subtract({M:2}), Kalendae.moment().subtract({D:1})]
        });

        jQuery(".cal__button-submit").unbind().click(function (e) {
            jQuery("#cal").removeClass("show");
            console.log("submit");

            // Set date range
            app.dateRange = 'custom,' + k.getSelectedAsText();
            // Refresh data
            app.dataRefresh = 1;
            // Set the dates to custom
            // TODO: Figure out how this affects routing
            window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
        });

        jQuery(".cal__button-cancel").unbind().click(function (e) {
            console.log("cancel");
            jQuery("#cal").removeClass("show");
        });

    },
    createExport : function() {
        // Bind the download links

        // On clicking export PDF put the data into the form then redirect to the PDF.
        jQuery("#download__pdf").click(function(e) {

            e.preventDefault();
            app.data.chart = {};

            // Add the images to app.data.charts[]
            jQuery(".chart").each(function() {

                var content = jQuery(this).html().trim(),
                    canvas = document.getElementById('drawingArea');

                canvg(canvas, content);

                var theImage = canvas.toDataURL('image/png');
                app.data.chart[jQuery(this).attr("name")] = theImage;
            });

            var form = jQuery("#download__pdf-form");
            jQuery(form).find("#download__pdf-form-data").html(JSON.stringify(app.data));
            console.log(form);

            jQuery(form).submit();
        });
    },
    setCsvLink : function() {
        var href = "/api/csv/" + app.sessionDateRange[0] + "/" + app.sessionDateRange[1] ;
        jQuery("#download__csv").attr("href", href ) ;
    },
    setDateRangeDisplay : function() {
        jQuery(".date-range__from").html(app.sessionDateRange[0]);
        jQuery(".date-range__to").html(app.sessionDateRange[1]);
    },
    createMachineNav : function() {
        // Machine navigation
        self = this;
        self.machines = [];
        for (var key in app.data.data) {
            self.machines.push(key);
        };

        var currentMachineIndex,
            leftArrow,
            rightArrow,
            machinesLength;

        leftArrow = jQuery("#machine").find(".caret-left-wrapper");
        rightArrow = jQuery("#machine").find(".caret-right-wrapper");

        machinesLength = controls.machines.length;

        //currentMachine = controls.machines.indexOf(app.machine);
        currentMachineIndex = controls.machines.indexOf(app.machine);

        jQuery(leftArrow).removeClass("active")
            .unbind();
        jQuery(rightArrow).removeClass("active")
            .unbind();

        if (currentMachineIndex > 0) {
            jQuery(leftArrow).addClass("active")
                .click(function () {
                    app.machine = controls.machines[currentMachineIndex - 1];
                    window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
            })
        }
        if (currentMachineIndex < (machinesLength - 1)) {
            jQuery(rightArrow).addClass("active")
                .click(function () {
                    app.machine = controls.machines[currentMachineIndex + 1];
                    window.location.hash = app.machine + "+" + app.metric + "+" + app.dateRange;
                })
        }

    },
    initialize : function() {
        // We can call all of these because the jQuery selectors will just return an empty result if the element
        // is not on the page.
        //this.showSpinner();
//        this.createReportSelect();
//        this.createTimeSelect();
    }
}

// Initialize
controls.initialize();

