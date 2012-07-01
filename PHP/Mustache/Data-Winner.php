<?php
	class Winner extends Mustache {
	    public $name = "Mark";
	    public $value = 10000;
	
	    public function taxed_value() {
	        return $this->value - ($this->value * 0.4);
	    }
	
	    public $in_ca = true;
	}
?>