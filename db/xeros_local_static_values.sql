use xeros_local;


truncate xeros_xeros_local_static_value;

insert into xeros_xeros_local_static_value (
    xeros_local_static_value_id,
    machine_classification_id,
    hot_water_gallons,
    cold_water_gallons,
    run_time
)
values
    (1, 1, 0, 34.9, 22),
(2, 2, 0, 32.88, 22),
(3, 3, 0, 36.7, 22),
(4, 4, 0, 37.1, 22),
(5, 5, 0, 30.56, 22),
(6, 6, 0, 21.82, 22),
(7, 7, 0, 77.9, 22)
