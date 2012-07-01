<?php 
	include('Mustache.php');
	include('Data.php');
	include('Template.php');
?>
<!doctype html>
<html dir="ltr" lang="en">
<head>
	<title>Mustache.php</title>
   <meta charset="utf-8">
   <link rel="stylesheet" href="Styles.css">
</head>
<body>
	<div id="content">
		<?php
			echo $winner->render($template_winner);
		?>
	</div>
</body>
</html>