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

      $user->company = t("No company assigned");
      $user->location = t("No location assigned");

      if (isset($u->field_company['und'][0]['target_id'])) {
        $company = node_load($u->field_company['und'][0]['target_id']);
        $user->company = $company->title;
      }
      if (isset($u->field_location['und'][0]['target_id'])) {
        $location = node_load($u->field_location['und'][0]['target_id']);
        $user->location = $location->title;
      }
      ?>
      <span class="header__welcome"><?php print t('welcome'); ?> <?php print $user->name ; ?><br/>
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


<!--    <div class="refresh-timestamp">Data refreshed <span class="refresh-timestamp__data"></span></div>-->

    <div class="controls__section">
      <div class="controls__header">

      </div>
      <div class="controls__details">
        <span>Filter by Status: </span>
        <span class="controls filter red" data-filter="red"><i class="fa status-icon"></i><div class="controls__label">0</div></span>
        <span class="controls filter yellow" data-filter="yellow"><i class="fa status-icon"></i><div class="controls__label">0</div></span>
        <span class="controls filter green" data-filter="green"><i class="fa status-icon"></i><div class="controls__label">0</div></span>
        <span class="controls filter grey" data-filter="grey"><i class="fa status-icon"></i><div class="controls__label">0</div></span>
        <!--        <span class="controls filter blue" data-filter="blue"><i class="fa status-icon"></i>10 </span>-->
      </div>
      <div class="controls__model">
        <span>Model: </span>
        <span class="controls filter xeros" data-filter="xeros"><i class="fa model-icon"></i><div class="controls__label">0</div></span>
        <span class="controls filter non-xeros" data-filter="non-xeros"><i class="fa model-icon"></i><div class="controls__label">0</div></span>
      </div>
      <div class="page-ops__key">
        <div class="key__header">
          <div class="key__title">Key</div>
          <i class="fa fa-chevron-down key__open-close"></i>
        </div>
        <div class="key__details">
          <div class="title">
            <?php print t('Status'); ?>
          </div>
          <div class="green key__item">
            <?php print t('Machine is active.'); ?>
          </div>
          <div class="yellow key__item">
            <?php print t('Machine is idle.'); ?>
          </div>
          <div class="red key__item">
            <?php print t('Alert.  See status message for details.'); ?>
          </div>
          <div class="grey key__item">
            <?php print t('Machine is not currently being monitored.'); ?>
          </div>
          <div class="title">
            <?php print t('Machine Type'); ?>
          </div>
          <div class="xeros key__item">
            <?php print t(' Xeros Machine.'); ?>
          </div>
          <div class="non-xeros key__item">
            <?php print t('Non Xeros Machine.'); ?>
          </div>
<!--          <div class="blue key__item">-->
<!--            <i class="fa fa-bolt"></i>-->
<!--            <p>Cannot connect to machine.</p>-->
<!--          </div>-->
        </div>
      </div>

      <div class="controls__display">
        <span>Display: </span>
<!--        <span class="controls display-type block" data-display-type="block">Block </span>-->
<!--        <span class="controls display-type list" data-display-type="list">List </span>-->
<!--        <span class="controls display-type" data-display-type="icon" >Icons </span>-->
<!--        <span class="controls display-type" data-display-type="block" >Blocks </span>-->

        <span class="controls show-label" > <?php print t('Show Labels'); ?> </span>
        <span class="controls show-details" ><?php print t('Show Details'); ?> </span>

        <span class="controls full-screen" data-display="full-screen"><?php print t('Full Screen'); ?></span>
      </div>

    </div>

    <?php print render($page['content']); ?>

    <div class="machine-status">...</div>
    <div class="countdown-timer"></div>
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
    <?php print render($page['footer']); ?>
  </div>
</footer>
<div class="machine-detail">...</div>
<?php print render($page['bottom']); ?>