<?php
	if ( strpos($_SERVER["HTTP_USER_AGENT"], "MSIE") ) {
		header("ETag: MSIE");
	} 
	else {
		header("ETag: notMSIE");
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>ETag Configuration</title>
</head>
<body>

	<h1>ETag Configuration</h1>
	<pre>
		&lt;?php
			if ( strpos($_SERVER["HTTP_USER_AGENT"], "MSIE") ) {
				header("ETag: MSIE");
			} 
			else {
				header("ETag: notMSIE");
			}
		?&gt;
	</pre>

</body>
</html>