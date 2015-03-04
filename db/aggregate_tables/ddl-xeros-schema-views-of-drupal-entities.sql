/**
*  Delta is used for the ordering of multi-valued fields.  For these views we will take just the first one
**/

drop table if exists xeros_location;
drop table if exists xeros_customer;
drop table if exists xeros_contact;

drop view if exists xeros_company;

create view xeros_company as
select 
  n.nid as company_id,
  n.title as name,
	fa.field_address_thoroughfare as address_1,
	fa.field_address_premise as address_2,
	fa.field_address_locality as city,
	fa.field_address_administrative_area as state,
	fa.field_address_postal_code as zip
  from node as n
  left join field_data_field_address as fa
    on fa.entity_id = n.nid
    and fa.delta = 0
    and fa.bundle = 'company'
  left join field_data_field_phone as fp
    on fp.entity_id = n.nid
    and fp.delta = 0
    and fp.bundle = 'company'
where n.type = 'company';


drop view if exists xeros_location;
create view xeros_location as
select 
	n.nid as location_id,
	fc.field_company_target_id as company_id,
	n.title as location_name,
	fa.field_address_thoroughfare as address_1,
	fa.field_address_premise as address_2,
	fa.field_address_locality as city,
	fa.field_address_postal_code as zip
	from node as n
	left join field_data_field_company as fc
		on n.nid = fc.entity_id
		and fc.delta = 0
    and fc.bundle = 'location'
	left join field_data_field_address as fa
	  on n.nid = fa.entity_id 
	  and fa.delta = 0
    and fa.bundle = 'location'
	left join field_data_field_phone as fp
	  on n.nid = fp.entity_id
	  and fp.delta = 0
    and fp.bundle = 'location'
	left join node as company
	  on fc.field_company_target_id = company.nid
where n.type = 'location';

drop view if exists xeros_user_roles;
create view xeros_user_roles as
  select
    ur.uid,
    GROUP_CONCAT(r.name) as user_role
  from
      users_roles as ur
      left join role as r
        on ur.rid = r.rid
  group by ur.uid
  ;

drop view if exists xeros_users;
create view xeros_users as
  select
    u.uid,
    u.name,
    u.mail,
    company.nid as company_id,
    company.title as company_name,
    location.nid as location_id,
    location.title as location_name,
    ur.user_role
  from users as u
    left join field_data_field_company as fc
      on u.uid = fc.entity_id
         and fc.delta = 0
         and fc.bundle = 'user'
    left join node as company
      on fc.`field_company_target_id` = company.nid
    left join field_data_field_location as fl
      on u.uid = fl.entity_id
         and fl.delta = 0
         and fl.bundle = 'user'
    left join node as location
      on fl.field_location_target_id = location.nid
    left join xeros_user_roles as ur
      on u.uid = ur.uid
;