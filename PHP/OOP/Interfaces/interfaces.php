<?php
class Person
{
    /*
	instead of using an Array (see below) you can just use private variables
	
		e.g.
			
			private $prefix;
			
			public function setPrefix($prefix)
			{
				$this->prefix = $prefix;
			}
			
			public function getPrefix()
			{
				return $this->prefix;
			}
	*/
	
	private $personName = array();
    
    public function setPrefix($prefix)
    {
        $this->personName['prefix'] = $prefix;
    }
    
    public function getPrefix()
    {
        return $this->personName['prefix'];
    }
    
    public function setGivenName($gn)
    {
        $this->personName['givenName'] = $gn;
    }
    
    public function getGivenName()
    {
        return $this->personName['givenName'];
    }
}

interface PersonProvider
{
    public function getPerson($givenName, $familyName);
}

class DBPersonProvider implements PersonProvider 
{
    public function getPerson($givenName, $familyName)
    {
        /* pretend to go to the database, get the person... */
        $person = new Person();
        $person->setPrefix("Mr. ");
        $person->setGivenName("John");
        return $person;
    }
}

class PersonProviderFactory
{
    public static function createProvider($type)
    {
        if ($type == 'database')
        {
        	return new DBPersonProvider();
        } else {
            return new NullProvider();
        }
    }
}

$config = 'database';

// use class 'PersonProviderFactory' to determine what type of connection is needed
$provider = PersonProviderFactory::createProvider($config);

// create 'instance' of the relevant Class object (remember the Class object depends on the '$config' variable)
$person = $provider->getPerson("John", "Doe");

echo($person->getPrefix());
echo($person->getGivenName());
?>