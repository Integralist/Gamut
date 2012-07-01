var $ = function(){};

/*
 * DOM Ready:
 * Method for checking when the Document Object Model has been processed/loaded.
 * @param func | Function | a function that should be called once the DOM is ready to be interacted with
 */
$.prototype.ready = (function() {
	var load_events = [], // Stacks all functions sent to addDOMLoadEvent
		load_timer, // Used as a timer for versions of Safari older than 525 and Internet Explorer
		done, // Used to check when the DOM has completed loading
		exec, // Used to execute each function in the load_events stack
		old_onload; // Used as a fallback for older browsers that fail all other means of emulating DOMContentLoaded
		 
	// This method will be called when the DOM is loaded. 
	// Or when the window.onload event is triggered.
	var init = function() {
		// Let the application know the DOM has finished loaded
		done = true;
		
		// Run a quick clean up of the load_timer interval
		window.clearInterval(load_timer);
	
		// Execute all the functions in the load_events stack in the order they were added
		while ((exec = load_events.shift())) {
			exec();
		}
	};

	return function (func) {
		// We check to see if the DOM has already loaded.
		// If it is then just run the function that's trying to be called and stop there.
      	if (done) {
			return func();
		}

		if (!load_events[0]) {
			if (document.addEventListener) {
				document.addEventListener("DOMContentLoaded", init, false);
			}
			
			// Internet Explorer
				
			/**
			 * For full information see comment 201
			 * http://dean.edwards.name/weblog/2006/06/again/#comment335794
			 * 
			 * Summing up the IE challenge:
			 * Initialization event behaviours and order vary greatly among different pages.
			 *
			 * Dean Edwards document.write of the deferred script has given problems on some pages (causing a consistent > 60 sec delay).
			 * Dean confirmed that document.readyState is unreliable. 
			 * We have seen cases where document.readyState was “complete” while document.body was still null.
			 * And other cases where document.readyState was not complete until after all images on the page were loaded.
			 *
			 * The doScroll method has been seen to succeed while document.body is still null.
			 * And as already mentioned, document.body can be non-null prior to the DOM being available.
			 * 
			 * One solution that so far has tested 100% OK is to combine a test for both document.body and success of doScroll. 
			 * And this is the method we use as it has so far provided perfect DOMContentLoaded emulation on all pages tested.
			 * Sometimes the doScroll is not available and IE falls back to window.onload so I've used a timer to counter this.
			 *
			 * Note that we use IE's Conditional Compilation to target IE rather than browser sniffing
			 * http://msdn.microsoft.com/en-gb/library/121hztk3(VS.85).aspx
			 */
			 
			/*@cc_on @*/
			/*@if (@_win32)
				load_timer = setInterval(function() {
					if (document.body) {
						try {
							document.createElement('div').doScroll('left');
							clearInterval(load_timer);
							return init();
						} catch(e) {}
					}
				}, 10);
			@*/
			/*@end @*/	
			
			// Safari (versions older than 525 which don't support the DOMContentLoaded event)
			// Use a try-catch statement to make sure no errors (such as Firefox generates) are displayed.
			try {
				if (window.navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1] < 525) {
					load_timer = window.setInterval(function() {
						if (/loaded|complete/.test(document.readyState)) {
							init();
						}
					}, 10);
				}
			} catch(e) {}

			// For other browsers fall back to calling init() on the window.onload event.
			// But first store the original window.onload (just in case it was already set) and execute after init().
			old_onload = window.onload;
			window.onload = function() {
				// Calling init() within the window.onload event wont affect modern browsers.
				// The reason being the init() function has already been called.
				// So the stack of waiting functions have been cleared out already.
				init();
				
				// Run the original window.onload after init() 
				// as window.onload should run after DOMContentLoaded.
				if (old_onload) {
					old_onload();
				}
				
				//window.alert("window.onload is complete");
			};
		}

		// We push the requested function into the stack array,
		// which will be executed either once the DOM has loaded or the window.onload is called.
		load_events.push(func);
	};
})();

