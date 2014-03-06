USE `xeros-qa`;

DELIMITER ;;

-- Chemical usage
-- Broken down by each chemical in each cycle

	DROP TABLE IF EXISTS xeros_chemical_unit;;
	DROP VIEW IF EXISTS xeros_chemical_unit;;
	
	CREATE TABLE xeros_chemical_unit
	(
		dai_meter_actual_id int unsigned,
		machine_id int unsigned,
		classificiation_id int unsigned,
		chemical_profile_id int unsigned,
		strength decimal(15,4),
		unit_cost decimal(15,4),
		xeros_strength decimal(15,4),
		chemical_unit_cost decimal(15,4),
		xeros_chemical_unit_cost decimal(15,4),
		load_size decimal(15,4),
		xeros_load_size decimal(15,4)
	)
	;;
	
DROP PROCEDURE IF EXISTS sp_chemical_unit;;


CREATE PROCEDURE sp_chemical_unit ( )
BEGIN
	TRUNCATE TABLE xeros_chemical_unit;
	
	INSERT INTO xeros_chemical_unit 
	(
		dai_meter_actual_id,
		machine_id,
		classificiation_id,
		chemical_profile_id,
		strength,
		unit_cost,
		xeros_strength,
		chemical_unit_cost,
		xeros_chemical_unit_cost,
		load_size,
		xeros_load_size
	)
	SELECT
    dma.dai_meter_actual_id,
    dma.machine_id,
    dma.classification_id,
-- type of laundry in the cycle
    cu.chemical_profile_id,
    cu.strength,
-- Let's do all units as a standard (ounces)
    cp.unit_cost,
    cu.xeros_strength,
    cp.unit_cost * cu.strength       AS chemical_unit_cost,
    cp.unit_cost * cu.xeros_strength AS xeros_chemical_unit_cost,
    mc.load_size,
    mc.xeros_load_size
  FROM
      xeros_dai_meter_actual AS dma
      LEFT JOIN xeros_machine_classification AS mc
        ON dma.machine_id = mc.machine_id
       AND dma.classification_id = mc.classification_id
      LEFT JOIN xeros_chemical_usage AS cu
        ON mc.machine_classification_id = cu.machine_classification_id
      LEFT JOIN xeros_chemical_profile AS cp
        ON cu.chemical_profile_id = cp.chemical_profile_id
        
END ;;

-- Calculations by cycle
-- Summing the component parts of the chemical formulas

DROP TABLE IF EXISTS xeros_chemical_cycle ;;
DROP VIEW IF EXISTS xeros_chemical_cycle ;;

CREATE TABLE xeros_chemical_cycle
(
	dai_meter_actual_id INT UNSIGNED PRIMARY KEY,
    cycle_chemical_cost decimal(15,4),
    cycle_chemical_strength decimal(15,4),
    cycle_chemical_strength_per_pound decimal(15,4),
    cycle_chemical_cost_per_pound decimal(15,4),
    cycle_chemical_xeros_cost_per_pound decimal(15,4),
    cycle_chemical_xeros_strength decimal(15,4),
    cycle_chemical_xeros_strength_per_pound decimal(15,4),
    cycle_chemical_xeros_cost decimal(15,4)
) ;;

DROP PROCEDURE IF EXISTS sp_chemical_cycle ;;

CREATE PROCEDURE sp_chemical_cycle ()
BEGIN

	TRUNCATE TABLE xeros_chemical_cycle;
	
	INSERT INTO xeros_chemical_cycle
	(
	dai_meter_actual_id,
	cycle_chemical_cost,
	cycle_chemical_strength,
	cycle_chemical_strength_per_pound,
	cycle_chemical_cost_per_pound,
	cycle_chemical_xeros_cost_per_pound,
	cycle_chemical_xeros_strength,
	cycle_chemical_xeros_strength_per_pound,
	cycle_chemical_xeros_cost
	)
  SELECT
    dai_meter_actual_id,
    sum(chemical_unit_cost)                   		AS cycle_chemical_cost,
    sum(strength)                             		AS cycle_chemical_strength,
    sum(strength / load_size)                 		AS cycle_chemical_strength_per_pound,
    sum(chemical_unit_cost / load_size)       		AS cycle_chemical_cost_per_pound,
    sum(xeros_chemical_unit_cost / xeros_load_size) AS cycle_chemical_xeros_cost_per_pound,
    sum(xeros_strength)                       		AS cycle_chemical_xeros_strength,
    sum(xeros_strength / xeros_load_size)          		AS cycle_chemical_xeros_strength_per_pound,
    sum(xeros_chemical_unit_cost)             		AS cycle_chemical_xeros_cost  
  FROM
    xeros_chemical_unit
  GROUP BY
    dai_meter_actual_id;
    
