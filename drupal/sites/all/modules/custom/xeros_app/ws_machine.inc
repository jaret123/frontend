<?php

include_once(drupal_get_path('module', 'xeros_admin') . '/db/machine.inc');

function ws_machine($location_id = NULL, $machine_id = NULL)
{

    $machine = new machine();

    $machine->fields = array(
        'machine_id', 'machine_name', 'serial_number', 'manufacturer', 'location_id', 'active', 'status'
    );
    $rows = $machine->select($location_id, $machine_id);


    echo json_encode($rows);

}