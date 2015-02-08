DELIMITER ;;

DROP FUNCTION IF EXISTS udf_convert_temperature;;

CREATE FUNCTION udf_convert_temperature( _temperature float(10,2), _unit_from varchar(10) charset utf8, _unit_to varchar(10) charset utf8 )
  RETURNS DECIMAL(10,4)
  BEGIN

    IF _unit_from = 'F' and _unit_to = 'C' then
      return ( _temperature - 32 ) * ( 5 / 9 ) ;
    elseif _unit_from = 'C' and _unit_to = 'F' THEN
      return ( _temperature * ( 9 / 5 ) ) + 32 ;
    elseif _unit_from = _unit_to THEN
      return _temperature ;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid parameter passed';
    end if;

  END ;;

select udf_convert_temperature(10, 'F', 'C');;
select udf_convert_temperature(10, 'C', 'F');;
select udf_convert_temperature(10, 'F', 'F');;


select udf_convert_temperature(10, 'kelvin', 'tshirts');