END ;;
  

-- Top Level Reports (by day)



-- Cold Water Usage
-- Calculations by cycle
DROP TABLE IF EXISTS xeros_cycle ;;
DROP VIEW IF EXISTS xeros_cycle ;;

CREATE TABLE xeros_cycle
(
	dai_meter_actual_id INT UNSIGNED PRIMARY KEY,
    machine_id INT,
    classification_id INT,
    location_id INT,
-- Base measures
-- Should always equal one in this view
    reading_date timestamp,
    reading_timestamp timestamp,
    cycle_load_size decimal(15,4),
    cycle_xeros_load_size decimal(15,4),

-- Cold water
    cycle_cold_water_volume decimal(15,4),
    cycle_cold_water_xeros_volume decimal(15,4),
    cycle_cold_water_cost decimal(15,4),
    cycle_cold_water_xeros_cost decimal(15,4),

    cycle_cold_water_volume_per_pound decimal(15,4),
    cycle_cold_water_xeros_volume_per_pound decimal(15,4),
    cycle_cold_water_cost_per_pound decimal(15,4),
    cycle_cold_water_xeros_cost_per_pound decimal(15,4),

-- hot water
	cycle_hot_water_volume decimal(15,4),
	cycle_hot_water_pounds decimal(15,4),
	cycle_hot_water_xeros_volume decimal(15,4),
	cycle_hot_water_xeros_pounds decimal(15,4),
	cycle_hot_water_volume_per_pound decimal(15,4),
	cycle_hot_water_xeros_volume_per_pound decimal(15,4),
	cycle_therms decimal(15,4),
	cycle_therms_xeros decimal(15,4),
	cycle_therms_cost decimal(15,4),
	cycle_therms_cost_xeros decimal(15,4),
	cycle_therms_per_pound decimal(15,4),
	cycle_therms_per_pound_xeros decimal(15,4),
	cycle_therm_cost_per_pound decimal(15,4),
	cycle_therm_cost_per_pound_xeros decimal(15,4),

-- Labor and cycle time measures
    cycle_time_run_time decimal(15,4),
    cycle_time_xeros_run_time decimal(15,4),
    cycle_time_unload_time decimal(15,4),
    cycle_time_total_time decimal(15,4),
    cycle_time_xeros_total_time decimal(15,4),
    cycle_time_labor_cost decimal(15,4),
    cycle_time_xeros_labor_cost decimal(15,4),
    cycle_time_labor_cost_per_pound decimal(15,4),
    cycle_time_xeros_labor_cost_per_pound decimal(15,4),

    cycle_chemical_cost decimal(15,4),
    cycle_chemical_xeros_cost decimal(15,4),
    cycle_chemical_cost_per_pound decimal(15,4),
    cycle_chemical_xeros_cost_per_pound decimal(15,4),
    cycle_chemical_strength decimal(15,4),
    cycle_chemical_xeros_strength decimal(15,4),
    cycle_chemical_strength_per_pound decimal(15,4),
    cycle_chemical_xeros_strength_per_pound decimal(15,4),
    KEY `reading_date` (`reading_date`),
    KEY `classification_id` (`classification_id`),
    KEY `machine_id` (`machine_id`)
);;

DROP PROCEDURE IF EXISTS sp_xeros_cycle;;

