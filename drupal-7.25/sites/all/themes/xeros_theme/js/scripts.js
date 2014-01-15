

jQuery( document ).ready(function() {
    console.log( "ready!" );

    loadTemplate("kpis", function() {
        //showPage(jQuery('#page-1'));
        createDropDown("#kpi-select");
        chart();
    } );
    loadTemplate("news");
    loadTemplate("consumption", bindLinks);
    loadTemplate("consumption-details", function() {
        createDropDown("#consumption-details-select");
        createDropDown("#report-select", function(){
            showSection();
            //console.log("Do Nothing");
        });

        jQuery( "#report-select" ).on( "change", function(event) {
            event.preventDefault();
            alert( jQuery( this ).text() );
        });

    });

//    jQuery('#menu-dashboard').click(function(event) {
//            event.preventDefault();
//            jQuery(".header__main-menu li").removeClass("active");
//            jQuery(this).addClass("active");
//            //showPage(jQuery('#page-1'));
//        }
//    );
//
//    jQuery('#menu-consumption').click(function(event) {
//            event.preventDefault();
//            jQuery(".header__main-menu li").removeClass("active");
//            jQuery(this).addClass("active");
//            //showPage(jQuery('#page-2'));
//        }
//    )

});

var ql = 400;

function showPage(box) {
    // Hide active
    jQuery( "div").stop();
    if (jQuery("div.active").length > 0) {
        jQuery("div.active").removeClass("active").animate( { opacity : 0 }, ql, function() {
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
    jQuery(".page-wrapper").animate({ "height": h}, ql, function() {
        box.addClass("active").animate( {opacity: 1}, ql );
    });
}

function bindLinks () {
    jQuery('.consumption__machine, .link').click(function(event) {
        event.preventDefault();
        //showPage(jQuery('#page-3'));
        document.location.href='consumption-details';
    });


    createDropDown("#consumption-select");
};

function loadTemplate(templateName, callback) {

    if (arguments.length == 2) { // if only two arguments were supplied
        if (Object.prototype.toString.call(callback) == "[object Function]") {
            var c = callback;
        }
    }

    var filename = "/sites/all/themes/xeros_theme/ms-templates/" + templateName + ".html";

    jQuery.get( filename,
        function(template) {
            var html = Mustache.to_html(template, data);
            jQuery('#' + templateName).html(html);
            if (typeof c != "undefined") {
                c();
            }
        },
        'text');
}


