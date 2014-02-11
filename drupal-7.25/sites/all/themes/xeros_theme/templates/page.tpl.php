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
            <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home"><img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>"/></a>
        <?php endif; ?>
    </div>
    <div class="header__row-1">
        <?php print render($page['header']); ?>
    </div>
    <div class="header__row-2">
        <?php print render($page['navigation']); ?>
        <!--                  <ul class="header__main-menu">-->
        <!--                  TODO: Need to add these IDs to the links or re-do JS    -->
        <!--                      <li id="menu-dashboard" class="active">Dashboard</li>-->
        <!--                      <li id="menu-consumption">Consumption</li>-->
        <!--                  </ul>-->
        <?php
            if ( $user->uid > 0 ) {
        ?>
            <span class="header__welcome">Welcome <?php print $user->name ; ?></span>
        <?php
            }; // endif
        ?>

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
          <?php print render($tabs); ?>
          <?php print render($page['help']); ?>
          <?php if ($action_links): ?>
            <ul class="action-links"><?php print render($action_links); ?></ul>
          <?php endif; ?>
          <?php print render($page['content']); ?>
          <?php print $feed_icons; ?>
        </div>

        <?php
          // Render the sidebars to see if there's anything in them.
          $sidebar_first  = render($page['sidebar_first']);
          $sidebar_second = render($page['sidebar_second']);
        ?>

        <?php if ($sidebar_first || $sidebar_second): ?>
          <aside class="sidebars">
            <?php print $sidebar_first; ?>
            <?php print $sidebar_second; ?>
          </aside>
        <?php endif; ?>

</div>
<footer class="footer">
    <div class="footer-wrapper">

        <div class="footer__logo">
            <img src="/sites/all/themes/xeros_theme/images/xeros_logo.png"/>
        </div>
        <div class="footer__left">
            <a href="www.xeroscleaning.com">BACK TO XEROS WEBSITE</a>
        </div>

        <div class="footer__middle">
            <a href="http://www.xeroscleaning.com/contact-us/">CONTACT US</a><br/>
            <phone>1-855-XEROS NA (1-855-937-6762)</phone><br/>
            <a href="mailto:Jonathan.benjamin@xeroscleaning.com">Jonathan.benjamin@xeroscleaning.com</a><br/>
        </div>

        <div class="footer__right">
            CONNECT<br/>
            <a href="https://twitter.com/XerosLtd" title="" class="icon-Twitter"></a>
            <a href="http://www.facebook.com/pages/Xeros-Ltd/278750025534402" title="" class="icon-Facebook"></a>
            <a href="http://www.linkedin.com/company/2695466?trk=tyah" title="" class="icon-LinkedIn"></a>
        </div>

    </div>

</footer>

<?php print render($page['bottom']); ?>
