#!/bin/sh

DRUSH=/usr/bin/drush

$DRUSH @xeros.prod cc all

mysqldump xeros-prod | gzip > /var/backup/xeros-prod$(date +%Y-%m-%d-%H.%M.%S).sql.gz