# Xeros SBEADY Data Acquisition and Reporting Project


This repository includes the following 

## Projects

1. /drupal - Drupal project - manages users, ACL, groups and report definitions.
2. /service - Symfony webservice - serves structure data for reports.
3. /docs - Documentation.
4. /db - Database schema scripts (if not stored in other projects).
5. /misc - Scripts for setting up dev_ops and other miscellany.

## Adding a new customer, location and machines

### Add customer, location, and users (contacts) in Drupal

* Add customer (Drupal)
  Add content – customer

* Add location (Drupal)
  Add content – location

* Link to customer
  Add User (Drupal)
  Link to customer - Note: Users are contacts

### Load Machine Configurations

This step is all done in the database

* Get the location id from the database

    select nid as location_id
    from node as n
      left join field_data_field_address as fa
      on n.nid = fa.entity_id
    where n.type = 'location' and name = '<location_name>';

** Add values for utility profile with Location as FK
** Add values for utility actual with Location as FK
** Add values for operations schedule with Location as FK
** Add values for location static values with Location as FK
** Add values for labor profile with Location as FK
** Add values for chemical profile with Location as FK

* Create Machine(s) with Location as FK
* Create Active DAI with machine_id as FK
* Create Machine Classification with machine_id as FK
	** Insert classification into classification table
* Create Usage with classification and chemical ids as Fks
* Create xeros_local_static values
