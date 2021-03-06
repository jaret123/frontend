<?php
/**
 * @file
 * Returns the HTML for a single Drupal page.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728148
 */
?>
<div class="top-border"></div>
<header class="header">
    <div class="header__logo">
        <?php if ($logo): ?>
            <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home">
            </a>
        <?php endif; ?>
    </div>
    <div class="header__row-1">
        <?php print render($page['header']); ?>
    </div>
    <div class="header__row-2">
        <?php print render($page['navigation']); ?>
        <?php if (user_is_logged_in()) : ?>
          <span class="header__welcome">Welcome <?php print $user->name ; ?><br/>
            Company: <span class="header__company"></span><br/>
            Location: <span class="header__location"></span>
          </span>
        <?php endif; ?>
    </div>
</header>

<div class="page-wrapper">
<!--      <div id="page">-->
<!--      <div id="main">-->

        <div id="content" class="column" role="main">
          <?php print render($page['highlighted']); ?>
          <a id="main-content"></a>
          <?php print render($title_prefix); ?>
          <?php if ($title): ?>
            <h1 class="page__title title" id="page-title"><?php print $title; ?></h1>
          <?php endif; ?>
          <?php print render($title_suffix); ?>
          <?php print $messages; ?>
            <div class="error-messages">
                <?php print t("Status Message"); ?>
            </div>
          <?php print render($tabs); ?>
          <?php print render($page['help']); ?>
          <?php if ($action_links): ?>
            <ul class="action-links"><?php print render($action_links); ?></ul>
          <?php endif; ?>
          <?php print render($page['content']); ?>
          <?php print $feed_icons; ?>
        </div>

<!--        --><?php
//          // Render the sidebars to see if there's anything in them.
//          $sidebar_first  = render($page['sidebar_first']);
//          $sidebar_second = render($page['sidebar_second']);
//        ?>
<!---->
<!--        --><?php //if ($sidebar_first || $sidebar_second): ?>
<!--          <aside class="sidebars">-->
<!--            --><?php //print $sidebar_first; ?>
<!--            --><?php //print $sidebar_second; ?>
<!--          </aside>-->
<!--        --><?php //endif; ?>

</div>

<?php print render($page['footer']); ?>
<?php print render($page['bottom']); ?>
<canvas id="drawingArea" style="display:none;position: fixed; top: 100px; left: 150px; background-color: antiquewhite;"></canvas>
