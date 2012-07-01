/*
Namespace: Drag Module
	A flow widget that allows drag / drop functionality.

About: Version
	1.1.1

License:
	- Created by Richard Herrera <http://doctyper.com>
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Animate.js.
*/

new Flow.Fx({
	name : "Drag",
	version : "1.1.1",
	constructor : function(target, options) {
		var that;
		return {
			init : function(target, options) {
				that = this;
				
				options = options || {};
				var defaults = {
					space : 5,
					speed : 0.1,
					tween : null
				};
				for (var key in defaults) {
					options[key] = options[key] || defaults[key];
				}
				that.options = options;
				
				that.node = target;
				target.setStyle("position", "relative");
				that.target = target.getDocumentPosition();
				
				var children = target.getChildNodes();
				children.forEach(function(child) {
					that.bind(child);
				});
				
				document.addEventListener("mouseup", function(e) {
					that.dispatchEvent("ondragstop");
					if (that.clone) {
						that.curr.setOpacity(100);
						
						that.getPosition(e);

						var mouse = that.mouse,
						    tg = that.target;
						if ((mouse.x < (tg.x - 10)) || (mouse.x > (tg.x + (that.node.offsetWidth + 50))) || (mouse.y < tg.y - 10) || (mouse.y > tg.y + that.node.offsetHeight + 50)) {
							that.poof(e);
						}
						that.clone.removeNode(that.clone);
						that.clone = null;
						document.removeEventListener("mousemove", that.mousemove, false);
					}
				}, false);
				
				return that;
			},
			bind : function(element) {
				element.addEventListener("mousedown", function(e) {
					that.dispatchEvent("ondragstart");
					that.ghost.call(this, e);
					e.preventDefault();
				}, false);
				element.setStyle({
					cursor : "move",
					position : "relative"
				});
			},
			setInnerHTML : function(markup, method) {
				var dummy = document.createElement("div");
				dummy.setInnerHTML(markup);
				element = dummy.firstChild;
				that.bind(element);
				var node = that.node;
				if (method && method == "prepend") {
					node.insertBefore(element, node.firstChild);
				} else {
					node.appendChild(element);
				}
			},
			appendChild : function(element) {
				that.bind(element);
				that.node.appendChild(element);
			},
			getPosition : function(e) {
				that.mouse = Flow.Viewport.getMousePosition(e);
				that.target = that.node.getDocumentPosition();
			},
			setPosition : function(clone, e) {
				that.getPosition(e);
				
				var mouse = that.mouse,
				    target = that.target;
				
				if (clone) {
					var pos = (mouse.y - that.target.y);
					that.prev = that.prev || pos;
					
					var up = ((that.prev - pos) > 0),
					    previous = that.curr.previousSibling,
					    next = that.curr.nextSibling,
					    current = that.curr;
					
					if (previous && up && pos < (previous.getPosition().y + previous.offsetHeight)) {
						current.parentNode.insertBefore(current, previous);
						that.dispatchEvent("onmove");
						that.dispatchEvent("onmoveup");
					}
					if (next && !up && pos > (next.getPosition().y)) {
						current.parentNode.insertAfter(current, next);
						that.dispatchEvent("onmove");
						that.dispatchEvent("onmovedown");
					}
					that.prev = pos;
					
					that.moveClone(clone, e);
					that.tinyGhost(e);
				}
			},
			moveClone : function(clone, e) {
				that.getPosition(e);
				
				var mouse = that.mouse,
				    target = that.target;
				
				var pos = {
					x : ((mouse.x - target.x) - (clone.offsetWidth / 2)),
					y : ((mouse.y - target.y) - (clone.offsetHeight / 2))
				};
				
				clone.setStyle({
					top : pos.y + "px",
					left : pos.x + "px"
				});
			},
			tinyGhost : function(e) {
				that.getPosition(e);
				
				var mouse = that.mouse,
				    target = that.target;
				
				var tiny = document.getById("FlowDragTinyPoof");
				if ((mouse.x < (target.x - 10)) || (mouse.x > (target.x + (that.node.offsetWidth + 50))) || (mouse.y < target.y - 10) || (mouse.y > target.y + that.node.offsetHeight + 50)) {
					if (!tiny) {
						tiny = that.node.setInnerHTML('<div id="FlowDragTinyPoof"></div>', "append");
						that.tiny = tiny;
					}
					
					if (tiny.setStyle) {
						tiny.setStyle({
							position : "absolute",
							display : "block",
							'z-index' : 9999,
							top : ((mouse.y - target.y) + 5) + "px",
							left : ((mouse.x - target.x) + 5) + "px"
						});
					}
					that.curr.setStyle("display", "none");
				} else if (tiny) {
					if (tiny.setStyle) {
						tiny.setStyle("display", "none");
					}
					that.curr.setStyle("display", "block");
				}	
			},
			cloneStyle : function(clone) {
				var style = this.getComputedStyle();
				for (var key in style) {
					try {
						clone.setStyle(key, style[key]);
					} catch(e) {}
				}
			},
			mousemove : function(e) {
				that.setPosition(that.clone, e);
				e.preventDefault();
			},
			ghost : function(e) {
				var current = this.getPosition();
				this.setOpacity(50);
				var clone = this.cloneNode(true);
				clone.addClass("clone");
				that.cloneStyle.call(this, that.clone);
				clone.setStyle({
					position : "absolute",
					left : 0,
					top : current.y + "px",
					opacity : 50,
					width : this.getComputedStyle("width"),
					height : this.getComputedStyle("height")
				});
				this.parentNode.appendChild(clone);
				that.curr = this;
				that.clone = clone;
				that.current = current;
				document.addEventListener("mousemove", that.mousemove, false);
			},
			poof : function(e) {
				that.getPosition(e);
				
				var mouse = that.mouse,
				    target = that.target;
				
				var poof = that.node.setInnerHTML('<div id="FlowDragPoof"></div>', "append");
				poof.setStyle({
					position : "absolute",
					display : "none",
					'z-index' : 9999,
					top : ((mouse.y - target.y) - (poof.offsetHeight / 2)) + "px",
					left : ((mouse.x - target.x) - (poof.offsetWidth / 2)) + "px",
					opacity : 50
				});
				if (that.tiny) {
					that.tiny.parentNode.removeChild(that.tiny);
					that.tiny = null;
				}
				that.curr.removeNode();
				that.dispatchEvent("ondelete");
				var animate = function() {
					if (that.poof.timeout) {
						clearTimeout(that.poof.timeout);
					}
					var pos = poof.style.backgroundPosition.split(" ");
					if (!pos[1]) {
						pos = ["0", "0"];
					}
					for (var i = 0, j = pos.length; i < j; i++) {
						pos[i] = parseFloat(pos[i]);
					}
					pos[1] = (pos[1] - 128);
					poof.setStyle("background-position", pos[0] + " " + pos[1] + "px");
					if (pos[1] > -640) {
						that.poof.timeout = setTimeout(animate, 75);
					} else {
						poof.removeNode();
						clearTimeout(that.poof.timeout);
					}
				};
				
				poof.setStyle("display", "block");
				that.poof.timeout = setTimeout(animate, 75);
			},
			addEventListener : function(type, handler, useCapture) {
				that = this;
				that.events = that.events || {};
				type = "on" + type;
				if (!that.events[type]) {
					that.events[type] = [];
				}
				that.events[type].push(handler);
				return that;
			},
			dispatchEvent : function(type) {
				if (that.events && that.events[type]) {
					for (var i = 0, j = that.events[type].length; i < j; i++) {
						that.events[type][i].call(that.node);
					}
				}
			}
		}.init(target, options);
	}
});