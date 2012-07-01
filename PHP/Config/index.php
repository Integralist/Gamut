<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>
</head>

<body>

<?php
	echo realpath(dirname(__FILE__));
	
	ini_set("display_errors", "1");
	error_reporting(E_ALL); 
	
	//Parse and store the ini file, this will return an associative array
	$config_info = parse_ini_file('config.ini', true);
	
	//Debug
	echo '<pre>';
	print_r($config_info);
	echo '</pre>';
	
	//Example usage
	echo '<p>You are currently running version <b style="color:red;">' . $config_info['version_info']['version_number'] . '</b></p>';
?>

</body>
</html>