<?php
	$json = array(
		array(
			"Name" => "Mark McDonnell",
			"Age" => 27, 
			"Address" => "Welcome Cottage"
		),
		array(
			"Name" => "Neil Heather",
			"Age" => 36, 
			"Address" => "1727-1729 London Road"
		),
		array(
			"Name" => "Catherine Barrass",
			"Age" => 22, 
			"Address" => "8 Meeson Mead"
		)
	);
	
	header ("content-type: text/javascript; charset: UTF-8");
	echo json_encode($json);
?>