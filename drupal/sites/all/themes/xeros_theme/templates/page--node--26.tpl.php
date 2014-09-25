<?php
/**
 * @file
 * Returns the HTML for a single Drupal page.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728148
 */
?>

<div id="landing">
	<div class="sb_banner_bar">
  	<div class="sb_logo"></div>
  </div>
<!--

     You can add or remove anything in this page.  We will set to home page later.
-->


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
                Status Message
            </div>
          <?php print render($tabs); ?>
          <?php print render($page['help']); ?>

<!-- Render the login block -->
<?php   $sidebar_second = render($page['sidebar_second']); ?>
        <?php if ($sidebar_second): ?>
          <aside class="login"><h3>Member Login</h3>
            <?php print $sidebar_second; ?>
          </aside>
        <?php endif; ?>


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
</div>

<?php print render($page['footer']); ?>
<?php print render($page['bottom']); ?>