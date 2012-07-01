<?php
	class Loser extends Mustache {
	    public $name = "John";
	    public $type = "fool";
	    public $under_18 = true;
	
	    public function generate_random_word() {
	        $funny_words = array("Fiduciary", "Diadochokinetic", "Flink", "Jiggle", "Foibles");
	        return $funny_words[array_rand($funny_words)];
	    }
	}
?>