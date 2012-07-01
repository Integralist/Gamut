<?php require 'Assets/Includes/TextOnly.php'; ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
   <head>
	  <title></title>
      <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
      <meta http-equiv="content-language" content="en" />
      <meta name="description" content="" />
      <meta name="keywords" content="" />
      <?php
         if (isset($_SESSION['textonly']) && $_SESSION['textonly'] === true) {
            $toggleStyle = true;
				// do nothing
         } else {
      ?>
			<link rel="stylesheet" media="screen" href="Assets/Styles/Layout.php" />
		<?php
         }
      ?>
   </head>
   <body>
		<?php 
			if (isset($toggleStyle)) {
		?>
				<link rel="stylesheet" media="screen" href="Assets/Styles/TextOnly.php" />
				<p><a href="?css=reset">Turn OFF 'text-only' mode</a></p>
		<?php
			}
		?>
		
		<ul id="links">
			<li><a href="?css=none">Text only</a></li>
			<li><a href="index.php">Page 1</a></li>				
		</ul>
   </body>
</html>