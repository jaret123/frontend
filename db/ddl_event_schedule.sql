--
--  Refresh the reporting aggregate tables.
-- 

set global event_scheduler = on;

create event ev_data_refresh
  on schedule every 10 minute do
	call sp_refresh_report_data();