var $ = function(){};

// DOM Ready Method
// One downside to this method is that there is no order to the functions being executed.
// Also I may have noticed it not working properly in IE!
// @TODO look at original DOMReady function and integrate stack order code into this method.
$.prototype.onDomReady = function(callback)
{
	// W3C Standard Compliant Browsers
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", callback, false);
	} 
	// Other Non-Standard Compliant Browsers
	else {
		// If the DOM is available for access, execute the init function 
		if (document.body && document.body.lastChild) {
			callback();
		} else {
			// Reexecute the current function (denoted by arguments.callee), 
			// after waiting a brief nanosecond so as not to lock up the browser 
			return setTimeout(arguments.callee, 0);
		}
	}
};

// Event management
$.prototype.Events = {
	// The add method allows us to assign a function to execute when an 
	// event of a specified type occurs on a specific element
	add: function (element, eventType, callback) 
	{ 
		// Store the current value of this to use within subfunctions 
		var self = this; 
		
		eventType = eventType.toLowerCase();
		
		if (element.addEventListener) { 
			// If the W3C event listener method is available, use that 
			element.addEventListener(eventType, function(e)
			{ 
				// Execute callback function, passing it a standardized version of 
				// the event object, e. The standardize method is defined later 
				callback(self.standardize(e)); 
			}, false); 
		} else if (element.attachEvent) { 
			// Otherwise use the Internet Explorer- proprietary event handler 
			element.attachEvent("on" + eventType, function() 
			{ 
				// IE uses window.event to store the current event's properties 
				callback(self.standardize(window.event)); 
			}); 
		} 
	},
	
	// The remove method allows us to remove previously assigned code from an event 
	remove: function (element, eventType, callback) 
	{ 
      eventType = eventType.toLowerCase(); 
		  
		if (element.removeEventListener) { 
      	// If the W3C- specified method is available, use that 
         element.removeEventListener(element, eventType, callback); 
      } else if (element.detachEvent) { 
      	// Otherwise, use the Internet Explorer- specific method 
      	element.detachEvent("on" + eventType, callback); 
		}
	},
	
	// The standardize method produces a unified set of event 
	// properties, regardless of the browser 
	standardize: function(event) 
	{ 
		// These two methods, defined later, return the current position of the 
		// mouse pointer, relative to the document as a whole, and relative to the 
		// element the event occurred within 
		var page = this.getMousePositionRelativeToDocument(event); 
		var offset = this.getMousePositionOffset(event);
		
		// Let's stop events from firing on element nodes above the current 
		if (event.stopPropagation) { 
			event.stopPropagation(); 
		} else { 
			event.cancelBubble = true; 
		} 
		
		// We return an object literal containing seven properties and one method 
		return { 
			// The target is the element the event occurred on 
			target: this.getTarget(event), 
			
			// The relatedTarget is the element the event was listening for, 
			// which can be different from the target if the event occurred on an 
			// element located within the relatedTarget element in the DOM 
			relatedTarget: this.getRelatedTarget(event), 
			
			// If the event was a  keyboard- related one, key returns the character 
			key: this.getCharacterFromKey(event), 
			
			// Return the x and y coordinates of the mouse pointer, 
			// relative to the document 
			pageX: page.x, 
			pageY: page.y, 
			
			// Return the x and y coordinates of the mouse pointer, 
			// relative to the element the current event occurred on 
			offsetX: offset.x, 
			offsetY: offset.y, 
			
			// The preventDefault method stops the default event of the element 
			// we're acting upon from occurring. If we were listening for click 
			// events on a hyperlink, for example, this method would stop the 
			// link from being followed 
			preventDefault: function() 
			{ 
				if (event.preventDefault) { 
					event.preventDefault(); // W3C method 
				} else { 
					event.returnValue = false; // Internet Explorer method 
				} 
			} 
		};
	},
	
	// The getTarget method locates the element the event occurred on
	getTarget: function(event) 
	{ 
		// Internet Explorer value is srcElement, W3C value is target 
		var target = event.srcElement || event.target; 
		
		// Fix legacy Safari bug which reports events occurring on a text 
		// node instead of an element node 
		if (target.nodeType == 3) { // 3 denotes a text node 
			target = target.parentNode; // Get parent node of text node 
		} 
		
		// Return the element node the event occurred on 
		return target; 
	},
	
	// The getCharacterFromKey method returns the character pressed when 
	// keyboard events occur. You should use the keypress event 
	// as others vary in reliability 
	getCharacterFromKey: function(event) 
	{ 
		var character = ""; 
		
		if (event.keyCode) { // Internet Explorer 
			character = String.fromCharCode(event.keyCode); 
		} else if (event.which) { // W3C 
			character = String.fromCharCode(event.which); 
		} 
		
		return character; 
	},
	
	// The getMousePositionRelativeToDocument method returns the current 
	// mouse pointer position relative to the top left edge of the current page	
	getMousePositionRelativeToDocument: function(event) 
	{ 
		var x = 0, y = 0; 
		
		if (event.pageX) { 
			// pageX gets coordinates of pointer from left of entire document 
			x = event.pageX; 
			y = event.pageY; 
		} else if (event.clientX) { 
			// clientX gets coordinates from left of current viewable area 
			// so we have to add the distance the page has scrolled onto this value 
			x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
		}
		
		// Return an object literal containing the x and y mouse coordinates 
		return { 
			x: x, 
			y: y 
		} 
	},
	
	// The getMousePositionOffset method returns the distance of the mouse 
	// pointer from the top left of the element the event occurred on 
	getMousePositionOffset: function(event) 
	{ 
		var x = 0, y = 0; 
	
		if (event.layerX) { 
			x = event.layerX; 
			y = event.layerY; 
		} else if (event.offsetX) { 
			// Internet Explorer- proprietary 
			x = event.offsetX; 
			y = event.offsetY; 
		} 
		
		// Returns an object literal containing the x and y coordinates of the 
		// mouse relative to the element the event fired on 
		return { 
			x: x, 
			y: y 
		} 
	},
	
	// The getRelatedTarget method returns the element node the event was set up to 
	// fire on, which can be different from the element the event actually fired on 
	getRelatedTarget: function(event) 
	{ 
		var relatedTarget = event.relatedTarget; 
		
		if (event.type == "mouseover") { 
			// With mouseover events, relatedTarget is not set by default 
			relatedTarget = event.fromElement; 
		} else if (event.type == "mouseout") { 
			// With mouseout events, relatedTarget is not set by default 
			relatedTarget = event.toElement; 
		}
		
		return relatedTarget; 
	}
};

