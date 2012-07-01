<?php
/**
 * This is a test class to show how an 'interface' works
 *
 * @author Mark McDonnell
 */
interface ISpeedInfo {
    function getMaximumSpeed();
}

class Car {
	// Any base class methods
}

class FastCar extends Car implements ISpeedInfo {
	function getMaximumSpeed() {
		return 150;
	}
}

class BadCar extends Car{}
?>
