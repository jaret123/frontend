var exportPDF = {

    l : 0, // Line number
//    createPNG: function(svg) {
//
//        // Canvg requires trimmed content
//        content = svg.html().trim(),
//            canvas = document.getElementById('svg-canvas');
//
//        // Draw svg on canvas
//        canvg(canvas, content);
//
//        // Change img be SVG representation
//        var theImage = canvas.toDataURL('image/png');
//        $('#svg-img').attr('src', theImage);
//    },

    init : function () {
        var $ = jQuery.noConflict();
        var doc = new jsPDF();

        // We'll make our own renderer to skip this editor
        var specialElementHandlers = {

            '#editor': function(element, renderer){
                return true;
            },
            'div.col.title': function(element, renderer) {
                doc.text(element, 5, exportPDF.l * 40);
                return true;
            },
            'svg': function(element, renderer){
                exportPDF.l += 1;

                //doc.text("Draw a graph", 20, exportPDF.l * 40);

                //load a svg snippet in the canvas with id = 'drawingArea'
                var chart = $(element).html();
                var canvas = document.getElementById("drawingArea");

                canvg(canvas, chart, {ignoreDimensions: false,
                                      ignoreAnimation: false,
                                      offSetX: 0,
                                      offSetY: 0});

                var img = canvas.toDataURL("image/jpeg");

                renderer.pdf.addImage(img, 'JPEG', 50, 30 + (exportPDF.l * 40));
                //doc.addImage(img);
                return true;
            }
//            'svg': function(element, renderer){
//                doc.text("Draw a graph", 20, 20);
//
//                //load a svg snippet in the canvas with id = 'drawingArea'
//                //var chart = $('svg');
//                //var canvas = document.getElementById("drawingArea");
//
//
//                doc.addSVG(element, 10, 10, 327, 150);
//                //doc.addImage(img);
//                doc.addPage();
//                return true;
//            }
        };



        $(".download-pdf").click( function (e){

            e.preventDefault();

            var $ = jQuery.noConflict();

            var doc = new jsPDF();

            //mydoc = jQuery(".template-container");
            // All units are in the set measurement for the document
            // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
//            doc.fromHTML(mydoc.get(0), 15, 15, {
//                'width': 170,
//                'elementHandlers': specialElementHandlers
//            });

            doc.text("Total Savings", 20, 20);

            //load a svg snippet in the canvas with id = 'drawingArea'
            var chart = $(".kpi-chart.total").html();
            var canvas = document.getElementById("drawingArea");

            canvg(canvas, chart, {ignoreDimensions: false,
                ignoreAnimation: false,
                offSetX: 0,
                offSetY: 0});

            var img = canvas.toDataURL("image/jpeg");

            doc.addImage(img, 'JPEG', 60, 20 - 5);

            doc.text("Total Savings", 150, 20);
            doc.text("$10,208", 150, 30);
            doc.text("Actual Cost", 150, 40);
            doc.text("$4,603", 150, 50);
            doc.text("Potential Cost", 150, 60);
            doc.text("54%", 150, 70);


            //var file = demos[$('#template').val()];
            var file = "";
            if (file === "undefined") {
                file = 'demo';
            }
            doc.save('test.pdf');
        });
    }
}