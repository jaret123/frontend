
DELIMITER ;;

DROP FUNCTION IF EXISTS udf_temp_rise;;

CREATE FUNCTION udf_temp_rise( _reading_date timestamp, _location_id int ) 
RETURNS INTEGER
BEGIN
 	DECLARE temp_rise int DEFAULT 0;

	SELECT 
		CASE
			WHEN month(_reading_date) < 3 THEN temperature_rise_winter
			WHEN month(_reading_date) >= 3 < 6 THEN temperature_rise_spring
			WHEN month(_reading_date) >= 6 < 9 THEN temperature_rise_summer
			WHEN month(_reading_date) >= 9 < 11 THEN temperature_rise_fall
			WHEN month(_reading_date) >=11 <= 12 THEN temperature_rise_winter
			ELSE 'undefined'
		END INTO temp_rise 
	FROM
		xeros_location_static_value
	WHERE
		location_id = _location_id;

 	RETURN temp_rise;
END ;;

select udf_temp_rise('2014-10-03', 10);;

DROP FUNCTION IF EXISTS udf_total_therms;;
CREATE FUNCTION udf_total_therms (_reading_date timestamp, _location_id int, _gallons decimal(15,4))
RETURNS decimal(15,4)
BEGIN
	DECLARE total_therms decimal(15,4);

/*
    Cost per pound of laundry
	Pounds of Laundry = Load Size * Cycles
	Pounds of Hot Water = Gallons of Hot Water * 8.34 
	(Efficiency) Degrees to raise adjusted = Temperatur Rise * Heating Efficiency Coefficient
	Total Therms = Pounds Hot Water * Degrees to Raise Adjusted
	Total Therms

*/
	DECLARE water_pounds decimal(15,4) ;
	DECLARE efficiency decimal(15,4) ; -- Degrees to raise adjusted
	DECLARE _heating_efficiency decimal(15,4); 
	DECLARE _thermal_conversion decimal(15,4);
	DECLARE _temp_rise int;
	
	SET water_pounds = _gallons * 8.34;
	
	SELECT
		heating_efficiency,
		thermal_conversion,
		udf_temp_rise(_reading_date, _location_id)
	INTO
		_heating_efficiency,
		_thermal_conversion,
		_temp_rise
	FROM
		xeros_location_static_value 
	WHERE
		location_id = _location_id;

	SET efficiency = _temp_rise / _heating_efficiency;

	SET total_therms = water_pounds * efficiency;

	SET total_therms = total_therms / 100000;

	RETURN total_therms;

END;;

SELECT udf_total_therms('2014-10-11', 10, 44);;

DROP TABLE IF EXISTS xeros_therm_cycle;;

CREATE TABLE xeros_therm_cycle
(
	dai_meter_actual_id int unsigned primary key,
	cycle_hot_water_volume decimal(15,4),
	cycle_hot_water_pounds decimal(15,4),
	cycle_hot_water_xeros_volume decimal(15,4),
	cycle_hot_water_xeros_pounds decimal(15,4),
	cycle_hot_water_volume_per_pound decimal(15,4),
	cycle_hot_water_xeros_volume_per_pound decimal(15,4),
	cycle_therms decimal(15,4),
	cycle_therms_xeros decimal(15,4),
	cycle_therms_per_pound decimal(15,4),
	cycle_therms_per_pound_xeros decimal(15,4),
	cycle_therm_cost_per_pound decimal(15,4),
	cycle_therm_cost_per_pound_xeros decimal(15,4)
)
;;

DROP PROCEDURE IF EXISTS sp_therm_cycle ;;

CREATE PROCEDURE sp_therm_cycle ()
BEGIN

	TRUNCATE TABLE xeros_therm_cycle;
	
	INSERT INTO xeros_therm_cycle
	(
	dai_meter_actual_id,
	cycle_hot_water_volume,
	cycle_hot_water_pounds,
	cycle_hot_water_xeros_volume,
	cycle_hot_water_xeros_pounds,
	cycle_hot_water_volume_per_pound,
	cycle_hot_water_xeros_volume_per_pound,
	cycle_therms,
	cycle_therms_xeros,
	cycle_therms_per_pound,
	cycle_therms_per_pound_xeros,
	cycle_therm_cost_per_pound,
	cycle_therm_cost_per_pound_xeros
	)
  SELECT
    xdma.dai_meter_actual_id							as dai_meter_actual_id,
	-- Hot water gallons
    ( xdma.hot_water / 10 )                                                                     AS cycle_hot_water_volume,
    -- Hot water pounds
	( xdma.hot_water / 10 ) * 8.34 																AS cycle_hot_water_pounds,  	
    -- Xeros hot water gallons
	xlsv.hot_water_gallons                                                                     AS cycle_hot_water_xeros_volume,
	-- Xeros hot water pounds
	xlsv.hot_water_gallons * 8.34                                                              AS cycle_hot_water_xeros_pounds,

	-- Volume of water per pound 
	(xdma.hot_water / 10) / mc.load_size as cycle_hot_water_volume_per_pound,
	(xlsv.hot_water_gallons) / mc.load_size as cycle_hot_water_xeros_volume_per_pound,

	-- Total Therms
	udf_total_therms(xdma.reading_timestamp, m.location_id, xdma.hot_water / 10) as cycle_therms,
	udf_total_therms(xdma.reading_timestamp, m.location_id, xlsv.hot_water_gallons) as cycle_therms_xeros,	

	-- Therms per pound
	udf_total_therms(xdma.reading_timestamp, m.location_id, xdma.hot_water / 10) / mc.load_size as cycle_therms_per_pound,
	udf_total_therms(xdma.reading_timestamp, m.location_id, xlsv.hot_water_gallons) / mc.xeros_load_size as cycle_therms_per_pound_xeros,

	-- Cost per pound
	( udf_total_therms(xdma.reading_timestamp, m.location_id, xdma.hot_water / 10) / mc.load_size ) * lsv.cost_per_therm as cycle_therm_cost_per_pound,
	( udf_total_therms(xdma.reading_timestamp, m.location_id, xlsv.hot_water_gallons) / mc.load_size ) * lsv.cost_per_therm as cycle_therm_cost_per_pound_xeros

  FROM
    xeros_dai_meter_actual as xdma
	left join xeros_machine as m
		on xdma.machine_id = m.machine_id
	left join xeros_machine_classification as mc
		on xdma.machine_id = mc.machine_id
		and xdma.classification_id = mc.classification_id
	left join xeros_location_static_value as lsv
		on m.location_id = lsv.location_id
	left join xeros_xeros_local_static_value as xlsv
		on xdma.classification_id = xlsv.classification_id
  GROUP BY
    dai_meter_actual_id;
    
END ;;

call sp_therm_cycle();;

SELECT * FROM xeros_therm_cycle;;