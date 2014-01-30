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
                apiUrl : 'http://xeros.local/api/report/consumption/2013-11-10/2013-12-20.json',
                template : "consumption",
                callback : "consumptionCallback"
            }
     ];

    function consumptionCallback () {
        jQuery('.consumption__machine, .link').click(function(event) {
            event.preventDefault();
            //showPage(jQuery('#page-3'));
            document.location.href='consumption-details';
        });

        createDropDown("#consumption-select");
    }
</script>

<div id="page-2" class="main page">
    <div class="page-container">
        <div id="consumption">...</div>
    </div>
</div>