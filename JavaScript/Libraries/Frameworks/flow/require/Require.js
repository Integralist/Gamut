/*
Namespace: The Require Namespace
	On demand javascript lets you dynamically include scripts and styles on your page.

About: Version
	1.1.1

License:
	- Created by Champ Bennett. Released to the public domain.
	
	- Modified by Richard Herrera <http://doctyper.com>
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Flow.js.
*/

new Flow.Plugin({
	name : "Require",
	version : "1.1.1",
	constructor : function(type, uri, managed) {
		var head, script, style,
		    that = this;

		if (managed) {
			// Create cache of required scripts
			that.required = that.required || {};
			
			// test if script has already been required
			if (that.required[uri]) {
				return;
			} else {
				// Add to list of already included scripts
				that.required[uri] = uri;
			}
		}
		
		head = document.getElementsByTagName("head")[0];
		
		switch (type) {
			case "js" :
			case "javascript" :
			
			// Keep a record of multiple requests (if any)
			that.files = that.files || [];
			that.files.push(uri);
			
			var createScript = function(uri) {
				// create new script element in head
				script = document.createElement("script");
				script.setAttribute("type", "text/javascript");
				script.setAttribute("src", uri);
				head.appendChild(script);
				
				var evt = Flow.Browser.IE ? "readystatechange" : "load";
				
				script["on" + evt] = function() {
					// console.log(this);
					loadNextScript();
				};
			};
			
			var loadNextScript = function() {
				if (that.files && that.files[++that.currentIndex]) {
					createScript(that.files[that.currentIndex]);
				} else {
					delete that.files;
					delete that.isBusy;
					delete that.currentIndex;
				}
			};
			
			if (!that.isBusy) {
				that.isBusy = true;
				that.currentIndex = 0;
				createScript(that.files[that.currentIndex]);
			}
			
			return script;
			
			case "css" :
			case "style" :
			case "stylesheet" :
			// create new script element in head
			style = document.createElement("link");
			style.setAttribute("charset", "utf-8");
			style.setAttribute("rel", "stylesheet");
			style.setAttribute("type", "text/css");
			style.setAttribute("media", "screen");
			style.setAttribute("href", uri);
			head.appendChild(style);
			
			return style;
		}
	}
});

new Flow.Plugin({
	name : "RequireCSS",
	constructor : function(uri) {
		return Flow.Require("stylesheet", uri, true);
	}
});

new Flow.Plugin({
	name : "RequireJS",
	constructor : function(uri) {
		return Flow.Require("javascript", uri, true);
	}
});

new Flow.Plugin({
	name : "RequireOnce",
	constructor : function(type, uri) {
		return Flow.Require(type, uri, true);
	}
});
