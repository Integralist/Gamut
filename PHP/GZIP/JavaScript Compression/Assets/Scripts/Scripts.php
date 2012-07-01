<?php
	if (extension_loaded('zlib')) {
		// initialize ob_gzhandler function to send and compress data 
		ob_start('ob_gzhandler');
	}
	
	// send the requisite header information and character set 
	header ("content-type: text/javascript; charset: UTF-8");
	
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
	
	// list CSS files to be included
	include('jquery-1.3.2.min.js');
 
	if (extension_loaded('zlib')) {
		ob_end_flush();
	}
?>