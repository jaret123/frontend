-- USE `xeros-qa`;

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
    m.dai_meter_actual_id,
    m.machine_id,
    m.classification_id,
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
      xeros_dai_meter_actual AS m
      LEFT JOIN xeros_machine_classification AS mc
        ON m.machine_id = mc.machine_id
       AND m.classification_id = mc.classification_id
      LEFT JOIN xeros_chemical_usage AS cu
        ON mc.machine_classification_id = cu.machine_classification_id
      LEFT JOIN xeros_chemical_profile AS cp
        ON cu.chemical_profile_id = cp.chemical_profile_id;
        
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
    sum(chemical_unit_cost)                   AS cycle_chemical_cost,
    sum(strength)                             AS cycle_chemical_strength,
    sum(strength / load_size)                 AS cycle_chemical_strength_per_pound,
    sum(chemical_unit_cost / load_size)       AS cycle_chemical_cost_per_pound,
    sum(xeros_chemical_unit_cost / load_size) AS cycle_chemical_xeros_cost_per_pound,
    sum(xeros_strength)                       AS cycle_chemical_xeros_strength,
    sum(xeros_strength / load_size)           AS cycle_chemical_xeros_strength_per_pound,
    sum(xeros_chemical_unit_cost)             AS cycle_chemical_xeros_cost  
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
-- Should always equal one in this view
    cycle_hot_water_volume decimal(15,4),
# TODO: Change gallons to volume
    cycle_hot_water_xeros_volume decimal(15,4),
    cycle_hot_water_cost decimal(15,4),
    cycle_hot_water_xeros_cost decimal(15,4),
    cycle_hot_water_volume_per_pound decimal(15,4),
    cycle_hot_water_xeros_volume_per_pound decimal(15,4),
    cycle_hot_water_cost_per_pound decimal(15,4),
    cycle_hot_water_xeros_cost_per_pound decimal(15,4),

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
-- Should always equal one in this view
    cycle_hot_water_volume,
# TODO: Change gallons to volume
    cycle_hot_water_xeros_volume,
    cycle_hot_water_cost,
    cycle_hot_water_xeros_cost,
    cycle_hot_water_volume_per_pound,
    cycle_hot_water_xeros_volume_per_pound,
    cycle_hot_water_cost_per_pound,
    cycle_hot_water_xeros_cost_per_pound,

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
    xdma.dai_meter_actual_id,
    xdma.machine_id,
    xdma.classification_id,
    xm.location_id,
-- Base measures
-- Should always equal one in this view
    date(reading_timestamp)                                                                 AS reading_date,
    xmc.load_size                                                                           AS cycle_load_size,
    xmc.xeros_load_size                                                                     AS cycle_xeros_load_size,

-- Cold water
    xdma.cold_water                                                                         AS cycle_cold_water_volume,
    xxlsv.cold_water_gallons                                                                AS cycle_cold_water_xeros_volume,
--    xua.period_cost / xua.period_usage                                         AS cycle_unit_cost,
    xdma.cold_water * (xua.period_cost / xua.period_usage)                                  AS cycle_cold_water_cost,
    xxlsv.hot_water_gallons * (xua.period_cost / xua.period_usage)                          AS cycle_cold_water_xeros_cost,

    xdma.cold_water /
    xmc.load_size                                                                           AS cycle_cold_water_volume_per_pound,
    xxlsv.cold_water_gallons /
    xmc.load_size                                                                           AS cycle_cold_water_xeros_volume_per_pound,
    (xdma.cold_water * (xua.period_cost / xua.period_usage)) /
    xmc.load_size                                                                           AS cycle_cold_water_cost_per_pound,
    (xxlsv.cold_water_gallons * (xua.period_cost / xua.period_usage)) /
    xmc.load_size                                                                           AS cycle_cold_water_xeros_cost_per_pound,

-- hot water
-- Should always equal one in this view
    xdma.hot_water                                                                          AS cycle_hot_water_volume,
# TODO: Change gallons to volume
    xxlsv.hot_water_gallons                                                                 AS cycle_hot_water_xeros_volume,
