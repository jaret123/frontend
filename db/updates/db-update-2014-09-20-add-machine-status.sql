ALTER TABLE `xeros_machine` 
ADD COLUMN `status` VARCHAR(45) NULL DEFAULT NULL AFTER `notes`;

UPDATE xeros_machine set status = 'online';

UPDATE xeros_machine set status = 'offline' where machine_id in (6,7);

UPDATE xeros_machine set status = 'inactive' where machine_id in (1,2);
