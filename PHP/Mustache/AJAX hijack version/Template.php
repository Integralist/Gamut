<?php
	$template_winner = file_get_contents('Template.html') or die('Sorry, there was a problem retrieving the page.');
	$winner = new Winner;
?>