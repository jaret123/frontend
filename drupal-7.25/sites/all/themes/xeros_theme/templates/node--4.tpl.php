<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>

<script>
    var reports = [
        {
            rid : 1,
            apiUrl : 'http://xeros.local/api/report/consumptionDetails/2013-11-10/2013-12-20.json',
            template : "consumption-details",
            callback : "consumptionDetailsCallback"
        }
    ];

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
</script>


<div id="page-3" class="main page">
    <div class="page-container">
        <div id="consumption-details">...</div>
    </div>
</div>