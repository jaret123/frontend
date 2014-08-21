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

    <?php
    // If logged in (0 is anonymous)
    if ( $user->uid > 0 ) :
      $u = user_load($user->uid);

      $user->company = "No company assigned";
      $user->location = "No location assigned";

      if (isset($u->field_company['und'][0]['target_id'])) {
        $company = node_load($u->field_company['und'][0]['target_id']);
        $user->company = $company->title;
      }
      if (isset($u->field_location['und'][0]['target_id'])) {
        $location = node_load($u->field_location['und'][0]['target_id']);
        $user->location = $location->title;
      }
      ?>
      <span class="header__welcome">Welcome <?php print $user->name ; ?><br/>
              Company: <span class="header__company"><?php print $user->company ?></span><br/>
              Location: <span class="header__location"><?php print $user->location ?></span>
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
      Status Message
    </div>
    <?php print render($tabs); ?>
    <?php print render($page['help']); ?>
    <?php if ($action_links): ?>
      <ul class="action-links"><?php print render($action_links); ?></ul>
    <?php endif; ?>

    <?php print render($page['content']); ?>

    <div class="machine-status">...</div>

  </div>

  <div class="page-ops__key">
    <h3>Key</h3>
    <div class="key">
      <div class="green key__item">
        <i class="fa fa-check"></i>
        <p>Connected, and in use according to usage parameters</p>
      </div>
      <div class="yellow key__item">
        <i class="fa fa-circle-o-notch"></i>
        <p>Connected, but idle</p>
      </div>
      <div class="red key__item">
        <i class="fa fa-times"></i>
        <p>Been idle for too long - machine not in use.</p>
      </div>
      <div class="blue key__item">
        <i class="fa fa-bolt"></i>
        <p>Cannot connect to machine.</p>
      </div>
    </div>


  </div>
</div>
<?php
// TODO: We need to figure out a different set of controls for the consumption details page since the navigation is
// by machine instead of location.
?>


<footer class="footer">
  <div class="footer-wrapper">

    <div class="footer__logo">
    </div>
    <div class="footer__left">
    </div>

    <div class="footer__middle">
    </div>

    <div class="footer__right">
    </div>

  </div>
</footer>
<div class="machine-detail">...</div>
<?php print render($page['bottom']); ?>