CREATE PROCEDURE sp_xeros_cycle ()
BEGIN

	TRUNCATE TABLE xeros_cycle;
	
	INSERT INTO xeros_cycle
	(
	dai_meter_actual_id,
    machine_id,
    classification_id,
    location_id,
    reading_date,
    reading_timestamp,
    cycle_load_size,
    cycle_xeros_load_size,
-- Cold water
    cycle_cold_water_volume,
    cycle_cold_water_xeros_volume,
    cycle_cold_water_cost,
    cycle_cold_water_xeros_cost,

    cycle_cold_water_volume_per_pound,
    cycle_cold_water_xeros_volume_per_pound,
    cycle_cold_water_cost_per_pound,
    cycle_cold_water_xeros_cost_per_pound,

-- hot water
	cycle_hot_water_volume,
	cycle_hot_water_pounds,
	cycle_hot_water_xeros_volume,
	cycle_hot_water_xeros_pounds,
	cycle_hot_water_volume_per_pound,
	cycle_hot_water_xeros_volume_per_pound,

	cycle_therms,
	cycle_therms_xeros,
cycle_therms_cost,
cycle_therms_cost_xeros,
	cycle_therms_per_pound,
	cycle_therms_per_pound_xeros,
	cycle_therm_cost_per_pound,
	cycle_therm_cost_per_pound_xeros,

-- Labor and cycle time measures
    cycle_time_run_time,
    cycle_time_xeros_run_time,
    cycle_time_unload_time,
    cycle_time_total_time,
    cycle_time_xeros_total_time,
    cycle_time_labor_cost,
    cycle_time_xeros_labor_cost,
    cycle_time_labor_cost_per_pound,
    cycle_time_xeros_labor_cost_per_pound,

    cycle_chemical_cost,
    cycle_chemical_xeros_cost,
    cycle_chemical_cost_per_pound,
    cycle_chemical_xeros_cost_per_pound,
    cycle_chemical_strength,
    cycle_chemical_xeros_strength,
    cycle_chemical_strength_per_pound,
    cycle_chemical_xeros_strength_per_pound
	)
  SELECT
    dma.dai_meter_actual_id,
    dma.machine_id,
    dma.classification_id,
    m.location_id,
-- Base measures
-- Should always equal one in this view
    date(reading_timestamp)                                                                     AS reading_date,
    reading_timestamp                                                                           AS reading_timestamp,
    mc.load_size                                                                               AS cycle_load_size,
    mc.xeros_load_size                                                                         AS cycle_xeros_load_size,

-- Cold water
    ( dma.cold_water + dma.hot_water) * lp.water_meter_rate                                                                        AS cycle_cold_water_volume,
    xlsv.cold_water_gallons + xlsv.hot_water_gallons                                                                   AS cycle_cold_water_xeros_volume,
    ( (dma.cold_water + dma.hot_water) * lp.water_meter_rate ) * (ua.period_cost / ua.period_usage)                             AS cycle_cold_water_cost,
    ( xlsv.cold_water_gallons + xlsv.hot_water_gallons ) * (ua.period_cost / ua.period_usage)                              AS cycle_cold_water_xeros_cost,

    ( (dma.cold_water + dma.hot_water) * lp.water_meter_rate ) / mc.load_size                                                    AS cycle_cold_water_volume_per_pound,
    ( xlsv.hot_water_gallons + xlsv.hot_water_gallons )  / mc.xeros_load_size                                                    AS cycle_cold_water_xeros_volume_per_pound,
    (( (dma.cold_water + dma.hot_water) * lp.water_meter_rate ) * (ua.period_cost / ua.period_usage)) / mc.load_size           AS cycle_cold_water_cost_per_pound,
    (( xlsv.cold_water_gallons + xlsv.hot_water_gallons )  * (ua.period_cost / ua.period_usage)) / mc.xeros_load_size           AS cycle_cold_water_xeros_cost_per_pound,

	cycle_hot_water_volume,
	cycle_hot_water_pounds,
	cycle_hot_water_xeros_volume,
	cycle_hot_water_xeros_pounds,
	cycle_hot_water_volume_per_pound,
	cycle_hot_water_xeros_volume_per_pound,

    (cycle_hot_water_volume_per_pound * (ua.period_cost / ua.period_usage)) / mc.load_size           AS cycle_hot_water_cost_per_pound,
    (cycle_hot_water_xeros_volume_per_pound * (ua.period_cost / ua.period_usage)) / mc.xeros_load_size           AS cycle_hot_water_xeros_cost_per_pound,

    (cycle_hot_water_volume_per_pound * (ua.period_cost / ua.period_usage))        AS cycle_hot_water_cost,
    (cycle_hot_water_xeros_volume_per_pound * (ua.period_cost / ua.period_usage))           AS cycle_hot_water_xeros_cost,

	cycle_therms,
	cycle_therms_xeros,
