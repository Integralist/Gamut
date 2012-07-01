<?php
	session_start();
	header("Content-Type: text/event-stream\n\n");
	echo "data: s\n";
	echo "data: test\n";
	echo "data: last\n";
	echo "data: This is your session_id - ".session_id();
?>