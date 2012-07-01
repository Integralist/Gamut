<?php
	header('Content-Type: text/javascript; charset=utf8');
	header('Access-Control-Allow-Origin: http://www.domain.com/');
	header('Access-Control-Max-Age: 3628800');
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	
	// Callback function
	$callback = $_GET['callback'];
	
	// JSON data
	$data = '{"name":"mark mcdonnell"}';
	
	echo $callback.'('.$data.');';
?>