#!/bin/sh
mysqldump –u root –p xeros_local | perl –p –i.bak –e “s/DEFINER=\`\w.*\`@\`\d[0-3].*[0-3]\`//g" xeros-dump.sql
