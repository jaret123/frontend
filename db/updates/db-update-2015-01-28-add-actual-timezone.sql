
ALTER TABLE `xeros_dai_meter_actual`
ADD COLUMN `olson_timezone_id` VARCHAR(45) NULL DEFAULT NULL;

ALTER TABLE `xeros_local`.`xeros_dai_meter_actual`
CHANGE COLUMN `reading_timestamp` `reading_timestamp` TIMESTAMP NULL ;

UPDATE xeros_dai_meter_actual as a
left join xeros_dai_meter_collection as C
  ON a.dai_meter_actual_id = c.dai_meter_actual_id
set a.olson_timezone_id = c.olson_timezone_id
;