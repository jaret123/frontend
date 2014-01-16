<?php

$aliases['xeros.dev'] = array (
  'root' => '/var/www/ELYXOR/dev/www/drupal-7.25',
  'uri' => 'http://xeros-dev.d.ffinno.com',
  'remote-host' => 'ffinno',
  'path-aliases' => 
  array (
    '%drush' => '/usr/bin',
    '%site' => 'sites/default/',
  ),
  'databases' => 
  array (
    'default' => 
    array (
      'default' => 
      array (
        'database' => 'xeros_dev',
        'username' => 'root',
        'password' => 'root',
        'host' => 'localhost',
        'port' => '',
        'driver' => 'mysql',
        'prefix' => '',
      ),
    ),
  ),
);
$aliases['xeros.stage'] = array (
    'root' => '/var/www/ELYXOR/stage/www/drupal-7.25',
    'uri' => 'http://xeros-stage.d.ffinno.com',
    'remote-host' => 'ffinno',
    'path-aliases' =>
        array (
            '%drush' => '/usr/bin',
            '%site' => 'sites/default/',
        ),
    'databases' =>
        array (
            'default' =>
                array (
                    'default' =>
                        array (
                            'database' => 'xeros_stage',
                            'username' => 'root',
                            'password' => 'root',
                            'host' => 'localhost',
                            'port' => '',
                            'driver' => 'mysql',
                            'prefix' => '',
                        ),
                ),
        ),
);
$aliases['xeros.prod'] = array (
    'root' => '/var/www/ELYXOR/prod/www/drupal-7.25',
    'uri' => 'http://xeros-prod.d.ffinno.com',
    'remote-host' => 'ffinno',
    'path-aliases' =>
        array (
            '%drush' => '/usr/bin',
            '%site' => 'sites/default/',
        ),
    'databases' =>
        array (
            'default' =>
                array (
                    'default' =>
                        array (
                            'database' => 'xeros_prod',
                            'username' => 'root',
                            'password' => 'root',
                            'host' => 'localhost',
                            'port' => '',
                            'driver' => 'mysql',
                            'prefix' => '',
                        ),
                ),
        ),
);
$aliases['xeros.local'] = array (
  'root' => '/Users/jason/dev/ELYXOR/xeros/drupal-7.25',
  'uri' => 'http://xeros.local',
  'path-aliases' => 
  array (
    '%drush' => '/usr/local/Cellar/drush/6.1.0/libexec',
    '%site' => 'sites/default/',
  ),
  '#name' => 'self',
  'databases' => 
  array (
    'default' => 
    array (
      'default' => 
      array (
        'database' => 'xeros_local',
        'username' => 'root',
        'password' => 'root',
        'host' => 'localhost',
        'port' => '',
        'driver' => 'mysql',
        'prefix' => '',
      ),
    ),
  ),
);
