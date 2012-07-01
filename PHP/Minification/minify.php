<?php

	if (extension_loaded('zlib')) {
		// initialize ob_gzhandler function to send and compress data 
		ob_start('ob_gzhandler');
	}
	
	include "php-closure.php";
	
	// Grab the file and add the site root path to the file path
	// This should remove any potential errors
	$file = $_SERVER['DOCUMENT_ROOT']."/".$_GET['f'];

	// Send the requisite header information and character set 
	header ("content-type: text/javascript; charset: UTF-8");
	
	// Set expiration length to 6 months.
	// This works out as... 
	// 60 seconds * by 60 minutes which equals 1 hr
	// then times the 1hr by 24 to get 1 day
	// then times 1 day by however many days you want the item to be cached for (this case 30 days = practically 1 month)
	// then times 1 month by how many months to cache by (in this case 6 months)
	$expiration_length = 60 * 60 * 24 * 30 * 6;
	$expiring = gmdate ("D, d M Y H:i:s", time() + $expiration_length);
	
	// Create new instance of Google Closure Class
	$c = new PhpClosure();
	
	// Add the Js file to the list to be sent to Google Compiler
	$c->add($file.".js");
	
	// Complete the rest of the settings
	$c->simpleMode()
	  ->hideDebugInfo()
	  ->cacheExpire($expiring)
	  ->cacheDir("../Scripts/Cache/")
	  ->write();
	
	if (extension_loaded('zlib')) {
		ob_end_flush();
	}
	
?>