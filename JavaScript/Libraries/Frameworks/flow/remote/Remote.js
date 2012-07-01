/*
Namespace: The Remote Namespace
	All internal references use the Flow namespace.

About: Version
	1.1.1

License:
	- Sergey Ilinsky's cross-browser XHR solution <http://www.ilinsky.com>. Licensed under the Apache License, Version 2.0 <http://www.apache.org/licenses/LICENSE-2.0>.
	
	- Modified by Richard Herrera <http://doctyper.com>
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Flow.js.
*/

/*
Class: Remote
	These functions are bound to _elements_.

Example:
	(start code)
	var foo = document.getElementById("foo");
	var ani = new Flow.Animate({
		node : foo,
		from : {
			height : 10,
			width : 10
		},
		to : {
			height : 200,
			width : 200
		},
		tween : "Expo.inout"
	}, 1).start();
	(end code)
*/
/*
Property: XMLHttpRequest
	This is the standard XHR call. However, this implementation has a major drawback:
		- Safari 2 and IE 7 do not support overwriting XMLHttpRequest. As such, this functionality is limited to the implementation of those browsers (no flags).

Parameters:
	type - the type of event to bind.
	handler - the event to bind.
	useCapture - turn event bubbling on/off.

Example:
	(start code)
	var req = new XMLHttpRequest();
	req.open("GET", "foo.xml", true);
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200 || req.status == 304) {
				console.log(req.responseXML); // req = XHR object
			} else {
				console.log(req.status); // 404'd
			}
		}
	}
	req.send(null);
	(end code)
*/
/*
Property: HttpRequest
	A non-standard property with standards-compliant behavior. Use HttpRequest if you'd like all functionality detailed in the specs. Also contains several helper functions for a drastic reduction in code.

Parameters:
	type - the type of event to bind.
	handler - the event to bind.
	useCapture - turn event bubbling on/off.

Example:
	(start code)
	var req = new HttpRequest();
	req.open("GET", "foo.xml", true);
	req.onsuccess = function() {
		console.log(this.responseXML); // this = XHR object
	}
	req.onerror = function() {
		console.log(this.status); // 404'd
	}
	req.send();
	(end code)
*/

