<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>


<div id="page-1" class="main page">
    <div class="page-container">
        <div class="container">
            <div id="kpis" class="kpis">...</div>
            <div id="news" class="news">...</div>
        </div>
    </div>
</div>
<script src="/sites/all/themes/xeros_theme/js/scripts.js"></script>
<script>
    var reports = [
        {
            rid : 1,
            apiUrl : '/api/report/kpis/2013-12-01/2013-12-07.json',
            template : "kpis",
            callback : "kpiCallback"
        }

//        {
//            rid : 2,
//            apiUrl : 'http://xeros.local/api/report/7/news/123/321.json',
//            template : "news",
//            callback : "newsCallback"
//        }
    ];

    function kpiCallback(data) {
        createDropDown("#kpi-select");
        for ( row in data.data ) {
            var chart = new kpiChart( data.data[row] );
        }
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