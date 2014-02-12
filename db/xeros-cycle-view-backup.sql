-- Create syntax for 'xeros_cycle'

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `xeros_cycle`
AS SELECT
   `xdma`.`dai_meter_actual_id` AS `dai_meter_actual_id`,
   `xdma`.`machine_id` AS `machine_id`,
   `xdma`.`classification_id` AS `classification_id`,
   `xm`.`location_id` AS `location_id`,cast(`xdma`.`reading_timestamp` as date) AS `reading_date`,
   `xmc`.`load_size` AS `cycle_load_size`,
   `xmc`.`xeros_load_size` AS `cycle_xeros_load_size`,
   `xdma`.`cold_water` AS `cycle_cold_water_volume`,
   `xxlsv`.`cold_water_gallons` AS `cycle_cold_water_xeros_volume`,(`xdma`.`cold_water` * (`xua`.`period_cost` / `xua`.`period_usage`)) AS `cycle_cold_water_cost`,(`xxlsv`.`hot_water_gallons` * (`xua`.`period_cost` / `xua`.`period_usage`)) AS `cycle_cold_water_xeros_cost`,(`xdma`.`cold_water` / `xmc`.`load_size`) AS `cycle_cold_water_volume_per_pound`,(`xxlsv`.`cold_water_gallons` / `xmc`.`load_size`) AS `cycle_cold_water_xeros_volume_per_pound`,((`xdma`.`cold_water` * (`xua`.`period_cost` / `xua`.`period_usage`)) / `xmc`.`load_size`) AS `cycle_cold_water_cost_per_pound`,((`xxlsv`.`cold_water_gallons` * (`xua`.`period_cost` / `xua`.`period_usage`)) / `xmc`.`load_size`) AS `cycle_cold_water_xeros_cost_per_pound`,
   `xdma`.`hot_water` AS `cycle_hot_water_volume`,
   `xxlsv`.`hot_water_gallons` AS `cycle_hot_water_xeros_volume`,(`xdma`.`hot_water` * (`xuah`.`period_cost` / `xuah`.`period_usage`)) AS `cycle_hot_water_cost`,(`xxlsv`.`hot_water_gallons` * (`xuah`.`period_cost` / `xuah`.`period_usage`)) AS `cycle_hot_water_xeros_cost`,(`xdma`.`hot_water` / `xmc`.`load_size`) AS `cycle_hot_water_volume_per_pound`,(`xxlsv`.`hot_water_gallons` / `xmc`.`load_size`) AS `cycle_hot_water_xeros_volume_per_pound`,((`xdma`.`hot_water` * (`xuah`.`period_cost` / `xuah`.`period_usage`)) / `xmc`.`load_size`) AS `cycle_hot_water_cost_per_pound`,((`xxlsv`.`hot_water_gallons` * (`xuah`.`period_cost` / `xuah`.`period_usage`)) / `xmc`.`xeros_load_size`) AS `cycle_hot_water_xeros_cost_per_pound`,
   `xdma`.`run_time` AS `cycle_time_run_time`,
   `xxlsv`.`run_time` AS `cycle_time_xeros_run_time`,
   `xmc`.`unload_time` AS `cycle_time_unload_time`,(`xdma`.`run_time` + `xmc`.`unload_time`) AS `cycle_time_total_time`,(`xxlsv`.`run_time` + `xmc`.`unload_time`) AS `cycle_time_xeros_total_time`,((`xdma`.`run_time` + `xmc`.`unload_time`) * (`xlp`.`ops_hourly_rate` / 60)) AS `cycle_time_labor_cost`,((`xxlsv`.`run_time` + `xmc`.`unload_time`) * (`xlp`.`ops_hourly_rate` / 60)) AS `cycle_time_xeros_labor_cost`,(((`xdma`.`run_time` + `xmc`.`unload_time`) * (`xlp`.`ops_hourly_rate` / 60)) / `xmc`.`load_size`) AS `cycle_time_labor_cost_per_pound`,(((`xxlsv`.`run_time` + `xmc`.`unload_time`) * (`xlp`.`ops_hourly_rate` / 60)) / `xmc`.`xeros_load_size`) AS `cycle_time_xeros_labor_cost_per_pound`,
   `xcc`.`cycle_chemical_cost` AS `cycle_chemical_cost`,
   `xcc`.`cycle_chemical_xeros_cost` AS `cycle_chemical_xeros_cost`,
   `xcc`.`cycle_chemical_cost_per_pound` AS `cycle_chemical_cost_per_pound`,
   `xcc`.`cycle_chemical_xeros_cost_per_pound` AS `cycle_chemical_xeros_cost_per_pound`,
   `xcc`.`cycle_chemical_strength` AS `cycle_chemical_strength`,
   `xcc`.`cycle_chemical_xeros_strength` AS `cycle_chemical_xeros_strength`,
   `xcc`.`cycle_chemical_strength_per_pound` AS `cycle_chemical_strength_per_pound`,
   `xcc`.`cycle_chemical_xeros_strength_per_pound` AS `cycle_chemical_xeros_strength_per_pound`
FROM ((((((((`xeros_dai_meter_actual` `xdma` left join `xeros_classification` `xc` on((`xdma`.`classification_id` = `xc`.`classification_id`))) left join `xeros_machine_classification` `xmc` on(((`xdma`.`machine_id` = `xmc`.`machine_id`) and (`xdma`.`classification_id` = `xmc`.`classification_id`)))) left join `xeros_machine` `xm` on((`xdma`.`machine_id` = `xm`.`machine_id`))) left join `xeros_xeros_local_static_value` `xxlsv` on((`xmc`.`classification_id` = `xxlsv`.`classification_id`))) left join `xeros_utility_actual` `xua` on((`xua`.`utility_type` = 'water'))) left join `xeros_utility_actual` `xuah` on((`xuah`.`utility_type` = 'electric'))) left join `xeros_labor_profile` `xlp` on((`xm`.`location_id` = `xlp`.`location_id`))) left join `xeros_chemical_cycle` `xcc` on((`xdma`.`dai_meter_actual_id` = `xcc`.`dai_meter_actual_id`)));
