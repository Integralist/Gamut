<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>
<body>

	<?php
		function seo($string) 
		{
			 $string = preg_replace("`\[.*\]`U","",$string);
			 $string = preg_replace('`&(amp;)?#?[a-z0-9]+;`i','-',$string);
			 $string = preg_replace( "`&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);`i","\\1", $string );
			 $string = preg_replace( array("`[^a-z0-9]`i","`[-]+`") , "-", $string);
			 $string = htmlentities($string, ENT_COMPAT, 'utf-8');
			 return strtolower(trim($string, '-'));
		}
		
		$myURL = seo("this is my url to be SEO'd");
		
		echo $myURL;
	?>

</body>
</html>