<?php
/**
 * Created by PhpStorm.
 * User: jason
 * Date: 4/26/14
 * Time: 12:33 PM
 */
require_once('db/active_dai.inc');

/**
 * This is used by the location edit page.
 *
 * @param null $location_id
 * @param null $active_dai
 *
 * @return string
 */
function active_dai_listing($location_id = NULL, $active_dai_id = NULL)
{
    $output = '<div>This is the DAI listing page for location: ' . $location_id . '</div>';

    $active_dai = new active_dai();

    $active_dai->fields = array(
        'active_dai_id', 'dai_identifier'
    );
    $rows = $active_dai->select($location_id, $active_dai_id);

    if (count($rows) > 0) {

        foreach ($rows as $i => $row) {
            array_push($rows[$i], '<a href="/config/active_dai/' . $row['location_id'] . '/edit/' . $row['active_dai_id'] . '">Edit</a>');
        }
        // Make a table
        $header = array(
            t('Active Dai ID'),
            t('DAI Identifier'),
            t('Machine ID'),
            t('Location ID'),
            t('Location Name'),
            t('Edit')
        );
        //$output .= theme('table', array('header' => $header, 'rows' => $rows));

        $r = array(
            '#theme' => 'table',
            '#header' => $header,
            '#rows' => $rows
        );
        $output .= drupal_render($r);
    } else {
        drupal_set_message(t('No Active DAIs found for this location.'));
    }

    $output .= '<div><a href="/config/active_dai/' . $location_id . '/add">Add another DAI</a></div>';
    return $output;
}

;

function active_dai_edit_page($location_id = NULL, $function_call = NULL, $active_dai_id = NULL)
{

    if ($location_id == NULL || !in_array($function_call, array('edit', 'add'))) {
        return "Page not found";
    } else {
        $output = '';
        $output .= '<a href="/config/location/edit/' . $location_id . '"> << Back to Location</a><br/>';
        $output .= 'Location ID: ' . $location_id . '<br />';
        $output .= 'Function: ' . $function_call . '<br />';

        $active_dai = new active_dai();

        if ($function_call == 'edit') {
            $rows = $active_dai->select($location_id, $active_dai_id);

            $vars = array(
                'active_dai_id' => $active_dai_id,
                'function_call' => $function_call,
                'location_id' => $rows[0]['location_id'],
                'dai_identifier' => $rows[0]['dai_identifier'],
                'location_name' => $rows[0]['location_name'],
                'machine_id' => $rows[0]['machine_id'],
                'active_dai' => $rows[0]
            );
        } else {
            $vars = array(
                'active_dai_id' => NULL,
                'function_call' => $function_call,
                'location_id' => $location_id,
                'dai_identifier' => '',
                'location_name' => '',
                'machine_id' => '',
                'active_dai' => ''
            );
        }


        $f = drupal_get_form('active_dai_form', $vars);

        $output .= drupal_render($f);

        return $output;
    }
}

/**
 * @param $form
 * @param $form_state
 *
 * @return mixed
 */
function active_dai_form($form, &$form_state, $vars)
{

    if (empty($form_state['#vars'])) {
        // Initialize values based on database.  These will only get used the first time the page is rendered.
        // After that the input values from $form_state will be used.
        $form_state['values']['active_dai_id'] = $vars['active_dai_id'];
        $form_state['values']['location_id'] = $vars['location_id'];
        $form_state['values']['machine_id'] = $vars['machine_id'];
        $form_state['values']['location_name'] = $vars['location_name'];
        $form_state['values']['dai_identifier'] = $vars['dai_identifier'];
        $form_state['values']['dai_settings']['active_dai'] = $vars['active_dai'];
        // Save this for reference in the form_state so each sub form can access it, even on callback.
        $form_state['#vars'] = $vars;
    }

    $form = array(
        '#tree' => TRUE
    );
    $form['header'] = array(
        '#type' => 'markup',
        '#markup' => t("DAI ID - Unique ID of the DAI (Auto Generated)") . ': ' . $vars['active_dai_id'] . '<br />',
    );

    // Hidden fields for processing between validate and submit
    $form['active_dai_id'] = array(
        '#type' => 'hidden',
        '#default_value' => !empty($form_state['values']['active_dai_id']) ? $form_state['values']['active_dai_id'] : '',
    );

    $form['location_id'] = array(
        '#type' => 'hidden',
        '#default_value' => !empty($form_state['values']['location_id']) ? $form_state['values']['location_id'] : '',
    );

    $form['dai_settings'] = array(
        '#type' => 'fieldset',
        '#title' => t('DAI Settings'),

        '#collapsible' => TRUE,
        '#collapsed' => FALSE,
        '#tree' => TRUE
    );
    // Visible fields
    $form['dai_settings']['DAI Identifier'] = array(
        '#title' => 'DAI Identifier',
        '#type' => 'textfield',
        '#default_value' => !empty($form_state['values']['dai_identifier']) ? $form_state['values']['dai_identifier'] : '',
    );

    $form['dai_settings']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Save'),
    );

    return $form;
}

function active_dai_form_validate($form, &$form_state)
{
}

function active_dai_form_submit($form, &$form_state)
{

    $active_dai = new active_dai();

    $active_dai->id = $form_state['values']['active_dai_id'];

    $f = array(
        'active_dai_id',
        'location_id'
    );

    foreach ($f as $field) {
        $active_dai->fields[$field] = $form_state['values'][$field];
    };

    $f = array(
        'dai_identifier'
    );

    foreach ($f as $field) {
        $active_dai->fields[$field] = $form_state['values']['dai_settings'][$field];
    }

    // If it's a new machine, then update the machine records and redirect to edit page.
    if ($form_state['#vars']['function_call'] == 'add') {
        unset($active_dai->fields['active_dai_id']);
        $new_active_dai_id = $active_dai->insert();

        drupal_set_message(t('New DAI saved.  Assign to machines.'));
        $form_state['redirect'] = 'config/location/' . $form_state['#vars']['location_id'] . '/edit/' . $active_dai->fields['location_id'];
    } else {
        $active_dai->merge();
        drupal_set_message(t('DAI settings saved.'));
        $form_state['redirect'] = 'config/location/' . $form_state['#vars']['location_id'] . '/edit/' . $active_dai->fields['location_id'];
        //$form_state['redirect'] = 'config/location/edit/' . $form_state['#vars']['location_id'];
    }
}