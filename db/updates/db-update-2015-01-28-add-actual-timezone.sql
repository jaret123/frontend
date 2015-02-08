
ALTER TABLE `xeros_dai_meter_actual`
ADD COLUMN `olson_timezone_id` VARCHAR(45) NULL DEFAULT NULL;

ALTER TABLE `xeros_local`.`xeros_dai_meter_actual`
CHANGE COLUMN `reading_timestamp` `reading_timestamp` TIMESTAMP NULL ;

UPDATE xeros_dai_meter_actual as a set a.olson_timezone_id = (select olson_timezone_id from xeros_dai_meter_collection as c where c.dai_meter_actual_id = a.dai_meter_actual_id);