// Define a new namespace within the $ library, 
// called Remote, to store our Ajax methods
$.prototype.Remote = { 
	// The getConnector method returns the base object for performing 
	// dynamic browser-server communication through JavaScript 
	getConnector: function() 
	{ 
		var connectionObject = null; 
		
		// If the W3C- supported request object is available, use that 
		if (window.XMLHttpRequest) {
			connectionObject = new XMLHttpRequest(); 
		}
		// Otherwise, if the  IE- proprietary object is available, use that
		else if (window.ActiveXObject) {
			// IE has different ActiveX versions depending on the browser version (IE6 > IE4)
			var versions = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
			for (var i=0, len=versions.length; i<len; i++) {
				try {
					connectionObject = new ActiveXObject(versions[i]); 
					break; 
				} catch (e){}
			}
		} 
		
		// Both objects contain virtually identical properties and methods 
		// so it's just a case of returning the correct one that's supported 
		// within the current browser 
		return connectionObject; 
	}, 
	
	// The configureConnector method defines what should happen while the 
	// request is taking place, and ensures that a callback method is executed 
	// when the response is successfully received from the server 
	configureConnector: function(connector, callback) 
	{ 
		// The readystatechange event fires at different points in the life cycle of the request, 
		// when loading starts, while it is continuing and again when it ends 
		connector.onreadystatechange = function() 
		{ 
			// If the current request has completed...
			if (connector.readyState == 4) { 
				// ...ensure the HTTP status denotes successful download of content 
				if (connector.status == 200) { 
					/*
					 * Execute the callback method, passing it an object literal containing two properties, 
					 * the raw text of the downloaded content 
					 * and the same content in XML format (if indeed the content requested was able to be parsed as XML) 
					 * 
					 * We call the callback function 
					 * and set its 'this' value to be the connector object
					 */
					callback.call(connector, { 
						text: connector.responseText, 
						xml: connector.responseXML 
					}); 
				} 
			} 
		} 
	},
	
	// The load method takes an object literal containing a URL to load and a method 
	// to execute once the content has been downloaded from that URL. Since the 
	// Ajax technique is asynchronous, the rest of the code does not wait for the 
	// content to finish downloading before continuing, hence the need to pass in 
	// the method to execute once the content has downloaded in the background. 
	load: function(request) 
	{ 
		// Take the url from the request object literal input, 
		// or use an empty string value if it doesn't exist 
		var url = request.url || ""; 
		
		// Take the callback method from the request input object literal, 
		// or use an empty function if it is not supplied 
		var callback = request.callback || function() {}; 
		
		// Get our cross-browser connection object 
		var connector = this.getConnector(); 
        
		if (connector) { 
			// Configure the connector to execute the callback method once the 
			// content has been successfully downloaded 
			this.configureConnector(connector, callback); 
			
			// Now actually make the request for the contents found at the URL 
			connector.open("GET", url, true); 
			connector.send(""); 
		} 
	}, 
	
	// The save method performs an HTTP POST action, effectively sending content, 
	// such as a form's field values, to a server-side script for processing
	save: function(request) 
	{ 
		var url = request.url || ""; 
		var callback = request.callback || function() {};
		
		// The data variable is a string of URL- encoded  name- value pairs to send to 
		// the server in the following format: 
		// "parameter1=value1&parameter2=value2&..." 
		var data = request.data || ""; 
		var connector = this.getConnector(); 
        
		if (connector) { 
			this.configureConnector(connector, callback); 
			
			// Now actually send the data to script found at the URL 
			connector.open("POST", url, true); 
			connector.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
			connector.setRequestHeader("Content-length", data.length); 
			connector.setRequestHeader("Connection", "close"); 
			connector.send(data); 
		} 
	} 
};

