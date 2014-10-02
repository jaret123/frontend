var FF = FF || {};

/**
 * FF - Controls-PDF
 *
 *
 * Created by jason on 10/1/14
 */
FF.Controls.Pdf = (function ($) {

    var pub = {},
        els = {};

    // Public functions/objects
    pub.create = create;

    var image;

    var content;

    var canvas;

    var charts = {};

    function create() {
        // On clicking export PDF put the data into the form then redirect to the PDF.
        $("#download__pdf").click(function(e) {

            e.preventDefault();

            // Add the images to app.data.charts[]
            $(".chart").each(function() {

                content = d3.select(this).select("svg");

                canvas = document.getElementById('drawingArea');

                // Note, depends on canvg
                canvg(canvas, $(this).html().trim(), { ignoreDimensions: false });

                image = canvas.toDataURL('image/png');

                charts[$(this).attr("name")] = image;
            });

            els.form = $("#download__pdf-form");
            els.form.find("#download__pdf-form-data").html(JSON.stringify({
                title : $("#page-title").html(),
                reportData : app.reportData,
                charts : charts,
                dateRange : FF.User.reportSettings.dateRange,
            }));

            els.form.submit();

        });
    }

    return pub;
})(jQuery);
