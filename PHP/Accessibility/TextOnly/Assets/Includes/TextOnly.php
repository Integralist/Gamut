<?php
   // start a session immediately
   session_start();

   // see if the user has requested the text size be changed
	if (isset($_GET['css'])) {
		if ($_GET['css'] === "none") {
			$_SESSION['textonly'] = true;
		} else if ($_GET['css'] === "reset") {
			$_SESSION['textonly'] = false;
		}
	}
?>
