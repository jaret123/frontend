<?php

/**
 * Active_DAI class
 */

require_once 'orm_abstract.inc';

class active_dai extends orm_abstract {

  function __construct() {
    $this->table = 'xeros_active_dai';
    $this->key = 'active_dai_id';
  }

    /** Override the base function because we want multiple filters */
    public function select($location_id = NULL, $active_dai_id = NULL, $active_dai_identifier = NULL)
    {

        $select = db_select('xeros_active_dai', 'd');
        $select->leftJoin('xeros_machine', 'm', 'd.active_dai_id = m.active_dai_id');
        $select->leftJoin('xeros_location', 'l', 'm.location_id = l.location_id');
        $select->fields('d', array('active_dai_id', 'dai_identifier'));
        $select->fields('m', array('machine_id', 'location_id'));
        $select->fields('l', array('location_name'));

        if ($location_id <> NULL) {
            $select->condition('m.location_id', $location_id);
        }
        else if ($active_dai_id <> NULL) {
            $select->condition('d.active_dai_id', $active_dai_id);
        }
        else if ($active_dai_identifier <> NULL) {
            $select->condition('d.dai_identifier', $active_dai_identifier);
        }
        else {
            $select->condition('m.active_dai_id', NULL);
        }


        $entries = $select->execute()->fetchAll(PDO::FETCH_ASSOC);
        $rows = array();
        if (!empty($entries)) {
            foreach ($entries as $entry) {
                // Sanitize the data before handing it off to the theme layer.
                $rows[] = array_map('check_plain', $entry);
            }
        }
        return $rows;
    }

}