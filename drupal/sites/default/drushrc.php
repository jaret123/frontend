<?php
/**
 * Global config file for drush.
 */

//"include" table for refreshing dev data from prod
$options['tables']['xeros'] = array(
    'xeros_active_dai',
    'xeros_calculation_rules',
    'xeros_chemical_cycle',
    'xeros_chemical_profile',
    'xeros_chemical_unit',
    'xeros_chemical_usage',
    'xeros_classification',
    'xeros_collection_map',
    'xeros_collection_map_detail',
    'xeros_company',
    'xeros_cycle',
    'xeros_dai_meter_actual',
    'xeros_dai_meter_collection',
    'xeros_dai_meter_collection_detail',
    'xeros_dates',
    'xeros_dim_date',
    'xeros_labor_profile',
    'xeros_local_static_values',
    'xeros_location',
    'xeros_location_profile',
    'xeros_machine',
    'xeros_machine_classification',
    'xeros_operations_schedule',
    'xeros_static_values',
    'xeros_status',
    'xeros_therm_cycle',
    'xeros_user_roles',
    'xeros_users',
    'xeros_utility_actual',
    'xeros_utility_profile',
    'xeros_xeros_local_static_value'
);
