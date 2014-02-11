-- Create syntax for 'generateData'

DELIMITER ;;
CREATE DEFINER=`xeros`@`%` PROCEDURE `generateData`()
BEGIN 
	DECLARE rundate datetime;
	DECLARE count, tempclass, m_id, intv int;
	DECLARE savings double;

	SET count = 1;
	SET m_id = 1;
	SET savings = 1;
	SET intv = 1;
	SET tempclass = 1 + rand()*9;

	SET rundate = '2013-01-01 06:00:00';


	WHILE rundate<'2013-01-08 00:00:00' DO		
			INSERT INTO xeros_dai_meter_actual_test (reading_timestamp, 
				active_dai_id, classification_id, hot_water, cold_water, run_time, machine_id)
			VALUES(
				rundate,
				m_id + 750000,
				CASE (tempclass)
					when 10 THEN 99
					else tempclass
				END,
				CASE (tempclass)
					when 9 THEN 0
					else (savings * (80 + floor(rand()*70)))
				END,
				(savings * (80 + floor(rand()*70))),
				(savings * (20 + floor(rand()*70))),
				m_id);
			CASE (m_id)
				when 1 THEN 
					SET savings = .5;
					SET m_id = 2;
				when 2 THEN
					SET rundate = date_add(rundate, interval intv hour);
					SET savings = 1;
					SET m_id = 1;
			END CASE;
	
			IF (count % 32 = 0) THEN
				SET rundate = date_add(rundate, interval 8 hour);
			END IF;

			SET count = count + 1;
			SET tempclass = 1 + rand()*9;
		END WHILE;
END;;
DELIMITER ;
