#!/bin/bash

databaseName="xeros_release"

files=(
    ddl-date-dimension.sql
    ddl-sp-cycle-data.sql
    ddl-sp-get-status-history.sql
    ddl-sp-get-status.sql
    ddl-sp-therm-cycle.sql
    ddl-standardize-location-profile.sql
    ddl-standardize-meter.sql
    ddl-udf_convert_currency.sql
    ddl-udf_convert_energy.sql
    ddl-udf_convert_mass.sql
    ddl-udf_convert_temperature.sql
    ddl-udf_convert_volume.sql
    ddl-xeros-schema-views-of-drupal-entities.sql
    ddl_remap_record.sql
    )
for i in "${files[@]}"
do
    echo "mysql -h localhost -u root -proot $databaseName < $i"
	mysql -h localhost -u root -p"root" $databaseName < $i
done


