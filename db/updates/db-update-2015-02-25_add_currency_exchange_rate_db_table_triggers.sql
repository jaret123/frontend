/**
  Create the exchange rate history table
 */
CREATE TABLE IF NOT EXISTS currency_exchange_rate_db_table_revision (
  currency_code_from varchar(3) CHARACTER SET utf8 NOT NULL,
  currency_code_to varchar(3) CHARACTER SET utf8 NOT NULL,
  rate varchar(255) CHARACTER SET utf8 NOT NULL,
  timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (timestamp,currency_code_from,currency_code_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Historical record of exchange rates.';

/**
  Create triggers to add records to the historical table on create and update
 */
DROP TRIGGER IF EXISTS currency_exchange_create_trigger
CREATE TRIGGER currency_exchange_create_trigger AFTER INSERT ON currency_exchange_rate_db_table FOR EACH ROW insert into currency_exchange_rate_db_table_revision (currency_code_from,currency_code_to,rate) values (new.currency_code_from, new.currency_code_to,new.rate);

DROP TRIGGER IF EXISTS currency_exchange_update_trigger
CREATE TRIGGER currency_exchange_update_trigger AFTER UPDATE ON currency_exchange_rate_db_table FOR EACH ROW insert into currency_exchange_rate_db_table_revision (currency_code_from,currency_code_to,rate) values (new.currency_code_from, new.currency_code_to,new.rate);