<?php

if ( isset ( $GLOBALS["HTTP_RAW_POST_DATA"] )) {
	
	// get bytearray
	$im = $GLOBALS["HTTP_RAW_POST_DATA"];
	
	// add headers for download dialog-box
	header('Content-Type: image/jpeg');
	header("Content-Disposition: attachment; filename=".$_GET['name']);
	echo $im;
	
}  else echo 'An error occured.';

?>