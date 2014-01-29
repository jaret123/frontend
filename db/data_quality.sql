# Verify that we did not do a cross product on creating the reporting view

select count(*) from xeros_cycle;

select count(*), count(distinct dai_meter_actual_id) from xeros_dai_meter_actual;


