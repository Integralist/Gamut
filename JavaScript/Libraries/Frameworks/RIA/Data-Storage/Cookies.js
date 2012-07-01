// Create a Cookies namespace for storing cookie-related storage methods 
$.prototype.Storage.Cookies = {
	
	// The set method sets a cookie on the local machine with the given name and value 
	set: function(input)
	{
		// Expect an object literal as an input, with name, value, expiry and path properties 
		var name = input.name || "";
		var value = input.value || "";
		
		// If an expiry date is provided, get its value as a string for setting in the cookie. If no expiry date is provided, default to 10 years ahead
		var tenYearsAhead = new Date();
		tenYearsAhead.setFullYear(tenYearsAhead.getFullYear() + 10);
		
		// Use an expiry date provided as an input or default to a date 10 years in the future 
		var expiry = (input.expiry ? input.expiry.toUTCString() : tenYearsAhead.toUTCString());
	
		// Default to the site root directory if no path is given 
		var path = input.path || "/";
	
		// A cookie is set as a specially formatted string. The domain will be assigned automatically to the current domain of the site being accessed 
		var cookieFormat = "{name}={value}; expires={expiry}; path={path}";
		
		// Create a new cookie by assigning the formatted string to document.cookie 
		document.cookie = $.Utils.replaceText(cookieFormat, {
			// Use the escape method to ensure nonalphanumeric characters are encoded and cannot break the resulting formatted cookie string 
			name: escape(name), 
			value: escape(value), 
			expiry: expiryDate, 
			path: path
		});
	},
	
	// The get method retrieves a previously stored cookie value by name 
	get: function(name) 
	{
		// document.cookie is a string automatically containing all cookies valid for the current domain and path of the site being accessed

		// Locate the cookie using a regular expression run against document.cookie 
		var cookieFinder = new RegExp("(^|;) ?" + name + "=([^;]*)(;|$)"); 
		var cookie = document.cookie.match(cookieFinder);
		
		var value = ""; 
		if (cookie) {
			// If a cookie was located, take its value found using the regular expression 
			value = unescape(cookie[2]);
		}
		return value;
	},

	// The remove method deletes an existing cookie by name 
	remove: function(name)
	{
		// A cookie is removed by resetting the expiry date to any time before the present 
		var expiryDate = new Date();

		// Wind back the clock 
		expiryDate.setTime(expiryDate.getTime() - 1);
		
		// Let the previously defined set method reset the cookie's expiry date, deleting the cookie 
		this.set({
			name: escape(name), 
			expiry: expiryDate
		});
	}
	
};