// Add the Utils namespace to hold a set of useful, reusable methods
$.prototype.Utils = { 
	// The mergeObjects method copies all the property values of one object 
	// literal into another, replacing any properties that already exist, and 
	// adding any that don't 
	mergeObjects: function(original, newObject) 
	{ 
		for (var key in newObject) { 
			// for ... in ... loops expose unwanted properties such as prototype 
			// and constructor, among others. Using the hasOwnProperty 
			// native method allows us to only allow real properties to pass
			if (newObject.hasOwnProperty(key)) { 
				// Loop through every item in the new object literal, 
				// getting the value of that item in the original object and 
				// the equivalent value in the original object, if it exists 
				var newPropertyValue = newObject[key]; 
				var originalPropertyValue = original[key]; 
			} 
            
			// Set the value in the original object to the equivalent value from the 
			// new object, except if the property's value is an object type, in 
			// which case call this method again recursively, in order to copy every 
			// value within that object literal also 
			original[key] = (originalPropertyValue && typeof newPropertyValue == 'object' && typeof originalPropertyValue == 'object') ? this.mergeObjects(originalPropertyValue, newPropertyValue) : newPropertyValue; 
		}
		
		// Return the original object, with all properties copied over from 
		// the new object 
		return original; 
	},
	
	// The replaceText method takes a text string containing placeholder values and 
	// replaces those placeholders with actual values passed in through the values 
	// object literal. 
	// For example: "You have {count} messages in the {folderName} folder" 
	// Each placeholder, marked with braces – { } – will be replaced with the 
	// actual value from the values object literal, the properties count and 
	// folderName will be sought in this case 
	replaceText: function(text, values) 
	{ 
		for (var key in values) { 
			if (values.hasOwnProperty(key)) { 
				// Loop through all properties in the value object literal 
				if (typeof values[key] == undefined) { // Code defensively 
					values[key] = ""; 
				} 
				
				// Replace the property name wrapped in braces from the text 
				// string with the actual value of that property. The regular 
				// expression ensures that multiple occurrences are replaced 
				text = text.replace(new RegExp("{" + key +"}", "g"), values[key]); 
         } 
		}
		
		// Return the text with all placeholder values replaced with real ones 
		return text; 
	}, 
	
	// The toCamelCase method takes a hyphenated value and converts it into 
	// a camel case equivalent, e.g.,  margin- left becomes marginLeft. Hyphens 
	// are removed, and each word after the first begins with a capital letter 
	toCamelCase: function(hyphenatedValue) 
	{ 
		var result = hyphenatedValue.replace(/-\D/g, function(character) 
		{ 
			return character.charAt(1).toUpperCase(); 
		}); 
		
		return result; 
	}, 
	
	// The toHyphens method performs the opposite conversion, taking a camel 
	// case string and converting it into a hyphenated one. 
	// e.g., marginLeft becomes  margin- left 
	toHyphens: function(camelCaseValue) 
	{ 
		var result = camelCaseValue.replace(/[A-Z]/g, function(character) 
		{ 
			return  ('-' + character.charAt(0).toLowerCase()); 
		});
	
		return result; 
	}
};

