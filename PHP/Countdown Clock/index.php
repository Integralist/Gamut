<?php
	// Calculate days remaining from event date
	function days($day, $month, $year) {
		// Hour, Minute, Second, Month, Day, Year
		$target = mktime(0, 0, 0, $month, $day, $year);
		$today = time();
		$difference = ($target - $today);
		$days = (int)($difference/86400); // 86400 being the number of seconds in a day
		
		// Make sure that we show the correct number of zeros when the number gets smaller
		// + if the date passes then we don't show a minus value
		if ($days < 0) {
			$days = '000';
		} else if ($days < 10) {
			$days = '00'.$days;
		} else if ($days < 100) {
			$days = '0'.$days;
		} 
		
		// Needs to be returned as a String so we can split it into individual characters
		return (String)$days;
	}
	
	// Split returned days into Array of numbers
	$olympic = preg_split('//', days('27', '7', '2011'), -1, PREG_SPLIT_NO_EMPTY);
	$paralympic = preg_split('//', days('29', '8', '2011'), -1, PREG_SPLIT_NO_EMPTY);
?>
<!doctype html>
<html>
	<head>
		<title>Countdown Clock</title>
		<meta charset="utf-8">
		<link rel="stylesheet" href="countdown.css" />
	</head>
	<body>
		<div id="countdown">
			<p id="box-top">Southend-on-Sea is counting down to LONDON 2012</p>
			<p id="olympic">
				<span>
					<?php
						foreach ($olympic as $item) {
    						echo "<b class='t$item'>$item</b>";
						}
					?>
				</span> 
				<span class="fr">Days until <strong>Olympic Games</strong> 27th July - 12th August 2012</span></p>
			<p id="paralympic">
				<span>
					<?php
						foreach ($paralympic as $item) {
    						echo "<b class='t$item'>$item</b>";
						}
					?>
				</span> 
				<span class="fr">Days until <strong>Paralympic Games</strong> 29th August - 9th September 2012</span></p>
			<span id="inbetween"></span>
		</div>
	</body>
</html>