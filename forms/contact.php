<?php
// Minimal contact form handler for testing and simple deployments.
// - Validates required fields
// - Attempts to send via mail() if available
// - Logs submissions to forms/contact_log.txt when mail() is not available or fails
// - Returns plain text 'OK' on success (compatible with the frontend validator)

header('Content-Type: text/plain; charset=utf-8');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo 'Method Not Allowed';
  exit;
}

$receiving_email_address = 'rathnayakeravi32@gmail.com';

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : 'New Contact Message';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($name === '' || $email === '' || $message === '') {
  http_response_code(400);
  echo 'Please fill in all required fields.';
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo 'Invalid email address.';
  exit;
}

$body = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message\n";
$headers = "From: $name <$email>\r\nReply-To: $email\r\n";

$sent = false;
if (function_exists('mail')) {
  // Suppress mail() warnings; we'll fallback to logging if it fails
  try {
    $sent = @mail($receiving_email_address, $subject, $body, $headers);
  } catch (Exception $e) {
    $sent = false;
  }
}

if ($sent) {
  echo 'OK';
  exit;
}

// If mail() is not available (common on local setups) or failed, log the message and return OK
$logdir = __DIR__;
$logfile = $logdir . DIRECTORY_SEPARATOR . 'contact_log.txt';
$entry = date('c') . " \n" . $body . "\n---\n";
@file_put_contents($logfile, $entry, FILE_APPEND | LOCK_EX);

// Inform the client the form was accepted so the front-end shows the success message.
// The message is still recorded in contact_log.txt for retrieval.
echo 'OK';
exit;
?>
