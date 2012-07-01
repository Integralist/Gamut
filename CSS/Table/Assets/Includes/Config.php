<?php
	if ($_SERVER['HTTP_HOST'] === '192.168.0.39:8888') {
		define('ROOT', '/intranet.nhs.uk/');
	} else {
		define('ROOT', '/');
	}
?>