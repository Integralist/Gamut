<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>NETTUTS: jQuery/PHP Style-Switcher</title>
		<?php 
			if(!empty($_COOKIE['style'])) $style = $_COOKIE['style'];
			else $style = 'day';
		?>
		<link id="stylesheet" type="text/css" href="css/<?php echo $style ?>.css" rel="stylesheet" />
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/styleswitcher.jquery.js"></script>
	</head>
	<body>
		<div id="container">
			<h1>Style-Switcher Example</h1>
			<ul id="nav">
				<li><a href="#">Home</a></li>
				<li><a href="#">About</a></li>
				<li><a href="#">Services</a></li>
				<li><a href="#">Products</a></li>
				<li><a href="#">Links</a></li>
				<li><a href="#">Contact</a></li>
			</ul>
			<div id="banner"></div>
			<div id="content">
				<h2>NETTUTS Tutorial Example</h2>
				<p>This is an example of an obtrusive and entirely degradable jQuery style switcher. You can try it out by choosing from the choices (at very top of page).</p>
			</div>
			<div id="foot">
				<p><a href="#link-to-tut">Tutorial</a> by <a href="http://nettuts.com/author/james/">James Padolsey</a></p>
			</div>
			<div id="style-switcher">
				<h4>Choose your style:</h4>
				<ul>
					<li id="day"><a href="style-switcher.php?style=day">Day</a></li>
					<li id="night"><a href="style-switcher.php?style=night">Night</a></li>
				</ul>
			</div>
		</div>
		<script type="text/javascript">
			$('#style-switcher a').styleSwitcher();
		</script>
	</body>
</html>
