/*
Namespace: The Animate Namespace
	A small and powerful animation library.

About: Version
	1.1

License:
	- Based on David Zuch's animation prototype. Licensed under the Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>.

	- Based on Lenny Burdette's object-oriented rewrite of JSTween by Philippe Maegerman. Licensed under the Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>.
	
	- Some parts based on JSTween <http://jstween.blogspot.com/>. Licensed under the BSD License <http://opensource.org/licenses/bsd-license.php>.
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.
	
Requires:
	Flow.js.
	Dom.js.
*/

if (typeof Flow != "object" || !Flow.Dom) {
	throw "Missing required JavaScript. Flow Core is required."; 
}

/*
Interface: Animate
	These functions are bound to _elements_.
	
Parameters:
	node - foo
	from - foo
	to - foo
	tween - foo
	hide - foo
	duration - foo
	addEventListener - foo
	start - foo
	stop - foo

Example:
	(start code)
	var foo = document.getElementById("foo");
	var ani = Flow.Animate({
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
new Flow.Plugin({
	name : "Animate",
	version : "1.1",
	constructor : function(options, duration) {

		var that,
		    doc = document,
		    F = Flow,
		    U = F.Utils;
		
		return {
			init : function(options, duration) {
				that = this;
				
				options.suffix = options.suffix || "px";

				that.objects = that.objects || [];
				that.duration = duration || 0.25;
				
				if (typeof options.node == "string") {
					options.node = doc.getById(options.node);
				}
				
				that.node = options.node;
				
				if (!options.from) {
					options.from = that.getFrom(options.to, options.node);
				}
				
				for (key in options.from) {
					if (options.from.hasOwnProperty(key)) {
						options.from[U.toCamelCase(key)] = options.from[key];
					}
				}
				
				for (var key in options.to) {
					
					var curr = {
						node : options.node,
						prop : key,
						begin : options.from[key],
						end : options.to[key],
						tween : options.tween
					};

					that.objects.push(curr);
				}
				return that;
			},

			start : function() {
				F.Animate.animations = F.Animate.animations || {};
				var animations = F.Animate.animations[that.node.DOM];
				
				if (animations) {
					that.stop(animations);
				}
				
				F.Animate.animations[that.node.DOM] = [];
				animations = F.Animate.animations[that.node.DOM];
				
				for (var i = 0, j = that.objects.length; i < j; i++) {
					
					var object = that.objects[i];
					
					that.ani = new that.object(object, that.duration);
					
					if (that.events && (i == [that.objects.length - 1])) {
						for (var k = 0, l = that.events.length; k < l; k++) {
							var e = that.events[k];
							that.ani.addEventListener(e.type, e.handler, e.useCapture);
						}
					}
					
					animations.push(that.ani);
					that.ani.start();
				}
				
				return that;
			},
			
			stop : function(animations) {
				animations = animations || F.Animate.animations[that.node.DOM];
				
				for (var i = 0, j = animations.length; i < j; i++) {
					animations[i].stop();
				}
			},
			
			resume : function() {
				that.ani.resume();
			},
			
			getFrom : function(to, node) {
				
				var toHyphenCase = function(e) {
					var match = e.match(/[a-z]+([A-Z]+)/g);
					if (RegExp.$1) {
						e = e.replace(RegExp.$1, "-" + RegExp.$1.toLowerCase());
					}
					return e;
				};
				
				var computed = doc.defaultView.getComputedStyle(node, null),
				    key, from, value;
				
				var object = {};
				
				for (key in to) {
					if (to.hasOwnProperty(key)) {
						if (key == "borderWidth") {
							key = "borderTopWidth";
						}
						try {
							from = computed.getPropertyValue(toHyphenCase(key));
						} catch(e) {
							from = 0;
						}
						object[key] = (!from || (from == "auto")) ? 0 : parseFloat(from);
					}
				}
				
				var opacity = object.opacity;
				if (opacity) {
					object.opacity = (opacity <= 1) ? (opacity * 100) : opacity;
				}
				
				return object;
			},
			
			addEventListener : function(type, handler, useCapture) {
				that.events = that.events || [];
				that.events.push({
					type : type,
					handler : handler,
					useCapture : useCapture
				});
			},
			
			object : function(options, duration) {
				
				var obj;
				return {
					linearTween : function(time, begin, change, duration) {
						return change * time / duration + begin;
					},
					
					init : function(options, duration) {
						obj = this;
						obj.addEventListener(obj);

						for (var key in options) {
							obj[key] = options[key];
						}
	
						var equations = F.Animate.equations;
						if (obj.tween && equations) {
							var tween = obj.tween.split(".");
							obj.tween = equations;
							for (var i = 0, j = tween.length; i < j; i++) {
								var e = tween[i];
								switch (e.toLowerCase()) {
									case "easein" :
									case "in" :
									e = "i";
									break;
				
									case "easeout" :
									case "out" :
									e = "o";
									break;
				
									case "easeinout" :
									case "inout" :
									e = "io";
									break;
								}
								obj.tween = obj.tween[e];
							}
						} else {
							obj.tween = obj.linearTween;
						}
						
						obj.suffix = obj.suffix || "px";
						obj.begin = obj.begin || 0;
						
						if (F.Browser.IE && (obj.prop == "opacity") && (obj.node.style.filter === "")) {
							obj.begin = 100;
						}

						obj._pos = options.begin;

						obj.setDuration(duration);

						obj.setFinish(obj.end);
						return obj;
					},
					
					setTime : function(t) {
						obj.prevTime = obj._time;
						if (t > obj._duration) {
							obj._time = obj._duration;
							obj.update();
							obj.stop();
							obj.dispatchEvent("oncomplete");
						} else if (t < 0) {
							obj.rewind();
							obj.update();
						} else {
							obj._time = t;
							obj.update();
						}
					},

					getTime : function() {
						return obj._time;
					},

					setDuration : function(d) {
						obj._duration = (d === null || d <= 0) ? 500 : d;
					},

					setPosition : function(p) {
						obj.prevPos = obj._pos;
						var a = obj.suffix;
						
						if (obj.prop == "opacity") {
							obj.node.style[obj.prop] = (p / 100);
							if (F.Browser.IE) {
								// Triggering hasLayout for IE (filter prop requires this)
								obj.node.style.zoom = obj.node.style.zoom || 1;
								obj.node.style.filter = "alpha(opacity=" + p + ")";
							}
						} else {
							try {
								obj.node.style[U.toCamelCase(obj.prop)] = Math.round(p) + a;
							} catch(e) {}
						}
						
						obj._pos = p;
						obj.dispatchEvent("onreadystatechange");
					},

					getPosition : function(t) {
						if (t == undefined) {
							t = obj._time;
						}

						return obj.tween(t, obj.begin, obj.change, obj._duration);
					},

					setFinish : function(f) {
						obj.change = f - obj.begin;
					},

					rewind : function(t) {
						obj.stop();
						obj._time = (t == undefined) ? 0 : t;
						obj.fixTime();
						obj.update();
					},

					update : function() {
						obj.setPosition(obj.getPosition(obj._time));
					},

					startEnterFrame : function() {
						obj.stopEnterFrame();
						obj.isPlaying = true;
						obj.onEnterFrame();
					},

					onEnterFrame : function() {
						if(obj.isPlaying) {
							obj.nextFrame();
							var that = obj;
							setTimeout(function() {
								that.onEnterFrame.call(that, that.onEnterFrame);
							}, 0);
						}
					},

					nextFrame : function() {
						obj.setTime((obj.getTimer() - obj._startTime) / 1000);
					},

					start : function() {
						obj.rewind();
						obj.startEnterFrame();
						obj.dispatchEvent("onstart");
					},

					stop : function() {
						obj.stopEnterFrame();
						obj.dispatchEvent("onstop", {
							halted : true
						});
					},

					stopEnterFrame : function() {
						obj.isPlaying = false;
					},

					continueTo : function(finish, duration) {
						obj.begin = obj._pos;
						obj.setFinish(finish);
						if (obj._duration != undefined) {
							obj.setDuration(duration);
						}
						obj.start();
					},

					resume : function() {
						obj.fixTime();
						obj.startEnterFrame();
						obj.dispatchEvent("onresume");
					},

					addEventListener : function(type, callback) {
						obj.events = obj.events || {};
						type = "on" + type;
						if (!obj.events[type]) {
							obj.events[type] = [];
						}
						obj.events[type].push(callback);
						return obj;
					},

					dispatchEvent : function(type, params) {
						params = params || {};
						params.type = type;
						params.tween = obj;
						if (obj.events[type]) {
							for (var i = 0, j = obj.events[type].length; i < j; i++) {
								obj.events[type][i].call(obj.node, params);
							}
						}
					},

					fixTime : function() {
						obj._startTime = obj.getTimer() - obj._time * 1000;
					},

					getTimer : function() {
						return new Date().getTime() - obj._time;
					}
				}.init(options, duration);
			}
		}.init(options, duration);
	}
});

new Flow.Plugin({
	name : "Fx",
	version : "1.1",
	constructor : function(animation) {
		Flow.Fx[animation.name] = animation.constructor;
	}
});