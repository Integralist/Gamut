/*
Namespace: The Viewport Namespace
	Viewport includes window and screen dimension reporting, window position and popup functions.

About: Version
	1.1.1

License:
	- Created by Michael Bester <http://kimili.com>. Released to the public domain.
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Flow.js.
*/

new Flow.Plugin({
	name : "Viewport",
	version : "1.1.1",
	constructor : function() {
		var doc = document,
		    body = "body",
		    docElement = "documentElement",
		    win = window;

		return {
			/**
			 *	getSize()
			 *	Cross-browser script to get the current size of the browser win without chrome in pixels.
			 * 
			 *	@returns {Object} Contains the height and width of a user's win in a JSON object, like so: { w : 820, h : 600 }
			**/
			getSize : function() {
				var size = {};
				if (Flow.Browser.WK) {
					size.w = self.innerWidth;
					size.h = self.innerHeight;
				} else if (Flow.Browser.OP) {
					size.w = doc[body].clientWidth;
					size.h = doc[body].clientHeight;
				} else {
					size.w = doc[docElement].clientWidth;
					size.h = doc[docElement].clientHeight;
				}
				return size;
			},

			/**
			 *	getScreenSize()
			 *	Allows you to get the size of a user's screen in pixels.
			 * 
			 *	@returns {Object} Contains the height and width of a users screen in a JSON object, like so: { w : 1024, h : 768 }
			**/
			getScreenSize : function() { 
				return {
					w : (typeof self.screen.availWidth !== "undefined") ? self.screen.availWidth : self.screen.width,
					h : (typeof self.screen.availHeight !== "undefined") ? self.screen.availHeight : self.screen.height
				};
			},

			/**
			 *	getOuterSize()
			 *	Gets the size of the browser win including chrome in pixels if available.
			 * 
			 *	@returns {Object} Contains the height and width of a users width in a JSON object, like so: { w : 1024, h : 768 } or { w : null, h : null }
			**/
			getOuterSize : function() {
				return {
					w : (typeof self.outerWidth !== "undefined") ? self.outerWidth : null,
					h : (typeof self.outerHeight !== "undefined") ? self.outerHeight : null
				};	
			},

			/**
			 *	getScrollOffset()
			 *	Gets the amount the win has been scrolled, both horozontally and vertically, from the top left corner.
			 * 
			 *	@returns {Object} Contains the horozontal (x) and vertical (y) scroll offsets in a JSON object, like so: { x : 0, y : 120 }
			**/
			getScrollOffset : function() {
				var scroll = {};
				if (Flow.Browser.IE) {
					scroll.x = doc[docElement].scrollLeft;
					scroll.y = doc[docElement].scrollTop;				
				} else if (Flow.Browser.WK) {	
					scroll.x = doc[body].scrollLeft;
					scroll.y = doc[body].scrollTop;
				} else {
					scroll.x = self.pageXOffset;
					scroll.y = self.pageYOffset;
				}
				return scroll;
			},

			/**
			 *	getScrollSize()
			 *	Gets the the total horizontal and vertical scroll sizes
			 * 
			 *	@returns {Object} Contains the horozontal (w) and vertical (h) scroll sizes in a JSON object, like so: { w : 850, h : 1162 }
			**/
			getScrollSize : function() {
				var size = {};
				if (Flow.Browser.IE) {
					size.w = Math.max(doc[docElement].offsetWidth, doc[docElement].scrollWidth);
					size.h = Math.max(doc[docElement].offsetHeight, doc[docElement].scrollHeight);				
				} else if (Flow.Browser.WK) {	
					size.w = doc[body].scrollWidth;
					size.h = doc[body].scrollHeight;
				} else {
					size.w = doc[docElement].scrollWidth;
					size.h = doc[docElement].scrollHeight;
				}
				return size;
			},

			/**
			 *	getPosition()
			 *	Gets the position of the current browser win on the user's screen, measured from the top left corner.
			 * 
			 *	@returns {Object} Contains the horozontal (x) and vertical (y) win coordinates in a JSON object, like so: { x : 210, y : 50 }
			**/
			getPosition : function() {
				return {
					x : (typeof win.screenX !== "undefined") ? win.screenX : win.screenTop,
					y : (typeof win.screenY !== "undefined") ? win.screenY : win.screenLeft
				};
			},

			/**
			 *	getMousePosition()
			 *	Gets the coordinates of the users cursor in the browser win, measured from the top left corner.
			 * 
			 *	@returns {Object} Contains the horozontal (x) and vertical (y) cursor coordinates in a JSON object, like so: { x : 210, y : 50 }
			**/		
			getMousePosition : function(e) {
				var pos = {};
				
				e = e || win.event;

				if ((typeof e.pageX !== "undefined") || (typeof e.pageY !== "undefined")) {
					pos.x = e.pageX;
					pos.y = e.pageY;
				} else if (e.clientX || e.clientY) {
					pos.x = e.clientX + doc[body].scrollLeft + doc[docElement].scrollLeft;
					pos.y = e.clientY + doc[body].scrollTop + doc[docElement].scrollTop;
				}
				return pos;
			},

			/**
			 *	popup()
			 *	Generic popup win generator.
			 *
			 *	@param url {String} The url you want to load in the new win.
			 *	@param options {Object} A JSON object with the win options you want.  Available parameters for the options object are (defaults in parenthesis): width (600), height (400), scrollbars (true), resizable (true), left (horizontally centers win on screen), top (vertically centers win on screen), toolbar (false), location (false), status (false), name ("popup").
			 * 
			 *	@returns {Object} A reference to the newly created popup win.
			 *
			 *	@example var myWin = Flow.Window.popup("http://www.google.com", { height: 600, location: true });
			**/
			popup : function(url) {

				if (!url || url === "") {
					return;
				}

				var options, name, newWin, scr, config = "", opt;

				options = {
					width : 600, 
					height : 400, 
					scrollbars : 1, 
					resizable: 1,
					toolbar : 0,
					location : 0,
					status : 0,
					name : "popup"
				};

				if (arguments.length > 1) {
					if (typeof arguments[1] === "object") {
						for (opt in arguments[1]) {
							if (arguments[1].hasOwnProperty(opt)) {
								options[opt] = arguments[1][opt];
							}
						}
					}
				}

				/*
				 * If top or left not set, center the win
				**/

				scr = Flow.Viewport.getSize();

				if (typeof options.left == "undefined") {
					options.left = (scr.w / 2 - options.width / 2);
				}
				if (typeof options.top == "undefined") {
					options.top	= (scr.h / 2 - options.height / 2);
				}

				/*
				 * Build options string
				**/
				for (opt in options) {
					if (options.hasOwnProperty(opt)) {
						if (opt === 'name') {
							name = options[opt];
						} else {
							if ((typeof options[opt] === 'number' || typeof options[opt] === 'boolean') && (opt !== 'height' && opt !== 'width' && opt !== 'top' && opt !== 'left') ) {
								options[opt] = (Number(options[opt]) === 0) ? 'no' : 'yes';
							}
							config += (opt + "=" + options[opt] + ",");
						}
					}
				}
				
				newWin = window.open(url, name, config.replace(/\,$/,''));			
				if (newWin) {
					newWin.focus();
				}

				/* return newWin; */
			}
		};

	}()
});
