/**
  Add water_meter_rate to xeros_machine
 */
ALTER TABLE xeros_machine
ADD COLUMN water_meter_rate DECIMAL(10,2) NULL DEFAULT NULL AFTER water_only;

/**
  Set the water_meter_rate for existing machines - all were .10 up to this update
 */
UPDATE xeros_machine SET water_meter_rate = 0.10;

/**
  Drup the column from xeros_location_profile
 */
ALTER TABLE xeros_location_profile
DROP COLUMN water_meter_rate;