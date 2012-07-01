<?php
	/*
	if (isset($GLOBALS['HTTP_RAW_POST_DATA'])) {
	 
		$name = 'test' . '.wav'; 
	     
	   $f = fopen($name, 'w+'); 
	     
	   if (fwrite($f, $GLOBALS['HTTP_RAW_POST_DATA'])) { 
			echo $name;
	   } else {
			echo 0;
		} 
	     
		fclose($f);
	    
	}
	*/
	/*if( empty($_FILES['wavdata']) ){
		echo 0;
		die;
	}
	
	$target_path = "recording/" . basename( $_FILES['wavdata']['name']); 
	
	if(move_uploaded_file($_FILES['wavdata']['tmp_name'], $target_path)) {
		echo basename( $_FILES['wavdata']['name']);
	} else{
		echo 0;
	}
	*/
	
	$fp = fopen("recording.wav", "wb");
	fwrite($fp, $GLOBALS["HTTP_RAW_POST_DATA"]);
	fclose($fp);
?>