/*
 * XMLHttpRequest:
 * Internet Explorer 6 (and lower) uses an ActiveXObject to create a new XMLHttpRequest object.
 * So if Internet Explorer is being used then create a wrapper for the XMLHttpRequest object.
 */
if (typeof XMLHttpRequest == "undefined") {
	XMLHttpRequest = function() {
		return new ActiveXObject(
			// Internet Explorer 5 uses a different XMLHTTP object from Internet Explorer 6
			navigator.userAgent.indexOf("MSIE 5") >= 0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
		);
	};
}

/*
 * AJAX:
 * Means of establishing HTTP requests with the server without reloading the page (via XMLHttpRequest)
 * @param settings | object literal | a predefined set of options for the user to configure
 */
$.prototype.remote = function(settings) {
	// Load the settings object with defaults, if no values were provided by the user
	settings = {
		// The type of HTTP Request
		method: settings.method || "POST",
		
		// If it's a POST method then what variables are we sending
		query: encodeURI(settings.query) || null,
	
		// The URL the request will be made to
		url: settings.url || "",
	
		// How long to wait before considering the request to be a timeout
		timeout: settings.timeout || 5000,
	
		// Functions to call when the request fails, succeeds, or completes (either fail or succeed)
		onComplete: settings.onComplete || function(){},
		onError: settings.onError || function(){},
		onSuccess: settings.onSuccess || function(){},
	
		// The data type that'll be returned from the server
		// Accepted formats are: json, xml, html (if none specified then we attempt to determine the format ourselves)
		format: settings.format || undefined
	};

	// Create the request object
	var xhr = new XMLHttpRequest();
	
	// Open the asynchronous request
	xhr.open(settings.method, settings.url, true);
	
	// If it's a POST method then we need to set the request-headers
	if (settings.method === "POST" && settings.query !== "undefined" && settings.query.length>0) {
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	}
	
	// We're going to wait for a request for 5 seconds, before giving up
	var timeoutLength = settings.timeout;
	
	// Keep track of when the request has been succesfully completed
	var requestDone = false;
	
	// Initalize a callback which will fire 5 seconds from now, cancelling the request (if it has not already occurred).
	setTimeout(function() {
		requestDone = true;
	}, timeoutLength);

	// Watch for when the state of the document gets updated
	xhr.onreadystatechange = function() {
		// Wait until the data is fully loaded, and make sure that the request hasn't already timed out
		if (xhr.readyState == 4 && !requestDone) {
			// Check to see if the request was successful
			if (httpSuccess(xhr)) {
				// Execute the success callback with the data returned from the server
				settings.onSuccess(httpData(xhr, settings.format));
			} else {
				// Otherwise, an error occurred, so execute the error callback
				settings.onError(httpData(xhr, settings.format));
			}
			
			// Call the completion callback
			settings.onComplete();
			
			// Clean up after ourselves, to avoid memory leaks
			xhr = null;
		}
	};
	
	// Establish the connection to the server
	xhr.send(settings.query);
	
	// Determine the success of the HTTP response
	function httpSuccess(xhr) {
		try {
			// If no server status is provided, and we're actually requesting a local file, then it was successful
			return !xhr.status && location.protocol == "file:" ||
			
			// Any status in the 200 range is good
			(xhr.status >= 200 && xhr.status < 300) ||
			
			// Successful if the document has not been modified
			xhr.status == 304 ||
			
			// Safari returns an empty status if the file has not been modified
			navigator.userAgent.indexOf("Safari") >= 0 && typeof xhr.status == "undefined";
		} catch(e){}
		
		// If checking the status failed, then assume that the request failed too
		return false;
	}
	
	// Extract the correct data from the HTTP response
	function httpData(xhr, format) {
		// If the user has specified the content-type then use that...
		if (typeof format !== "undefined") {
			switch (format) {
				case "json":
					return JSON.parse(xhr.responseText);
					break;
				case "xml":
					return xhr.responseXML;
					break;
				case "html":
					return xhr.responseText;
					break;
				default:
					return xhr.responseText;
			}
		};
		// ...otherwise try and determine the content-type the best we can...
		
		// Get the content-type header
		var contentType = xhr.getResponseHeader("content-type");
		
		if (contentType.indexOf("javascript") >= 0 || contentType.indexOf("json") >= 0) {
			return JSON.parse(xhr.responseText);
		}
		
		if (contentType.indexOf("xml") >= 0) {
			return xhr.responseXML;
		}
		
		if (contentType.indexOf("html") >= 0) {
			return xhr.responseText;
		}
	}
};

