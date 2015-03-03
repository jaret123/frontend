DELIMITER ;;

DROP FUNCTION IF EXISTS udf_convert_mass;;

CREATE FUNCTION udf_convert_mass( _mass float(10,2), _unit_from varchar(10) charset utf8, _unit_to varchar(10) charset utf8 )
  RETURNS DECIMAL(10,4)
  BEGIN

    IF _unit_from = 'ounces' and _unit_to = 'grams' then
      return _mass * 28.3495 ;
    elseif _unit_from = 'grams' and _unit_to = 'ounces' THEN
      return _mass / 28.3495 ;
    elseif _unit_from = _unit_to THEN
      return _mass ;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid parameter passed';
    end if;

  END ;;

# select udf_convert_mass(10, 'ounces', 'grams');;
# select udf_convert_mass(10, 'grams', 'ounces');;
# select udf_convert_mass(10, 'grams', 'grams');;
#
#
# select udf_convert_mass(10, 'kelvin', 'tshirts');
