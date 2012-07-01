// Add a LocalStorage namespace to keep local storage API code together
$.prototype.Storage.LocalStorage = {
	
	// The set method stores a value with a given name using the local storage API 
	set: function(input) 
	{
		// Expect an object literal as an input, containing name and value to set 
		var name = input.name || ""; 
		var value = input.value || "";
		
		// Save the data using the top-level localStorage object 
		localStorage.setItem(name, value);
	},
	
	// The get method retrieves a previously stored value by name
	get: function(name) 
	{
		// Return an empty string if the item requested does not exist; otherwise, fetch the value from the localStorage object 
		return localStorage.getItem(name) || "";
	},
	
	// The remove method deletes a previously stored value from the localStorage object 
	remove: function(name) 
	{
		// Remove the item from localStorage 
		localStorage.removeItem(name);
	}
	
};