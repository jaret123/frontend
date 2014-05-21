USE xeros_local;

CREATE TABLE xeros_static_values
(
  name varchar(255) primary key,
  value varchar(1024),
  description varchar(2056)
);

INSERT INTO xeros_static_values VALUES ( 'water_only_diff', '.75', 'The average ratio of water that Xeros uses compared to standard machine.  Used in Water Only machine comparisons.');