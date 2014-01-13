SET foreign_key_checks = 0;

DROP TABLE IF EXISTS xeros_customer ;
drop table if exists xeros_location_static_value;
drop table if exists xeros_location;
drop table if exists xeros_operations_schedule;
drop table if exists xeros_contact;
drop table if exists xeros_utility_profile;
drop table if exists xeros_chemical_profile;
drop table if exists xeros_utility_actual;
drop table if exists xeros_machine_profile;
drop table if exists xeros_labor_profile;
drop table if exists xeros_classification_profile;
drop table if exists xeros_chemical_usage;
drop table if exists xeros_active_dai;
drop table if exists xeros_dai_meter_actual;
drop table if exists xeros_calculation_rules;
drop table if exists xeros_local_static_values;


CREATE TABLE xeros_customer (
  customer_id int unsigned NOT NULL AUTO_INCREMENT,
  customer_erp_id int DEFAULT NULL,
  name varchar(255) NOT NULL COMMENT 'Customer Full Name' ,
  address_1 varchar(255),
  address_2 varchar(255),
  city varchar(255),
  state varchar(10),
  zipcode varchar(15),
  primary_contact int(11) COMMENT 'Foreign key to contacts table',
  primary_email int(11) COMMENT 'Should we get this from the contacts table?',
  telephone varchar(15) COMMENT 'Should we get this from contacts table?',
  fax varchar(15) COMMENT 'Should we get this from contacts table?',
  logo_path varchar(255) COMMENT 'What is this?',
  PRIMARY KEY (customer_id)
) ENGINE=InnoDB COMMENT='Customer information - consider moving to Drupal Entity or node';


CREATE TABLE xeros_location_static_value (
  location_static_value_id int unsigned NOT NULL AUTO_INCREMENT,
  temperature_rise_spring int DEFAULT 0 NOT NULL COMMENT 'We should make this a delta, and a date start, like a home therm',
  temperature_rise_fall int DEFAULT 0 NOT NULL,
  temperature_rise_winter int DEFAULT 0 NOT NULL,
  heating_efficiency int DEFAULT 0 NOT NULL COMMENT 'What is this',
  PRIMARY KEY (location_static_value_id)
) ENGINE=InnoDB COMMENT='Static values about each location' ;

CREATE TABLE xeros_location (
  location_id int unsigned NOT NULL AUTO_INCREMENT,
  customer_id int unsigned,
  index customer_id_index (customer_id),
  foreign key (customer_id) references xeros_customer(customer_id) on delete cascade,
  name varchar(255),
  address_1 varchar(255),
  address_2 varchar(255),
  city varchar(255),
  zipcode varchar(15),
  telephone varchar(15),
  fax varchar(15),
  primary key (location_id)
) engine=innodb comment='location address information';

create table xeros_operations_schedule (
  operations_schedule_id int unsigned not null auto_increment,
  day varchar(255),
  shift varchar(255),
  shift_start_time time,
  shift_end_time time comment 'Should we make this a length for dealing with shifts that might wrap around midnight',
  location_id int unsigned not null,
  index location_id_index (location_id),
  foreign key (location_id) references xeros_location(location_id) on delete cascade,
  primary key (operations_schedule_id)
) engine=innodb comment='Operations Schedule';

-- We should move all the customer, location, and contact information into Drupal users and
-- taxonomy or entity references

-- Contact = User (role - contact)


create table xeros_contact (
  contact_id int unsigned not null auto_increment,
  name varchar(255),
  title varchar(255),
  email varchar(255),
  telephone varchar(255),
  mobile varchar(15),
  primary key (contact_id)
) engine=innodb comment='Contact information';


create table xeros_utility_profile (
  utility_profile_id int unsigned not null auto_increment,
  inbound_water_temp int,
  hot_water_temp int,
  water_hardness int,
  water_chlorine int,
  estimated_cost_per_gallon numeric(15,2),
  estimated_cost_per_kwh numeric(15,2),
  estimated_cost_basic numeric(15,2), -- TODO: Documentation said estimated_cost_Gasic?
  location_id int unsigned not null,
  index location_id_index (location_id),
  foreign key (location_id) references xeros_location(location_id),
  primary key (utility_profile_id)
) engine='innodb';



