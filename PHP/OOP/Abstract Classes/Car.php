<?php
/**
 * This is a test class to show how 'abstraction' works
 *
 * @author Mark McDonnell
 */
abstract class Car {
    abstract function getMaximumSpeed();
}

class FastCar extends Car {
    function getMaximumSpeed() {
        return 350;
    }
}

class SlowCar extends Car {
    function getMaximumSpeed() {
        return 20;
    }
}

class Street {
    protected $speedLimit;
    protected $cars;

    /*
     * When this class is instantiated the below constructor is called
     * which creates a 'cars' Array and also sets the speed limit property
     * (or provides a default value if no arguments are found)
     */
    public function __construct($speedLimit = 200) {
        $this->cars = array(); //Initialize the variable
        $this->speedLimit = $speedLimit;
    }

    protected function isStreetLegal($car) {
        /*
         * The argument provided is a new instance of the class 'FastCar'
         * This gives us access to its method 'getMaximumSpeed'
         * which then returns the Fast Car's top speed.
         *
         * We check if the top speed is faster than the speed limit
         * and if it is then the car isn't allowed on the road.
         */
        if($car->getMaximumSpeed() < $this->speedLimit) {
            return true;
        } else {
            return false;
        }
    }

    /*
     * The Street class includes an addCar() method, 
     * which is designed to take an instance of a derived Car. 
     * 
     * Now you can use the Street class and pass an instance 
     * of the FastCar class to the addCar() method.
     *
     * The addCar() method makes a call to the isStreetLegal() method,
     * which will then call the getMaximumSpeed() method
     * defined in the FastCar class.
     */
    public function addCar($car) {
        if($this->isStreetLegal($car)) {
            echo '<p><b>The Car was allowed on the road.</b></p>';
            $this->cars[] = $car;
        } else {
            echo '<p><b>The Car is too fast and was not allowed on the road.</b></p>';
        }
    }
}
?>
