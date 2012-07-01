<?php
	sleep(5);
?>
<!doctype html>
<html dir="ltr" lang="en">
	<head>
		<title></title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" rel="stylesheet" type="text/css" />
		<link href="custom.css" rel="stylesheet" type="text/css">
		<script src="http://code.jquery.com/jquery-1.7.min.js"></script>
		<script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"></script>
	</head>
	<body>
		<div data-role="page">
			<div data-role="header">
				<h1>Test Title</h1>
				<a href="index.html" data-direction="reverse" class="jqm-home ui-btn ui-btn-icon-notext ui-btn-corner-all" title="Home"><span class="ui-btn-inner ui-btn-corner-all" aria-hidden="true"><span class="ui-btn-text">Home</span><span class="ui-icon ui-icon-home ui-icon-shadow"></span></span></a>
			</div>
			<div data-role="content">
				This page uses <code>PHP</code> to delay loading the page (<code>sleep(5);</code>)
			</div>
			<div data-role="footer">
				<h4>Test Footer</h4>
			</div>
		</div>
	</body>
</html>