<?php

/**
 * Block template for date-select
 */
?>
<div id="kpis__select" class="time__select kpis__select select">
    <span>
          <span>Timeframe</span>
          <select id="time-select" autofocus class="flagvisibility">
              <option value="weekToDate">Week To Date</option>
              <option value="monthToDate" selected>Month to Date</option>
              <option value="yearToDate">Year to Date</option>
              <option value="custom">Custom...</option>
          </select>
    </span>

    <div id="cal">
        <div class="cal__button">
            <div class="cal__button-submit">Get Data</div>
            <div class="cal__button-cancel">Cancel</div>
        </div>
    </div>
</div>