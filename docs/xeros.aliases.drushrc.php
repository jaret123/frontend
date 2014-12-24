<?php
$aliases['xeros.dev'] = array (
  'root' => '/var/www/xeros-dev/www/drupal',
  'uri' => 'http://sbeadycare-dev.xeroscleaning.com',
  'remote-host' => 'xeros-qa',
  'path-aliases' =>
    array (
      '%drush' => '/usr/bin',
      '%site' => 'sites/default/',
      '%files' => 'sites/default/files'
    ),
  'databases' =>
    array (
      'default' =>
        array (
          'default' =>
            array (
              'database' => 'xeros-dev',
              'username' => 'xeros',
              'password' => 'X#r)S2014',
              'host' => 'localhost',
              'port' => '',
              'driver' => 'mysql',
              'prefix' => '',
            ),
        ),
    ),
);
$aliases['xeros.test'] = array (
  'root' => '/var/www/xeros-test/www/drupal',
  'uri' => 'http://sbeadycare-test.xeroscleaning.com',
  'remote-host' => 'xeros-qa',
  'path-aliases' =>
    array (
      '%drush' => '/usr/bin',
      '%site' => 'sites/default/',
      '%files' => 'sites/default/files'
    ),
  'databases' =>
    array (
      'default' =>
        array (
          'default' =>
            array (
              'database' => 'xeros-test',
              'username' => 'xeros',
              'password' => 'X#r)S2014',
              'host' => 'localhost',
              'port' => '',
              'driver' => 'mysql',
              'prefix' => '',
            ),
        ),
    ),
);
$aliases['xeros.qa'] = array (
  'root' => '/var/www/xeros/www/drupal',
  'uri' => 'http://sbeadycare-qa.xeroscleaning.com',
  'remote-host' => 'xeros-qa',
  'path-aliases' =>
    array (
      '%drush' => '/usr/bin',
      '%site' => 'sites/default/',
      '%files' => 'sites/default/files'
    ),
  'databases' =>
    array (
      'default' =>
        array (
          'default' =>
            array (
              'database' => 'xeros-qa',
              'username' => 'xeros',
              'password' => 'X#r)S2014',
              'host' => 'localhost',
              'port' => '',
              'driver' => 'mysql',
              'prefix' => '',
            ),
        ),
    ),
);
$aliases['xeros.prod'] = array (
  'root' => '/var/www/xeros/www/drupal',
  'uri' => 'http://sbeadycare.xeroscleaning.com',
  'remote-host' => 'xeros-prod',
  'path-aliases' =>
    array (
      '%drush' => '/usr/bin',
      '%site' => 'sites/default/',
      '%files' => 'sites/default/files'
    ),
  'databases' =>
    array (
      'default' =>
        array (
          'default' =>
            array (
              'database' => 'xeros-prod',
              'username' => 'xeros',
              'password' => 'X#r)S2014',
              'host' => 'localhost',
              'port' => '',
              'driver' => 'mysql',
              'prefix' => '',
            ),
        ),
    ),
);
$aliases['xeros.local'] = array (
  'root' => '~/dev/ELYXOR/xeros/drupal',
  'uri' => 'http://xeros.local',
  'path-aliases' =>
    array (
      '%drush' => '/usr/local/bin/drush',
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