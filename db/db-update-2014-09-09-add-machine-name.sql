ALTER TABLE `xeros_machine`
ADD COLUMN `machine_name` VARCHAR(150) NULL DEFAULT '<machine name>' AFTER `classification_base`,
ADD COLUMN `notes` VARCHAR(2048) NULL AFTER `machine_name`;