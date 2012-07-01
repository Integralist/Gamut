<?php
	function spamcheck($field)
	{
		// filter_var() sanitizes the e-mail address using FILTER_SANITIZE_EMAIL
		$checked = filter_var($_POST[$field], FILTER_SANITIZE_EMAIL);
	
		// filter_var() validates the e-mail address using FILTER_VALIDATE_EMAIL
		if (filter_var($checked, FILTER_VALIDATE_EMAIL)) {
			return TRUE;
		} else {
			return FALSE;
		}
	}
	
	function checkName($requiredField)
	{
		// If the name field was filled out, sanitize the input and store it
		if (!empty($_POST[$requiredField])) {
			$fullname = htmlentities($_POST[$requiredField], ENT_QUOTES);
			return TRUE;
		} else {
			return FALSE;
		}
	}
	
	/*
		isset($_POST['submit'])
	
		ONLY WORKS WHEN THE SUBMIT BUTTON HAS A NAME VALUE CALLED 'submit'.
		AND DOESN'T WORK WHEN SUBMIT BUTTON IS OF TYPE 'image'.
	*/
	
	if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit'])) {
		// If the name has checked out OK then test the email account
		if (checkName('fullname')) {
			// If the email OR phone number has checked out OK then start setting up the HTML email
			if (spamcheck('email') || preg_match("/^[0-9\s+()]+/i", $_POST['phone'])) {
				// Prepare email
				$fullname = $_POST['fullname'];
				$email = $_POST['email'];
				$subject = $_POST['subject'];
				$ref = $_POST['ref'];
				$message = $_POST['message'];
				$spambot = $_POST['tester']; // This field should be empty. If it's not then it's likely a spambot has filled it in accidentally
				
				if ($subject === 'na') {
					$subject = 'No subject was selected';
				}
				
				if (!empty($spambot)) {
					header('Location: contact.php?status=fail&reason=spambot');
				} else {				
					// prepare HTML
					$html = "
					<html>
					<head>
						<title></title>
					</head>
					<body>
						<p><strong>Name:</strong> $fullname</p>
						<p><strong>Email:</strong> $email</p>
						<p><strong>Subject:</strong> $subject</p>
						<p><strong>Reference:</strong> $ref</p>
						<p><strong>Message:</strong> $message</p>
					</body>
					</html>
					";
					
					// To send HTML mail, the Content-type header must be set
					$headers  = "MIME-Version: 1.0" . "\r\n";
					$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";
					
					// Set 'from' email in the header
					$headers .= "From: $email";
					
					// send email
					mail("email@domain.com", ": website contact", $html, $headers);
					
					// display a 'success' message
					header('Location: contact.php?status=success');
				}
			} else {
				// The name wasn't entered so redirect the user
				header('Location: contact.php?status=fail&reason=email');
			}
		} else {
			// The name wasn't entered so redirect the user
			header('Location: contact.php?status=fail&reason=fullname');
		}
	} else {
		// No form was submitted, spambot must have come directly to this script, so redirect them!
		header('Location: contact.php?status=fail&reason=noform');
	}
?>