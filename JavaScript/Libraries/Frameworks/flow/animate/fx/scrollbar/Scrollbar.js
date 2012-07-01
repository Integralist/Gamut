/*
Namespace: Drag Module
	Custom scrollbars at your command.

About: Version
	1.1.1

License:
	- Created by Richard Herrera <http://doctyper.com>
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Animate.js.
*/

new Flow.Fx({
	name : "Scrollbar",
	version : "1.1.1",
	constructor : function(target, options) {
		var $this;
		return {
			vars : {
				wheelSpeed : 6, // 1 - 10 (1 being the slowest, 10 the highest. Default = 6)
				minHeight : 10 // minimum height of scrollbar (In pixels. Default = 10)
			},
			init : function(target, options) {
				$this = this;
				
				options = options || {};
				$this.options = options;
				
				for (var key in $this.vars) {
					$this.options[key] = $this.options[key] || $this.vars[key];
				}
				
				$this.options.targetElement = target;
				
				$this.setDragEvent();
				$this.setMouseWheelEvent();
				
				return $this;
			},
			setDragEvent : function() {
				
				// Set some variables
				var content = $this.options.targetElement;
				
				// Create scrollbar
				var container = $this.createScrollbar(content);
				
				// And now grab all rendered elements
			    var parent = container.getByClass("scrollbarContent")[0],
				    scrollbar = container.getByClass("scrollbarContainer")[0],
				    handle = scrollbar.getByClass("scrollbarHandle")[0],
				    parentHeight = parent.offsetHeight;
				
				// If there was a height before, remove it
				$this.setContentHeight(parent, content, scrollbar);
				
				// Make sure scrollbar matches percentage-wise
				$this.resetScrollbar();
				
				// Reference these during mousemove
				var startY, offsetY;
				
				// Make sure content starts at correct position
				if (parent.scrollTop !== 0) {
					var percent = (parent.scrollTop / content.offsetHeight) * 100;
					handle.style.top = (percent) + "%";
				}

				// Mousemove FTW.
				var mousemove = function(e) {

					// Prevent default
					e.preventDefault();

					// More math.
					parentHeight = parseFloat(parent.getComputedStyle("height"));
					
					var value = (offsetY + e.clientY - startY),
					    height = (parentHeight - handle.offsetHeight);

					// Stay within viewport bounds, ignore drags outside boundaries
					if ((value > 0) && (value < height)) {

						// Percent = (value / parent height) * 100
						var percent = Math.floor((value / parentHeight) * 100);

						// Reposition scrollbar top
						handle.style.top = percent + "%";

						// Scroll content based on scrollbar position
						parent.scrollTop = content.offsetHeight * (percent / 100);
					}
				};

				var mousedown = function(e) {
					
					$this.mouseCache = $this.mouseCache || {};
					var $m = $this.mouseCache;
					
					$m.target = $m.target || e.target;
					
					if ($m.target === this) {
						
						if (e) {
							e.preventDefault();
						}
						
						handle.style.top = handle.style.top || 0;
						$this.scrollOffset = $this.scrollOffset || 12;

						var scroll = content.offsetHeight * ($this.scrollOffset / 100),
						    offset = $this.scrollOffset,
						    top = parseFloat(handle.style.top),
						    value;
						
						// FF = e.layerY, Safari = e.clientY, IE = e.offsetY
						var valueY = $m.valueY || (e.layerY || e.offsetY || e.clientY);
						$m.valueY = valueY;

						// Even more math
						
						if (valueY < handle.offsetTop) {
							value = top - offset;

							handle.style.top = ((value > 0) ? value : 0) + "%";
							scroll = -(scroll);
						} else {
							value = top + offset;

							var height = (parentHeight - handle.offsetHeight),
							    over = parentHeight * (value / 100);
								
							handle.style.top = ((height > over) ? value : (over / parentHeight) * 100) + "%";
						}

						// Scroll content based on scrollbar position
						parent.scrollTop += scroll;

						if (!$this.initialMouseDown) {
							var _this = this;
							$this.scrollbarTimeout = window.setTimeout(function() {
								repeatMousedown(_this, valueY);
							}, 500);
							$this.initialMouseDown = true;
						}

					}
				};

				var repeatMousedown = function(target, valueY) {
					
					if ((handle.offsetTop > valueY) || (handle.offsetTop + handle.offsetHeight) < valueY) {
						clearTimeout($this.scrollbarTimeout);
					
						mousedown.call(target);
					
						$this.scrollbarTimeout = window.setTimeout(function() {
							repeatMousedown(target, valueY);
						}, 50);
					}
				};
				
				scrollbar.addEventListener("mousedown", mousedown, false);


				// Set mousedown event listener
				handle.addEventListener("mousedown", function(e) {
					e.preventDefault();
					
					// Log Y start point
					startY = e.clientY;

					// Log Y offset point (can be 0)
					offsetY = this.offsetTop;

					// Set mousemove event listener
					document.addEventListener("mousemove", mousemove, false);
				}, false);

				// Set mouseup event listener
				document.addEventListener("mouseup", function() {

					// Remove mousemove event listener (cleanlines counts)
					document.removeEventListener("mousemove", mousemove, false);

					// Remove scrollbar timeout
					clearTimeout($this.scrollbarTimeout);
					delete $this.initialMouseDown;
					
					$this.mouseCache = {};
					delete $this.mouseCache;
				}, false);

			},
			handleMouseWheelEvent : function(element, callback) {
				function wheel(e) {
					var delta = 0;
					if (!e) {
						e = window.event;
					}
					
					if (e.wheelDelta) {
						delta = event.wheelDelta / 120;
						
						if (Flow.Browser.IE) {
							delta = (delta * 4);
						}
						
						if (window.opera) {
							delta = -(delta);
						}
					} else if (e.detail) {
						delta = -(e.detail);
					}
					
					if (delta) {
						callback.call(element, delta);
					}
					
					if (e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
				}

				/* Initialization code. */
				if (element._addEventListener) {
					element._addEventListener("DOMMouseScroll", wheel, false);
				}
				
				element.onmousewheel = wheel;
			},
			setMouseWheelEvent : function() {
				
				// Set some variables
				var content = $this.options.targetElement.parentNode,
				    container = content.parentNode,
				    scrollbar = container.getByClass("scrollbarContainer")[0],
				    handle = scrollbar.getByClass("scrollbarHandle")[0];
				
				$this.handleMouseWheelEvent(container, function(delta) {
					
					// Speed it up a bit
					var value = (delta * $this.vars.wheelSpeed);
					
					switch (delta > 0) {
						case true :
						content.scrollTop -= value;
						break;
					
						case false :
						content.scrollTop -= value;
						break;
					}
					
					var percent = (content.scrollTop / content.getFirstChild().offsetHeight) * 100;
					handle.style.top = (percent) + "%";
				});
				
			},
			createScrollbar : function(target) {
				var wrapper = document.createElement("div");
				wrapper.setAttribute("class", "scrollbarWrapper");
				
				target.parentNode.insertBefore(wrapper, target);
				
				wrapper.setInnerHTML('<div class="scrollbarContent"></div><div class="scrollbarContainer"><div class="scrollbarHandle"></div></div>', "append");
				wrapper.getByClass("scrollbarContent")[0].appendChild(target);
				
				$this.resetScrollbar();
				
				return wrapper;
			},
			resetScrollbar : function() {
				var content = document.getByClass("scrollbarContent")[0],
				    child = content.getFirstChild(),
				    handle = document.getByClass("scrollbarHandle")[0];

				// We need to ensure the scrollbar reflects the proper size perspective
				// We set it once onload, and once every time the click event fires (see below)
				var viewport = Math.floor((content.offsetHeight / child.offsetHeight) * 100);
				viewport = (viewport < 100) ? ((viewport > $this.vars.minHeight) ? viewport : $this.vars.minHeight) : 0;

				handle.style.height = (viewport) + "%";
				
				var percent = (content.scrollTop / child.offsetHeight) * 100;
				handle.style.top = (percent) + "%";
			},
			setContentHeight : function(parent, target, scrollbar) {
				var container = parent.parentNode;
				
				var getInt = function(element, prop) {
					return parseInt(element.getComputedStyle(prop));
				};
				
				var width = getInt(target, "width") + getInt(target, "padding-left") + getInt(target, "padding-right");
				var height = getInt(target, "height") + getInt(target, "padding-top") + getInt(target, "padding-bottom");
				
				$this.reassignProperties(container, target);
				
				parent.setStyle({
					"height" : height + "px",
					"width" : width - getInt(scrollbar, "width") + "px"
				});
				
				scrollbar.setStyle("height", height + "px");
				
				container.setStyle({
					"width" : width + "px",
					"height" : height + "px"
				});
				
				target.setStyle({
					"overflow" : "visible",
					"height" : "auto",
					"width" : "auto"
				});
			},
			reassignProperties : function(parent, child) {
				var props = {
					dimensions : ["width", "height"],
					margins : ["margin-left", "margin-right", "margin-top", "margin-bottom"],
					borders : {
						"left" : ["border-left-width", "border-left-style", "border-left-color"],
						"right" : ["border-right-width", "border-right-style", "border-right-color"],
						"top" : ["border-top-width", "border-top-style", "border-top-color"],
						"bottom" : ["border-bottom-width", "border-bottom-style", "border-bottom-color"]
					}
				};
				
				for (var key in props) {
					var i, j, cc, prop;
					
					if (props[key] instanceof Array) {
						for (i = 0, j = props[key].length; i < j; i++) {
							prop = props[key][i];
							cc = Flow.Utils.toCamelCase(prop);

							parent.style[cc] = child.getComputedStyle(prop);
							child.style[cc] = 0;
						}
					} else {
						for (var e in props[key]) {
							var string = [];
							cc = Flow.Utils.toCamelCase("border-" + e);
							
							for (i = 0, j = props[key][e].length; i < j; i++) {
								prop = props[key][e][i];
								
								var computed = child.getComputedStyle(prop);
								string.push(computed || "solid");
							}
							
							parent.style[cc] = string.join(" ");
							child.style[cc] = 0;
						}
					}
				}
			}
		}.init(target, options);
	}
});