// Define the CSS namespace within the $ library to store style-related methods
$.prototype.CSS = {
	// The getAppliedStyle method returns the current value of a specific 
	// CSS style property on a particular element
	getAppliedStyle: function(element, styleName) 
	{ 
		var style = "";
		
		if (window.getComputedStyle) { 
			//  W3C- specific method. Expects a style property with hyphens 
			style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue($.Utils.toHyphens(styleName)); 
		} else if (element.currentStyle) { 
			// Internet Explorer-specific method. Expects style property names 
			// in camel case 
			style = element.currentStyle[$.Utils.toCamelCase(styleName)]; 
		}
		  
		// Return the value of the style property found 
		return style; 
	},
	
	// The getArrayOfClassNames method is a utility method which returns an 
	// array of all the CSS class names assigned to a particular element. 
	// Multiple class names are separated by a space character
	getArrayOfClassNames: function(element) 
	{ 
		var classNames = []; 
		if (element.className) { 
			// If the element has a CSS class specified, create an array 
			classNames = element.className.split(' '); 
		} 
		return classNames; 
	},
	
	// The addClass method adds a new CSS class of a given name to a particular element
	addClass: function(element, className) 
	{ 
		// Get a list of the current CSS class names applied to the element 
		var classNames = this.getArrayOfClassNames(element); 
		
		// Add the new class name to the list 
		classNames.push(className);
		
		// Convert the list in space-separated string and assign to the element 
		element.className = classNames.join(' '); 
	},
	
	// The removeClass method removes a given CSS class name from a given element
	removeClass: function(element, className) 
	{ 
		var classNames = this.getArrayOfClassNames(element); 
        
		// Create a new array for storing all the final CSS class names in 
		var resultingClassNames = []; 
        
		for (var index = 0; index < classNames.length; index++) { 
			// Loop through every class name in the list 
			if (className != classNames[index]) { 
				// Add the class name to the new list if it isn't the one specified 
				resultingClassNames.push(classNames[index]); 
			} 
		}
		  
		// Convert the new list into a  space- separated string and assign it 
		element.className = resultingClassNames.join(" "); 
	},
	
	// The hasClass method returns true if a given class name exists on a 
	// specific element, false otherwise
	hasClass: function(element, className) 
	{ 
		// Assume by default that the class name is not applied to the element 
		var isClassNamePresent = false; 
		var classNames = this.getArrayOfClassNames(element); 
        
		for (var index = 0; index < classNames.length; index++) { 
			// Loop through each CSS class name applied to this element 
			if (className == classNames[index]) { 
				// If the specific class name is found, set the return value to true 
				isClassNamePresent = true; 
			} 
		} 
        
		// Return true or false, depending on if the specified class name was found 
		return isClassNamePresent; 
	},
	
	// The getPosition method returns the x and y coordinates of the  top- left 
	// position of a page element within the current page, along with the 
	// current width and height of that element
	getPosition: function(element) 
	{ 
		var x = 0, y = 0; 
		var elementBackup = element;
		
		if (element.offsetParent) { 
			// The offsetLeft and offsetTop properties get the position of the 
			// element with respect to its parent node. To get the position with 
			// respect to the page itself, we need to go up the tree, adding the 
			// offsets together each time until we reach the node at the top of 
			// the document, by which point, we'll have coordinates for the 
			// position of the element in the page 
			do { 
				x += element.offsetLeft; 
				y += element.offsetTop; 
				// Deliberately using = to force the loop to execute on the next 
				// parent node in the page hierarchy 
			} while (element = element.offsetParent) 
		}
		
		// Return an object literal with the x and y coordinates of the element, 
		// along with the actual width and height of the element 
		return { 
			x: x, 
			y: y, 
			height: elementBackup.offsetHeight, 
			width: elementBackup.offsetWidth 
		} 
	}
};

