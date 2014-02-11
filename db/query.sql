use xeros_local;

select
  xm.machine_id as id,
  xm.manufacturer as machine_name,
  xm.size,
  b.*
from
    xeros_machine as xm


    left join
    ( -- metrics
      select
        xc.machine_id,
        xc.classification_id,

        xmc.load_size,
        xmc.xeros_load_size,

        xcl.name,


        'Gallons' as value_one_label,
        truncate(sum(xc.cycle_hot_water_volume), 0) as value_one,
        truncate(sum(xc.cycle_hot_water_xeros_volume), 0) as xeros_value_one,

        'Load Size' as value_two_label,
        '50' as value_two,
        '50' as xeros_value_two,

        'Gallons Per Pound' as value_three_label,
        truncate(sum(xc.cycle_hot_water_volume_per_pound), 0) as value_three,
        truncate(sum(xc.cycle_hot_water_xeros_volume_per_pound), 0) as xeros_value_three,

        'Cost Per Pound' as value_four_label,
        truncate(sum(xc.cycle_hot_water_cost_per_pound), 2) as value_four,
        truncate(sum(xc.cycle_hot_water_xeros_cost_per_pound), 2) as xeros_value_four,

        'Water Reduction' as delta_one_label,
        truncate(sum(xc.cycle_hot_water_volume_per_pound) -
                 sum(xc.cycle_hot_water_xeros_volume_per_pound), 2) as delta_one,

        'Cost Reduction' as delta_two_label,
        truncate(sum(xc.cycle_hot_water_cost_per_pound) /
                 sum(xc.cycle_hot_water_xeros_cost_per_pound), 2) as delta_two


      from
          xeros_cycle as xc
          left join xeros_machine_classification as xmc
            on xc.machine_id = xmc.machine_id
               and xc.classification_id = xmc.classification_id
          left join xeros_classification as xcl
            on xmc.classification_id = xcl.classification_id
      where
        1 = 1
        and reading_date >= '2013-12-01' and reading_date <= '2013-12-30'
      group by
        xc.machine_id,
        xc.classification_id
    ) as b
      on xm.machine_id = b.machine_id
where
  1 = 1
  and xm.machine_id = 2
  and b.classification_id = 1
# put in location filter;
