USE xeros_local;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_get_status $$

CREATE PROCEDURE sp_get_status (IN machine_ids varchar(255))
BEGIN

	set @num := 0, 
		@machine_id := '';

	if ( machine_ids IS NOT NULL ) then
		set @where_clause = CONCAT(' where machine_id in (', machine_ids , ') ');
	else 
		set @where_clause = CONCAT(' where 1 = 1 ');
	end if;

	set @query = CONCAT('
		select machine_id, status_id, status_message, status_code, time_stamp
		from (
		   select machine_id, status_id, time_stamp, status_code, status_message,
			  @num := if(@machine_id = machine_id, @num + 1, 1) as row_number,
			  @machine_id := machine_id as dummy
		  from xeros_status',
		  @where_clause,
		  'order by machine_id, time_stamp DESC
		) as x 
		where 
			x.row_number <= 1
	');

	PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END$$

call sp_get_status('14,15')$$
call sp_get_status(NULL) $$

DROP PROCEDURE IF EXISTS sp_get_status_history$$

CREATE PROCEDURE `sp_get_status_history`(IN machine_ids varchar(2048), IN record_count int)
BEGIN

	set @num := 0, 
		@machine_id := '';

	if ( machine_ids IS NOT NULL ) then
		set @where_clause = CONCAT(' where machine_id in (', machine_ids , ') ');
	else 
		set @where_clause = CONCAT(' where 1 = 1 ');
	end if;

	set @query = CONCAT('
		select machine_id, status_id, status_message, status_code, time_stamp
		from (
		   select machine_id, status_id, time_stamp, status_code, status_message,
			  @num := if(@machine_id = machine_id, @num + 1, 1) as row_number,
			  @machine_id := machine_id as dummy
		  from xeros_status', 
		  @where_clause,
		  'order by machine_id, time_stamp DESC
		) as x 
		where 
			x.row_number <= ', record_count, '
	');

	PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END$$


call sp_get_status_history('14', 5) $$

call sp_get_status_history(NULL, 5) $$
