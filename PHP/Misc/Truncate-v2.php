<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>
<body>

	<?php
		function truncate($text, $limit = 25, $ending = '...')
		{
			 $text = strip_tags($text);
			
			 if (strlen($text) > $limit) {
				  $text = substr($text, 0, $limit);
				  $text = substr($text, 0, -(strlen(strrchr($text, ' '))));
				  $text = $text . $ending;
			 }
			
			 return $text;
		}
		
		$longText = "this is my really long piece of text, it's like an essay but only for the purposes of this example.";
		
		echo truncate($longText);
	?>

</body>
</html>