(function(window, document, undef) {
	
	// Stand.ard.iz.er library
	var standardizer = (function(){
	
		// Private implementation
		var __standardizer = {
		
			/**
			 * Following property indicates whether the current rendering engine is Trident (i.e. Internet Explorer)
			 * 
			 * @return v { Integer|undefined } if IE then returns the version, otherwise returns 'undefined' to indicate NOT a IE browser
			 */
			isIE: (function() {
				var undef,
					 v = 3,
					 div = document.createElement('div'),
					 all = div.getElementsByTagName('i');
			
				while (
					div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
					all[0]
				);
			
				return v > 4 ? v : undef;
			}()),
			
			/**
			 * The following method is a direct copy from Douglas Crockfords json2.js script (https://github.com/douglascrockford/JSON-js/blob/master/json2.js)
			 * It is used to replicate the native JSON.parse method found in most browsers.
			 * e.g. IE<8 hasn't got a native implementation.
			 * 
			 * @return { Object } a JavaScript Object Notation (JSON) compatible object
			 */
			json: function(text) {
				// The parse method takes a text and returns a JavaScript value if the text is a valid JSON text.
				var j,
					 cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
				
				function walk(holder, key) {
					// The walk method is used to recursively walk the resulting structure so that modifications can be made.
					var k, v, value = holder[key];
					if (value && typeof value === 'object') {
						for (k in value) {
							if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = walk(value, k);
								if (v !== undefined) {
									value[k] = v;
								} else {
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder, key, value);
				}
				
				// Parsing happens in four stages. In the first stage, we replace certain
				// Unicode characters with escape sequences. JavaScript handles many characters
				// incorrectly, either silently deleting them, or treating them as line endings.
				text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
            	text = text.replace(cx, function(a) {
               	return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
					});
            }
            
            // In the second stage, we run the text against regular expressions that look
				// for non-JSON patterns. We are especially concerned with '()' and 'new'
				// because they can cause invocation, and '=' because it can cause mutation.
				// But just to be safe, we want to reject all unexpected forms.
				
				// We split the second stage into 4 regexp operations in order to work around
				// crippling inefficiencies in IE's and Safari's regexp engines. First we
				// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
				// replace all simple value tokens with ']' characters. Third, we delete all
				// open brackets that follow a colon or comma or that begin the text. Finally,
				// we look to see that the remaining characters are only whitespace or ']' or
				// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.				
				if (/^[\],:{}\s]*$/
					.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
				   .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
				   .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
				
				// In the third stage we use the eval function to compile the text into a
				// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
				// in JavaScript: it can begin a block or an object literal. We wrap the text
				// in parens to eliminate the ambiguity.				
					j = eval('(' + text + ')');
				
				// In the optional fourth stage, we recursively walk the new structure, passing
				// each name/value pair to a reviver function for possible transformation.				
				   return typeof reviver === 'function' ? walk({'': j}, '') : j;
				}
				
				// If the text is not JSON parseable, then a SyntaxError is thrown.				
				throw new SyntaxError('JSON.parse');
			},
			
			// Errors for AJAX request
			errors: [],
			
			/**
			 * Listens for when the DOM is ready to be interacted with.
			 * Then processes queued functions.
			 * 
			 * @param fn { Function } a function to be executed when the DOM is ready.
			 * @return anonymous { Function } this method is an immediately-invoked function expression which returns an anonymous Function to be executed.
			 */
			domready: (function(){

				// Variables used throughout this function
				var win = window,
					 doc = win.document,
					 dce = doc.createElement,
					 supportAEL = (function(){
					 	if (doc.addEventListener) {
					 		return true;
					 	} else {
					 		return false;
					 	}
					 }()), 
					 queue = [],
					 exec,
					 loaded,
					 fallback_onload, 
					 explorerTimer,
					 readyStateTimer,
					 // Had to duplicate isIE function from above as both sections of the script rely on isIE being an IIFE 
					 // (immediately invoked function expression)
					 isIE = (function() {
						var undef,
							 v = 3,
							 div = doc.createElement('div'),
							 all = div.getElementsByTagName('i');
					
						while (
							div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
							all[0]
						);
					
						return v > 4 ? v : undef;
					}());
				
				// Private inner function which is called once DOM is loaded.
				function process() {
					// Let the script know the DOM is loaded
					loaded = true;
					
					// Cleanup
					if (supportAEL) {
						doc.removeEventListener("DOMContentLoaded", process, false);
					}
				
					// Move the zero index item from the queue and set 'exec' equal to it
					while ((exec = queue.shift())) {
						// Now execute the current function
						exec();
					}
				}
			
				return function(fn) {
					// if DOM is already loaded then just execute the specified function
					if (loaded) { 
						return fn();
					}
					
					if (supportAEL) {
						// Any number of listeners can be set for when this event fires,
						// but just know that this event only ever fires once
						doc.addEventListener("DOMContentLoaded", process, false);
					}
					
					// Internet Explorer versions less than 9 don't support DOMContentLoaded.
					// The doScroll('left') method  by Diego Perini (http://javascript.nwbox.com/IEContentLoaded/) appears to be the most reliable solution.
					// Microsoft documentation explains the reasoning behind this http://msdn.microsoft.com/en-us/library/ms531426.aspx#Component_Initialization
					else if (isIE < 9) {
						explorerTimer = win.setInterval(function() {
							if (doc.body) {
								// Check for doScroll success
								try {
									dce('div').doScroll('left');
									win.clearInterval(explorerTimer);
								} catch(e) { 
									return;
								}
								
								// Process function stack
								process();
								return;
							}
						}, 10);
						
						// Inner function to check readyState
						var checkReadyState = function() {
							if (doc.readyState == 'complete') {
								// Clean-up
								doc.detachEvent('onreadystatechange', checkReadyState);
								win.clearInterval(explorerTimer);
								win.clearInterval(readyStateTimer);
								
								// Process function stack
								process();
							}
						};
			
						// If our page is placed inside an <iframe> by another user then the above doScroll method wont work.
						// As a secondary fallback for Internet Explorer we'll check the readyState property.
						// Be aware that this will fire *just* before the window.onload event so isn't ideal.
						// Also notice that we use IE specific event model (attachEvent) to avoid being overwritten by 3rd party code.
						doc.attachEvent('onreadystatechange', checkReadyState);
						
						// According to @jdalton: some browsers don't fire an onreadystatechange event, but do update the document.readyState
						// So to workaround the above snippet we'll also poll via setInterval.
						readyStateTimer = win.setInterval(function() {
							checkReadyState();
						}, 10);
					}
					
					fallback_onload = function() {
						// Note: calling process() now wont cause any problem for modern browsers.
						// Because the function would have already been called when the DOM was loaded.
						// Meaning the queue of functions have already been executed
						process();
						
						// Clean-up
						if (supportAEL) {
							doc.removeEventListener('load', fallback_onload, false);
						} else {
							doc.detachEvent('onload', fallback_onload);
						}
					};
					
					// Using DOM1 model event handlers makes the script more secure than DOM0 event handlers.
					// This way we don't have to worry about an already existing window.onload being overwritten as DOM1 model allows multiple handlers per event.
					if (supportAEL) {
						doc.addEventListener('load', fallback_onload, false);
					} else {
						doc.attachEvent('onload', fallback_onload);
					}
					
					// As the DOM hasn't loaded yet we'll store this function and execute it later
					queue.push(fn);
				};
				
			}()),
			
			/**
			 * XMLHttpRequest abstraction.
			 * 
			 * @return xhr { XMLHttpRequest|ActiveXObject } a new instance of either the native XMLHttpRequest object or the corresponding ActiveXObject
			 */
		 	xhr: (function() {
	
				// Create local variable which will cache the results of this function
				var xhr;
				
				return function() {
					// Check if function has already cached the value
					if (xhr) {
						// Create a new XMLHttpRequest instance
						return new xhr();
					} else {
						// Check what XMLHttpRequest object is available and cache it
						xhr = (!window.XMLHttpRequest) ? function() {
							return new ActiveXObject(
								// Internet Explorer 5 uses a different XMLHTTP object from Internet Explorer 6
								(__standardizer.isIE < 6) ? "Microsoft.XMLHTTP" : "MSXML2.XMLHTTP"
							);
						} : window.XMLHttpRequest;
						
						// Return a new XMLHttpRequest instance
						return new xhr();
					}
				};
				
			}()),
			
			/**
			 * A basic AJAX method.
			 * 
			 * @param settings { Object } user configuration
			 * @return undefined {  } no explicitly returned value
			 */
		 	ajax: function(settings) {
		 	
		 		// JavaScript engine will 'hoist' variables so we'll be specific and declare them here
		 		var xhr, url, requestDone, 
		 		
		 		// Load the config object with defaults, if no values were provided by the user
				config = {
					// The type of HTTP Request
					method: settings.method || 'POST',
					
					// The data to POST to the server
					data: settings.data || '',
				
					// The URL the request will be made to
					url: settings.url || '',
				
					// How long to wait before considering the request to be a timeout
					timeout: settings.timeout || 5000,
				
					// Functions to call when the request fails, succeeds, or completes (either fail or succeed)
					onComplete: settings.onComplete || function(){},
					onError: settings.onError || function(){},
					onSuccess: settings.onSuccess || function(){},
				
					// The data type that'll be returned from the server
					// the default is simply to determine what data was returned from the server and act accordingly.
					dataType: settings.dataType || ''
				};
				
				// Create new cross-browser XMLHttpRequest instance
				xhr = __standardizer.xhr();
				
				// Open the asynchronous request
				xhr.open(config.method, config.url, true);
				
				// Determine the success of the HTTP response
				function httpSuccess(r) {
					try {
						// If no server status is provided, and we're actually
						// requesting a local file, then it was successful
						return !r.status && location.protocol == 'file:' ||
						
						// Any status in the 200 range is good
						( r.status >= 200 && r.status < 300 ) ||
						
						// Successful if the document has not been modified
						r.status == 304 ||
						
						// Safari returns an empty status if the file has not been modified
						navigator.userAgent.indexOf('Safari') >= 0 && typeof r.status == 'undefined';
					} catch(e){
						// Throw a corresponding error
						throw new Error("httpSuccess = " + e);
					}
					
					// If checking the status failed, then assume that the request failed too
					return false;
				}
				
				// Extract the correct data from the HTTP response
				function httpData(xhr, type) {
					
					if (type === 'json') {
						// Make sure JSON parser is natively supported
						if (window.JSON !== undefined) {
							return JSON.parse(xhr.responseText);
						} 
						// IE<8 hasn't a native JSON parser so we'll need to eval() the code - dangerous I know
						else {
							return __standardizer.json(xhr.responseText);
							//return eval('(' + xhr.responseText + ')');
						}
					} 
					
					/*
					// If the specified type is "script", execute the returned text response as if it was JavaScript
					else if (type === 'script') {
						eval.call(window, xhr.responseText);
					}
					*/
					
					//
					else if (type === 'html') {
						return xhr.responseText;
					}
					
					//
					else if (type === 'xml') {
						return xhr.responseXML;
					}
					
					// Attempt to work out the content type
					else {
						// Get the content-type header
						var contentType = xhr.getResponseHeader("content-type"), 
							 data = !type && contentType && contentType.indexOf("xml") >= 0; // If no default type was provided, determine if some form of XML was returned from the server
						
						// Get the XML Document object if XML was returned from the server,
						// otherwise return the text contents returned by the server
						data = (type == "xml" || data) ? xhr.responseXML : xhr.responseText;	
						
						// Return the response data (either an XML Document or a text string)
						return data;
					}
					
				}
				
				// Initalize a callback which will fire within the timeout range, also cancelling the request (if it has not already occurred)
				window.setTimeout(function() {
					requestDone = true;
					config.onComplete();
				}, config.timeout);
				
				// Watch for when the state of the document gets updated
				xhr.onreadystatechange = function() {
				
					// Wait until the data is fully loaded, and make sure that the request hasn't already timed out
					if (xhr.readyState == 4 && !requestDone) {
						
						// Check to see if the request was successful
						if (httpSuccess(xhr)) {
							// Execute the success callback
							config.onSuccess(httpData(xhr, config.dataType));
						}
						// Otherwise, an error occurred, so execute the error callback
						else {
							config.onError(httpData(xhr, config.dataType));
						}
			
						// Call the completion callback
						config.onComplete();
						
						// Clean up after ourselves, to avoid memory leaks
						xhr = null;
						
					} else if (requestDone && xhr.readyState != 4) {
						// If the script timed out then keep a log of it so the developer can query this and handle any exceptions
						__standardizer.errors.push(url + " { timed out } ");
						
						// Bail out of the request immediately
						xhr.onreadystatechange = null;
					}
					
				};
				
				// Get if we should POST or GET...
				if (config.data) {
					// Settings
					xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
					
					// Establish the connection to the server
					xhr.send(config.data);
				} else {					
					// Establish the connection to the server
					xhr.send(null);
				}
	
			},
			
			/**
			 * hashchange event, HTML5 pushState support?
			 */
		 	history: function() {
		 		
		 	},
			
			/**
			 * Event management
			 * 
			 * Based on: addEvent/removeEvent written by Dean Edwards, 2005
			 * http://dean.edwards.name/weblog/2005/10/add-event/
			 * http://dean.edwards.name/weblog/2005/10/add-event2/
			 * 
			 * It doesn't utilises the DOM Level 2 Event Specification (http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/ecma-script-binding.html)
			 * Instead it uses the traditional DOM Level 1 methods along with a hash map object to correlate the different listeners/handlers.
			 * 
			 * Originally I had used a branching technique for add/removeEventListener (W3C) & add/detachEvent (IE).
			 * But discovered that trying to standardise the event object for a listener was impossible because it meant wrapping the callback in a function.
			 * And within that function then executing the callback and passing through a normalised event object.
			 * Problem is the removeEventListener can't remove listeners for anonymous functions.
			 * 
			 * e.g. this doesn't work...
			   
			   element.addEventListener(eventType, function(e) {
            	handler(__standardizer.events.standardize(e));
            }, false); 
            
			 */
			events: {
			
				/**
				 * A counter to generate a unique event handler ID
				 */
				id: 1,
			
				/**
				 * The add method allows us to assign a function to execute when an event of a specified type occurs on a specific element
				 * 
				 * @param element { Element/Node } the element that will have the event listener attached
				 * @param eventType { String } the event type, e.g. 'click' that will trigger the event handler
				 * @param handler { Function } the function that will execute as the event handler
				 * @return undefined {  } no explicitly returned value
				 */
				add: function(element, eventType, handler) {
					
					// Normalise user input
					eventType = eventType.toLowerCase();

					// Assign each event handler function a unique ID (via a static property '$$guid')
					if (!handler.$$guid) { 
						handler.$$guid = __standardizer.events.id++;
					}
					
					// Create hash table of event types for the element.
					// As there could be different events for the same element.
					if (!element.events) { 
						element.events = {};
					}
					
					// Create hash table of event handlers for each element/event pair
					var handlers = element.events[eventType];
					if (!handlers) {
						// If no eventType found then create empty hash for it
						handlers = element.events[eventType] = {};

						// Store the current event handler.
						// As each eventType could have multiple handlers needed to be executed for it.
						if (element["on" + eventType]) {
							handlers[0] = element["on" + eventType];
						}
					}
					
					// Store the event handler in the hash table
					handlers[handler.$$guid] = handler;
					
					// Assign a global event handler to do all the work
					element["on" + eventType] = __standardizer.events.handler;
					
				},
				
				/**
				 * The remove method allows us to remove previously assigned code from an event
				 * 
				 * @param element { Element/Node } the element that will have the event listener detached
				 * @param eventType { String } the event type, e.g. 'click' that triggered the event handler
				 * @param handler { Function } the function that was to be executed as the event handler
				 * @return undefined {  } no explicitly returned value
				 */
				remove: function(element, eventType, handler) {
				
					// Normalise user input
					eventType = eventType.toLowerCase();
					
					// Delete the event handler from the hash table
					if (element.events && element.events[eventType]) {
						delete element.events[eventType][handler.$$guid];
					}
					
				},
			
				/**
				 * This method handles the event hash map object and executes each event handler for each event type stored
				 */
				handler: function(e) {
				
					var returnValue = true,
						 handlers,
						 fn;
	
					// Standardise the event object
					e = e || window.event;
					
					// If you try and pass e to standardize method without first checking for e || window.event then a race condition issue happens with IE<8
					e = __standardizer.events.standardize(e);
					
					// Get a reference to the hash table of event handlers
					handlers = this.events[e.type];

					// Execute each event handler
					for (var i in handlers) {
						// Store current handler to be executed
						fn = handlers[i];
						
						// If after executing the function it's return value is false, then explicitly set the return value
						if (fn(e) === false) {
							returnValue = false;
						}
					}
					
					return returnValue;
					
				},
				
				/**
				 * Mimicks Event Delegation.
				 *
				 * @note this method is inefficient when checking for more than one type of tag/className.
				 *
				 * E.g. 
				 * 	st.events.delegate(container, { tag: 'form' }, 'mouseout', myFunc1);
				 * 	st.events.delegate(container, { tag: 'input' }, 'mouseout', myFunc2);
				 *
				 * This effectively is adding two event handlers onto the 'container' element, which isn't what event delegation is about!
				 * And there is no easy way to work around this (currently).
				 *
				 * @param parent { Element/Node } the element to use as the parent
				 * @param options { Object } user must provide either a className OR a 'tag name' to match by
				 * @param type { String } the event to listen for
				 * @param handler { Function } the callback function to execute when the element has been found
				 * @return undefined {  } no explicitly returned value
				 */
			 	delegate: function(parent, options, type, handler) {
			 	
			 		var searchFor = options.searchForClassName,
			 			 tag = options.tag;
			 		
			 		this.add(parent, type, function(e) {
	 					var targ = e.target,
						 	 tagname = targ.tagName.toLowerCase();
						 	 
						if (tag === undefined && searchFor === undefined) {
							throw new Error('you must provide the delegate method either a className or tagname value');
						}
						
						// Just search by className (as no tagname was provided)
						if (tag === undefined) {
			 				if (st.css.hasClass(targ, searchFor)) {
			 					handler(e);
			 				}
			 			} else {
			 				// Just search by tagname (as no className was provided)
			 				if (searchFor === undefined) {
			 					if (tagname == tag) {
									handler(e);
								}
			 				} 
			 				// Otherwise search using both className and tagname
			 				else {
			 					if (tagname == tag && st.css.hasClass(targ, searchFor)) {
									handler(e);
								}
			 				}	
			 			}
	 				});
	 				
			 	},
								
				/**
				 * The standardize method produces a unified set of event properties, regardless of the browser
				 * 
				 * @param event { Object } the event object associated with the event that was triggered
				 * @return anonymous { Object } an un-named object literal with the relevant event properties normalised
				 */
			 	standardize: function(event) { 
				
					// These two methods, defined later, return the current position of the 
					// mouse pointer, relative to the document as a whole, and relative to the 
					// element the event occurred within 
					var page = this.getMousePositionRelativeToDocument(event),
						 offset = this.getMousePositionOffset(event),
						 type = event.type;
					
					// Let's stop events from firing on element nodes above the current...
					
					// W3C method 
					if (event.stopPropagation) { 
						event.stopPropagation(); 
					} 
					
					// Internet Explorer method 
					else { 
						event.cancelBubble = true; 
					}
					
					// We return an object literal containing seven properties and one method 
					return { 
					
						// The event type
						type: type,
						
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
						preventDefault: function() {
						 
						 	// W3C method
							if (event.preventDefault) {
								event.preventDefault();
							} 
							
							// Internet Explorer method
							else { 
								event.returnValue = false; 
							} 
							
						}
						
					};
					
				},
				
				/**
				 * The getTarget method locates the element the event occurred on
				 * 
				 * @param event { Object } the event object associated with the event that was triggered
				 * @return target { Element/Node } the element that was the target of the triggered event
				 */
			 	getTarget: function(event) { 
				
					// Internet Explorer value is srcElement, W3C value is target 
					var target = event.srcElement || event.target; 
					
					// Window resize event causes 'undefined' value for target
					if (target !== undefined) {
						// Fix legacy Safari bug which reports events occurring on a text node instead of an element node 
						if (target.nodeType == 3) { // 3 denotes a text node 
							target = target.parentNode; // Get parent node of text node 
						}
					}
					
					// Return the element node the event occurred on 
					return target;
					 
				},
				
				/**
				 * The getCharacterFromKey method returns the character pressed when keyboard events occur. 
				 * You should use the keypress event as others vary in reliability
				 * 
				 * @param event { Object } the event object associated with the event that was triggered
				 * @return character { String } the character pressed when keyboard events occurred
				 */
			 	getCharacterFromKey: function(event) {
				 
					var character = "",
						 keycode; 
					
					// Internet Explorer 
					if (event.keyCode) {
						keycode = event.keyCode;
						character = String.fromCharCode(event.keyCode); 
					} 
					
					// W3C 
					else if (event.which) {
						keycode = event.which;
						character = String.fromCharCode(event.which); 
					} 
					
					return { code:keycode, character:character };
					
				},
				
				/**
				 * The getMousePositionRelativeToDocument method returns the current mouse pointer position relative to the top left edge of the current page.
				 * 
				 * @param event { Object } the event object associated with the event that was triggered
				 * @return anonymous { Object } the x and y coordinates
				 */
			 	getMousePositionRelativeToDocument: function(event) { 
					
					var x = 0, y = 0; 
					
					// pageX gets coordinates of pointer from left of entire document 
					if (event.pageX) { 
						x = event.pageX; 
						y = event.pageY; 
					} 
					
					// clientX gets coordinates from left of current viewable area 
					// so we have to add the distance the page has scrolled onto this value 
					else if (event.clientX) { 
						x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
						y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
					}
					
					// Return an object literal containing the x and y mouse coordinates 
					return { 
						x: x, 
						y: y 
					};
					
				},
				
				/**
				 * The getMousePositionOffset method returns the distance of the mouse pointer from the top left of the element the event occurred on
				 * 
				 * @param event { Object } the event object associated with the event that was triggered
				 * @return anonymous { Object } the x and y coordinates of the mouse relative to the element
				 */
			 	getMousePositionOffset: function(event) {
				 
					var x = 0, y = 0; 
				
					if (event.layerX) { 
						x = event.layerX; 
						y = event.layerY; 
					}
					
					// Internet Explorer proprietary
					else if (event.offsetX) { 
						x = event.offsetX; 
						y = event.offsetY; 
					} 
					
					// Returns an object literal containing the x and y coordinates of the mouse relative to the element the event fired on 
					return { 
						x: x, 
						y: y 
					};
					
				},
				
				/**
				 * The getRelatedTarget method returns the element node the event was set up to fire on, 
				 * which can be different from the element the event actually fired on
				 * 
				 * @param event { Object } the event object associated with the event that was triggered
				 * @return relatedTarget { Element/Node } the element the event was set up to fire on
				 */
			 	getRelatedTarget: function(event) { 
				
					var relatedTarget = event.relatedTarget; 
					
					// With mouseover events, relatedTarget is not set by default 
					if (event.type == "mouseover") { 
						relatedTarget = event.fromElement; 
					} 
					
					// With mouseout events, relatedTarget is not set by default
					else if (event.type == "mouseout") { 
						relatedTarget = event.toElement; 
					}
					
					return relatedTarget; 
					
				}
				
			},
			
			utilities: {
			
				/**
				 * The toCamelCase method takes a hyphenated value and converts it into a camel case equivalent.
				 * e.g. margin-left becomes marginLeft. 
				 * Hyphens are removed, and each word after the first begins with a capital letter.
				 * 
				 * @param hyphenatedValue { String } hyphenated string to be converted
				 * @return result { String } the camel case version of the string argument
				 */
			 	toCamelCase: function(hyphenatedValue) { 
					
					var result = hyphenatedValue.replace(/-\D/g, function(character) { 
						return character.charAt(1).toUpperCase(); 
					}); 
					
					return result;
					 
				}, 
				
				/**
				 * The toHyphens method performs the opposite conversion, taking a camel case string and converting it into a hyphenated one.
				 * e.g. marginLeft becomes margin-left
				 * 
				 * @param camelCaseValue { String } camel cased string to be converted
				 * @return result { String } the hyphenated version of the string argument
				 */
			 	toHyphens: function(camelCaseValue) { 
					
					var result = camelCaseValue.replace(/[A-Z]/g, function(character) { 
						return ('-' + character.charAt(0).toLowerCase()); 
					});
				
					return result; 

				},
				
				/**
				 * The following method truncates a string by the length specified.
				 * The second argument is the suffix (e.g. rather than ... you could have !!!)
				 *
				 * @param str { String } the string to 
				 * @param length { Integer } the length the string should be (if none specified a default is used)
				 * @param suffix { String } default value is ... but can be overidden with any number of characters
				 * @return { String } the modified String value
				 */
				truncate: function(str, length, suffix) {
					length = length || 30;
					suffix = (typeof suffix == "undefined") ? '...' : suffix;
					
					// If the string isn't longer than the specified cut-off length then just return the original string
					return (str.length > length) 
						// Otherwise, we borrow the String object's "slice()" method using the "call()" method
						? String.prototype.slice.call(str, 0, length - suffix.length) + suffix
						: str;
				},
				
				/**
				 * The following method inserts a specified element node into the DOM after the specified target element node.
				 * For some reason the DOM api provides different methods to acheive this functionality but no actual native method?
				 *
				 * @param newElement { Element/Node } new element node to be inserted
				 * @param targetElement { Element/Node } target element node where the new element node should be inserted after
				 * @return undefined {  } no explicitly returned value
				 */
				insertAfter: function(newElement, targetElement) {
					var parent = targetElement.parentNode;
					
					(parent.lastChild == targetElement) 
						? parent.appendChild(newElement) 
						: parent.insertBefore(newElement, targetElement.nextSibling);
					
				},
				
				/**
				 * The following method creates a new element or returns a copy of an element already created by this script.
				 *
				 * @param tagname { String } element to be created/copied
				 * @return { Element/Node } the newly created element
				 */
				createElement: function(tagname) {
					// Memorize previous elements created
					this.memory = this.memory || {};
					
					if (tagname in this.memory) {
						// If we've already created an element of the specified kind then duplicate it
						return this.memory[tagname].cloneNode(true);
					} else {
						// Create new instance of specified element and store it
						this.memory[tagname] = document.createElement(tagname);
						return this.memory[tagname].cloneNode(true);
					}
				},
				
				/**
				 * The following method returns the height of the document/page.
				 * If the actual document’s body height is less than the viewport height then it will return the viewport height instead.
				 *
				 * @return { Integer } the height of the document/page ()
				 */
				getDocHeight: (function() {
					var doc = document,
						 body = doc.body,
						 elem = doc.documentElement;
						 
					return Math.max(
						Math.max(body.scrollHeight, elem.scrollHeight),
						Math.max(body.offsetHeight, elem.offsetHeight),
						Math.max(body.clientHeight, elem.clientHeight)
					);
				}()),
				
				/**
				 * The following method isn't callable via the 'utilities' namespace.
				 * It actually modifies the native Function object so as to mimic the functionality of new ECMAScript5 feature known as 'function binding'.
				 * Similar functionality can be carried out with the standard Function.apply/call, but bind() is more flexible and easier syntax.
				 *
				 * @reference https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
				 */
			 	bind: (function() { 
					
					if (!Function.prototype.bind) {
						Function.prototype.bind = function(obj) {
						
							var slice = [].slice,
								 args = slice.call(arguments, 1),
								 self = this,
								 nop = function(){},
								 bound = function() {
								 	return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
								 };
							
							nop.prototype = self.prototype;
							bound.prototype = new nop();
							return bound;

						};
					}
					
				}()),
				
				/**
				 * The following method is a Constructor with additional methods attached to the prototype
				 * which aid every time you need to check whether a property is present in an object.
				 * We approach an object as just a set of properties.
				 * And because we can use it to look things up by name, we will call it a 'Dictionary'.
				 * Lastly, as it's a constructor we'll use the correct naming convention of using a capitalised first letter.
				 *
				 * @notes for the prototype object see near bottom of script (after this __standardizer object definition has ended).
				 * @param {} x
				 * @return {} x
				 */
				Dictionary: function(startValues) {
					this.values =  startValues || {};
				}
				
			},
			
			css: {
			
				/**
				 * The getAppliedStyle method returns the current value of a specific CSS style property on a particular element
				 * 
				 * @param element { Element/Node } the element we wish to find the style value for
				 * @param styleName { String } the specific style property we're interested in
				 * @return style { String } the value of the style property found
				 */
			 	getAppliedStyle: function(element, styleName) {
			 	 
					var style = "";
					
					if (window.getComputedStyle) { 
						//  W3C specific method. Expects a style property with hyphens 
						style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue(__standardizer.utilities.toHyphens(styleName)); 
					} 
					
					else if (element.currentStyle) { 
						// Internet Explorer-specific method. Expects style property names in camel case 
						style = element.currentStyle[__standardizer.utilities.toCamelCase(styleName)]; 
					}
					  
					return style;
					
				},
				
				/**
				 * The getArrayOfClassNames method is a utility method which returns an array of all the CSS class names assigned to a particular element.
				 * Multiple class names are separated by a space character
				 * 
				 * @param element { Element/Node } the element we wish to retrieve class names for
				 * @return classNames { String } a list of class names separated with a space in-between
				 */
			 	getArrayOfClassNames: function(element) {
			 	
					var classNames = []; 
					
					if (element.className) { 
						// If the element has a CSS class specified, create an array 
						classNames = element.className.split(' '); 
					} 
					
					return classNames;
					
				},
				
				/**
				 * The addClass method adds a new CSS class of a given name to a particular element
				 * 
				 * @param element { Element/Node } the element we want to add a class name to
				 * @param className { String } the class name we want to add
				 * @return undefined {  } no explicitly returned value
				 */
			 	addClass: function(element, className) {
			 	
					// Get a list of the current CSS class names applied to the element 
					var classNames = this.getArrayOfClassNames(element); 
					
					// Make sure the class doesn't already exist on the element
				   if (this.hasClass(element, className)) {
				   	return;
				   }
				   
					// Add the new class name to the list 
					classNames.push(className);
					
					// Convert the list in space-separated string and assign to the element 
					element.className = classNames.join(' '); 
					
				},
				
				/**
				 * The removeClass method removes a given CSS class name from a given element
				 * 
				 * @param element { Element/Node } the element we want to remove a class name from
				 * @param className { String } the class name we want to remove
				 * @return undefined {  } no explicitly returned value
				 */
			 	removeClass: function(element, className) { 
			 	
					var classNames = this.getArrayOfClassNames(element),
						 resultingClassNames = []; // Create a new array for storing all the final CSS class names in 
			        
					for (var index = 0, len = classNames.length; index < len; index++) { 
					
						// Loop through every class name in the list 
						if (className != classNames[index]) { 
						
							// Add the class name to the new list if it isn't the one specified 
							resultingClassNames.push(classNames[index]); 
							
						} 
						
					}
					  
					// Convert the new list into a  space- separated string and assign it 
					element.className = resultingClassNames.join(" "); 
					
				},
				
				/**
				 * The hasClass method returns true if a given class name exists on a specific element, false otherwise
				 * 
				 * @param element { Element/Node } the element we want to check whether a class name exists on
				 * @param className { String } the class name we want to check for
				 * @return isClassNamePresent { Boolean } if class name was found or not
				 */
			 	hasClass: function(element, className) { 
			 	
					// Assume by default that the class name is not applied to the element 
					var isClassNamePresent = false,
						 classNames = this.getArrayOfClassNames(element); 
			        
					for (var index = 0, len = classNames.length; index < len; index++) { 
					
						// Loop through each CSS class name applied to this element 
						if (className == classNames[index]) { 
						
							// If the specific class name is found, set the return value to true 
							isClassNamePresent = true; 
							
						} 
						
					} 
			        
					// Return true or false, depending on if the specified class name was found 
					return isClassNamePresent; 
					
				}
				
			},
			
			/**
			 * The function defined here has been modified from the source by @ded (https://github.com/ded/morpheus/)
			 * TODO: Consider re-implementing a CSSTransitions fallback (as per my previous version which originally used emile.js by @thomasfuchs
			 */
			animation: (function(context, doc, win) {
			
				/* The equations defined here are open source under BSD License.
				 * http://www.robertpenner.com/easing_terms_of_use.html (c) 2003 Robert Penner
				 * Adapted to single time-based by
				 * Brian Crescimanno <brian.crescimanno@gmail.com>
				 * Ken Snyder <kendsnyder@gmail.com>
				 */
				var easings = {
  					easeOut: function (t) {
						return Math.sin(t * Math.PI / 2);
					},

					easeOutStrong: function (t) {
						return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t);
					},
					
					easeIn: function (t) {
						return t * t;
					},
					
					easeInStrong: function (t) {
						return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
					},
					
					easeOutBounce: function(pos) {
						if ((pos) < (1/2.75)) {
							return (7.5625*pos*pos);
						} else if (pos < (2/2.75)) {
							return (7.5625*(pos-=(1.5/2.75))*pos + .75);
						} else if (pos < (2.5/2.75)) {
							return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
						} else {
							return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
						}
					},
					
					easeInBack: function(pos){
						var s = 1.70158;
						return (pos)*pos*((s+1)*pos - s);
					},
					
					easeOutBack: function(pos){
						var s = 1.70158;
						return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
					},
					
					bounce: function(t) {
						if (t < (1 / 2.75)) {
							return 7.5625 * t * t;
						}
						if (t < (2 / 2.75)) {
							return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
						}
						if (t < (2.5 / 2.75)) {
							return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
						}
						return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
					},
					
					bouncePast: function(pos) {
						if (pos < (1 / 2.75)) {
							return (7.5625 * pos * pos);
						} else if (pos < (2 / 2.75)) {
							return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
						} else if (pos < (2.5 / 2.75)) {
							return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
						} else {
							return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
						}
					},
					
					swingTo: function(pos) {
						var s = 1.70158;
						return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
					},
					
					swingFrom: function(pos) {
						var s = 1.70158;
						return pos * pos * ((s + 1) * pos - s);
					},
					
					elastic: function(pos) {
						return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
					},
					
					spring: function(pos) {
						return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
					},
					
					blink: function(pos, blinks) {
						return Math.round(pos*(blinks||5)) % 2;
					},
					
					pulse: function(pos, pulses) {
						return (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5;
					},
					
					wobble: function(pos) {
						return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
					},
					
					sinusoidal: function(pos) {
						return (-Math.cos(pos*Math.PI)/2) + 0.5;
					},
					
					flicker: function(pos) {
						var pos = pos + (Math.random()-0.5)/5;
						return easings.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
					},
					
					mirror: function(pos) {
						if (pos < 0.5) {
							return easings.sinusoidal(pos*2);
						} else {
							return easings.sinusoidal(1-(pos-0.5)*2);
						}
					}

				};

				var px = 'px',
					 html = doc.documentElement,
					 opasity = function () {
					 	return typeof doc.createElement('a').style.opacity !== 'undefined';
					 }(),
					 unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1 },
					 getStyle = doc.defaultView && doc.defaultView.getComputedStyle 
					 	? function (el, property) {
								var value = null;
			          		var computed = doc.defaultView.getComputedStyle(el, '');
			          		computed && (value = computed[camelize(property)]);
			          		return el.style[property] || value;
			        	  } 
			         : html.currentStyle 
			         ? function (el, property) {
								property = camelize(property);
			
			          		if (property == 'opacity') {
									var val = 100;
									try {
				              		val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
				            	} catch (e1) {
				              		try {
				                		val = el.filters('alpha').opacity;
				              		} catch (e2) {}
				            	}
			            		return val / 100;
			          		}
			          		
			          		var value = el.currentStyle ? el.currentStyle[property] : null;
			          		return el.style[property] || value;
			        	  }
			         : function (el, property) {
			         		return el.style[camelize(property)];
			        	  },
			
					 rgb = function (r, g, b) {
							return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
					 },
			
					 toHex = function (c) {
							var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
			        		return (m ? rgb(m[1], m[2], m[3]) : c).replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3'); // short to long
					 },
			
					 // change font-size => fontSize etc.
					 camelize = function (s) {
							return s.replace(/-(.)/g, function (m, m1) {
								return m1.toUpperCase();
							});
					 },
			
				frame = (function() {
					// native animation frames
					// http://webstuff.nfshost.com/anim-timing/Overview.html
					// http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
					return win.requestAnimationFrame 		|| 
							 win.webkitRequestAnimationFrame || 
							 win.mozRequestAnimationFrame    || 
							 win.oRequestAnimationFrame      || 
							 win.msRequestAnimationFrame     || 
							 function(callback) {
							 	win.setTimeout(function () {
									callback(+new Date());
								}, 10);
							 };
				}());
				
				function tween(duration, fn, done, ease, from, to) {
					ease = ease || function (t) {
			      	// default to a pleasant-to-the-eye easeOut (like native animations)
			      	return Math.sin(t * Math.PI / 2)
			    	};
			    	var time = duration || 1000,
						 diff = to - from,
						 start = +new Date();
			    
					frame(run);
			
					function run(t) {
						var delta = t - start;
			      	if (delta > time) {
							fn(isFinite(to) ? to : 1);
							done && done();
							return;
			      	}
			      
			      	// if you don't specify a 'to' you can use tween as a generic delta tweener
			      	// cool, eh?
						to ? fn((diff * ease(delta / time)) + from) 
							: fn(ease(delta / time));
			      
			      	frame(run);
					}
				}
			
				// this gets you the next hex in line according to a 'position'
				function nextColor(pos, start, finish) {
					var r = [], i, e;
					for (i = 0; i < 6; i++) {
				      from = Math.min(15, parseInt(start.charAt(i),  16));
				      to   = Math.min(15, parseInt(finish.charAt(i), 16));
				      e = Math.floor((to - from) * pos + from);
				      e = e > 15 ? 15 : e < 0 ? 0 : e;
			      	r[i] = e.toString(16);
					}
					return '#' + r.join('');
				}
			
				function getVal(pos, options, begin, end, k, i, v) {
					if (typeof begin[i][k] == 'string') {
						return nextColor(pos, begin[i][k], end[i][k]);
					} else {
						// round so we don't get crazy long floats
						v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * 1000) / 1000;
						
						// some css properties don't require a unit (like zIndex, lineHeight, opacity)
						!(k in unitless) && (v += px);
						return v;
					}
				}
			
				// support for relative movement via '+=n' or '-=n'
				function by(val, start, m, r, i) {
			   	return (m = /^([+\-])=([\d\.]+)/.exec(val)) 
			   		? (i = parseInt(m[2], 10)) && (r = (start + i)) && m[1] == '+' 
			   			? r 
			   			: start - i 
			   		: parseInt(val, 10);
				}
			
				/**
			    * morpheus: main API method
			    * elements: HTMLElement(s)
			    * options: mixed bag between CSS Style properties & animation options
			    *  - duration: time in ms - defaults to 1000ms
			    *  - easing: a transition method - defaults to an 'easeOut' algorithm
			    *  - complete: a callback method for when all elements have finished
			    */
				function morpheus(elements, options) {
					var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], i,
			      	 complete = options.complete,
			        	 duration = options.duration,
			        	 ease = easings[options.easing] || easings.easeIn,
			        	 begin = [],
			        	 end = [];
			        	 
					delete options.complete;
					delete options.duration;
					delete options.easing;
			
					for (i = els.length; i--;) {
				      // record beginning and end states to calculate positions
				      begin[i] = {};
				      end[i] = {};
				      
				      for (var k in options) {
				      	var v = getStyle(els[i], k);
				        	begin[i][k] = typeof options[k] == 'string' && options[k].charAt(0) == '#' ?
								v == 'transparent' ? // default to 'white' if transparent (fairly safe bet)
				            'ffffff' :
				            toHex(v).slice(1) : parseFloat(v, 10);
							end[i][k] = typeof options[k] == 'string' && options[k].charAt(0) == '#' ? toHex(options[k]).slice(1) : by(options[k], parseFloat(v, 10));
				      }
				      
					}
			    
					// one tween to rule them all
			    	tween(duration, function (pos, v) {
						// normally not a fan of optimizing for() loops, but we want something fast for animating
						for (i = els.length; i--;) {
							for (var k in options) {
								v = getVal(pos, options, begin, end, k, i);
								k == 'opacity' && !opasity 
									? (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') 
									: (els[i].style[camelize(k)] = v);
							}
						}
					}, complete, ease);
				}
			
				morpheus.tween = tween;
				
				return morpheus;
			
			}(this, document, window)),
			
			/**
			 * An event emitter facility which provides the observer(Publisher/Subscriber) design pattern to javascript objects
			 * Doesn't rely on the browser DOM. Super Simple.
			 *
			 * Modified from: 
			 * https://github.com/jeromeetienne/microevent.js/blob/master/microevent.js
			 *
			 * @notes All methods are added via the prototype chain (see below)
			 */
		 	observer: function(){}
			
		};
		
		__standardizer.observer.prototype = {
			
			bind: function(event, fct) {
			
				this._events = this._events || {};
				this._events[event] = this._events[event]	|| [];
				this._events[event].push(fct);
				
			},
			
			unbind: function(event, fct) {
			
				this._events = this._events || {};
				
				if( event in this._events === false) {	
					return;
				}
				
				this._events[event].splice(this._events[event].indexOf(fct), 1);
				
			},
			
			trigger: function(event /* , args... */) {
				
				this._events = this._events || {};
				
				if (event in this._events === false) {
					return
				};
				
				for(var i = 0; i < this._events[event].length; i++) {
					this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
				}
				
			}
			
		};
		
		/**
		 * This method will delegate all event emitter functions to the destination object
		 *
		 * @param destObject { Object } the object which will support MicroEvent
		 * @return undefined {  } no explicitly returned value
		 */
		__standardizer.observer.mixin = function(destObject) {
		
			var props	= ['bind', 'unbind', 'trigger'];
			
			for(var i = 0; i < props.length; i ++){
				destObject.prototype[props[i]] = __standardizer.observer.prototype[props[i]];
			}
			
		}
		
		// Here follows is the prototype for the Dictionary Constructor
		// See: __standardizer.utilities.dictionary
		__standardizer.utilities.Dictionary.prototype = {
			
			/**
			 * s
			 * 
			 * @param name {} x
			 * @param value {} x
			 * @return 
			 */
			store: function(name, value) {
				this.values[name] = value;
			},
			
			/**
			 * s
			 * 
			 * @param name {} x
			 * @return
			 */
			lookup: function(name) {
				return this.values[name];
			},
			
			/**
			 * s
			 * 
			 * @param name {} x
			 * @return
			 */
			contains: function(name) {
				return Object.prototype.hasOwnProperty.call(this.values, name) && 
						 Object.prototype.propertyIsEnumerable.call(this.values, name);
			},
			
			/**
			 * The following method executes a function for every property in this object.
			 * 
			 * @param action { Function } a user specified callback function to execute for each property in this object
			 * @return undefined {  } no explicitly returned value
			 */
			each: function(action) {
				var object = this.values;
				for (var property in object) {
					if (object.hasOwnProperty(property)) {
						action(property, object[property]);
					}
				}
			},
			
			/**
			 * The following method returns an Array of all property names within an object.
			 * 
			 * @return names { Array } a list of all property names in this object
			 */
			names: function() {
				var names = [];
				
				this.each(function(name, value) {
					names.push(name);
				});
				
				return names;
			}
			
		};
	
		// Return public API
		return {
			ondomready: __standardizer.domready,
			load: __standardizer.ajax,
			events: __standardizer.events,
			utils: __standardizer.utilities,
			css: __standardizer.css,
			observe: __standardizer.observer,
			anim: __standardizer.animation
		};
		
	}());
	
	// Expose st to the global object
	window.st = standardizer;
	
}(this, this.document));