create table xeros_chemical_profile (
  chemical_profile_id int unsigned not null auto_increment,
  chemical_type varchar(255),
  supplier varchar(255),
  material_type varchar(255),
  measurement_type varchar(255),
  unit_cost numeric(15,2), -- TODO: Verify data type
  location_id int unsigned not null,
  index location_id_index (location_id),
  foreign key (location_id) references xeros_location(location_id),
  primary key (chemical_profile_id)
) engine=innodb;



create table xeros_utility_actual (
  utility_actual_id int unsigned not null auto_increment,
  period int, -- TODO: verify data type
  utility_type int, -- TODO: verify data type and values
  measurement int, -- TODO: verify data type and values
  period_count int, -- TODO: verify data type and values
  total_cost numeric(15,2), -- TODO: verify data type and values
  unit_cost numeric(15,2), -- TODO: verify data type and values
  location_id int unsigned not null,
  index location_id_index (location_id),
  foreign key (location_id) references xeros_location(location_id),
  primary key (utility_actual_id)
) engine=innodb;




create table xeros_machine_profile (
  machine_profile_id int unsigned not null auto_increment,
  serial_number varchar(255),
  manufacturer varchar(255),
  size varchar(255), -- TODO: Should this be volume in gallons?
  steam int, -- TODO: verify data type and values
  fuel_type int,  -- TODO: verify data type and values
  location_id int unsigned not null,
  index location_id_index (location_id),
  foreign key (location_id) references xeros_location(location_id),
  primary key (machine_profile_id)
) engine=innodb;



create table xeros_labor_profile (
  labor_profile_id int unsigned not null auto_increment,
  ops_hourly_rate numeric(15,2),
  location_id int unsigned not null,
  index location_id_index (location_id),
  foreign key (location_id) references xeros_location(location_id),
  primary key (labor_profile_id)
) engine=innodb;



create table xeros_classification_profile (
  classification_profile_id int unsigned not null auto_increment,
  description varchar(255),
  machine_profile_id int unsigned,
  index machine_profile_id_index (machine_profile_id),
  foreign key (machine_profile_id) references xeros_machine_profile(machine_profile_id),
  load_size numeric(15,2), -- TODO: Is this gallons or pounds?
  xeros_load_size numeric(15,2), -- TODO: How is this different?
  unload_time numeric(15,2), -- TODO: Record all time as minutes or decimal hours?
  primary key (classification_profile_id)
);



create table xeros_chemical_usage (
  chemical_usage_id int unsigned not null auto_increment,
  chemical_type varchar(255),
  strength varchar(255),
  xeros_strength varchar(255),
  primary key (chemical_usage_id)
) engine=innodb;



create table xeros_active_dai (
  active_dai_id int unsigned not null auto_increment,
  dry_smart int,
  machine_profile_id int,
  primary key (active_dai_id)
) engine=innodb;



create table xeros_dai_meter_actual (
  dai_meter_actual_id int unsigned not null auto_increment,
  reading_timestamp datetime,
  active_dai_id int unsigned,
  index active_dai_id_index (active_dai_id),
  foreign key (active_dai_id) references xeros_active_dai(active_dai_id),
  primary key (dai_meter_actual_id)
) engine=innodb;



create table xeros_calculation_rules (
  calculation_rules_id int unsigned not null auto_increment,
  description varchar(255),
  primary key (calculation_rules_id)
) engine=innodb;



# Single record per location.
create table xeros_local_static_values (
  local_static_values_id int unsigned not null auto_increment,
  classification varchar(255),
  hot_water_gallons numeric(15,2),
  cold_water_gallons numeric(15,2),
  primary key (local_static_values_id)
) engine=innodb;

SET foreign_key_checks = 1;
# drop table if exists {{table_name}};
# 
# create table {{table_name}} (
#   {{table_name}}_id int unsigned not null auto_increment,
#   
#   primary key ({{table_name}}_id)
# ) engine=innodb;