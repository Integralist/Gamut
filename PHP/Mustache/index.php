<?php 
	include('Mustache.php');
	include('Data-Winner.php');
	include('Data-Loser.php');
	include('Template-Winner.php');
	include('Template-Loser.php');
	include('Template-HTML.php');
?>
<!doctype html>
<html dir="ltr" lang="en">
<head>
	<title>Mustache.php</title>
   <meta charset="utf-8">
</head>
<body>
		<?php
			echo $winner->render($template_winner);
		?>
		<hr>
		<?php
			echo $loser->render($template_loser);
		?>
		<hr>
		<?php
			echo $test->render($template_test); // not sure if using a HTML file is less *efficient*, but definitely feels like a *cleaner* way.
		?>
</body>
</html>