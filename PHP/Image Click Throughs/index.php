<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Array Image Click Through</title>
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
		/**
		 * This version is useful if you have no control over the filenames.
		 * e.g. normally you would name the files numerically (1.jpg, 2.jpg, 3.jpg...)
		 */
	
		$files = array('a','b','c','d','e');
		$extension = 'jpg';
    	$img = $_GET['id'];
		$limit = count($files);
		
		// Check if there is any querystring value set
		if (empty($img)) {
			$img = 1;
		}
		
		// Prepare next image to be loaded
		$next = ($img+1);
		
		// Make sure 'next' doesn't go over its limit
		($next > $limit) ? $next=1 : $next;
	?>

	<a href="index.php?id=<?php echo $next; ?>">
    	<img src="<?php echo $files[($img-1)] . '.' . $extension; ?>" width="1200" class="align">
    </a>

</body>
</html>
