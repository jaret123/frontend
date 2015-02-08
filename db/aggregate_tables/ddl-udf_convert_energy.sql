DELIMITER ;;

DROP FUNCTION IF EXISTS udf_convert_energy;;

CREATE FUNCTION udf_convert_energy( _value float(10,2), _unit_from varchar(10) charset utf8, _unit_to varchar(10) charset utf8)
  RETURNS DECIMAL(10,4)
  BEGIN

    IF _unit_from = 'therms' and _unit_to = 'kwh' then
      return _value * 29.3001;
    elseif _unit_from = 'kwh' and _unit_to = 'therms' THEN
      return _value * 0.0341;
    elseif _unit_from = _unit_to THEN
      return _value ;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid parameter passed';
    end if;

  END ;;

select udf_convert_energy(10, 'therms', 'kwh');;
select udf_convert_energy(10, 'kwh', 'therms');;
select udf_convert_energy(10, 'kwh', 'kwh');;


select udf_convert_energy(10, 'hats', 'tshirts');
