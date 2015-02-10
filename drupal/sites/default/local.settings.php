<?php

$host = $_SERVER['HTTP_HOST'];
$base_url = 'http://'.$host;
$cookie_domain = $host;

//var_dump($host);

    $databases = array(
      'default' =>
        array(
          'default' =>
            array(
              'database' => 'xeros_local',
              'username' => 'root',
              'password' => 'root',
              'host'     => 'localhost',
              'port'     => '',
              'driver'   => 'mysql',
              'prefix'   => '',
            ),
        ),
    );
    $conf['database_script_dir'] = "/Users/Jason/dev/ELYXOR/xeros-sbeady/db";
    $conf['mysql_bin'] = "/Applications/MAMP/Library/bin/mysql";
    error_reporting(E_ALL);
    ini_set('display_errors', TRUE);
    ini_set('display_startup_errors', TRUE);