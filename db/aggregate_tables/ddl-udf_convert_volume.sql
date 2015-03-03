DELIMITER ;;

DROP FUNCTION IF EXISTS udf_convert_volume;;

CREATE FUNCTION udf_convert_volume( _volume float(10,2), _unit_from varchar(10) charset utf8, _unit_to varchar(10) charset utf8 )
  RETURNS DECIMAL(10,4)
  BEGIN

    IF _unit_from = 'gallons' and _unit_to = 'liters' then
      return _volume * 3.78541;
    elseif _unit_from = 'liters' and _unit_to = 'gallons' THEN
      return _volume / 3.78541;
    elseif _unit_from = _unit_to THEN
      return _volume;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid parameter passed';
    end if;

  END ;;

# select udf_convert_volume(10, 'gallons', 'liters');;
# select udf_convert_volume(10, 'liters', 'gallons');;
# select udf_convert_volume(10, 'gallons', 'gallons');;
#
#
# select udf_convert_volume(10, 'microns', 'gallons');
