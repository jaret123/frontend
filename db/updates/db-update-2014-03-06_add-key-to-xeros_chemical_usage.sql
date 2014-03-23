use xeros_local;

delete from xeros_chemical_usage 
where 
	machine_classification_id = 11
and chemical_profile_id = 2
;

insert into xeros_chemical_usage 
values (
   11, 2, 4, 1.35
)
;
ALTER TABLE `xeros_chemical_usage` 
CHANGE COLUMN `machine_classification_id` `machine_classification_id` INT(10) UNSIGNED NOT NULL  , 
CHANGE COLUMN `chemical_profile_id` `chemical_profile_id` VARCHAR(255) NOT NULL  , 
ADD PRIMARY KEY (`machine_classification_id`, `chemical_profile_id`) ;


