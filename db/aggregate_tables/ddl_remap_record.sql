DELIMITER ;;

DROP PROCEDURE IF EXISTS sp_xeros_cycle_delete;;

CREATE PROCEDURE sp_xeros_cycle_delete(IN _dai_meter_actual_id int)
  BEGIN

-- Delete xeros_chemical_unit
    DELETE FROM xeros_chemical_unit WHERE dai_meter_actual_id = _dai_meter_actual_id;

-- Delete xeros_chemical_cycle
    DELETE FROM xeros_chemical_cycle WHERE dai_meter_actual_id = _dai_meter_actual_id;

-- Delete xeros_therm_cycle
    DELETE FROM xeros_therm_cycle WHERE dai_meter_actual_id = _dai_meter_actual_id;

-- Delete xeros_cycle
    DELETE FROM xeros_cycle WHERE dai_meter_actual_id = _dai_meter_actual_id;


  END;;