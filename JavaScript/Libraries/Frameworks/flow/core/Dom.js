/*
Namespace: The Dom Namespace
	Extends the native JS DOM API across all grade-A browsers.

About: Version
	1.1.1

Requires:
	Flow.js.

License:
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Notes:
	- Some documentation assumes familiarity with the Firebug API <http://getfirebug.com/console.html>. Because if you're not, you probably should go there. Now.
*/

new Flow.Plugin({
	name : "Dom",
	version : "1.1.1",
	bind : true,
	constructor : function() {

		var F = Flow,
		    D = F.Dom,
		    X = F.Bind,
		    B = F.Browser,
		    U = F.Utils,
		    E = F.Event;
		
		var className = "className",
		    firstChild = "firstChild",
		    lastChild = "lastChild",
		    evalString = "evaluate",
		    doc = document,
		    zero = null,
		    that;

		return {
			/*
			Interface: Element
				These functions are bound to _elements_.
			*/
			nodes : {

				/*
				Property: getElementsByClassName
					http://developer.mozilla.org/en/docs/DOM:document.getElementsByClassName

				Shorthand:
					getByClass

				Parameters:
					className - the class to retrieve.

				Example:
					>var foo = document.getElementsByClassName("foo");
					>var foo = document.getByClass("foo"); // shortcut
				*/
				getElementsByClassName : function() {
					var format = function(className) {
						if (!(className instanceof Array)) {
							className = className.replace(/^\s?|\s?$/g, "");
							if (/ /.test(className)) {
								className = className.split(" ");
							}
							className = (typeof className == "string") ? [className] : className;
						}
						return className;
					};
					
					var hasClass = function(elClass, element) {
						return new RegExp("(?:^|\\s+)" + elClass + "(?:\\s+|$)").test(element[className]);
					};
					var match = function(reg, element) {
						var i = 0, ex;
						while (ex = reg[i++]) {
							if (!ex.test(element[className])) {
								element = zero;
								break;
							}
						}
						return element;
					};
					var evaluate = function(className, that) {
						var evals = [], reg = [],
						    i = 0, Class;
						while (Class = className[i++]) {
							if (doc[evalString] && that) {
								evals.push(U.xpath.contains("class", Class, that));
							}
							reg.push(U.match(Class));
						}
						return {
							evals : evals,
							reg : reg
						};
					};
					var empty = function(className) {
						return (typeof className == "object" && !className[0]) || (className === "");
					};

					// native
					if (doc._getElementsByClassName) {
						return function(className) {

							var that = this;

							var nodes = new U.liveNodeList(that._getElementsByClassName(className));
							return X.extend(nodes);
						};
					}

					// xpath
					if (doc[evalString]) {
						return function(className) {
					
							var that = this;
					
							if (empty(className)) {
								// Paranoid
								return [];
							}
					
							// Clean className
							className = format(className);
							var nodes = [], element, i = 0, x = 0,
							    regEx = evaluate(className, that),
							    evals = regEx.evals, xpath,
							    reg = regEx.reg, _match;
					
							while (xpath = evals[i++]) {
								while (element = xpath.snapshotItem(x++)) {
									_match = match(reg, element);
									if (_match) {
										nodes.push(_match);
									}
								}
							}
							return X.extend(new U.liveNodeList(nodes));
						};
					}
					
					// generic
					return function(className) {
					
						var that = this;
					
						if (empty(className)) {
							// Paranoid
							return [];
						}
					
						className = format(className);
						// Private variables
						var nodes, elArray = [], element, i = 0, _match;
						nodes = that._getElementsByTagName("*");
						var regEx = evaluate(className),
						    reg = regEx.reg;
					
						while (element = nodes[i++]) {
							_match = match(reg, element);
							if (_match) {
								elArray.push(_match);
							}
						}
						
						return X.extend(elArray);
					};
				}(),

				/*
				Property: getElementsByTagName
					http://developer.mozilla.org/en/docs/DOM:document.getElementsByTagName

				Shorthand:
					getByTag

				Parameters:
					tagName - the tag to retrieve.

				Example:
					>var foo = document.getElementsByTagName("li");
					>var foo = document.getByTag("li"); // shortcut
				*/
				getElementsByTagName : function() {
					
					if (doc[evalString]) {
						return function(tagName) {
							tagName = tagName.toLowerCase();
							
							switch (tagName) {
								case "applet" :
								case "embed" :
								return document._getElementsByTagName(tagName);
								
								default:
								var i = 0, element, that = this;

								var xpath = doc[evalString](".//" + tagName, that, zero, U.xpath.snapshot, zero),
								    nodes = [];

								while (element = xpath.snapshotItem(i++)) {
									nodes.push(element);
								}

								nodes = X.extend(nodes);

								return nodes;
							}
						};
					}
					return function(tagName) {
						tagName = tagName.toLowerCase();

						var that = this;

						switch (tagName) {
							case "applet" :
							case "embed" :
							return document._getElementsByTagName(tagName);
							
							default:
							var nodes = X.extend(that._getElementsByTagName(tagName));
							
							var clones = [];
							for (var i = 0, j = nodes.length; i < j; i++) {
								clones.push(nodes[i]);
							}
							
							return clones;
						}
					};
				}(),

				// cloneNode wrapper
				cloneNode : function(deep) {
					var clone = this._cloneNode(deep);

					// DOM elements should not have the same ID
					if (deep) {
						var i = 0,
						    children = clone.getElementsByTagName("*");
						while (i < children.length) {
							X.extend(children[i]);
							children[i].DOM = "SCH_" + X.UNIQUE++;
							i++;
						}
					}
					clone = X.extend(clone);
					
					// Assign new DOM ID
					clone.DOM = "SCH_" + X.UNIQUE++;
					
					return clone;
				},

				// removeChild wrapper
				removeChild : function(childNode) {
					E = E || F.Event;
					if (E && childNode && childNode.DOM && childNode.nodeType == 1) {
						E.cache.flush(childNode);
					}
					
					if (typeof this._removeChild !== "undefined") {
						this._removeChild(childNode);
					}
				},

				// replaceChild wrapper
				replaceChild : function(newNode, referenceNode) {
					E = E || F.Event;
					if (E && referenceNode && referenceNode.DOM && referenceNode.nodeType == 1) {
						E.cache.flush(referenceNode);
					}
					
					if (this.replaceNode) {
						referenceNode.replaceNode(newNode);
					} else {
						this._replaceChild(newNode, referenceNode);
					}
				}
			},

			/*
			Interface: Document
				These functions are bound to _document_.
			*/
			document : {

				/*
				Property: getElementById
					http://developer.mozilla.org/en/docs/DOM:document.getElementById

				Shorthand:
					getById

				Parameters:
					idName - the id to retrieve.

				Example:
					>var foo = document.getElementById("foo");
					>var foo = document.getById("foo"); // shortcut
				*/
				getElementById : function(idName) {
					D = D || F.Dom;
					
					var element = doc._getElementById(idName);
					
					if (element) {
						//make sure that it is a valid match on id
						var attr = element.attributes["id"];
						if (attr && attr.value && (attr.value == idName)) {
							return X.extend(element);
						} else {
							if (B.WK) {
								// Safari 2 chokes on attributes["id"]
								// But we know it returns an id regardless, so we give it a pass
								return X.extend(element);
							} else {
								//otherwise find the correct element
								for (var i = 1; i < document.all[idName].length; i++) {
									if(document.all[idName][i].id == idName) {
										return X.extend(document.all[idName][i]);
									}
								}
							}
						}
					}
				},

				/*
				Property: getElementsByName
					http://developer.mozilla.org/en/docs/DOM:document.getElementsByName

				Shorthand:
					getByName

				Parameters:
					name - the name to retrieve.

				Example:
					>var foo = document.getElementsByName("foo");
					>var foo = document.getByName("foo"); // shortcut
				*/
				getElementsByName : function(name) {
					D = D || F.Dom;

					var element = X.extend(doc._getElementsByName(name));
					element = new U.liveNodeList(element);
					return element;
				},

				// Binds custom events to newly created elements
				createElement : function(element) {
					var newElement = this._createElement(element);
					return X.extend(newElement);
				}
			},

			/*
			Interface: IE Fixes
				These functions are fixed for Internet Explorer.
			*/
			ie : {

				/*
				Property: getAttribute
					http://developer.mozilla.org/en/docs/DOM:element.getAttribute

				Parameters:
					attribute - the attribute to retrieve.

				Example:
					>var foo = document.getElementById("foo");
					>var attr = foo.getAttribute("class");
					>// returns class (yes, even in IE)
				*/
				getAttribute : function(attribute) {
					that = this;

					switch (attribute) {
						case "style" :
						var style = that.style.cssText.toLowerCase();
						
						// Perfectionist's addition of semicolon ;)
						if (!(/;$/.test(style))) {
							style += ";";
						}
						return style;

						case "class" :
						return that[className];

						case "for" :
						return that.htmlFor;
						
						case "type" :
						return that.type;

						case "href" :
						case "src" :
						case "value" :
						return that._getAttribute(attribute, 2);

						default :
						return that._getAttribute(attribute);
					}
				},

				/*
				Property: setAttribute
					http://developer.mozilla.org/en/docs/DOM:element.setAttribute

				Parameters:
					attribute - the attribute to set.
					value - the value to set.

				Example:
					>var foo = document.getElementById("foo");
					>foo.setAttribute("class", "bar");
					>// sets class (yes, even in IE)
				*/
				setAttribute : function(attribute, value) {
					that = this;

					switch (attribute) {
						case "style" :
						that.style.cssText = value;
						return;

						case "class" :
						that[className] = value;
						return;

						case "for" :
						that.htmlFor = value;
						return;

						case "title" :
						that.title = value;
						return;
						
						case "type" :
						that.type = value;
						return;

						default :
						that._setAttribute(attribute, value);
						return;
					}
				},

				/*
				Property: hasAttribute
					http://developer.mozilla.org/en/docs/DOM:element.hasAttribute

				Parameters:
					attribute - the attribute to set.
					value - the value to set.

				Example:
					>var foo = document.getElementById("foo");
					>if (foo.hasAttribute("class")) {
					>	foo.removeAttribute("class");
					>}
					>// (yes, even in IE)
				*/
				hasAttribute : function(attribute) {
					return this.getAttribute(attribute) !== zero;
				}
			},

			/*
			Interface: Window
				These functions are bound to _document.defaultView_.
			*/
			computed : {

				/*
				Property: getComputedStyle
					http://developer.mozilla.org/en/docs/DOM:window.getComputedStyle

				Parameters:
					element - the computed element to retrieve.
					pseudoElt - _(optional)_ the computed pseudo-element to retrieve.

				Example:
					>var foo = document.getElementById("foo");
					>var computedStyle = document.defaultView.getComputedStyle(foo, null);
				*/
				getComputedStyle : function(element, pseudoElt) {

					/*
					Property: getPropertyValue
						Grabs individual property values from an element's computed style

					Parameters:
						property - the property to retrieve.

					Example:
						>var foo = document.getElementById("foo");
						>var width = document.defaultView.getComputedStyle(foo, null).getPropertyValue("width");
					*/
					var RGBtoHex = U.RGBtoHex;
					
					if (document.defaultView._getComputedStyle) {
						
						var computedStyle = document.defaultView._getComputedStyle(element, pseudoElt);
						
						if (!B.Chrome) {
							computedStyle.getPropertyValue = function(property) {
							
								var value = document.defaultView._getComputedStyle(element, pseudoElt).getPropertyValue(property);
								switch (/color|background/.test(property)) {
									case true :
									if (/rgb/.test(value)) {
										// Switch to Hex
										var rgb = (/rgb\(([^\)]+)\)/).exec(value);
										if (rgb && rgb[1]) {
											rgb = rgb[1].split(/\, ?/);
											return RGBtoHex(rgb[0], rgb[1], rgb[2]).toLowerCase();
										}
									} else {
										// Make sure hex is lowercase
										var hexcode = (/\#[a-zA-Z0-9]+/).exec(value);
										if (hexcode && hexcode[0]) {
											value = value.replace(hexcode[0], hexcode[0].toLowerCase());
										}
										return value;
									}
									break;
								
									default :
									return value;
								}
							};
						}
						
						return computedStyle;
					} else {
						element.getPropertyValue = function(property) {
							property = U.toCamelCase(property);

							var unAuto = function(prop) {

								var calcPx = function(props, dir) {
									var value;
									dir = dir.replace(dir.charAt(0), dir.charAt(0).toUpperCase());

									var globalProps = {
										visibility : "hidden",
										position : "absolute",
										left : "-9999px",
										top : "-9999px"
									};

									var dummy = element.cloneNode(true);

									for (var i = 0, j = props.length; i < j; i++) {
										dummy.style[props[i]] = "0";
									}
									for (var key in globalProps) {
										dummy.style[key] = globalProps[key];
									}

									document.body.appendChild(dummy);
									value = dummy["offset" + dir];
									document.body.removeChild(dummy);

									return value;
								};

								switch (prop) {
									case "width" :
									props = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
									prop = calcPx(props, prop);
									break;

									case "height" :
									props = ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"];
									prop = calcPx(props, prop);
									break;

									default :
									prop = style[prop];
									break;
								}

								return prop;
							};


							var PIXEL = /^\d+(px)?$/i;
							var COLOR = /color|backgroundColor/i;
							var SIZES = /width|height|top|bottom|left|right|margin|padding|border(.*)?Width/;
							
							// Limited to HTML 4.01 defined names
							// http://www.w3.org/TR/REC-html40/types.html#h-6.5
							var getHexColor = {
								aqua : "00FFFF",
								black : "000000",
								blue : "0000FF",
								fuchsia : "FF00FF",
								green : "008000",
								grey : "808080",
								lime : "00FF00",
								maroon : "800000",
								navy : "000080",
								olive : "808000",
								purple : "800080",
								red : "FF0000",
								silver : "C0C0C0",
								teal : "008080",
								white : "FFFFFF",
								yellow : "FFFF00"
							};
							
							var getPixelValue = function(prop, name) {
								if (PIXEL.test(prop)) {
									return prop;
								}
								
								// if property is auto, do some messy appending
								if (prop === "auto") {
									prop = unAuto(name);
								} else {
									var style = this.style.left,
									    runtimeStyle = this.runtimeStyle.left;

									this.runtimeStyle.left = this.currentStyle.left;
									this.style.left = prop || 0;
									prop = this.style.pixelLeft;
									this.style.left = style;
									this.runtimeStyle.left = runtimeStyle;
								}
								
								return prop + "px";
							};
							
							var getColorValue = function(value) {
								// Hex must be 7 chars in length, including octothorpe.
								if (/#/.test(value) && value.length !== 7) {
									var hex = (/[a-zA-Z0-9]+/).exec(value)[0].split("");
									value = "#" + [hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]].join("").toLowerCase();
								} else if (/rgb/.test(value)) {
									// Switch to Hex
									value = (/rgb\(([^\)]+)\)/).exec(value)[1].split(/\, ?/);
									return RGBtoHex(value[0], value[1], value[2]).toLowerCase();
								} else if (getHexColor[value]) {
									value = "#" + getHexColor[value].toLowerCase();
								}
								
								return value;
							};
							
							if (COLOR.test(property)) {
								property = getColorValue(this.currentStyle[property]);
							} else if (SIZES.test(property)) {
								property = getPixelValue.call(this, this.currentStyle[property], property);
							} else {
								property = this.currentStyle[property];
							}

							/**
							 * @returns property (or empty string if none)
							*/
							return property || "";
						};

						/*
						Property: removeProperty
							Removes individual property values from an element's computed style

						Parameters:
							property - the property to remove.

						Example:
							>var foo = document.getElementById("foo");
							>var width = document.defaultView.getComputedStyle(foo, null).removeProperty("width");
						*/
						element.removeProperty = function(property) {
							property = U.toCamelCase(property);
							this.currentStyle[property] = "";
						};

						/*
						Property: setProperty
							Sets individual property values on an element's computed style

						Parameters:
							property - the property to modify.
							value - the value to set

						Example:
							>var foo = document.getElementById("foo");
							>var width = document.defaultView.getComputedStyle(foo, null).setProperty("width", "200");
						*/
						element.setProperty = function(property, value) {
							property = U.toCamelCase(property);
							this.currentStyle[property] = value;
						};

						return element;
					}
				}
			},

			init : function() {
				doc.getByTag("*");
			}
		};

	}()
});