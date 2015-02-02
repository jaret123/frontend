ALTER TABLE `xeros_location_profile`
ADD COLUMN `currency_unit` VARCHAR(5) NULL DEFAULT 'USD' AFTER `temperature_unit`;