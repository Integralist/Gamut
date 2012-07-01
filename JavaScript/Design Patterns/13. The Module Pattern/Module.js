/**
 * The following code is an example of the Module Pattern.
 */

// Creating the class
var Person = function(p_options) 
{
	// Set default private member 'options' (used for construction) if none provided
	var defaultOptions = {
    	name: null,
    	age: 0
	};
  
	// Make sure the 'p_options' object passed in as a parameter actually exists
	if (p_options !== null && p_options !== undefined && p_options !== 'undefined') {
		// Loop through each option in 'defaultOptions' and store the key in "opt" (i.e. "name", "age")
		for (var opt in defaultOptions) {
			// check that the current member within the passed in 'p_options' object exists within 'defaultOptions'
			if (p_options[opt] !== null && p_options[opt] !== undefined && p_options[opt] !== 'undefined') {
				// Assign the value from the current 'p_options' member to the current member within 'defaultOptions'
				// Otherwise keep the default value of 'null' or '0'
				defaultOptions[opt] = p_options[opt];
			}
		}
	}

	// Private member 'name'
	var m_name = defaultOptions.name;
	
	// Private member 'age'
	var m_age = defaultOptions.age;

	// Private method
	var calcAgeInDogYears = function() {
		return m_age / 7;
	};

	// Begin public section by returning an Object with methods 
	// which have access to the variables in this function and which
	// are accessible outside the function (thus are PUBLIC methods)
	return {
		// Name accessor
		getName: function() {
			return m_name;
		},
		
		// Name mutator
		setName: function(name) {
			m_name = name;
		},
		
		// Age accessor
		getAge: function() {
			return m_age;
		},
		
		// Age mutator
		setAge: function(age) {
			m_age = age;
		},
		
		// Get person's age in dog years
		getAgeInDogYears: function() {
			return calcAgeInDogYears();
		}
	};
};


// Testing 'options' pattern and constructor regular
var dave = new Person({ name: "David Smith", age: 24 });

// Testing 1 parameter version (should use default for age)
var john = new Person({ name: "John Doe" });

// Should use defaults for name and age
var fred = new Person();

// Testing accessors
// Expected: normal
alert("Name: " + dave.getName() + "\nAge: " + dave.getAge());

// Expected normal name + 0 age
alert("Name: " + john.getName() + "\nAge: " + john.getAge());

// Expected: null name and 0 age
alert("Name: " + fred.getName() + "\nAge: " + fred.getAge());

// Testing mutators
fred.setName("Fred Flinstone");
fred.setAge(45);

// Expected: name = yabba dabba do + age = 45
alert("Name: " + fred.getName() + "\nAge: " + fred.getAge());

// Testing public calls to private methods
alert("Name: " + fred.getName() + "\nAge In Dog Years: " + fred.getAgeInDogYears());