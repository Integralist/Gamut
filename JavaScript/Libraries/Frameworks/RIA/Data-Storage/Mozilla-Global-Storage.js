// Add a GlobalStorage namespace to contain all global storage API-related methods 
$.prototype.Storage.GlobalStorage = {
	
	dataStore: null,
	
	// The initialize method locates the data store to use if the global storage API is supported in the browser 
	initialize: function() 
	{
		// The data store itself is an index of the globalStorage array, where the index is always the name of the domain of the current site 
		if (globalStorage) {
			this.dataStore = globalStorage[location.host];
		}
	},
	
	// The set method stores a value with a given name in the global storage API 
	set: function(input) 
	{
		// Expect an object literal as an input, containing name and value to set 
		var name = input.name || ""; 
		var value = input.value || "";
		
		// Save the data using our data store provided by globalStorage 
		this.dataStore.setItem(name, value);
	},
	
	// The get method retrieves a previously stored value by name 
	get: function(name) 
	{
		// Return an empty string if the item requested does not exist; otherwise, locate it from the data store 
		return this.dataStore.getItem(name) || "";
	},
	
	// The remove method permanently deletes a previously stored value by name from the data store
	remove: function(name) 
	{
		// Remove the item from the data store using the global storage API's removeItem method 
		this.dataStore.removeItem(name);
	}
	
};