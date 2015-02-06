DELIMITER ;;

DROP FUNCTION IF EXISTS :q;;

CREATE FUNCTION udf_convert_currency( _value float(10,2), _unit_from varchar(10), _unit_to varchar(10) )
  RETURNS DECIMAL(10,4)
  BEGIN

    -- Define rate to be up to 4 decimal places
    DECLARE _rate decimal(10,4) UNSIGNED DEFAULT 1;

    IF _unit_from = _unit_to THEN
      SET _rate = 1.0000;
    ELSE
      BEGIN
        select rate INTO _rate from currency_exchange_rate_db_table
        where currency_code_from = _unit_from and currency_code_to = _unit_to LIMIT 1;

        SELECT FOUND_ROWS() INTO @r;
        IF @r = 0 THEN
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid parameter passed';
        END IF;
      END ;
    END IF;

    RETURN _value * _rate;
  END ;;

select udf_convert_currency(10, 'USD', 'EUR');;
select udf_convert_currency(10, 'USD', 'GBP');;
select udf_convert_currency(10, 'USD', 'USD');;


select udf_convert_currency(10, 'bitcoin', 'rupies');
select udf_convert_currency(10, 'EUR', 'USD');;