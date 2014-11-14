ALTER TABLE `xeros_machine`
ADD COLUMN `active` INT NOT NULL DEFAULT 1 AFTER `status`;

UPDATE xeros_machine set active = 1;