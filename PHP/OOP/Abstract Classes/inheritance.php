<?php
/**
 * An 'abstract' class is like an interface
 * Except it defines both properties and methods (and the method content).
 * An 'abstract' class can't be instantiated
 *
 * @author Mark McDonnell
 */
abstract class Person
{
    private $givenName;
    private $familyName;
    
    public function setGivenName($gn)
    {
        $this->givenName = $gn;
    }
    
    public function getGivenName()
    {
        return $this->givenName;
    }
    
    public function setFamilyName($fn)
    {
        $this->familyName = $fn;
    }
    
    public function getFamilyName()
    {
        return $this->familyName;
    }
    
    abstract public function introduceSelf();
}

class Employee extends Person
{
    private $role;
    
    public function setRole($r)
    {
        $this->role = $r;
    }
    
    public function getRole()
    {
        return $this->role;
    }
    
    public function introduceSelf()
    {
    	echo('<b>Role</b>: ' . $this->getRole() . '<br><b>Given Name</b>: ' . $this->getGivenName() . '<br><b>Family Name</b>: ' . $this->getFamilyName() . '<hr>');
    }
}

class Manager extends Employee
{
    public function introduceSelf()
    {
    	echo('Hi, my name is ' . $this->getGivenName() . ', and I\'m the ' . $this->getRole() . '<hr>');
    }
}

// create new 'employee' instance and set some of the values;
$employee = new Employee();
$employee->setGivenName("Mark");
$employee->setFamilyName("McDonnell");
$employee->setRole("Developer");

// call function to display information above the employee instance we have created
$employee->introduceSelf();

// create new 'manager' instance and set some of the values;
$manager = new Manager();
$manager->setGivenName("Neil");
$manager->setFamilyName("Heather");
$manager->setRole("Manager");

// call function to display information above the employee instance we have created
$manager->introduceSelf();
?>