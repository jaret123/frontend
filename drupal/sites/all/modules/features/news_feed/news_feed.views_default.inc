<?php
/**
 * @file
 * news_feed.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function news_feed_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'recent_news';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Recent News';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'News';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'some';
  $handler->display->display_options['pager']['options']['items_per_page'] = '5';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Field: Content: More Link */
  $handler->display->display_options['fields']['field_more_link']['id'] = 'field_more_link';
  $handler->display->display_options['fields']['field_more_link']['table'] = 'field_data_field_more_link';
  $handler->display->display_options['fields']['field_more_link']['field'] = 'field_more_link';
  $handler->display->display_options['fields']['field_more_link']['label'] = '';
  $handler->display->display_options['fields']['field_more_link']['exclude'] = TRUE;
  $handler->display->display_options['fields']['field_more_link']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_more_link']['element_default_classes'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['label'] = '';
  $handler->display->display_options['fields']['body']['exclude'] = TRUE;
  $handler->display->display_options['fields']['body']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['body']['element_default_classes'] = FALSE;
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['text'] = '<a href="[field_more_link]">[title]</a>';
  $handler->display->display_options['fields']['title']['alter']['make_link'] = TRUE;
  $handler->display->display_options['fields']['title']['alter']['path'] = '[field_more_link]';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  $handler->display->display_options['fields']['title']['element_type'] = 'h3';
  $handler->display->display_options['fields']['title']['element_class'] = 'news__title';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['element_default_classes'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Source Publish Date */
  $handler->display->display_options['fields']['field_source_publish_date']['id'] = 'field_source_publish_date';
  $handler->display->display_options['fields']['field_source_publish_date']['table'] = 'field_data_field_source_publish_date';
  $handler->display->display_options['fields']['field_source_publish_date']['field'] = 'field_source_publish_date';
  $handler->display->display_options['fields']['field_source_publish_date']['label'] = '';
  $handler->display->display_options['fields']['field_source_publish_date']['exclude'] = TRUE;
  $handler->display->display_options['fields']['field_source_publish_date']['element_class'] = 'news__date';
  $handler->display->display_options['fields']['field_source_publish_date']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_source_publish_date']['element_default_classes'] = FALSE;
  /* Field: Parsed Body */
  $handler->display->display_options['fields']['php']['id'] = 'php';
  $handler->display->display_options['fields']['php']['table'] = 'views';
  $handler->display->display_options['fields']['php']['field'] = 'php';
  $handler->display->display_options['fields']['php']['ui_name'] = 'Parsed Body';
  $handler->display->display_options['fields']['php']['label'] = '';
  $handler->display->display_options['fields']['php']['element_class'] = 'news__body';
  $handler->display->display_options['fields']['php']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['php']['element_default_classes'] = FALSE;
  $handler->display->display_options['fields']['php']['use_php_setup'] = 0;
  $handler->display->display_options['fields']['php']['php_output'] = '<?php 
$b = $data->_field_data[\'nid\'][\'entity\']->body[\'und\'][0][\'value\'];
$b = str_replace("Read More", "", $b);
print $b;

?>';
  $handler->display->display_options['fields']['php']['use_php_click_sortable'] = '0';
  $handler->display->display_options['fields']['php']['php_click_sortable'] = '';
  /* Field: Read More Link */
  $handler->display->display_options['fields']['nothing']['id'] = 'nothing';
  $handler->display->display_options['fields']['nothing']['table'] = 'views';
  $handler->display->display_options['fields']['nothing']['field'] = 'nothing';
  $handler->display->display_options['fields']['nothing']['ui_name'] = 'Read More Link';
  $handler->display->display_options['fields']['nothing']['label'] = '';
  $handler->display->display_options['fields']['nothing']['alter']['text'] = 'Read More';
  $handler->display->display_options['fields']['nothing']['alter']['make_link'] = TRUE;
  $handler->display->display_options['fields']['nothing']['alter']['path'] = '[field_more_link]';
  $handler->display->display_options['fields']['nothing']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['nothing']['element_wrapper_class'] = 'news__read-more';
  $handler->display->display_options['fields']['nothing']['element_default_classes'] = FALSE;
  /* Field: Content: Hubspot Tags HTML */
  $handler->display->display_options['fields']['field_hubspot_tags_html']['id'] = 'field_hubspot_tags_html';
  $handler->display->display_options['fields']['field_hubspot_tags_html']['table'] = 'field_data_field_hubspot_tags_html';
  $handler->display->display_options['fields']['field_hubspot_tags_html']['field'] = 'field_hubspot_tags_html';
  $handler->display->display_options['fields']['field_hubspot_tags_html']['label'] = '';
  $handler->display->display_options['fields']['field_hubspot_tags_html']['element_class'] = 'news__tags';
  $handler->display->display_options['fields']['field_hubspot_tags_html']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_hubspot_tags_html']['element_default_classes'] = FALSE;
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'news' => 'news',
  );

  /* Display: Block */
  $handler = $view->new_display('block', 'Block', 'block');
  $export['recent_news'] = $view;

  return $export;
}
