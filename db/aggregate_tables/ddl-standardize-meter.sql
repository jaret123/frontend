DELIMITER ;;

-- Chemical usage
-- Broken down by each chemical in each cycle

DROP TABLE IF EXISTS xeros_dai_meter_standard;;

CREATE TABLE xeros_dai_meter_standard
(
	dai_meter_actual_id INT UNSIGNED NOT NULL,
	reading_timestamp TIMESTAMP,
	olson_timezone_id varchar(100),
	active_dai_id INT UNSIGNED,
	classification_id INT UNSIGNED,
	hot_water DECIMAL(10,2),
	cold_water DECIMAL(10,2),
	run_time INT,
	machine_id INT UNSIGNED
);;

CREATE INDEX PK_dai_meter_actual_id ON xeros_dai_meter_standard (dai_meter_actual_id);;
CREATE INDEX UN_machine_id ON xeros_dai_meter_standard (machine_id);;


DROP PROCEDURE IF EXISTS sp_standardize_meter;;

CREATE PROCEDURE sp_standardize_meter (IN refresh_mode varchar(10), IN record_id int)
/**
*  refresh_mode =
*    FULL - Refresh the entire reporting database
*    INCR (Incremental) - Insert all new records (records greater than the max in the aggregate table
*    DIFF (Differential) - Insert all records that don't exist in the agregate table
			  NOTE: Diffs are the slowest to implement
*    SINGLE - Insert a single record (useful for using with triggers.
*             NOTE: Single will always delete the existing record.  This is useful for fixing a bad run.
*
*  id =
*    Optional parameter used with the SINGLE option
*
**/
BEGIN

	DECLARE where_clause varchar(1024);

	IF refresh_mode = 'FULL' THEN

		TRUNCATE TABLE xeros_dai_meter_standard;
		SET where_clause = '1 = 1';

	ELSEIF refresh_mode = 'INCR' THEN
		SELECT @max_id:=max(dai_meter_actual_id) FROM xeros_dai_meter_standard;
		SET where_clause = CONCAT(' dai_meter_actual_id > ' , @max_id , ' ');

	ELSEIF refresh_mode = 'DIFF' THEN

		SET where_clause = '
			dai_meter_actual_id NOT IN (
          SELECT
            distinct dai_meter_actual_id
          FROM
            sp_standardize_readings
				)  ';

	ELSEIF refresh_mode = 'SINGLE' THEN

		DELETE FROM xeros_dai_meter_standard WHERE dai_meter_actual_id = record_id;
		SET where_clause = CONCAT(' dai_meter_actual_id = ' , record_id , ' ');

	ELSE

		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid parameter passed';

    END IF;


	SET @s = CONCAT('
	INSERT INTO xeros_dai_meter_standard
	(
		dai_meter_actual_id,
		reading_timestamp,
		olson_timezone_id,
		active_dai_id,
		classification_id,
		hot_water,
		cold_water,
		run_time,
		machine_id
	)
	SELECT
		dma.dai_meter_actual_id,
		dma.reading_timestamp,
		dma.olson_timezone_id,
		dma.active_dai_id,
		dma.classification_id,
		udf_convert_volume(dma.hot_water, lp.water_volume_unit, ''gallons''),
		udf_convert_volume(dma.cold_water, lp.water_volume_unit, ''gallons''),
		dma.run_time,
		dma.machine_id
	FROM
		xeros_dai_meter_actual AS dma
        LEFT JOIN xeros_machine AS m ON dma.machine_id = m.machine_id
        LEFT JOIN xeros_location_profile as lp on m.location_id = lp.location_id
        
	WHERE ',
			where_clause, ' ')
	;

	SELECT @s;

	PREPARE stmt FROM @s;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
        
END ;;


# call sp_standardize_meter('FULL', NULL) ;;
#
# select count(*) from xeros_dai_meter_standard ;;

