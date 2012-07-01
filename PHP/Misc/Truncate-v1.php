<?php
	function truncate ($string, $length) {
		$output = "";		 
	 	
	 	settype($string, 'string');
	 	settype($length, 'integer');
	 	
	 	for($a = 0; $a < $length AND $a < strlen($string); $a++){
			$output .= $string[$a];
	 	}
	 	
	 	return(trim($output) . '...');
}
?>