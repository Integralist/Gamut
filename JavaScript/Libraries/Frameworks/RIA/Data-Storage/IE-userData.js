// Add a UserData namespace to hold Microsoft userData-specific methods
$.prototype.Storage.IEUserData = {
	
	// Reference an element to store data within 
	storageElement:null,
	
	// Data can be stored in different data stores by using different names. We want all our data to be in one place, so we pick one name and stick with it 
	dataStore: "data-store",
	
	// Before we can use any data, we need to initialize the DOM element 
	initialize: function() 
	{
		// Data is stored within DOM elements, so let's create one to use 
		this.storageElement = $.Elements.create("span");
		
		// The behavior attribute is what allows the DOM element to be able to load and save data to a data store 
		this.storageElement.addBehavior('#default#userdata');
		
		// We don't want this element to be seen on the page, so hide it 
		this.storageElement.style.display = 'none';
		
		// Add the new DOM element to the end of the page 
		document.body.appendChild(this.storageElement);
		
		// Load any previously stored data from the data store, populating the element's attributes with the data 
		this.storageElement.load(this.dataStore);
	},
	
	// The set method saves a data value with a given name to the data store 
	set: function(input) 
	{
		// Expect an object literal as an input, containing name and value 
		var name = input.name || ""; 
		var value = input.value || "";
		
		// Save the data name and value to the DOM element 
		this.storageElement.setAttribute(name, value);
		
		// Commit the current data from the DOM element to the data store 
		this.storageElement.save(this.dataStore);
	},
	
	// The get method returns a previously stored value from the data store from a given property name 
	get: function(name) 
	{
		// Return the attribute value of the given name, or an empty string if it does not exist 
		return this.storageElement.getAttribute(name) || "";
	},
	
	// The remove method permanently removes the data name and associated value from the data store 
	remove: function(name) 
	{
		// Remove the attribute of the given name from the DOM element used for storing the data within 
		this.storageElement.removeAttribute(name);
		
		// Commit the changes made to the data store so the specified data is permanently removed 
		this.storageElement.save(this.dataStore);
	}
	
};