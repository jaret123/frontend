<?php

$aliases['xeros.dev'] = array (
  'root' => '/var/www/ELYXOR/dev/www/drupal',
  'uri' => 'http://xeros-dev.d.ffinno.com',
  'remote-host' => 'ffinno',
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
  'root' => '/Users/jason/dev/ELYXOR/xeros/drupal',
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
