<?php

/**
 * Block template for admin menu
 */
?>
<?php //if (isset($node->nid)): ?>
  <?php if ( user_access('xeros change location') ): ?>
    <div class="location-picker">
      <div class="location-picker__wrapper">
        <a href="#" class="location-picker__button"><?php print t('Menu'); ?></a>
        <h4>
          <?php print t('Admin Menu'); ?>
        </h4>
        <div>
          <?php print t('Select Company'); ?>
        </div>

        <select id="company-select" autofocus="" class="flagvisibility">
          <option value="0"><?php print t('-select-'); ?></option>
        </select>
        <select id="location-select" autofocus="" class="flagvisibility">
          <option value=""><?php print t('-select company-'); ?></option>
        </select>
        <script id="options-tpl" type="text/x-handlebars-template">
          <option value="0"><?php print t('-select-'); ?></option>
          {{#each data}}
          <option value="{{@key}}">{{this.name}}</option>
          {{/each}}
        </script>
      </div>
    </div>
  <?php  endif; ?>
<?php // endif; ?>