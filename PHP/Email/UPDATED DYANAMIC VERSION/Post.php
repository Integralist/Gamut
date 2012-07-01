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

	$returnPage = 'contact'; // initially redirect back to the contact page (as this script looks to have been accessed directly rather than posted to)
	
	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		// Set the page to redirect to in case of error/success (as this Post.php script processes multiple pages)
		$returnPage = $_POST['returnpage'];

		// If the name has checked out OK then test the email account
		if (checkName('field-fullname')) {
			// If the email has checked out OK then start setting up the HTML email
			if (spamcheck('field-email')) {
				// Prepare email
				$fullname = $_POST['field-fullname'];
				$email = $_POST['field-email'];
				$telephone = (empty($_POST['field-tel'])) ? '--' : $_POST['field-tel'];
				$extraInfo = ($_POST['furtherinfo'] === 'on') ? true : false;
				$requiresPost = ($_POST['furtherinfo'] === 'on') ? '<p><strong><u>This person requires more information by post</u></strong></p>' : '';
				$address = '--';
				$postcode = '--';
				$subject = $_POST['pagename'];
				$message = $_POST['message'];
				$referrer = explode("?", '/healthcare/'.basename($_SERVER['HTTP_REFERER'], ".php"));

				if (count($referrer) == 1) {
					$referrer[0] = $referrer[0].'.php'; // if no querystring set then basename doesn't display .php at the end so we need to add it
				}			

				/*
				Regex for matching the relevant part of the URL path
				(We have a set naming convention for file names)
				----------------------------------------------------
				
				((?<![^/-])[a-z0-9-]+)(?=\.)
				
				Options: case insensitive; ^ and $ match at line breaks
				
				Match the regular expression below and capture its match into backreference number 1 «((?<![^/-])[a-z0-9-]+)»
					Assert that it is impossible to match the regex below with the match ending at this position (negative lookbehind) «(?<![^/-])»
						Match a single character NOT present in the list below «[^/-]»
							The character "/" «/»
							The character "-" «-»
					Match a single character present in the list below «[a-z0-9-]+»
						Between one and unlimited times, as many times as possible, giving back as needed (greedy) «+»
						A character in the range between "a" and "z" «a-z»
						A character in the range between "0" and "9" «0-9»
						The character "-" «-»
				Assert that the regex below can be matched, starting at this position (positive lookahead) «(?=\.)»
					Match the character "." literally «\.»
				*/
				if (preg_match('%((?<![^/-])[a-z0-9-]+)(?=\.)%im', $subject, $regs)) {
					$result = $regs[1];
				} else {
					$result = $_SERVER['HTTP_REFERER'];
				}				

				if ($extraInfo) {
					$address = (empty($_POST['field-address'])) ? '--' : $_POST['field-address'];
					$postcode = (empty($_POST['field-postcode'])) ? '--' : $_POST['field-postcode'];
				}
				
				$spambot = $_POST['tester']; // This field should be empty. If it's not then it's likely a spambot has filled it in accidentally
				
				if (!empty($spambot)) {
					header("Location: $returnPage.php?status=fail&reason=spambot");
				} else {				
					// prepare HTML
					$html = "
					<html>
					<head>
						<title></title>
					</head>
					<body>
						<p><strong>Web Page:</strong> $referrer[0]</p>
						<p><strong>Name:</strong> $fullname</p>
						<p><strong>Email:</strong> $email</p>
						<p><strong>Telephone:</strong> $telephone</p>
						<p><strong>Message:</strong> $message</p>
						$requiresPost
						<p><strong>Address:</strong> $address</p>
						<p><strong>Postcode:</strong> $postcode</p>
					</body>
					</html>
					";
					
					// To send HTML mail, the Content-type header must be set
					$headers  = "MIME-Version: 1.0" . "\r\n";
					$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";
					
					// Set 'from' email in the header
					$headers .= "From: $email";
					
					// send email
					mail("email@domain.com", "RBF Healthcare Enquiry: $result", $html, $headers);
					
					// display a 'success' message
					header("Location: $returnPage.php?status=success");
				}
			} else {
				// The name wasn't entered so redirect the user
				header("Location: $returnPage.php?status=fail&reason=email");
			}
		} else {
			// The name wasn't entered so redirect the user
			header("Location: $returnPage.php?status=fail&reason=fullname");
		}
	} else {
		// No form was submitted, spambot must have come directly to this script, so redirect them!
		header("Location: $returnPage.php?status=fail&reason=noform");
	}
?>