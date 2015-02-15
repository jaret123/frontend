<?php

/**
 * Log Error Message
 *
 * Severity
 *
 *  WATCHDOG_EMERGENCY: Emergency, system is unusable.
 *  WATCHDOG_ALERT: Alert, action must be taken immediately.
 *  WATCHDOG_CRITICAL: Critical conditions.
 *  WATCHDOG_ERROR: Error conditions.
 *  WATCHDOG_WARNING: Warning conditions.
 *  WATCHDOG_NOTICE: (default) Normal but significant conditions.
 *  WATCHDOG_INFO: Informational messages.
 *  WATCHDOG_DEBUG: Debug-level messages.
 *
 */
function ws_error() {

  // See if anything was posted

  if ( !isset($_POST['errorCode']) ) {
    print '<pre>';
    print 'This method is for posting javascript errors to the Watchdog Log\n\n';
    print '</pre>';
    return;
  }

  try {
    watchdog($_POST['module'], $_POST['errorCode'] . ' | ' . $_POST['errorMessage'], array(), $_POST['severity'], $_POST['url']);
    print json_encode(array('success' => 'Your error has been logged'));

  } catch ( Exception $e ) {
    print json_encode(array('alert' => 'There was an error logging your message ' . $e->getMessage()));
  }
}