cycle_therms_cost,
cycle_therms_cost_xeros,
	cycle_therms_per_pound,
	cycle_therms_per_pound_xeros,
	cycle_therm_cost_per_pound,
	cycle_therm_cost_per_pound_xeros,

-- Labor and cycle time measures

      -- DMA Run time is in seconds - need to convert to minutes ( / 60 )
      -- Hourly Rate is per hour, need to convert to minutes ( / 60 )
    dma.run_time / 60                                                                              AS cycle_time_run_time,
    xlsv.run_time                                                                              AS cycle_time_xeros_run_time,
    mc.unload_time                                                                             AS cycle_time_unload_time,
    ( dma.run_time / 60 ) + mc.unload_time                                                             AS cycle_time_total_time,
    xlsv.run_time + mc.unload_time                                                            AS cycle_time_xeros_total_time,
    ( ( dma.run_time / 60 ) + mc.unload_time) * (labor_profile.ops_hourly_rate / 60)                              AS cycle_time_labor_cost,
    (xlsv.run_time + mc.unload_time) * (labor_profile.ops_hourly_rate / 60)                             AS cycle_time_xeros_labor_cost,
      ( ( ( dma.run_time / 60 ) + mc.unload_time) * (labor_profile.ops_hourly_rate / 60) ) / mc.load_size            AS cycle_time_labor_cost_per_pound,
    ((xlsv.run_time + mc.unload_time) * (labor_profile.ops_hourly_rate / 60)) / mc.xeros_load_size     AS cycle_time_xeros_labor_cost_per_pound,

    cycle_chemical_cost,
    cycle_chemical_xeros_cost,
    cycle_chemical_cost_per_pound,
    cycle_chemical_xeros_cost_per_pound,
    cycle_chemical_strength,
    cycle_chemical_xeros_strength,
    cycle_chemical_strength_per_pound,
    cycle_chemical_xeros_strength_per_pound

  FROM
      xeros_dai_meter_actual AS dma
      LEFT JOIN xeros_classification AS c
        ON dma.classification_id = c.classification_id
      LEFT JOIN xeros_machine_classification AS mc
        ON dma.machine_id = mc.machine_id
           AND dma.classification_id = mc.classification_id
      LEFT JOIN xeros_machine AS m
        ON dma.machine_id = m.machine_id
      left join field_data_field_location as fl
        on m.machine_id = fl.entity_id and fl.entity_type = 'data_xeros_machine'
      LEFT JOIN xeros_xeros_local_static_value AS xlsv
        ON mc.classification_id = xlsv.classification_id
      LEFT JOIN xeros_utility_actual AS ua
        ON fl.field_location_target_id = ua.location_id
           AND ua.utility_type = 'water'
	  LEFT JOIN xeros_therm_cycle AS tc
		ON dma.dai_meter_actual_id = tc.dai_meter_actual_id
      LEFT JOIN xeros_labor_profile AS labor_profile
        ON fl.field_location_target_id  = labor_profile.location_id
      LEFT JOIN xeros_chemical_cycle AS cc
        ON dma.dai_meter_actual_id = cc.dai_meter_actual_id
	  LEFT JOIN xeros_location_profile as lp
		on m.location_id = lp.location_id

  ;
END;;


DROP PROCEDURE IF EXISTS sp_refresh_report_data;;

CREATE PROCEDURE sp_refresh_report_data()
BEGIN

  call sp_chemical_unit();
  call sp_chemical_cycle();
  call sp_therm_cycle();
  call sp_xeros_cycle();

END;;

call sp_refresh_report_data();;

select * from xeros_cycle where machine_id = 6 limit 100;