// Add a new Elements namespace to the $ library 
$.prototype.Elements = { 
	// The getElementsByClassName method returns an array of DOM elements 
	// which all have the same given CSS class name applied. To improve the speed 
	// of the method, an optional contextElement can be supplied which restricts the 
	// search to only those child nodes within that element in the node hierarchy 
	getElementsByClassName: function(className, contextElement)
	{ 
		var allElements = null; 
		
		if (contextElement) { 
			// Get an array of all elements within the contextElement 
			// The * wildcard value returns all tags 
			allElements = contextElement.getElementsByTagName("*"); 
		} else { 
			// Get an array of all elements, if no contextElement was supplied 
			allElements = document.getElementsByTagName("*"); 
		} 
        
		var results = [];
		
		for (var elementIndex=0, len=allElements.length; elementIndex<len; elementIndex++) {            
			// Loop through every element found 
			var element = allElements[elementIndex];
			
			// If the element has the specified class, add that element to the output array 
			if ($.CSS.hasClass(element, className)) { 
				results.push(element); 
			} 
		} 
        
		// Return the list of elements that contain the specific CSS class name 
		return results; 
	} 
}

/*
 * Local storage API: 
 * Preferred since it is becoming an established standard, is simple to use, 
 * and has fairly strong support among the latest browser releases. 
 * Provides 5MB storage by default.
 *  
 * Mozilla global storage API: 
 * A good backup for those Firefox 2 and 3 users whose browsers do not yet support the local storage API 
 * but do support this very similar API. 
 * Provides 5MB storage by default.
 * 
 * IE’s userData mechanism: 
 * IE versions 5 to 7 do not support any of the preferred methods so far, 
 * but do provide this mechanism for storing data locally without requiring any plug-ins. 
 * Provides 64KB storage by default.
 * 
 * Cookies: 
 * Definitely the least-preferred option. 
 * Cookie files are oppressively small, and their data gets sent with each HTTP request to the server, 
 * clogging up the connection more and more the larger the cookies become. 
 * Provides 4KB storage by default.
 */
 
// Add a new Storage namespace to the $ library
$.prototype.Storage = {};

// Stores a reference to the technique's code object, set with the initialize method
$.prototype.Storage.dataStore = null;

// The initialize method selects the technique to use for local data storage.
$.prototype.Storage.initialize = function()
{
	// Work through our order of preference 
	if (window.localStorage) {
		// If local storage API is available, set the dataStore to point to the local storage API namespace we created earlier 
		this.dataStore = $.Storage.LocalStorage;
	} else if (window.globalStorage) {
		// If the global storage API is supported, set dataStore to point to the appropriate namespace 
		this.dataStore = $.Storage.GlobalStorage; 
		this.dataStore.initialize();
	} else if (window.ActiveXObject) { 
		// If Internet Explorer's userData mechanism is present, initialize that for use 
		this.dataStore = $.Storage.UserData; 
		this.dataStore.initialize();
	} else {
		// If all else fails, use cookies 
		this.dataStore = $.Storage.Cookies;
	}
};

