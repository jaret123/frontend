<?php

/**
 * On average, industry washers use .37 therms per cycle
 */
define('INDUSTRY_THERMS', 0.37381793);
/**
 * On average, the industry cost per therm is
 */
define('INDUSTRY_THERMS_COST', 0.34448701);
/**
 * On average, industry washers use 4x as much water as xeros
 */
define('INDUSTRY_WATER_DIFF', 4);

define('XEROS_THERMS', 0);

define('XEROS_THERMS_DIFF', 0);

define('INDUSTRY_THERMS_PER_GALLON', .1);

define('INDUSTRY_HOT_WATER_RATIO', .4);

/**
 *               cold_water_actual * xeros_cold_water_ratio * static_hot_water_ratio = Hot water used by a Non-Xeros machine
 *               (Hot water used * 8.34 * (temp_rise_season / heating_rise_efficiency)) / 100,000
 **/


function convert_non_xeros_therms($xeros_cold_water, $location, $unit_volume) {

  // Hot water used by a Non-Xeros machine = cold_water_actual * xeros_cold_water_ratio * static_hot_water_ratio
    $non_xeros_hot_water = $xeros_cold_water * INDUSTRY_WATER_DIFF * INDUSTRY_HOT_WATER_RATIO;

    $convert_to_therms = 1;
    $pounds_per_unit_volume = 8.34;

    switch ($unit_volume) {
        case 'gallons':
            break;
        case 'liters' :
            $pounds_per_unit_volume = 2.2;
            $convert_to_therms = 29.3001;
            break;
        default:
            //TODO: throw error
            break;
    }
    // Non Xeros Therms = (Hot water used * pounds per unit volume * (temp_rise_season / heating_rise_efficiency)) / 100,000
    $non_xeros_therms = (($non_xeros_hot_water * $pounds_per_unit_volume * ($location['temperature_rise_spring'] / $location['heating_efficiency'])) / $location['thermal_conversion']) * $convert_to_therms;

  return $non_xeros_therms;

}

function convert_non_xeros_water($xeros_cold_water) {

  return $xeros_cold_water * INDUSTRY_WATER_DIFF;
}

function convert_xeros_water($non_xeros_water) {

  return $non_xeros_water / INDUSTRY_WATER_DIFF;

}

function convert_xeros_therms($non_xeros_water) {

  return $non_xeros_water * 0;

}