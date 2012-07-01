/*
Namespace: The Cookie Namespace
	Cookie management. Includes functions to set, get and delete cookies.

About: Version
	1.1.1

License:
	- Created by Noel Del Rosario <http://alter.hk>. Released to the public domain.
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Flow.js.
*/

new Flow.Plugin({
	name : "Cookie",
	version : "1.1.1",
	bind : true,
	constructor : {

		document : {

			setCookie : function(name, val, options) {

				var cookieString = name + "=" + val + ";";

				// Sets options (if passed)
				if (typeof options == "object") {

					// Set Max Age
					if (options.maxAge) {
						cookieString += "max-age=" + options.maxAge + ";";
					}

					// Set Domain
					if (options.domain) {
						cookieString += "domain=" + options.domain + ";";
					}

					// Set Secure
					if (options.secure) {
						cookieString += "secure;";
					}
				}

				if(typeof options == "object" && options.path) {
					cookieString += "path=" + options.path + ";";
				} else {
					cookieString += "path=/;";	
				}

				/**
				 * @returns created cookie
				*/
				this.cookie = cookieString;
			},

			getCookie : function(name) {
				name += "=";

				// Split cookie
				var chip = this.cookie.split(";");

				for (var i = 0; i < chip.length; i++) {
					while (chip[i].charAt(0) == " ") {
						chip[i] = chip[i].substring(1, chip[i].length);
					}

					// Grab cookie name
					if (chip[i].indexOf(name) === 0) {
						
						var cookie = chip[i].substring(name.length, chip[i].length);
						cookie = (cookie === "") ? null : cookie;
						
						/**
						 * @returns cookie
						*/
						return cookie;
					}
				}

				/**
				 * @returns null
				*/
				return null;
			},

			/**
			 * @note: del.awesome is false
			 */
			deleteCookie : function(name) {

				// Delete cookie
				this.setCookie(name, "", {
					maxAge: -1
				});

				if (!this.getCookie(name)) {
					/**
					 * @returns true
					*/
					return true;
				}
			}

		}
	}
});