// The get method retrieves a previously stored value and passes it to the specified callback function. Because the callback technique is used in the client-side database API, we need to use it throughout
$.prototype.Storage.get = function(name, callback) 
{
	// Only one object (client-side database API) actually uses the callback parameter as part of the data retrieval process. Other namespaces specified in the dataStore will just ignore it 
	var value = this.dataStore.get(name, callback);
	
	// If a value is returned (which it isn't with the client-side database API), execute the callback function, passing it the value found. 
	if (value && callback) {
		callback(value);
	}
};

// The set method stores a value against a specified name 
$.prototype.Storage.set = function(name, value) 
{
	// All the different techniques accept the same inputs for setting data, so this universal method is fairly simple 
	this.dataStore.set(name, value);
};

// The remove method permanently deletes data by a specified name 
$.prototype.Storage.remove = function(name) 
{
	// Each technique accepts the same inputs for removing data 
	this.dataStore.remove(name);
};

// Create a History namespace for managing browser history items
// within our RIAs
$.prototype.History = {

    // The currentValue property holds the current hash value from the URL,
    // which is found via the global location.hash property. This property
    // value contains the # character, so we remove this as it is not needed
    currentValue: location.hash.replace(/#/g, ""),

    // To overcome an issue in Internet Explorer’s history handling, we need to
    // add and read back our history items from an <iframe> tag on the page in
    // that browser. Here, we maintain a reference to that element, which we
    // define later
    iframe: null,

    // We will want to perform some action when the user clicks the Back
    // and Forward buttons in their browser and the current history item
    // changes. The onChange method will be called when this change occurs
    onChange: function() {},
    
    // The enable method starts listening for changes occurring to the current 
    // hash portion of the URL and hence the browser’s history item list itself
    enable: function() {

        // Internet Explorer behaves differently from the other browsers, so we 
        // need to create an <iframe> to contain the changes to the hash
        if (window.ActiveXObject) {

            // Create a hidden <iframe> and add it to the page
            this.iframe = $.Elements.create("iframe");
            this.iframe.style.display = "none";
            this.iframe.src = "javascript:false;";
            document.body.appendChild(this.iframe);

            // Initialize the <iframe> with a history item to start with. The add
            // method is defined later
            this.add(this.currentValue);
        }
        
        var self = this;
        
        // The detectHistoryChange function detects when the current hash value 
        // differs the last and executes the onChange method when it does
        var detectHistoryChange = function() {

            // Get the last saved and latest hash values
            var lastValue = self.currentValue;
            var latestValue = location.hash.replace(/#/g, "");
            
            // Get the hash slightly different in Internet Explorer
            if (self.iframe) {
                var latestValue = self.iframe.contentWindow.document.location.hash.replace(/#/g, "");
            } 
            
            // If the latest and last hash values differ, save the new value and call
            // the onChange property, passing it the latest and previous hash values
            if (latestValue != lastValue) {
                self.currentValue = latestValue;
                self.onChange(latestValue, lastValue);
            }
        }

        // Execute the detectHistoryChange function once every 300 milliseconds - 
        // see Chapter 5 for the importance of this number - and begin listening for 
        // changes occuring to the hash value
        window.setInterval(detectHistoryChange, 300);
    },

    // The add method takes a specified text string value and adds it to the URL 
    // hash, creating a new browser history item with that value
    add: function(newValue) {
        if (this.iframe) {
            // Add the hash to Internet Explorer’s <iframe> tag
            var iframeDocument = this.iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.close();
            iframeDocument.location.hash = newValue;
        } else {
            // All other browser’s can access the hash property of the current page
            location.hash = newValue;
        }
    }
};

// Instantiate the $ library object as a singleton for use on a page 
$ = new $();