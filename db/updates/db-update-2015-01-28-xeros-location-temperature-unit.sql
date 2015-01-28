ALTER TABLE `xeros_location_profile`
ADD COLUMN `temperature_unit` VARCHAR(2) NULL DEFAULT 'F' AFTER `cost_per_gallon`;