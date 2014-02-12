-- Create syntax for 'xeros_chemical_unit'

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `xeros_chemical_unit`
AS SELECT
   `m`.`dai_meter_actual_id` AS `dai_meter_actual_id`,
   `m`.`machine_id` AS `machine_id`,
   `m`.`classification_id` AS `classification_id`,
   `cu`.`chemical_profile_id` AS `chemical_profile_id`,
   `cu`.`strength` AS `strength`,
   `cp`.`unit` AS `unit`,
   `cp`.`unit_cost` AS `unit_cost`,
   `cu`.`xeros_strength` AS `xeros_strength`,(`cp`.`unit_cost` * `cu`.`strength`) AS `chemical_unit_cost`,(`cp`.`unit_cost` * `cu`.`xeros_strength`) AS `xeros_chemical_unit_cost`,
   `mc`.`load_size` AS `load_size`,
   `mc`.`xeros_load_size` AS `xeros_load_size`,cast(`m`.`reading_timestamp` as date) AS `reading_date`
FROM ((((`xeros_dai_meter_actual` `m` left join `xeros_classification` `cl` on((`m`.`classification_id` = `cl`.`classification_id`))) left join `xeros_machine_classification` `mc` on(((`m`.`machine_id` = `mc`.`machine_id`) and (`m`.`classification_id` = `mc`.`classification_id`)))) left join `xeros_chemical_usage` `cu` on((`mc`.`machine_classification_id` = `cu`.`machine_classification_id`))) left join `xeros_chemical_profile` `cp` on((`cu`.`chemical_profile_id` = `cp`.`chemical_profile_id`)));
