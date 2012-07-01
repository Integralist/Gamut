/*
Namespace: The Class Namespace
	Classical inheritance model provided by John Resig.

About: Version
	1.1.1

License:
	- Created by John Resig <http://ejohn.org/blog/simple-javascript-inheritance>
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	Flow.js.
*/

new Flow.Plugin({
	name : "Class",
	version : "1.1.1",
	constructor : // Inspired by base2 and Prototype
	function() {
		var initializing = false,
		    fnTest = (/xyz/.test(function(){xyz;}) ? (/\b_super\b/) : /.*/);
		// The base Class implementation (does nothing)
		this.Class = function() {};
		
		var Class = this.Class;
		
		// Create a new Class that inherits from this class
		Class.extend = function(prop) {
			var _super = this.prototype;
			
			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			var _prototype = new this();
			initializing = false;
			
			// Copy the properties over onto the new prototype
			for (var name in prop) {
				// Check if we're overwriting an existing function
				_prototype[name] = typeof prop[name] == "function" && 
				typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
					return function() {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);        
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) : prop[name];
			}
			
			// The dummy class constructor
			function Class() {
				// All construction is actually done in the init method
				if (!initializing && this.init) {
					this.init.apply(this, arguments);
				}
			}
			
			// Populate our constructed prototype object
			Class.prototype = _prototype;
			
			// Enforce the constructor to be what we expect
			Class.constructor = Class;
			
			// And make this class extendable
			Class.extend = arguments.callee;
			
			return Class;
		};
	}
});

(function() {
	Flow.Class();
})();