/*
 * Event Management:
 * Cross-Browser methods for handling event management.
 */
$.prototype.events = {
	/*
	 * The standardize method produces a unified set of event properties, regardless of the browser.
	 * @param event | Event | the browser event object
	 * @returns {} | Object | an object literal containing a set of methods which standardizes the cross-browser handling
	 */ 
	standardize: function(event) { 
		// These two methods, defined later, return the current position of the mouse pointer, 
		// relative to the document as a whole, and relative to the element the event occurred within 
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
			// which can be different from the target 
			// if the event occurred on an element located within the relatedTarget element in the DOM 
			relatedTarget: this.getRelatedTarget(event), 
			
			// If the event was a  keyboard- related one, key returns the character 
			key: this.getCharacterFromKey(event), 
			
			// Return the x and y coordinates of the mouse pointer, relative to the document 
			pageX: page.x, 
			pageY: page.y, 
			
			// Return the x and y coordinates of the mouse pointer, 
			// relative to the element the current event occurred on 
			offsetX: offset.x, 
			offsetY: offset.y, 
			
			// The preventDefault method stops the default event of the element we're acting upon from occurring. 
			// If we were listening for click events on a hyperlink, for example, this method would stop the link from being followed 
			preventDefault: function() { 
				if (event.preventDefault) {
					// W3C method 
					event.preventDefault(); 
				} else { 
					// Internet Explorer method
					event.returnValue = false;
				} 
			} 
		};
	},
	
	/*
	 * The getTarget method locates the element the event occurred on.
	 * @param event | Event | the browser event object
	 * @returns target | Element | the target element
	 */
	getTarget: function(event) {
		// Internet Explorer value is srcElement, W3C value is target 
		var target = event.srcElement || event.target; 
		
		// Fix legacy Safari bug which reports events occurring on a text node instead of an element node 
		if (target.nodeType == 3) { // 3 denotes a text node 
			// Get parent node of text node
			target = target.parentNode;
		} 
		
		// Return the element node the event occurred on 
		return target; 
	},
	
	/*
	 * The getCharacterFromKey method returns the character pressed when keyboard events occur.
	 * You should use the keypress event as others vary in reliability.
	 * @param event | Event | the browser event object
	 * @returns character | String | the character key
	 */ 
	getCharacterFromKey: function(event) { 
		var character = ""; 
		
		// Internet Explorer
		if (event.keyCode) { 
			character = String.fromCharCode(event.keyCode); 
		} 
		// W3C
		else if (event.which) { 
			character = String.fromCharCode(event.which); 
		} 
		
		return character; 
	},
	
	/*
	 * The getMousePositionRelativeToDocument method returns
	 * the current mouse pointer position relative to the top left edge of the current page
	 * @param event | Event | the browser event object
	 * @returns {} | Object | object literal containing the correct x & y coordinates
	 */
	getMousePositionRelativeToDocument: function(event) { 
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
	
	/*
	 * The getMousePositionOffset method returns
	 * the distance of the mouse pointer from the top left of the element the event occurred on
	 * @param event | Event | the browser event object
	 * @returns {} | Object | object literal containing the correct x & y coordinates
	 */
	getMousePositionOffset: function(event) { 
		var x = 0, y = 0; 
	
		if (event.layerX) { 
			x = event.layerX; 
			y = event.layerY; 
		} else if (event.offsetX) { 
			// Internet Explorer proprietary 
			x = event.offsetX; 
			y = event.offsetY; 
		} 
		
		// Returns an object literal containing the x and y coordinates of the mouse 
		// relative to the element the event fired on 
		return { 
			x: x, 
			y: y 
		} 
	},
	
	/*
	 * The getRelatedTarget method returns the element node the event was set up to fire on
	 * which can be different from the element the event actually fired on
	 * @param event | Event | the browser event object
	 * @returns relatedTarget | Element | the target element
	 */ 
	getRelatedTarget: function(event) { 
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

if (typeof window.addEventListener === "function") {
	/*
	 * The add method allows us to assign a function to execute when an event of a specified type occurs on a specific element.
	 * @param element | Element | the element we are assigning the event listener to
	 * @param eventType | String | the name of the event to listen for
	 * @param callback | Function | the event handler function that will run when the event is triggered
	 */
	$.prototype.events.add = function(element, eventType, callback) {
		// Store the current value of this to use within subfunctions 
		var self = this; 
		eventType = eventType.toLowerCase();
		
		element.addEventListener(eventType, function(e) {
			// Execute callback function, passing it a standardized version of the event object, e. 
			callback(self.standardize(e)); 
		}, false);
	};
	
	/*
	 * The remove method allows us to remove previously assigned code from an event.
	 * @param element | Element | the element we assigned the event listener to
	 * @param eventType | String | the name of the event we're listening for
	 * @param callback | Function | the event handler function that should run when the event was triggered
	 */
	$.prototype.events.remove = function (element, eventType, callback) { 
		eventType = eventType.toLowerCase(); 
		element.removeEventListener(element, eventType, callback);
	};
} else {
	$.prototype.events.add = function(element, eventType, callback) {
		// Store the current value of this to use within subfunctions 
		var self = this; 
		eventType = eventType.toLowerCase();
		
		// Otherwise use the Internet Explorer proprietary event handler 
		element.attachEvent("on" + eventType, function() { 
			// IE uses window.event to store the current event's properties 
			callback(self.standardize(window.event)); 
		});
	};
	
	$.prototype.events.remove = function(element, eventType, callback) {
		eventType = eventType.toLowerCase();
		element.detachEvent("on" + eventType, callback);
	};
}

/*
 * Basic Utilities:
 * Set of methods for doing basic utility changes.
 */ 
$.prototype.utils = { 
	/*
	 * The toCamelCase method takes a hyphenated value and converts it into a camel case equivalent. 
	 * @param camelCaseValue | String | the string we want to camel case
	 * @returns result | String | new camel cased version of the string
	 */
	toCamelCase: function(hyphenatedValue) { 
		var result = hyphenatedValue.replace(/-\D/g, function(character) { 
			return character.charAt(1).toUpperCase(); 
		}); 
		
		return result; 
	}, 
	
	/*
	 * The toHyphens method performs the opposite conversion, taking a camel case string and converting it into a hyphenated one. 
	 * @param camelCaseValue | String | the string we want to convert from camel case to hypens
	 * @returns result | String | new hyphen version of the string
	 */
	toHyphens: function(camelCaseValue) { 
		var result = camelCaseValue.replace(/[A-Z]/g, function(character) { 
			return  ('-' + character.charAt(0).toLowerCase()); 
		});
	
		return result; 
	}
};

/*
 * Style and CSS Management:
 * Cross-Browser methods for handling the application and retrieval of styles.
 */ 
$.prototype.css = {
	/*
	 * The getAppliedStyle method returns the current value of a specific CSS style property on a particular element
	 * @param element | Element | the name of the element we want to check against
	 * @param styleName | String | the name of the style we want to retrieve
	 * @returns style | String | value of the style property
	 */
	getAppliedStyle: function(element, styleName) { 
		var style = "";
		
		if (window.getComputedStyle) { 
			//  W3C- specific method. Expects a style property with hyphens 
			style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue($.utils.toHyphens(styleName)); 
		} else if (element.currentStyle) { 
			// Internet Explorer-specific method. Expects style property names in camel case 
			style = element.currentStyle[$.utils.toCamelCase(styleName)]; 
		}
		  
		// Return the value of the style property found 
		return style; 
	},
	
	/*
	 * The getArrayOfClassNames method is a utility method which returns all CSS class names assigned.
	 * Multiple class names are separated by a space character.
	 * @param element | Element | the name of the element we want to check against
	 * @returns classNames | Array | an array of all the CSS class names assigned to a particular element
	 */ 
	getArrayOfClassNames: function(element) { 
		var classNames = []; 
		if (element.className) { 
			// If the element has a CSS class specified, create an array 
			classNames = element.className.split(' '); 
		} 
		return classNames; 
	},
	
	/*
	 * The addClass method adds a new CSS class of a given name to a particular element.
	 * @param element | Element | the name of the element we want to add to
	 * @param className | String | the name of the class we want to add
	 */
	addClass: function(element, className) { 
		// Get a list of the current CSS class names applied to the element 
		var classNames = this.getArrayOfClassNames(element); 
		
		// Add the new class name to the list 
		classNames.push(className);
		
		// Convert the list in space eparated string and assign to the element 
		element.className = classNames.join(' '); 
	},
	
	/*
	 * The removeClass method removes a given CSS class name from a given element
	 * @param element | Element | the name of the element we want to remove from
	 * @param className | String | the name of the class we want to remove
	 */
	removeClass: function(element, className) { 
		var classNames = this.getArrayOfClassNames(element); 
        
		// Create a new array for storing all the final CSS class names in 
		var resultingClassNames = []; 
        
		for (var index = 0, len = classNames.length; index < len; index++) { 
			// Loop through every class name in the list 
			if (className != classNames[index]) { 
				// Add the class name to the new list if it isn't the one specified 
				resultingClassNames.push(classNames[index]); 
			} 
		}
		  
		// Convert the new list into a space separated string and assign it 
		element.className = resultingClassNames.join(" "); 
	},
	
	/*
	 * The hasClass method returns true if a given class name exists on a specific element, false otherwise
	 * @param element | Element | the name of the element we want to check against
	 * @param className | String | the name of the class we want to check exists
	 * @returns isClassNamePresent | Boolean | depends on whether class name exists
	 */
	hasClass: function(element, className) { 
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
	
	/*
	 * The getPosition method returns the x and y coordinates of the top left position of a page element within the current page,
	 * along with the current width and height of that element
	 * @param element | Element | the name of the element we want to check against
	 * @returns {} | Object | object literal containing the correct x/y coordinates and width/height
	 */
	getPosition: function(element) { 
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

/*
 * Elements:
 * Set of methods for doing simple element searching.
 */ 
$.prototype.elements = { 
	/*
	 * The getElementsByClassName method returns an array of DOM elements which all have the same given CSS class name applied.
	 * To improve the speed of the method, an optional contextElement can be supplied which restricts the search.
	 * @param className | String | the class name we're looking for
	 * @param contextElement | String | the context, to help narrow down the search
	 * @returns results | Array | Array of all elements that contain the specified class name
	 */
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
			if ($.css.hasClass(element, className)) { 
				results.push(element); 
			} 
		} 
        
		// Return the list of elements that contain the specific CSS class name 
		return results; 
	} 
}

// Instantiate the $ library object as a singleton for use on a page .
// WARNING: Causes the ready() method to fire (as the 'ready' method is actually a self-executing function).
$ = new $();