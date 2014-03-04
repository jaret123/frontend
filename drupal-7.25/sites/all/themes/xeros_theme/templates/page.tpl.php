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
    <div class="error-messages">
        Status Message
    </div>
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
            <phone><span class="icon-Phone"></span>1-855-XEROS NA (1-855-937-6762)</phone><br/>
            <a href="mailto:Jonathan.benjamin@xeroscleaning.com"><span class="icon-Email"></span>Jonathan.benjamin@xeroscleaning.com</a><br/>
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

<!-- begin olark code -->
<script data-cfasync="false" type='text/javascript'>/*<![CDATA[*/window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){
        f[z]=function(){
            (a.s=a.s||[]).push(arguments)};var a=f[z]._={
        },q=c.methods.length;while(q--){(function(n){f[z][n]=function(){
            f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={
            0:+new Date};a.P=function(u){
            a.p[u]=new Date-a.p[0]};function s(){
            a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){
            hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){
            return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){
            b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{
            b.contentWindow[g].open()}catch(w){
            c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{
            var t=b.contentWindow[g];t.write(p());t.close()}catch(x){
            b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({
        loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
    /* custom configuration goes here (www.olark.com/documentation) */
    olark.identify('5370-676-10-6367');/*]]>*/</script><noscript><a href="https://www.olark.com/site/5370-676-10-6367/contact" title="Contact us" target="_blank">Questions? Feedback?</a> powered by <a href="http://www.olark.com?welcome" title="Olark live chat software">Olark live chat software</a></noscript>
<!-- end olark code -->
