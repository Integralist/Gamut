<?php
	if (extension_loaded('zlib')) {
		// initialize ob_gzhandler function to send and compress data 
		ob_start('ob_gzhandler');
	}
	
	// send the requisite header information and character set 
	header ("content-type: text/css; charset: UTF-8");
	
	// set an thirty days in the future
	// this works out as 60 seconds * by 60 minutes which equals 1 hr
	// then times the 1hr by 24 to get 1 day
	// then times 1 day by however many days you want the item to be cached for. 
	$offset = 60 * 60 * 24 * 30;
	
	// set variable specifying format of expiration header 
	$expire = "expires: " . gmdate ("D, d M Y H:i:s", time() + $offset) . " GMT";
	
	// send cache expiration header to the client broswer 
	header ($expire);
	
	// check cached credentials and reprocess accordingly 
	header ("cache-control: max-age=" . $offset . ", must-revalidate");
	
	// initialize the 'compress' function to remove all comments and whitespace from the CSS files
	ob_start("CSSCompress");
	
	// Function that removes comments, white space and line breaks from a CSS file
	function CSSCompress($subject) {
		$subject = preg_replace('/\/\*([^*]|\*+[^\/*])*\*+\//', '', $subject); // Remove Comments
		$subject = preg_replace('/(?<=[,;:{\'\/\n\r])\s+/i', '', $subject); // Remove White Space
		$subject = preg_replace('/\s+(?=[^\w#!(.-])/i', '', $subject); // Remove odd left over cases of White Space (e.g. the gap inbetween err and the closeing { "b.err {...}")
		$subject = preg_replace('/\n/', '', $subject); // Remove any line breaks so the entire file is in one line
		return $subject;
	}	
	
	// list CSS files to be included
	include('Reset.css');
	include('Layout.css');
 
	if (extension_loaded('zlib')) {
		ob_end_flush();
	}
?>