<?php
	$template_winner = '
		<p>Hello {{name}}</p>
		<p>You have just won £{{value}}!</p>
		
		<!-- The following is a Boolean (true/false) condition, set within the Template-Winner.php -->
		{{#in_ca}}
			<p>Well, £{{taxed_value}}, after taxes.<p>
		{{/in_ca}}
	';
	
	$winner = new Winner;
?>