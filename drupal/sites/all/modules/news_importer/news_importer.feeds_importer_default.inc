<?php
/**
 * @file
 * news_importer.feeds_importer_default.inc
 */

/**
 * Implements hook_feeds_importer_default().
 */
function news_importer_feeds_importer_default() {
  $export = array();

  $feeds_importer = new stdClass();
  $feeds_importer->disabled = FALSE; /* Edit this to true to make a default feeds_importer disabled initially */
  $feeds_importer->api_version = 1;
  $feeds_importer->id = 'xeros_in_the_news';
  $feeds_importer->config = array(
    'name' => 'Xeros In The News',
    'description' => 'Xeros In The News Feed',
    'fetcher' => array(
      'plugin_key' => 'FeedsHTTPFetcher',
      'config' => array(
        'auto_detect_feeds' => FALSE,
        'use_pubsubhubbub' => FALSE,
        'designated_hub' => '',
        'request_timeout' => NULL,
      ),
    ),
    'parser' => array(
      'plugin_key' => 'FeedsQueryPathParser',
      'config' => array(
        'context' => 'body',
        'sources' => array(
          'querypathparser:0' => '.hs-rss-description',
          'querypathparser:1' => '.hs-rss-title',
          'querypathparser:2' => '',
          'querypathparser:3' => '.hss-rss-date',
          'querypathparser:4' => '.hs-rss-description > a',
        ),
        'debug' => array(
          'options' => array(
            'querypathparser:0' => 'querypathparser:0',
            'querypathparser:1' => 'querypathparser:1',
            'context' => 0,
            'querypathparser:2' => 0,
            'querypathparser:3' => 0,
            'querypathparser:4' => 0,
          ),
        ),
        'attrs' => array(
          'querypathparser:0' => '',
          'querypathparser:1' => '',
          'querypathparser:2' => '',
          'querypathparser:3' => '',
          'querypathparser:4' => '',
        ),
        'rawXML' => array(
          'querypathparser:4' => 'querypathparser:4',
          'querypathparser:0' => 0,
          'querypathparser:1' => 0,
          'querypathparser:2' => 0,
          'querypathparser:3' => 0,
        ),
      ),
    ),
    'processor' => array(
      'plugin_key' => 'FeedsNodeProcessor',
      'config' => array(
        'expire' => '-1',
        'author' => 0,
        'authorize' => 0,
        'mappings' => array(
          0 => array(
            'source' => 'querypathparser:0',
            'target' => 'body',
            'unique' => FALSE,
          ),
          1 => array(
            'source' => 'querypathparser:1',
            'target' => 'title',
            'unique' => 1,
          ),
          2 => array(
            'source' => 'querypathparser:2',
            'target' => 'field_more_link',
            'unique' => FALSE,
          ),
          3 => array(
            'source' => 'querypathparser:3',
            'target' => 'field_source_publish_date',
            'unique' => FALSE,
          ),
          4 => array(
            'source' => 'querypathparser:4',
            'target' => 'field_hubspot_tags_html',
            'unique' => FALSE,
          ),
        ),
        'update_existing' => '1',
        'input_format' => 'full_html',
        'skip_hash_check' => 0,
        'bundle' => 'news',
      ),
    ),
    'content_type' => '',
    'update' => 0,
    'import_period' => '86400',
    'expire_period' => 3600,
    'import_on_create' => 1,
    'process_in_background' => 0,
  );
  $export['xeros_in_the_news'] = $feeds_importer;

  return $export;
}
