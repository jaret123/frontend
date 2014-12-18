<?php

function ws_industry_averages() {

  $record = get_industry_averages();

  echo json_encode($record);

}

function get_industry_averages() {

  $query = <<<SQL
  select
      avg(cycle_cold_water_volume) as avg_cold_water_volume,
      avg(cycle_cold_water_cost) as avg_cold_water_cost,
      avg(cycle_hot_water_volume) as avg_hot_water_volume,
      -- avg(cycle_hot_water_cost),
      avg(cycle_therms) as avg_therms,
      avg(cycle_therms_cost) as avg_therm_cost,
      avg(cycle_chemical_strength) as avg_chemical_strength,
      avg(cycle_chemical_cost) as avg_chemical_cost
  from xeros_cycle
where manufacturer <> 'xeros' and water_only = 0 ;
SQL;

  $result = db_query($query);

  $record = $result->fetchObject();

  foreach ($record as $key => $value) {
    $record->$key = (float)$value;
  }

  $record->avg_therm_per_gallon_hot_water = $record->avg_therms / $record->avg_hot_water_volume;

  return $record;
}