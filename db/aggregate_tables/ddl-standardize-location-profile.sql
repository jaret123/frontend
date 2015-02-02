DELIMITER ;;

-- Chemical usage
-- Broken down by each chemical in each cycle

DROP TABLE IF EXISTS xeros_location_profile_standard;;

CREATE TABLE xeros_location_profile_standard
(
  location_id INT UNSIGNED NOT NULL,
  water_volume_unit VARCHAR(25),
  chemical_volume_unit VARCHAR(25),
  temperature_rise_spring INT DEFAULT 0 NOT NULL,
  temperature_rise_fall INT DEFAULT 0 NOT NULL,
  temperature_rise_winter INT DEFAULT 0 NOT NULL,
  heating_efficiency DECIMAL(10,4) DEFAULT 0.0000 NOT NULL,
  thermal_conversion INT UNSIGNED,
  temperature_rise_summer INT DEFAULT 0,
  cost_per_therm DECIMAL(15,4),
  cost_per_gallon DECIMAL(15,5),
  temperature_unit VARCHAR(2) DEFAULT 'F',
  currency_profile VARCHAR(5) DEFAULT 'USD'
);

CREATE INDEX PK_location_id ON xeros_location_profile_standard (location_id);;

DROP PROCEDURE IF EXISTS sp_standardize_location_profile;;

CREATE PROCEDURE sp_standardize_location_profile ()
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

    INSERT INTO xeros_location_profile_standard
    (
      location_id,
      water_volume_unit,
      chemical_volume_unit,
      temperature_rise_spring,
      temperature_rise_fall,
      temperature_rise_winter,
      heating_efficiency,
      thermal_conversion,
      temperature_rise_summer,
      cost_per_therm,
      cost_per_gallon,
      temperature_unit,
      currency_unit
    )
    SELECT
      location_id,
      water_volume_unit,
      chemical_volume_unit,
      udf_convert_temperature(temperature_rise_spring, temperature_unit, 'F'),
      udf_convert_temperature(temperature_rise_fall, temperature_unit, 'F'),
      udf_convert_temperature(temperature_rise_winter, temperature_unit, 'F'),
      heating_efficiency,
      thermal_conversion,
      udf_convert_temperature(temperature_rise_summer, temperature_unit, 'F'),
      udf_convert_currency(cost_per_therm, 'USD', 'USD'),
      udf_convert_currency(cost_per_gallon, 'USD', 'USD'),
      temperature_unit,
      currency_unit
    FROM
      xeros_location_profile AS lp;

  END ;;


call sp_standardize_location_profile() ;;

select count(*) from xeros_location_profile_standard ;;

