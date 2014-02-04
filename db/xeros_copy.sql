use xeros_local;

drop table if exists xeros_washer_copy;

CREATE TABLE xeros_washer_copy
(
  washer_id INT UNSIGNED PRIMARY KEY NOT NULL,
  serial_number VARCHAR(255),
  manufacturer VARCHAR(255),
  size VARCHAR(255),
  steam INT,
  fuel_type INT,
  location_id INT NULL,
  machine_type VARCHAR(255)
);
CREATE INDEX washer_id ON xeros_washer_copy ( washer_id );

insert into xeros_washer_copy (washer_id, serial_number)
    values ( 1, '345' );

CREATE TABLE test_tagle
(
  id INT UNSIGNED PRIMARY KEY NOT NULL,
  content VARCHAR(255),
  other_content INT
);
CREATE INDEX id ON test_tagle ( id );

drop table if exists xeros_machine_copy;

CREATE TABLE xeros_machine_copy
(
  id INT UNSIGNED PRIMARY KEY NOT NULL,
  serial_number VARCHAR(255),
  manufacturer VARCHAR(255),
  size VARCHAR(255),
  steam INT,
  fuel_type INT,
  location_id INT NULL,
  machine_type VARCHAR(255)
);

insert into xeros_machine_copy (serial_number)
  values ( '325' );
