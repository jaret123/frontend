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
            apiUrl : 'http://xeros.local/api/report/7/kpis/123/321.json',
            template : "kpis",
            callback : "kpiCallback"
        },
        {
            rid : 2,
            apiUrl : 'http://xeros.local/api/report/7/news/123/321.json',
            template : "news",
            callback : "newsCallback"
        }
    ];

    
</script>

<div id="page-1" class="main page">
    <div class="page-container">
        <div class="container">
            <div id="kpis" class="kpis">...</div>
            <div id="news" class="news">...</div>
        </div>
    </div>
</div>