--     xuah.period_cost / xuah.period_usage                                       AS cycle_hot_water_unit_cost,
    xdma.hot_water * (xuah.period_cost / xuah.period_usage)                                 AS cycle_hot_water_cost,
    xxlsv.hot_water_gallons * (xuah.period_cost /
                               xuah.period_usage)                                           AS cycle_hot_water_xeros_cost,
    xdma.hot_water /
    xmc.load_size                                                                           AS cycle_hot_water_volume_per_pound,
    xxlsv.hot_water_gallons /
    xmc.load_size                                                                           AS cycle_hot_water_xeros_volume_per_pound,
    (xdma.hot_water * (xuah.period_cost / xuah.period_usage)) /
    xmc.load_size                                                                           AS cycle_hot_water_cost_per_pound,
    (xxlsv.hot_water_gallons * (xuah.period_cost / xuah.period_usage)) /
    xmc.xeros_load_size                                                                     AS cycle_hot_water_xeros_cost_per_pound,

-- Labor and cycle time measures
    xdma.run_time                                                                           AS cycle_time_run_time,
    xxlsv.run_time                                                                          AS cycle_time_xeros_run_time,
    xmc.unload_time                                                                         AS cycle_time_unload_time,
    xdma.run_time + xmc.unload_time                                                         AS cycle_time_total_time,
    xxlsv.run_time +
    xmc.unload_time                                                                         AS cycle_time_xeros_total_time,
    (xdma.run_time + xmc.unload_time) * (xlp.ops_hourly_rate / 60)                          AS cycle_time_labor_cost,
    (xxlsv.run_time + xmc.unload_time) * (xlp.ops_hourly_rate /
                                          60)                                               AS cycle_time_xeros_labor_cost,
    ((xdma.run_time + xmc.unload_time) * (xlp.ops_hourly_rate / 60)) /
    xmc.load_size                                                                           AS cycle_time_labor_cost_per_pound,
    ((xxlsv.run_time + xmc.unload_time) * (xlp.ops_hourly_rate / 60)) /
    xmc.xeros_load_size                                                                     AS cycle_time_xeros_labor_cost_per_pound,

    xcc.cycle_chemical_cost,
    xcc.cycle_chemical_xeros_cost,
    xcc.cycle_chemical_cost_per_pound,
    xcc.cycle_chemical_xeros_cost_per_pound,
    xcc.cycle_chemical_strength,
    xcc.cycle_chemical_xeros_strength,
    xcc.cycle_chemical_strength_per_pound,
    xcc.cycle_chemical_xeros_strength_per_pound

  FROM
      xeros_dai_meter_actual AS xdma
      LEFT JOIN xeros_classification AS xc
        ON xdma.classification_id = xc.classification_id
      LEFT JOIN xeros_machine_classification AS xmc
        ON xdma.machine_id = xmc.machine_id
           AND xdma.classification_id = xmc.classification_id
      LEFT JOIN xeros_machine AS xm
        ON xdma.machine_id = xm.machine_id
      LEFT JOIN xeros_xeros_local_static_value AS xxlsv
        ON xmc.classification_id = xxlsv.classification_id
-- Cold Water
      LEFT JOIN xeros_utility_actual AS xua
        ON xua.utility_type = 'water'
-- TODO: Can we assume a unique value?
     -- Hot Water
      LEFT JOIN xeros_utility_actual AS xuah
        ON xuah.utility_type = 'electric'
-- TODO: Can we assume a unique value?
     -- Labor
      LEFT JOIN xeros_labor_profile AS xlp
        ON xm.location_id = xlp.location_id
      LEFT JOIN xeros_chemical_cycle AS xcc
        ON xdma.dai_meter_actual_id = xcc.dai_meter_actual_id
        ;
END;;


DROP PROCEDURE IF EXISTS sp_refresh_report_data;;

CREATE PROCEDURE sp_refresh_report_data()
BEGIN

  call sp_chemical_unit();
  call sp_chemical_cycle() ;
  call sp_xeros_cycle();

END;;