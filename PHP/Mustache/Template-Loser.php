<?php
	$template_loser = '
		<p>Hello {{name}}</p>
		<p>Sorry, you\'re a {{type}}!</p>
		
		<!-- The following is a Boolean (true/false) condition, set within the Template-Loser.php -->
		{{#under_18}}
			<p>Well, as you\'re under the legal age to win any money, here is a random word for you... <strong><u>{{generate_random_word}}</u></strong>.<p>
			<p>Hope it made you smile.</p>
		{{/under_18}}
	';
	
	$loser = new Loser;
?>