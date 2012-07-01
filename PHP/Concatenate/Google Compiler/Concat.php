<?php
	if (extension_loaded('zlib')) {
		// initialize ob_gzhandler function to send and compress data 
		ob_start('ob_gzhandler');
	}
	
	// Function that removes comments, white space and line breaks from a CSS file
	function CSSCompress($subject) {
		$subject = preg_replace('/\/\*([^*]|\*+[^\/*])*\*+\//', '', $subject); // Remove Comments
		$subject = preg_replace('/(?<=[,;:{\'\/\n\r])\s+/i', '', $subject); // Remove White Space
		$subject = preg_replace('/\s+(?=[^\w#!(.-])/i', '', $subject); // Remove odd left over cases of White Space (e.g. the gap inbetween err and the closeing { "b.err {...}")
		$subject = preg_replace('/\n/', '', $subject); // Remove any line breaks so the entire file is in one line
		return $subject;
	}
	
	// Do not compress unless it's a CSS file we're dealing with
	$compress = false;
	
	// Do not minify unless it's a JavaScript file we're dealing with
	$minify = false;
	
	// Store reference to common data
	$filelist = $_GET['files'];
	$currentdate = gmdate('D, d M Y H:i:s \G\M\T', time());
	
	// Check for a valid file type
	if (strtolower($_GET['filetype']) == 'js') {
		$content_type = "javascript";
		$extention = ".js";
		
		// Request Google Closure PHP Wrapper
		include "php-closure.php";
		$minify = true;
	} elseif (strtolower($_GET['filetype']) == 'css') {
		$content_type = "css";
		$extention = ".css";
		$compress = true;
	} else {
		die('An unknown file type was provided');
	}
	
	// Send the requisite header information and character set 
	header ("content-type: text/$content_type; charset: UTF-8");
	
	// Initialize the 'compress' function to remove all comments and whitespace from the CSS files
	// Also set the HTTP headers for the CSS files.
	if ($compress) {
		ob_start("CSSCompress");
		
		// Set expiration length to 6 months.
		// This works out as... 
		// 60 seconds * by 60 minutes which equals 1 hr
		// then times the 1hr by 24 to get 1 day
		// then times 1 day by however many days you want the item to be cached for (this case 30 days = practically 1 month)
		// then times 1 month by how many months to cache by (in this case 6 months)
		$expiration_length = 60 * 60 * 24 * 30 * 6;
		$expiring = gmdate ("D, d M Y H:i:s", time() + $expiration_length);
		
		header('Last-Modified: ' . date ("F d Y H:i:s.", filemtime('Concat.php'))); 
		header('Expires: ' . $expiring);
		header("Cache-Control: max-age=" . $expiring . ", must-revalidate");
		
		// Grab each file and check they exist
		$files = explode(",", $filelist);
		
		// List the files to be included
		foreach ($files as $value) {
			if (file_exists($value.$extention)) {
				include $value.$extention;
			}
		}
	}
	
	// Run processes JavaScript files via Google Compiler API
	if ($minify) {
		// Create new instance of Google Closure Class
		$c = new PhpClosure();
		
		// Grab each file and check they exist
		$files = explode(",", $filelist);
		
		// List the files to be included
		foreach ($files as $value) {
			if (file_exists($value.$extention)) {
				// Add the Js file to the list to be sent to Google Compiler
				$c->add($value.$extention);
			}
		}
		
		// Complete the rest of the settings
		$c->simpleMode()
		  ->cacheDir("/PHP/Concatenate/tmp/js-cache/")
		  ->write();
	}
	
	if (extension_loaded('zlib')) {
		ob_end_flush();
	}
?>