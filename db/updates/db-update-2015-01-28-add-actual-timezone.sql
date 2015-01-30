ALTER TABLE `xeros_dai_meter_actual`
ADD COLUMN `olson_timezone_id` VARCHAR(45) NULL DEFAULT NULL AFTER `exception`;