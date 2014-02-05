<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>

<div id="page-2" class="main page">
    <div class="page-container">
        <div id="consumption">...</div>
    </div>
</div>

<script>
    // Refactor to the view
    var reports = [
        {
            rid : 1,
            apiUrl : '/api/report/consumption/2013-11-10/2013-12-20.json',
            template : "consumption",
            callback : "consumptionCallback"
        }
    ];

    function consumptionCallback () {
        jQuery('.consumption__machine, .link').click(function(event) {
            var classification = jQuery(this).attr("classification");
            var machine_id = jQuery(this).attr("machine");
            event.preventDefault();
            console.log(jQuery(this).attr("classification"));

            document.location.href='consumption-details#' + machine_id + "+" + classification;
        });

        createDropDown("#consumption-select");
    }
    jQuery(document).ready(function () {
        console.log("ready!");

        // Load the templates for each report on the page
        for (var i = 0; i < reports.length; i++) {
            var r = reports[i];
            loadTemplate(r.template, r.apiUrl, window[r.callback])
        }

    });
</script>

<script src="/sites/all/themes/xeros_theme/js/spin.min.js"></script>
<script src="/sites/all/themes/xeros_theme/js/scripts.js"></script>
<script src = "/sites/all/themes/xeros_theme/js/consumption.js" ></script>