new Flow.Plugin({
	name : "Remote",
	version : "1.1.1",
	constructor : 
	
	// Copyright 2007 Sergey Ilinsky (http://www.ilinsky.com)
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//   http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	function () {

		// Save reference to earlier defined object implementation (if any)
		var oXMLHttpRequest = window.XMLHttpRequest;

		// Define on browser type
		var B = Flow.Browser;
		
		var bGecko = B.GK,
		    bIE = B.IE;

		// Constructor
		var cXMLHttpRequest = function() {
			this._object = oXMLHttpRequest ? new oXMLHttpRequest : new window.ActiveXObject('Microsoft.XMLHTTP');
		};

		// BUGFIX: Firefox with Firebug installed would break pages if not executed
		if (bGecko && oXMLHttpRequest.wrapped) {
			cXMLHttpRequest.wrapped = oXMLHttpRequest.wrapped;
		}

		// Constants
		cXMLHttpRequest.UNSENT = 0;
		cXMLHttpRequest.OPENED = 1;
		cXMLHttpRequest.HEADERS_RECEIVED = 2;
		cXMLHttpRequest.LOADING = 3;
		cXMLHttpRequest.DONE = 4;

		// Public Properties
		cXMLHttpRequest.prototype.readyState = cXMLHttpRequest.UNSENT;
		cXMLHttpRequest.prototype.responseText = "";
		cXMLHttpRequest.prototype.responseXML = null;
		cXMLHttpRequest.prototype.status = 0;
		cXMLHttpRequest.prototype.statusText = "";

		// Instance-level Events Handlers
		cXMLHttpRequest.prototype.onreadystatechange = null;

		// Class-level Events Handlers
		cXMLHttpRequest.onreadystatechange = null;
		cXMLHttpRequest.onopen = null;
		cXMLHttpRequest.onsend = null;
		cXMLHttpRequest.onabort = null;
		
		// Custom functions
		cXMLHttpRequest.onsuccess = null;
		cXMLHttpRequest.onerror = null;

		// Public Methods
		cXMLHttpRequest.prototype.open = function(sMethod, sUrl, bAsync, sUser, sPassword) {

			// Save async parameter for fixing Gecko bug with missing readystatechange in synchronous requests
			this._async = bAsync;
			this.url	= sUrl;
			this.async = bAsync;

			if (this.query) {
				var query = (/\?/.test(this.url)) ? "&" : "?",
				    qArray = [];

				for (var i in this.query) {
					if (this.query.hasOwnProperty(i)) {
						qArray.push(i + "=" + this.query[i]);
					}
				}
				sUrl += query + qArray.join("&");
				this.url = sUrl;
			}

			// Set the onreadystatechange handler
			var oRequest = this,
				nState = this.readyState;

			// BUGFIX: IE - memory leak on page unload (inter-page leak)
			if (bIE) {
				var fOnUnload = function() {
					if (oRequest._object.readyState != cXMLHttpRequest.DONE) {
						fCleanTransport(oRequest);
					}
				};
				if (bAsync) {
					window.attachEvent("onunload", fOnUnload);
				}
			}

			this._object.onreadystatechange = function() {
				if (bGecko && !bAsync) {
					return;
				}

				// Synchronize state
				oRequest.readyState = oRequest._object.readyState;

				//
				fSynchronizeValues(oRequest);

				// BUGFIX: Firefox fires unneccesary DONE when aborting
				if (oRequest._aborted) {
					// Reset readyState to UNSENT
					oRequest.readyState = cXMLHttpRequest.UNSENT;

					// Return now
					return;
				}

				if (oRequest.readyState == cXMLHttpRequest.DONE) {
					//
					fCleanTransport(oRequest);
					
					// Uncomment this block if you need a fix for IE cache
	
					// BUGFIX: IE - memory leak in interrupted
					if (bIE && bAsync) {
						window.detachEvent("onunload", fOnUnload);
					}
				}

				// BUGFIX: Some browsers (Internet Explorer, Gecko) fire OPEN readystate twice
				if (nState != oRequest.readyState) {
					fReadyStateChange(oRequest);
				}

				nState = oRequest.readyState;
			};

			// Add method sniffer
			if (cXMLHttpRequest.onopen) {
				cXMLHttpRequest.onopen.apply(this, arguments);
			}

			this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);

			// BUGFIX: Gecko - missing readystatechange calls in synchronous requests
			if (!bAsync && bGecko) {
				this.readyState = cXMLHttpRequest.OPENED;

				fReadyStateChange(this);
			}
		};
		cXMLHttpRequest.prototype.send = function(vData) {
			// Add method sniffer
			if (cXMLHttpRequest.onsend) {
				cXMLHttpRequest.onsend.apply(this, arguments);
			}

			// BUGFIX: Safari - fails sending documents created/modified dynamically, so an explicit serialization required
			// BUGFIX: IE - rewrites any custom mime-type to "text/xml" in case an XMLNode is sent
			// BUGFIX: Gecko - fails sending Element (this is up to the implementation either to standard)
			if (vData && vData.nodeType) {
				vData = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
				if (!this._headers["Content-Type"]) {
					this._object.setRequestHeader("Content-Type", "application/xml");
				}
			}

			this._object.send(vData);

			// BUGFIX: Gecko - missing readystatechange calls in synchronous requests
			if (bGecko && !this._async) {
				this.readyState = cXMLHttpRequest.OPENED;

				// Synchronize state
				fSynchronizeValues(this);

				// Simulate missing states
				while (this.readyState < cXMLHttpRequest.DONE) {
					this.readyState++;
					fReadyStateChange(this);
					// Check if we are aborted
					if (this._aborted) {
						return;
					}
				}
			}
		};
		cXMLHttpRequest.prototype.abort = function() {
			// Add method sniffer
			if (cXMLHttpRequest.onabort) {
				cXMLHttpRequest.onabort.apply(this, arguments);
			}

			// BUGFIX: Gecko - unneccesary DONE when aborting
			if (this.readyState > cXMLHttpRequest.UNSENT) {
				this._aborted = true;
			}

			this._object.abort();

			// BUGFIX: IE - memory leak
			fCleanTransport(this);
		};

		// Custom functions
		cXMLHttpRequest.prototype.setquery = function(name, value) {
			var that = this;

			that.query = that.query || {};
			if (typeof name === "object") {
				for (var i in name) {
					if (name.hasOwnProperty(i)) {
						that.query[i] = name[i];
					}
				}
			} else {
				that.query[name] = value;
			}
		};
		
		cXMLHttpRequest.prototype.addEventListener = function(type, event) {
			return cXMLHttpRequest.prototype["on" + type] = event;
		};
		
		cXMLHttpRequest.prototype.getAllResponseHeaders = function() {
			return this._object.getAllResponseHeaders();
		};
		cXMLHttpRequest.prototype.getResponseHeader = function(sName) {
			return this._object.getResponseHeader(sName);
		};
		cXMLHttpRequest.prototype.setRequestHeader = function(sName, sValue) {
			// BUGFIX: IE - cache issue
			if (!this._headers) {
				this._headers = {};
			}
			this._headers[sName] = sValue;

			return this._object.setRequestHeader(sName, sValue);
		};
		cXMLHttpRequest.prototype.toString = function() {
			return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
		};
		cXMLHttpRequest.toString = function() {
			return '[' + "XMLHttpRequest" + ']';
		};

		// Helper function
		var fReadyStateChange = function(oRequest) {
			// Execute onreadystatechange
			if (oRequest.onreadystatechange) {
				oRequest.onreadystatechange.apply(oRequest);
			}

			// Sniffing code
			if (cXMLHttpRequest.onreadystatechange) {
				cXMLHttpRequest.onreadystatechange.apply(oRequest);
			}

			// Custom functions
			if (oRequest.readyState == cXMLHttpRequest.DONE) {
				// Execute onsuccess
				if (oRequest.onsuccess && (oRequest.status == 200 || oRequest.status == 304)) {
					oRequest.onsuccess.apply(oRequest);
				}
				// Execute onerror
				if (oRequest.onerror && oRequest.status == 404) {
					oRequest.onerror.apply(oRequest);
				}
			}
		};

		var fGetDocument = function(oRequest) {
			var oDocument = oRequest.responseXML;
			// Try parsing responseText
			if (bIE && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
				oDocument = new ActiveXObject('Microsoft.XMLDOM');
				oDocument.loadXML(oRequest.responseText);
			}
			// Check if there is no error in document
			if (oDocument) {
				if ((bIE && oDocument.parseError !== 0) || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror")) {
					return null;
				}
			}
			return oDocument;
		};

		var fSynchronizeValues = function(oRequest) {
			try {
				oRequest.responseText = oRequest._object.responseText;
			} catch (e) {}
			
			try {
				oRequest.responseXML = fGetDocument(oRequest._object);
			} catch (e) {}
			
			try {
				oRequest.status = oRequest._object.status;
			} catch (e) {}
			
			try {
				oRequest.statusText = oRequest._object.statusText;
			} catch (e) {}
		};

		var fCleanTransport = function(oRequest) {
			// BUGFIX: IE - memory leak (on-page leak)
			oRequest._object.onreadystatechange = new window.Function;

			// Delete private properties
			delete oRequest._headers;
		};

		// Register new object with window
		window.XMLHttpRequest = window.HttpRequest = cXMLHttpRequest;
	}()
	
});