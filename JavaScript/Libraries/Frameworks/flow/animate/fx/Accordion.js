/*
Namespace: Accordion Module
	A flow widget that auto-expands on click / mouseover.

About: Version
	1.1.1

License:
	- Created by Richard Herrera <http://doctyper.com>
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Animate.js.
*/

new Flow.Fx({
	name : "Accordion",
	version : "1.1.1",
	constructor : function(target, options) {
		var that;

		return {
			init : function(target, options) {
				that = this;
				
				if (target instanceof Array) {
					target.reverse();
				}
				
				that.size = {
					'old' : {},
					'new' : {}
				};
				
				options = options || {};
				
				var defaults = {
					speed : 0.25,
					event : "click",
					autofold : (options.autofold !== false) ? true : false,
					property : "height"
				};
				
				for (var key in defaults) {
					options[key] = options[key] || defaults[key];
				}
				
				that.options = options;

				target.addClass("FlowToggleAccordion");
				var children = target.getChildNodes();
				children.forEach(function(child) {
					
					var size = that.size,
					    dom = child.DOM,
					    o = size['old'],
					    n = size['new'],
					    opts = options,
					    toggler = child.getByClass("toggle")[0];
					
					var prop = opts.property;
					prop = prop.replace(prop.charAt(0), prop.charAt(0).toUpperCase());
					
					o[dom] = parseFloat(child["offset" + prop]);
					n[dom] = parseFloat(toggler["offset" + prop]);
					
					that.overflow = that.overflow || {};
					that.overflow[child.DOM] = child.style.overflow;
					
					if (!child.hasClass("open")) {
						
						child.style.overflow = "hidden";
						child.style[opts.property] = that.size['new'][child.DOM] + "px";
						
						var fades = child.getChildNodes().filter(function(node) {
							return !node.hasClass("toggle");
						});
						
						fades.setOpacity(0);
						
					}
					
					toggler.addClass("toggle");
					
					toggler.addEventListener(opts.event, function(e) {
						var nested = toggler.parentNode;
						while (!nested.hasClass("open")) {
							if (nested.nodeName.toLowerCase() == "body") {
								nested = null;
								break;
							}
							nested = nested.parentNode;
						}
						if (nested && (nested.getComputedStyle("overflow") == "hidden")) {
							nested.setStyle("height", "auto");
						}
						that.toggle.call(child);
						e.preventDefault();
					}, false);
				});
			},
			toggle : function() {
				var parent = this.parentNode,
				    opts = that.options;
				
				if (opts.autofold && this.hasClass("open")) {
					return;
				}
				
				while (!parent.hasClass("accordion")) {
					parent = parent.parentNode;
				}

				var children = parent.getChildNodes(),
				    value, curr = this, opacity;
				
				var animate = function(node, value) {
					var prop = {};
					prop[opts.property] = value;
					
					Flow.Animate({
						node : node,
						to : prop,
						tween : opts.tween
					}, opts.speed).start();
				};
				
				var size = that.size,
				    o = size['old'],
				    n = size['new'];
				
				if (opts.autofold) {
				
					children.removeClass("open");
					this.toggleClass("open");
					
					children.forEach(function(child) {
						var dom = child.DOM;
						value = (child == curr) ? o[dom] : n[dom];
							
						// Reset scroll position
						child.scrollTop = 0;
						
						animate(child, value);
						var fades = child.getChildNodes().filter(function(fade) {
							return !fade.hasClass("toggle");
						});
						var ani;
						if (child == curr) {
							opacity = 100;
							child.style.overflow = that.overflow[child.DOM];
						} else {
							opacity = 0;
							child.style.overflow = "hidden";
						}
						
						fades.forEach(function(fade) {
							
							ani = Flow.Animate({
								node : fade,
								to : {
									opacity : opacity
								}
							}, (opts.speed / 4)).start();
						});
					});
				} else {
					var child = this,
					    dom = child.DOM;
					
					child.toggleClass("open");
					
					if (child.hasClass("open")) {
						value = o[dom];
						opacity = 100;
					} else {
						value = n[dom];
						opacity = 0;
					}
					animate(child, value);
					var fades = child.getChildNodes().filter(function(fade) {
						return !fade.hasClass("toggle");
					});
					fades.forEach(function(fade) {
						Flow.Animate({
							node : fade,
							to : {
								opacity : opacity
							}
						}, (opts.speed / 4)).start();
					});
				}
			}
		}.init(target, options);
	}
});