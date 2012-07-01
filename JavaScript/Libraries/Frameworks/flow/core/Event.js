/*
Namespace: The Event Namespace
	Never again worry about memory leaks. Event automagically garbage-collects any node you remove/replace, and flushes event listeners on unload. In addition, Event brings native event handling API support.

About: Version
	1.1.1

License:
	- Some parts of _addEventListener_ based on Dean Edwards' event methods <http://dean.edwards.name/weblog/2005/10/add-event/>
	  and Tino Zijdel's subsequent modifications <crisp@xs4all.nl>
	
	- Some parts of _cache_ based on Mark Wubben's EventCache Version 1.0 <http://novemberborn.net/javascript/event-cache>.
	  Licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>.
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Flow.js.
*/
new Flow.Plugin({
	name : "Event",
	version : "1.1.1",
	bind : true,
	constructor : function() {
		var F = Flow,
		    B = F.Browser,
		    E = F.Event,
		    U = F.Utils,
		    C = F.CustomEvent,
		    that,
		    UNIQUE = 1,
		    doc = document,
		    readyState = "readyState",
		    ContentLoaded = /ContentLoaded/;
		
		var isFB = function() {
			return !!(window.console && window.console.firebug);
		}();
		
		return {

			/*
			Interface: Element
				These functions are bound to _elements_.
			*/
			nodes : {
				/*
				Property: addEventListener
					http://developer.mozilla.org/en/docs/DOM:element.addEventListener

				Parameters:
					type - the type of event to bind.
					handler - the event to bind.
					useCapture - turn event bubbling on/off.

				Example:
					(start code)
					var foo = document.getElementsByClassName("foo");
					var ZOMG = function(e) {
						console.log("zomg");
						e.preventDefault();
					};
					foo.addEventListener("click", ZOMG, false);
					(end code)
				*/
				addEventListener : function (type, handler, useCapture) {
					E = E || F.Event;

					// Add event to cache (avoid memory leaks)
					E.cache.add(this, type, handler, useCapture);
					
					if ((type == "DOMContentLoaded") && (B.IE || B.WK)) {
						if (B.WK) {
							E.stack.push(handler);
							var timer = setInterval(function() {
								if (/loaded|complete/.test(doc[readyState])) {
									clearInterval(timer);
									E.fire();
								}
							}, 10);
						} else if (B.IE) {
							E.stack.push(handler);
							
							// Write in a trigger for IE.
							// IE supports the defer attribute, which allows this to load when the DOM is ready.
							// aka: onDOMContentLoaded
							doc.write("<script id=_ready defer src=//:><\/script>");

							// Target the trigger.
							doc.all._ready.onreadystatechange = function() {
								// Access IE's readyState property.
								// Once complete, remove trigger, compile and fire our list of events.
								if (this.readyState == "complete") {
									this.removeNode();
									Flow.Event.fire();
								}
							};
						}
					} else {
						// Handle the event
						var handleEvent = function(event) {

							// Handle the event
							// Fix event if not handled properly
							event = event || function(event) {
								// The Magix

								// Now supporting preventDefault
								event.preventDefault = function() {
									this.returnValue = false;
								};

								// Now supporting stopPropagation
								event.stopPropagation = function() {
									this.cancelBubble = true;
								};
								
								// Now supporting relatedTarget
								event.relatedTarget = event.toElement;

								// Now supporting target
								event.target = event.srcElement || document;
								
								// Now supporting page X/Y
								var element = doc.documentElement, body = doc.body;
								event.pageX = event.clientX + (element && element.scrollLeft || body && body.scrollLeft || 0) - (element.clientLeft || 0);
								event.pageY = event.clientY + (element && element.scrollTop || body && body.scrollTop || 0) - (element.clientTop || 0);
								
								// Now supporting which
								event.which = (event.charCode || event.keyCode);
								
								// Now supporting metaKey
								event.metaKey = event.ctrlKey;

								return event;
							}(window.event);

							var handlers = this.events[event.type],
							    returnValue, key;
							for (key in handlers) {
								if (handlers.hasOwnProperty(key) && handlers[key].call(this, event) === false) {
									returnValue = false;
								}
							}

							return returnValue;
						};
						
						var attachEvent = function(type, handler) {
							var node = this;
							handler.SCH = handler.SCH || UNIQUE++;

							node.events = node.events || {};

							if (!node.events[type]) {

								node.events[type] = {};

								if (node["on" + type]) {
									node.events[type][0] = node["on" + type];
								}
								
								if (B.IE && (typeof(this.event) !== "undefined")) {
									node = window;
								}
								
								// If "DOM" event, these don't support "on" attachments
								if (/DOM/.test(type)) {
									node._addEventListener(type, handler, false);
								} else {
									node["on" + type] = handleEvent;
								}
							}
							
							node.events[type][handler.SCH] = handler;
							
						};
						
						// Firebug does not like Flow's overriding of addEventListener
						// We'll give it the default implementation.
						if ((/firebug/).test(type)) {
							this._addEventListener(type, handler, false);
						} else {
							attachEvent.call(this, type, handler);
						}
					}

					return that;
				},

				/*
				Property: removeEventListener
					http://developer.mozilla.org/en/docs/DOM:element.removeEventListener

				Parameters:
					type - the type of event to unbind.
					handler - the event to unbind.
					useCapture - turn event bubbling on/off.

				Example:
					>var foo = document.getElementsByClassName("foo");
					>foo.removeEventListener("click", ZOMG, false);
				*/
				removeEventListener : function (type, handler, useCapture) {
					that = this;
					
					var key, i;
					if (that.events) {
						if (!type) {
							for (key in that.events) {
								for (i in that.events[key]) {
									delete that.events[key][i];
								}
							}
						} else if (type && !handler) {
							for (key in that.events[type]) {
								delete that.events[type][key];
							}
						} else if (handler.SCH) {
							delete that.events[type][handler.SCH];
						}
					}
				},
				
				/*
				Property: dispatchEvent
					http://developer.mozilla.org/en/docs/DOM:element.dispatchEvent
					(differs slightly from implementation)

				Parameters:
					type - the type of event to fire.

				Example:
					(start code)
					var foo = document.getElementById("foo");
					foo.addEventListener("click", ZOMG, false);
					
					document.getById("trigger").addEventListener("click", function() {
						foo.dispatchEvent("click"); // Triggers foo's click event handler
					}, false);
					(end code)
				*/
				dispatchEvent : function(type) {
					that = this;
					
					var key;
					
					var fireEvents = function() {
						if ((typeof type === "string") && that.events && that.events[type]) {
							for (key in that.events[type]) {
								that.events[type][key].call(that);
							}
						}
					};
					
					// Firebug no likee
					if (isFB) {
						try {
							that._dispatchEvent(type);
						} catch (e) {
							fireEvents();
						}
					} else {
						fireEvents();
					}
					
					return that;
				}
				
			},

			stack : [],

			cache : function() {
				var eventCache = {};

				return {
					add : function(element, type, handler, useCapture) {
						// Let's create a cache of events
						var key = element.DOM;
						eventCache[key] = eventCache[key] || [];
						eventCache[key].push(arguments);
					},
					list : function(element) {
						return element ? (eventCache[element.DOM] || null) : eventCache;
					},
					flush : function(element) {
						var that = F.Event.cache,
						    key;

						// Time to flush
						var methods = F.Bind.methods;
						
						if (element && element.DOM) {
							key = element.DOM;
							that.iterate(eventCache[key], key);
							that.nullify(element, methods);
						} else {
							
							for (key in eventCache) {
								that.iterate(eventCache[key], key);
							}

							var all = document._getElementsByTagName("*"),
							    node, i = 0;

							while (node = all[i++]) {
								if (node && node.DOM) {
									that.nullify(node, methods);
								}
							}
						}
					},

					// Loop through each array and remove each event
					iterate : function(array, key) {
						if (array && key) {
							var i, item;
							for (i = array.length - 1; i >= 0; i = i - 1) {
								item = array[i];
								item[0].removeEventListener(item[1], item[2], item[3]);
							}
							eventCache[key] = null;
						}
					},

					// Augmenting DOM nodes can lead to memory leaks
					// Here I'm removing all custom methods from each node
					nullify : function(node, methods) {
						var key;
						
						// Problems with other libraries accessing node properties onunload
						// caused undefined errors. This will merely revert the element
						// back to its unaltered state.
						try {
							for (key in methods) {
								if (!(/^\_/).test(key)) {
									node[key] = node["_" + key] || null;
								}
							}
							
							for (key in methods) {
								if ((/^\_/).test(key)) {
									node[key] = null;
								}
							}
						} catch(e) {}
					}
				};
			}(),

			// Load objects when the DOM loads
			// @author Dean Edwards / Matthias Miller / John Resig / Mark Wubben / Paul Sowden
			fire : function() {
				if (arguments.callee.done) {
					return;
				}
				arguments.callee.done = true;
				var i = 0,
				    that = this;

				while (i < that.stack.length) {
					that.stack[i]();
					i++;
				}
			},

			init : function() {
				// Needed to support DOMContentLoaded
				var globals = [window, document],
				    onload = globals[0].onload,
				    i = 0, node, nodes, key, fire;

				if (!doc._addEventListener || B.WK) {
					while (i < globals.length) {
						node = globals[i];
						nodes = Flow.Event.nodes;
						for (key in nodes) {
							// ARCHIVED NATIVE METHODS
							if (node[key]) {
								node["_" + key] = node[key];
							}
							node[key] = nodes[key];
						}
						i++;
					}
				}

				if (Flow.Dom) {
					globals[0].addEventListener("DOMContentLoaded", Flow.Dom.init, false);
				}
			}
		};
	}()
});

(function() {
	var E = Flow.Event;
	E.init();
	// Flush the cache onunload
	window.addEventListener("unload", E.cache.flush, false);
})();
