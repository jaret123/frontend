#!/bin/sh
mysqldump -u root --password='root' -h localhost xeros_local --ignore-table=xeros_local.xeros_chemical_unit --ignore-table=xeros_local.xeros_chemical_cycle --ignore-table=xeros_local.xeros_cycle --result-file=xeros-dump.sql
scp xeros-dump.sql xeros:.
ssh xeros 'mysql -u xeros --password='X#r)S2014' xeros-qa < xeros-dump.sql'
mysql -u xeros --password='X#r)S2014' xeros-qa < /var/www/xeros/www/db/report_views.sql
