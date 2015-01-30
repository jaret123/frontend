DELIMITER ;;

DROP FUNCTION IF EXISTS udf_convert_mass;;

CREATE FUNCTION udf_convert_mass( _mass float(10,2), _unit_from varchar(10), _unit_to varchar(10) )
  RETURNS DECIMAL(10,4)
  BEGIN

    IF _unit_from = 'ounce' and _unit_to = 'gram' then
      return _mass * 28.3495 ;
    elseif _unit_from = 'gram' and _unit_to = 'ounce' THEN
      return _mass * 0.035274 ;
    elseif _unit_from = _unit_to THEN
      return _mass ;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid parameter passed';
    end if;

  END ;;

select udf_convert_mass(10, 'ounce', 'gram');;
select udf_convert_mass(10, 'gram', 'ounce');;
select udf_convert_mass(10, 'gram', 'gram');;


select udf_convert_mass(10, 'kelvin', 'tshirts');
