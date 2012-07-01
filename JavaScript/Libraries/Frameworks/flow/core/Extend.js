/*
Namespace: The Extend Namespace
	Extend allows you to chain one function after another, and introduces support for helper functions.

About: Version
	1.1.1

	License:
		- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	- Flow.js.
	- Dom.js.
	- Event.js.
*/
new Flow.Plugin({
	name : "Extend",
	version : "1.1.1",
	bind : true,
	constructor : function() {

		var F = Flow,
		    B = F.Browser,
		    U = F.Utils,
		    X = F.Bind;

		var doc = document,
		    className = "className",
		    zero = null,
		    that;

		return {

			/*
			Interface: Element
				These functions are bound to _elements_.
			*/
			nodes : {

				/*
				Property: addClass
					Adds class name to element

				Parameters:
					elClass - the class to add.

				Example:
					>var foo = document.getElementById("foo");
					>foo.addClass("zomg");
				*/
				addClass : function(elClass) {
					that = this;
					
					var curr = that[className];
					if (!new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i").test(curr)) {
						that[className] = curr + ((curr.length > 0) ? " " : "") + elClass;
					}
					return that;
				},

				/*
				Property: removeClass
				 	Removes class name to element

				Parameters:
					elClass - _(optional)_ the class to remove.

				Example:
					>var foo = document.getElementById("foo");
					>foo.removeClass("zomg"); // removes class "zomg"
					>foo.removeClass(); // removes all classes
				*/
				removeClass : function(elClass) {
					that = this;
					
					if (elClass) {
						var classReg = new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i");
						that[className] = that[className].replace(classReg, function(e) {
							var value = "";
							if (new RegExp("^\\s+.*\\s+$").test(e)) {
								value = e.replace(/(\s+).+/, "$1");
							}
							return value;
						}).replace(/^\s+|\s+$/g, "");
						
						if (that.getAttribute("class") === "") {
							that.removeAttribute("class");
						}
					} else {
						that[className] = "";
						that.removeAttribute("class");
					}
					return that;
				},

				/*
				Property: replaceClass
				 	Replaces element's class with another one

				Parameters:
					elClass - the class to replace.

				Example:
					>var foo = document.getElementById("foo");
					>foo.replaceClass("zomg", "lolz");
				*/
				replaceClass : function(elClass, elNewClass) {
					that = this;
					
					if (that.hasClass(elClass)) {
						that.removeClass(elClass).addClass(elNewClass);
					}
					
					if (that.getAttribute("class") === "") {
						that.removeAttribute("class");
					}
					
					return that;
				},

				/*
				Property: hasClass
				 	Tests if element has class

				Parameters:
					elClass - the class to test.

				Example:
					>var foo = document.getElementById("foo");
					>if (foo.hasClass("zomg")) {
					>	console.log("lolz");
					>}
				*/
				hasClass : function(elClass) {
					that = this;
					
					return new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i").test(that[className]);
				},

				/*
				Property: toggleClass
				 	Toggles a class on/off

				Parameters:
					elClass - the class to toggle.

				Example:
					>var foo = document.getElementById("foo");
					>foo.toggleClass("zomg");
				*/
				toggleClass : function(elClass) {
					that = this;

					that.hasClass(elClass) ? that.removeClass(elClass) : that.addClass(elClass);
					return that;
				},

				/*
				Property: getElementsByAttribute
					Grabs elements By Attribute and optional Value pair

				Shorthand:
					getByAttr

				Parameters:
					elAttribute - the attribute to retrieve.
					elValue - _(optional)_ a matching value pair

				Example:
					>var foo = document.getElementsByAttribute("type", "submit");
					>var foo = document.getByAttr("type", "submit"); // shortcut
				*/
				getElementsByAttribute : function() {

					var reg = /class/;

					// native
					if (doc._getElementsByAttribute) {
						return function(elAttribute, elValue) {
							var that = this;
							var nodes = new U.liveNodeList(that._getElementsByAttribute(elAttribute, elValue));
							return X.extend(nodes);
						};
					}

					// xpath
					if (doc.evaluate) {
						return function(elAttribute, elValue) {
							that = this;
					
							if (reg.test(elAttribute) && elValue) {
								return that.getByClass(elValue);
							}
					
							var xpath, x = 0, node, nodes = [];
							elValue = (elValue == "*") ? null : elValue;
							if (elValue) {
								xpath = U.xpath.contains(elAttribute, elValue, that);
							} else {
								xpath = doc.evaluate(".//*[@" + elAttribute  + "]", that, zero, U.xpath.snapshot, zero);
							}
					
							x = 0;
							while (node = xpath.snapshotItem(x++)) {
								nodes.push(node);
							}
					
							return X.extend(nodes);
						};
					}
					
					// else
					return function(elAttribute, elValue) {
						that = this;
					
						if (reg.test(elAttribute) && elValue) {
							return that.getByClass(elValue);
						}
					
						var nodes = that._getElementsByTagName("*"),
						    i = 0, exists, element, attrArray = [];
					
						while (element = nodes[i++]) {
							if (element.getAttribute) {
								exists = element.getAttribute(elAttribute);
							}
							if (exists && (!elValue || (elValue == "*") || U.match(elValue).test(exists))) {
								attrArray.push(element);
							}
						}
						return X.extend(attrArray);
					};

				}(),

				/*
				Property: insertAfter
					Inserts an element after a specified reference point
					(Honestly, why the heck isn't this spec'd?) <http://developer.mozilla.org/en/docs/DOM:element.insertBefore#Specification>

				Parameters:
					newNode - the node to insert.
					referenceNode - the reference point to insert after

				Example:
					>var foo = document.createElement("div").addClass("foo");
					>foo.insertAfter(foo, document.getById("zomg"));
				*/
				insertAfter : function(newNode, referenceNode) {
					that = this;

					if (that._insertAfter) {
						that._insertAfter(newNode, referenceNode);
					} else {
						// If referenceNode is lastChild of this, just append
						(that.lastChild == referenceNode) ? that.appendChild(newNode) : that.insertBefore(newNode, referenceNode.nextSibling);
					}
				},

				/*
				Property: elementName
					Returns the proper (lowercased) nodeName

				Example:
					>var foo = document.getElementById("foo");
					>console.log(foo.nodeName); // returns "DIV" in some browsers, "div" in others
					>console.log(foo.elementName()); // always returns "div"
				*/
				elementName : function() {
					return this.nodeName.toLowerCase();
				},

				/*
				Property: getFirstChild
					Returns the first child of a parent element

				Parameters:
					childNode - _(optional)_ Filter results by element type

				Example:
					>var foo = document.getElementById("foo");
					>var child = foo.getFirstChild(); // returns first child
					>child = foo.getFirstChild("li"); // returns first li child
				*/
				getFirstChild : function(childNode) {

					that = this;

					if (childNode) {
						var nodeList = that._getElementsByTagName(childNode);
						return (nodeList && nodeList[0]) ? nodeList[0] : null;
					}

					return that.childNodes[0];
				},

				/*
				Property: getLastChild
					Returns the last child of a parent element

				Parameters:
					childNode - _(optional)_ Filter results by element type

				Example:
					>var foo = document.getElementById("foo");
					>var child = foo.getLastChild(); // returns last child
					>child = foo.getLastChild("li"); // returns last li child
				*/
				getLastChild : function(childNode) {

					that = this;

					var nodeList;

					if (childNode) {
						nodeList = that._getElementsByTagName(childNode);
						return (nodeList && nodeList[0]) ? nodeList[nodeList.length - 1] : null;
					}

					nodeList = that.childNodes;
					return nodeList[0] ? nodeList[nodeList.length - 1] : null;
				},

				/*
				Property: hasChildNode
					Tests if element has a specified child node

				Parameters:
					childNode - The specified child node

				Example:
					>var foo = document.getElementById("foo");
					>if (foo.hasChildNode("li")) {
					>	console.log("zomg");
					>}
				*/
				hasChildNode : function(childNode) {
					var nodeList = this._getElementsByTagName(childNode);
					return (nodeList && nodeList[0]) ? true : false;
				},

				/*
				Property: hasParentNode
					Tests if element has a specified parent node

				Parameters:
					parentNode - The specified parent node

				Example:
					>var foo = document.getElementById("foo");
					>if (foo.hasParentNode("body")) {
					>	console.log("zomg");
					>}
				*/
				hasParentNode : function(parentNode) {
					var parent = this.parentNode;

					while (parent.parentNode && (parent.nodeName.toLowerCase() != parentNode)) {
						parent = parent.parentNode;
					}

					if (parent.nodeName.toLowerCase() == parentNode) {
						return X.extend(parent);
					}
					return false;

				},

				/*
				Property: getChildNodes
					Get an element's child nodes

				Parameters:
					parentNode - _(optional)_ Filter results by element type

				Example:
					>var foo = document.getElementById("foo");
					>var children = foo.getChildNodes(); // Returns all child nodes
					>children = foo.getChildNodes("li"); // Returns all child "li" nodes
				*/
				getChildNodes : function(childNode) {
					var nodeList;
					
					if (B.WK && !B.S3) {
						nodeList = [];
						for (var i = 0, j = this.childNodes.length; i < j; i++) {
							nodeList.push(this.childNodes[i]);
						}
					} else {
						nodeList = new U.liveNodeList(this.childNodes);
					}
					
					if (childNode) {
						nodeList = nodeList.filter(function(element) {
							return (element.nodeName.toLowerCase() == childNode);
						});
					}

					return nodeList;
				},

				/*
				Property: getParentNode
					Get an element's parentNode (can be specified)

				Parameters:
					parentNode - _(optional)_ Filter results by element type

				Example:
					>var foo = document.getElementById("foo");
					>var children = foo.getParentNode(); // Returns immediate parentNode
					>children = foo.getChildNodes("div"); // Returns first "div" parent
				*/
				getParentNode : function(parentNode) {
					var parent = this.parentNode;
					if (parentNode) {
						while (parent.parentNode && (parent.nodeName.toLowerCase() != parentNode)) {
							if (parent.nodeName.toLowerCase() == "body") {
								return null;
							}
							parent = parent.parentNode;
						}
					}

					return X.extend(parent);
				},
				
				/*
				Property: removeNode
					Remove an element from the DOM
					http://msdn2.microsoft.com/en-us/library/ms536708.aspx (shock!)

				Example:
					>var foo = document.getElementById("foo");
					>foo.parentNode.removeChild(foo); // The DOM 3 way
					>foo.removeNode(); // faster method
				*/
				removeNode : function() {
					that = this;
					
					if (that._removeNode) {
						that._removeNode();
					} else {
						that.parentNode.removeChild(that);
					}
				},
				
				/*
				Property: getText
					Get an element's text value

				Example:
					>var foo = document.getElementById("foo");
					>var text = foo.getText();
				*/
				getText : function() {
					var child = this.firstChild;
					if (child && child.nodeValue) {
						return this.firstChild.nodeValue;
					}
					return false;
				},
				
				/*
				Property: setText
					Set an element's text value

				Parameters:
					range - _(optional)_ Set a range to replace (can be string or RegExp)
					text - The text to insert

				Example:
					>var foo = document.getElementById("foo");
					>var text = /I are bored/; // can also be a string
					>foo.setText(text, "NOT!");
					>
					>foo.setText("I am so not bored.");
				*/
				setText : function(range, text) {
					var child = this.firstChild;
					
					if (!child) {
						this.appendChild(document.createTextNode(' '));
						child = this.firstChild;
					}

					if (text) {
						child.nodeValue = child.nodeValue.replace(range, text);
					} else {
						child.nodeValue = range;
					}
					
				},
				
				/*
				Property: setOpacity
					Set an element's opacity value

				Parameters:
					value - _(optional)_ The opacity value (1-100 scale)

				Example:
					>var foo = document.getElementById("foo");
					>foo.setOpacity(50); // Set to 50% opaque
				*/
				setOpacity : function(value) {
					var that = this;
					value = parseFloat(value);
					value = (value < 1) ? value : (value / 100);
					if (F.Browser.IE) {
						// Triggering hasLayout for IE (filter prop requires this)
						that.style.zoom = that.style.zoom || 1;
						that.style.filter = "alpha(opacity=" + (value * 100) + ")";
					} else {
						that.style.opacity = value;
					}
				},
				
				/*
				Property: getComputedStyle
					Shortcut for the verbose document.defaultView.getComputedStyle

				Parameters:
					cssProp - The property to retrieve

				Example:
					>var foo = document.getElementById("foo");
					>var width = document.defaultView.getComputedStyle(foo, null).getPropertyValue("width");
					>width = foo.getComputedStyle("width"); // Much shorter
				*/
				getComputedStyle : function(cssProp) {
					var style = document.defaultView.getComputedStyle(this, null);
					if (cssProp) {
						style = style.getPropertyValue(cssProp);
					}
					return style;
				},

				/*
				Property: setStyle
					Shortcut for foo.style[property] = value;

				Parameters:
					cssProp - The property to retrieve
					value - The value to set

				Example:
					>var foo = document.getElementById("foo");
					>foo.setStyle("width", "200px");
					>foo.setStyle({
					>	width : "200px",
					>	opacity : 40,
					>	display : "block"
					>});
				*/
				setStyle : function(cssProp, value) {
					if (cssProp instanceof Object) {
						for (var key in cssProp) {
							this.setStyle(key, U.toCamelCase(cssProp[key]));
						}
					} else if (cssProp && (typeof value !== "undefined")) {
						switch (cssProp) {
							case "opacity" :
							this.setOpacity(value);
							break;
							
							default :
							// if RGB
							if (/rgb/.test(value)) {
								value = (/rgb\(([^\)]+)\)/).exec(value)[1].split(/\, ?/);
								value = U.RGBtoHex(value[0], value[1], value[2]).toLowerCase();
							}
							
							this.style[U.toCamelCase(cssProp)] = value;
							break;
						}
					}
					
					return this;
				},

				/*
				Property: getPosition
					Get an element's current position relative to its parent

				Example:
					>var foo = document.getElementById("foo");
					>var pos = foo.getPosition(); // returns {x, y} coordinates
					>console.log(pos.x, pos.y);
				*/
				getPosition : function() {
					var curleft = this.offsetLeft,
					    curtop = this.offsetTop;
					    element = this;

					/**
					 * @returns an object of the current position {x, y};
					*/
					return {
						x : curleft,
						y : curtop
					};
				},
				
				/*
				Property: getDocumentPosition
					Get an element's current position relative to the document

				Example:
					>var foo = document.getElementById("foo");
					>var pos = foo.getDocumentPosition(); // returns {x, y} coordinates
					>console.log(pos.x, pos.y);
				*/
				getDocumentPosition : function() {
					var curleft = 0,
					    curtop = 0,
					    element = this;
					
					if (element.offsetParent) {

						curleft = element.offsetLeft;
						curtop = element.offsetTop;

						while (element = element.offsetParent) {
							curleft += element.offsetLeft;
							curtop += element.offsetTop;
						}
					}

					/**
					 * @returns an object of the current position {x, y};
					*/
					return {
						x : curleft,
						y : curtop
					};
				},
				
				// Overwriting markup using straight innerHTML will not bind our custom functions to events
				// Using setInnerHTML / getInnerHTML will resolve this issue

				/*
				Property: setInnerHTML
					Set an element's innerHTML

				Parameters:
					markup - The markup to insert
					method - _(optional)_ If defined, append or prepend to element

				Example:
					>var foo = document.getElementById("foo");
					>foo.setInnerHTML("&lt;li&gt;zomg&lt;/li&gt;"); // overrides innerHTML
					>foo.setInnerHTML("&lt;li&gt;lolz&lt;/li&gt;", "append"); // appends HTML to foo
					>foo.setInnerHTML("&lt;li&gt;wtf&lt;/li&gt;&quot;, "prepend"); // prepends HTML to foo
				*/
				setInnerHTML : function(markup, method) {
					/**
					 * @see HTML
					*/
					var dummy = function(markup) {

						// Create a dummy node
						var dummy = doc.createElement("div");

						// Attach our markup to dummy
						dummy.innerHTML = markup;
						U.stripWhitespace(dummy);

						// Use getElementsByTagName to attach functions
						var all = dummy._getElementsByTagName("*"),
						    i = 0;

						while (i < all.length) {
							var element = all[i];
							U.stripWhitespace(element);
							element.DOM = null;
							X.extend(element);
							i++;
						}

						/**
						 * @returns element
						*/
						return dummy;
					}(markup),

					that = this;

					if (!method) {
						// Remove nodes from target
						// While this has child nodes
						while (that.hasChildNodes()) {

							// remove child
							that.removeChild(that.lastChild);
						}
					}
					
					var returnNode = dummy.childNodes;
					if (!returnNode[1]) {
						returnNode = returnNode[0];
					}

					// While dummy has child nodes
					while (dummy.hasChildNodes()) {

						if (method && (/(^pre)|before/).test(method)) {
							// prepend child node to element
							that.insertBefore(dummy.lastChild, that.firstChild);
						} else {
							// append child node to element
							that.appendChild(dummy.firstChild);
						}

					}
					
					return returnNode;
				},

				/*
				Property: getInnerHTML
					Get an element's innerHTML

				Example:
					>var foo = document.getElementById("foo");
					>var inner = foo.getInnerHTML();
					>console.log(inner); // returns foo's innerHTML
				*/
				getInnerHTML : function() {
					return this.innerHTML;
				}
			},

			/*
			Interface: Chaining
				Extend introduces a way to chain getters and setters.

			Example:
				*Chaining getters:*

				Grab all *.zomg* elements inside all *.foo* elements
				>var foo = document.getByClass("foo").getByClass("zomg");

				Let's filter that. Grab all *li.zomg* elements inside all *ul.foo* elements
				(start code)
				var foo = document.getByTag("ul").filter(function(ul) {
					return ul.hasClass("foo");
				}).getByTag("li").filter(function(li) {
					return li.hasClass("zomg");
				});
				(end code)

				*Chaining setters:*

				Grab all *.zomg* elements inside all *ul.foo* elements, add an event listener to each

				(start code)
				var foo = document.getByTag("ul").filter(function(ul) {
					return ul.hasClass("foo");
				}).getByClass("zomg").addEventListener("click", function() {
					console.log(this);
				});
				(end code)

				Grab all *.zomg* elements inside all *ul.foo* elements, add an event listener to each, add classname "done"
				
				(start code)
				var foo = document.getByTag("ul").filter(function(ul) {
					return ul.hasClass("foo");
				}).getByClass("zomg").addEventListener("click", function() {
					console.log(this);
				}).addClass("done");
				(end code)
			*/
			chaining : {}

		};

	}()
});

// Sweet, sweet chainability
Flow.Bind.bind(Array.prototype);

// Don't bind, but set properties...
if (Flow.Dom) {
	Flow.Bind.iterate(Flow.Dom.ie, Array.prototype);
}