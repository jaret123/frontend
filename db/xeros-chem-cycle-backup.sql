-- Create syntax for 'xeros_chemical_cycle'

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `xeros_chemical_cycle`
AS SELECT
   `xeros_chemical_unit`.`dai_meter_actual_id` AS `dai_meter_actual_id`,
   `xeros_chemical_unit`.`machine_id` AS `machine_id`,
   `xeros_chemical_unit`.`classification_id` AS `classification_id`,sum(`xeros_chemical_unit`.`chemical_unit_cost`) AS `cycle_chemical_cost`,sum(`xeros_chemical_unit`.`strength`) AS `cycle_chemical_strength`,sum((`xeros_chemical_unit`.`strength` / `xeros_chemical_unit`.`load_size`)) AS `cycle_chemical_strength_per_pound`,sum((`xeros_chemical_unit`.`chemical_unit_cost` / `xeros_chemical_unit`.`load_size`)) AS `cycle_chemical_cost_per_pound`,sum((`xeros_chemical_unit`.`xeros_chemical_unit_cost` / `xeros_chemical_unit`.`load_size`)) AS `cycle_chemical_xeros_cost_per_pound`,sum(`xeros_chemical_unit`.`xeros_strength`) AS `cycle_chemical_xeros_strength`,sum((`xeros_chemical_unit`.`xeros_strength` / `xeros_chemical_unit`.`load_size`)) AS `cycle_chemical_xeros_strength_per_pound`,sum(`xeros_chemical_unit`.`xeros_chemical_unit_cost`) AS `cycle_chemical_xeros_cost`,
   `xeros_chemical_unit`.`reading_date` AS `reading_date`
FROM `xeros_chemical_unit` group by `xeros_chemical_unit`.`dai_meter_actual_id`,`xeros_chemical_unit`.`machine_id`,`xeros_chemical_unit`.`classification_id`,`xeros_chemical_unit`.`reading_date`;
