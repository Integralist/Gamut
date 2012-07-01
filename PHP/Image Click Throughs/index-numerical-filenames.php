<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Image Click Through</title>
<style>
	body {
		margin:0;
		padding:0;
	}
	
	.align {
		display:block;
		margin:auto;
		width:1200px;
	}
</style>
</head>
<body>

	<?php
    	$img = $_GET['id'];
		$limit = 5;
		$extension = 'jpg';
		
		// Check if there is any querystring value set
		// OR
		// If the user has changed the value to something over the limit
		if (empty($img) or ($img > $limit)) {
			$img = 1;
		}
		
		// Prepare next image to be loaded
		$next = ($img+1);
		
		// Make sure 'next' doesn't go over its limit
		($next > $limit) ? $next=1 : $next;
	?>

	<a href="index-numerical-filenames.php?id=<?php echo $next; ?>">
    	<img src="<?php echo $img . '.' . $extension; ?>" width="1200" class="align">
    </a>

</body>
</html>
