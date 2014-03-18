#!/bin/sh

DRUSH=/usr/bin/drush

$DRUSH @xeros.qa cc all

mysqldump xeros-qa | gzip > /var/backup/xeros-qa$(date +%Y-%m-%d-%H.%M.%S).sql.gz