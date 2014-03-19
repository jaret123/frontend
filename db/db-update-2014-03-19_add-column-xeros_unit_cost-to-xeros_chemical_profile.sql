alter table xeros_chemical_profile add xeros_unit_cost Decimal(15,2);
update xeros_chemical_profile set xeros_unit_cost = 0; 