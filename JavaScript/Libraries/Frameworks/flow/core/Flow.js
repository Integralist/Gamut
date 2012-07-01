/*
Namespace: The Flow Namespace
	The Flow namespace, Array Extras, Plugin support, and other goodies.
	
About: Version
	1.1.1

License:
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Notes:
	- Some documentation assumes familiarity with the Firebug API <http://getfirebug.com/console.html>. Because if you're not, you probably should go there. Now.
*/
var Flow = {
	
	Utils : {
		
		stripWhitespace : function(element) {
			// Private variables
			var i = 0, kids = element.childNodes;
			
			var preTest = function(element) {
				if (element) {
					if ((/pre|code/).test(element.nodeName.toLowerCase()) || ((element.style) && (element.style.whiteSpace))) {
						return true;
					}
				}
				return false;
			};
			
			// Break if '<pre>' or 'white-space: pre;' is detected
			var parent = element;
			
			while (parent) {
				if (preTest(parent)) {
					return;
				}
				
				parent = parent.parentNode;
			}
			
			// Loop
			while (i < kids.length) {
				// If nodeType is 3 (TEXT_NODE) and does not include text
				if ((kids[i].nodeType == 3) && !(/\S/.test(kids[i].nodeValue))) {
					// Remove child
					element.removeChild(kids[i]);
				}
				i++;
			}
		},
		
		match : function(attribute) {
			return new RegExp("(^|\\s)" + attribute.replace(/\-/g, "\\-") + "(\\s|$)");
		},
		
		xpath : {
			
			snapshot : (window.XPathResult) ? XPathResult.ORDERED_NODE_SNAPSHOT_TYPE : null,
			
			contains : function(attribute, value, that) {
				return document.evaluate(".//*[contains(concat(' ', @" + attribute + ", ' '), ' " + value + " ')]", that, null, this.snapshot, null);
			}
		},
		
		liveNodeList : function(nodes) {
			var F = Flow,
			    B = F.Browser;
			
			// Firefox && Safari 3 handle this perfectly
			if (B.GK || B.S3) {
				return [].slice.call(nodes, 0, nodes.length);
			} else {
				var i = 0, node, clones = [];
				if (nodes && nodes.length) {
					while (i < nodes.length) {
						node = nodes[i];
						if (node) {
							clones.push(node);
						}
						i++;
					}
				}
				return clones;
			}
		},
		
		toCamelCase : function(cssProp) {
			var hyphen = /(-[a-z])/ig;
			while (hyphen.exec(cssProp)) {
				cssProp = cssProp.replace(RegExp.$1, RegExp.$1.substr(1).toUpperCase());
			}
			return cssProp;
		},
				
		RGBtoHex : function(r, g, b) {
			var hexify = function(n) {
				if (n === null) {
					return "00";
				}

				n = parseInt(n);

				if ((n === 0) || isNaN(n)) {
					return "00";
				}

				n = Math.max(0, n);
				n = Math.min(n, 255);
				n = Math.round(n);

				return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
			};
			
			return "#" + hexify(r) + hexify(g) + hexify(b);
		}
	},
	
	Augment : function(subclass, superclass) {
		subclass = subclass[0] ? subclass : [subclass];
		
		for (var i = 0, j = subclass.length; i < j; i++) {
			for (var key in superclass) {
				if (!subclass[i][key] && superclass.hasOwnProperty(key)) {
					subclass[i][key] = superclass[key];
				}
			}
		}
	},
	
	/*
	Class: Browser
		Sets a few Browser/DOM flags.

	Note:
		These are more for internal use than external.
		The entire goal of Flow Core is that you don't need to worry about browser detection.

	Properties:
		Flow.Browser.IE - Internet Explorer.
		Flow.Browser.IE6 - Internet Explorer 6
		Flow.Browser.IE7 - Internet Explorer 7
		Flow.Browser.IE8 - Internet Explorer 8
		Flow.Browser.GK - Gecko-based
		Flow.Browser.WK - Webkit
		Flow.Browser.S3 - Safari 3
		Flow.Browser.Chrome - Chrome
		Flow.Browser.OP - Opera
	*/
	Browser : {
		IEWhich : function() {
			var e = this;

			e.IE = {};
			e.IE.jscript/*@cc_on =@_jscript_version@*/;

			switch (e.IE.jscript) {
				case 5.8 :
				e.IE8 = true;
				break;

				case 5.7 :
				e.IE7 = true;
				break;

				case 5.6 :
				e.IE6 = true;
				break;
			}
		},
		init : function() {
			var B = Flow.Browser,
			    A = Array,
			    proto = A.prototype;
			
			var ua = function(browser) {
				return (browser).test(navigator.userAgent.toLowerCase());
			};
			
			Flow.Augment(B, {
				W3 : !!(document.getElementById && document.createElement), // W3C
				IE : /*@cc_on !@*/false, // IE
				GK : !!(ua(/gecko/)), // Gecko
				WK : !!(ua(/webkit/)), // Webkit
				S3 : !!(ua(/webkit/) && window.devicePixelRatio), // Safari 3
				Chrome : !!(ua(/chrome/)), // Chrome
				KHTML : !!(ua(/khtml|webkit|icab/i)), // KHTML
				OP : !!(ua(/opera/)) // Opera
			});
			
			/*
				Class: Array
				A collection of Array Extras.
			*/
			Flow.Augment([proto, A], {
				/*
				Property: every
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					>var isBigEnough = function(element, index, array) {
					>  return (element >= 10);
					>};
					>var passed = [12, 5, 8, 130, 44].every(isBigEnough); // passed is false
					>passed = [12, 54, 18, 130, 44].every(isBigEnough); // passed is true
				*/
				every : function(fun /*, caller*/) {
					var that = this;

					var len = this.length, i = 0;
					var caller = arguments[1];
					
					while (i < len) {
						if (i in this && !fun.call(caller, this[i], i, this)) {
							return false;
						}
						i++;
					}

					return true;
				},

				/*
				Property: some
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					>var isBigEnough = function(element, index, array) {
					>  return (element >= 10);
					>};
					>var passed = [2, 5, 8, 1, 4].some(isBigEnough); // passed is false
					>passed = [12, 5, 8, 1, 4].some(isBigEnough); // passed is true
				*/
				some : function(fun /*, caller*/) {
					var that = this;

					var len = this.length, i = 0;
					var caller = arguments[1];
					
					while (i < len) {
						if (i in this && fun.call(caller, this[i], i, this)) {
							return true;
						}
						i++;
					}

					return false;
					
				},

				/*
				Property: filter
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					>var isBigEnough = function(element, index, array) {
					>  return (element >= 10);
					>};
					>var filtered = [12, 5, 8, 130, 44].filter(isBigEnough); // returns [12, 130, 44]
				*/
				filter : function(fun /*, caller*/) {
					var that = this;

					var res = [],
					    caller = arguments[1];
					
					var i = 0;
					while (i < that.length) {
						if (i in that) {
							var val = that[i]; // in case fun mutates this
							if (fun.call(caller, val, i, that)) {
								res.push(val);
							}
						}
						i++;
					}
					return res;
				},

				/*
				Property: map
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					>var numbers = [1, 4, 9];
					>var roots = numbers.map(Math.sqrt); // roots is now [1, 2, 3]
					>// numbers is still [1, 4, 9]
				*/
				map : function(fun /*, caller*/) {
					var that = this,
					     len = this.length;

					var res = [len], i = 0;
					var caller = arguments[1];
					
					while (i < len) {
						if (i in this) {
							res[i] = fun.call(caller, this[i], i, this);
						}
						i++;
					}

					return res;
				},

				/*
				Property: indexOf
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					>var array = [2, 5, 9];
					>var index = array.indexOf(2); // index is 0
					>index = array.indexOf(7); // index is -1
				*/
				indexOf : function(fun, start) {
					var that = this;

					var i = start || 0;
					
					while (i < that.length) {
						if (j === fun) {
							return i;
						}
						i++;
					}
				},
				
				/*
				Property: lastIndexOf
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:lastIndexOf>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					(start code)
					var array = [2, 5, 9, 2];
					var index = array.lastIndexOf(2); // index is 3
					index = array.lastIndexOf(7); // index is -1
					index = array.lastIndexOf(2, 3); // index is 3
					index = array.lastIndexOf(2, 2); // index is 0
					index = array.lastIndexOf(2, -2); // index is 0
					index = array.lastIndexOf(2, -1); // index is 3
					(end code)
				*/
				lastIndexOf : function(elt, from) {
					var that = this,
					    length = that.length;
					
					from = from || length;
					if (from >= length) {
						from = length;
					}
					if (from < 0) {
						from = length + from;
					}
					var i = from;
					while (i >= 0) {
						if (that[i] === elt) {
							return i;
						}
						i--;
					}
					return -1;
				},
				
				/*
				Property: forEach
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					(start code)
					var lis = document.getElementsByTagName("li");
					lis.forEach(function(element, index, array) {
						console.log(element.nodeName.toLowerCase == "li") // alerts true
						console.log(i) // Alerts current index
						console.log(array) // alerts the elements container array
					});
					(end code)
				*/
				forEach : function(fun /*, caller*/) {
					var that = this;
					
					var caller = arguments[1],
					    i = 0;
					
					while (i < that.length) {
						if (i in that) {
							fun.call(caller, that[i], i, that);
						}
						i++;
					}
				},
				
				/*
				Property: reduce
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:reduce>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					Flatten an array of arrays:
					(start code)
					var flattened = [[0,1], [2,3], [4,5]].reduce(function(a,b) {
					  return a.concat(b);
					}, []);
					// flattened is [0, 1, 2, 3, 4, 5]
					(end code)
				*/
				reduce : function(fun /*, initial*/) {
					var that = this;
					
					var len = that.length, i = 0;
					
					if (arguments.length >= 2) {
						var rv = arguments[1];
					} else {
						do {
							if (i in that) {
								rv = that[i++];
								break;
							}
						} while (true);
					}
					for (; i < len; i++) {
						if (i in that) {
							rv = fun.call(null, rv, that[i], i, that);
						}
					}
					return rv;
				},
				
				/*
				Property: reduceRight
					<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:reduceRight>

				Parameters:
					element - the element to test against
					index - _(optional)_ A.K.A. "i", the current index in loop
					array - _(optional)_ element's parent

				Example:
					Flatten an array of arrays:
					(start code)
					var flattened = [[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {
					  return a.concat(b);
					}, []);
					// flattened is [4, 5, 2, 3, 0, 1]
					(end code)
				*/
				reduceRight : function(fun /*, initial*/) {
					var that = this;
					
					var len = that.length,
					    i = len - 1;
					
					if (arguments.length >= 2) {
						var rv = arguments[1];
					} else {
						do {
							if (i in that) {
								rv = that[i--];
								break;
							}
						} while (true);
					}
					for (; i >= 0; i--) {
						if (i in that) {
							rv = fun.call(null, rv, that[i], i, that);
						}
					}
					return rv;
				},
				
				/*
				Property: exit
					Provides a way to break out of a forEach loop

				Parameters:
					index - A.K.A. "i", the current index in loop

				Example:
					Break a forEach loop:
					(start code)
					var array = [1, 2, 0, 3, 4, 5];
					array.forEach(function(item, i) {
					  if (item === 0) {
					    array = array.exit(i); // Break!
					  } else {
					    console.log(item);
					  }
					});
					console.log(array); // returns [1, 2, 0, 3, 4, 5];
					(end code)
				*/
				exit : function(index) {
					var that = this;
					return that.concat(that.splice(index, that.length - index));
				}
			});
			
			// Turn off background image caching for IE 
			if (B.IE) {
				B.IEWhich();
				try {
					document.execCommand("BackgroundImageCache", false, true);
				} catch (e) {}
			}
		}
	},
	
	/*
	Class: Apply
		Used to extend Flow to elements.

	Note:
		Flow auto-extends every element.
		getInnerHTML / setInnerHTML take care of adding Flow to elements using innerHTML
		However if you insist on using native innerHTML, you need to re-bind Flow to injected elements using Flow.Apply
	*/
	Apply : function(element) {
		return Flow.Bind.extend(element);
	},
	
	Bind : {
		// Each DOM element is flagged with a unique ID
		UNIQUE : 1,
	
		methods : {
			// We know DOM will be on every node
			DOM : "DOM"
		},

		apply : function(object) {
			var that = this;
		
			that.objects = that.objects || [];
			that.objects.push(object);
		
			that.document(document);
		},

		// Binds functions to elements
		extend : function(nodes) {
			var that = this,
			    F = Flow;

			// Sanity check
			if (!nodes) {
				return;
			}
			var one, i, node;

			// Parameter is not an array. Flag it, make it so
			if (nodes.nodeName) {
				one = true;
				nodes = [nodes];
			}

			// Reverse while loop (faster than a straight for)
			i = nodes.length;

			while (i >= 0) {
				node = nodes[i];
			
				// This is how I check if it's bound.
				// If it hasn't, it has no DOM reference
				if ((node && !node.DOM) || (node && node.nodeType === 9)) {
				
					// Bind events to element
					that.bind(node);

					// Strip whitespace from element
					F.Utils.stripWhitespace(node);

					// Assign DOM reference
					node.DOM = node.DOM || ("SCH_" + that.UNIQUE++);
				
				}

				// Reverse while loop
				i--;
			}
		
			return one ? nodes[0] : nodes;
		},

		// Custom document events
		document : function(node) {
			var that = this;

			// Private variables
			var i = 0, doc, F = Flow;
		
			// Assign DOM reference
			node.DOM = node.DOM || ("SCH_" + that.UNIQUE++);
		
			while (i < that.objects.length) {
				doc = that.objects[i];
				doc.boundElements = doc.boundElements || {};
			
				if (!doc.boundElements[node.DOM]) {
					that.iterate(doc.document, node);
				
					node._defaultView = node.defaultView;
				
					if (typeof node.defaultView === "undefined") {
						node.defaultView = window;
					}
				
					that.iterate(doc.computed, node.defaultView);
				
					doc.boundElements[node.DOM] = node.DOM;
				}
				i++;
			}
			that.extend(node);
		},

		iterate : function(object, node) {
			var that = this;
		
			for (var key in object) {
				if (object.hasOwnProperty(key)) {
					if (!node.DOM || !node[key] || !that.methods[key]) {
						// ARCHIVED NATIVE METHODS
					
						try {
							if (node == Array.prototype) {
								node[key] = function() {
									var i = 0, array = this, call,
									    args = arguments, combo = [];
								
									var singleProps = ["getFirstChild", "getLastChild"],
									    curr = args.callee.key;
									while (i < singleProps.length) {
										if (curr == singleProps[i]) {
											throw curr + " property can only be called on single element.";
										}
										i++;
									}
								
									i = 0;
									while (i < array.length) {
										// Yay, a useful purpose for arguments.callee!
										call = array[i][curr].apply(array[i], args);
										if (call) {
											var j = 0;
											while (j < call.length) {
												if (call[j]) {
													combo.push(call[j]);
												}
												j++;
											}
										}
										i++;
									}
									return combo[0] ? combo : array;
								};
								node[key].key = key;
							} else {

								if (node[key]) {
									var orig = "_" + key;
									node[orig] = node[key];
									that.methods[orig] = that.methods[orig] || orig;
								}
								node[key] = object[key];
							}
							that.methods[key] = that.methods[key] || key;
							that.shortcut(node, key);
						} catch (e) {}
					}
				}
			}
		},

		shortcut : function(node, key) {
			var that = this;
		
			var reg = /(get|query)(Element[s]?|Selector)?(By(Class|Tag|Id|Attr)|All)?(Name|ibute)?/;
			if (reg.test(key)) {
				var shorthand = key.replace(reg, "$1$3");
				node[shorthand] = node[key];
				that.methods[shorthand] = that.methods[shorthand] || shorthand;
			}
		},

		bind : function(node) {
			var that = this;

			if (!node.DOM || (node && node.nodeType === 9)) {
				var i = 0, j, k,
				    obj = that.objects;
			
				while (i < obj.length) {
					j = obj[i];
				
					if (j.nodes && j.nodes.limit) {
						k = 0;
						while (k < j.nodes.limit.length) {
							var type = j.nodes.limit[k];
							if (node.nodeName.toLowerCase() == type) {
								that.iterate(j.nodes, node);
							}
							k++;
						}
					} else {
						that.iterate(j.nodes, node);
					}
				
					// IE fixes for botched API
					if (Flow.Browser.IE) {
						that.iterate(j.ie, node);
					}
					i++;
				}
			}
		}
	},
	
	/*
		Class: Plugin
		Allows you to extend the Flow namespace

		Example:
			(start code)
			// define closure
			new Flow.Plugin({
				name : "Foo", // You've defined "Flow.Foo"
				version : "1.0.2 (fixes conflict with 'Soda.Grape')", // Versioning info
				description : "Foo integrates Flow with 'Soda.Orange'.", // Brief description

				constructor : { // The meat n' potatoes. Your Function/Object goes here
					init : function(e) {
						e = e.toUpperCase();
						this.orange(e);
					},
					orange : function(e) {
						this.flavor = e;
						this.fizz();
					},
					fizz : function() {
						alert("soda");
					}
				}.init("orange") // call constructor.init
			}); // closure
			(end code)
	*/
	Plugin : function(plugin) {
		// if no plugin.name, assume anonymous
		if (plugin.name) {
			if (Flow[plugin.name]) {
				throw "Flow." + plugin.name + " already exists";
			}
			Flow[plugin.name] = plugin.constructor;

			if (plugin.bind) {
				Flow.Bind.apply(plugin.constructor);
			}
		} else {
			plugin.constructor();
		}
	}
	
};

Flow.Browser.init();
