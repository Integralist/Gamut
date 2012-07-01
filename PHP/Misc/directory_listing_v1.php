<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<style type="text/css">
	body
	{ font-family:Arial, Helvetica, sans-serif; font-size:small; margin:20px; padding:20px; }
	
	h1
	{ border-bottom:1px solid #333; display:block; margin:0 0 1em; }
	
	h1, a
	{ color:#C00; }
	
	a:hover,
	a:focus
	{ color:#333; text-decoration:none; }
	
	h1 span
	{ color:#333; }
</style>
</head>
<body>

	<ul>
		<!--<li><a href="#">some link</a> { right-click and choose 'save' }</li>-->
      <?php 	
			// Define the full path to your folder from root 
			 $path = "C:/XAMPP/xampp/htdocs/xampp/_sites"; 
		
			 // Open the folder 
			 $dir_handle = @opendir($path) or die("Unable to open $path"); 
		
			 // Loop through the files 
			 while ($file = readdir($dir_handle)) { 
		
			 if($file == "." || $file == ".." || $file == "index.php" ) 
		
				  continue; 
				  echo "<li><a href='$file'>$file</a></li>"; 
		
			 } 
		
			 // Close 
			 closedir($dir_handle); 
		?>
	</ul>

</body>
</html>
