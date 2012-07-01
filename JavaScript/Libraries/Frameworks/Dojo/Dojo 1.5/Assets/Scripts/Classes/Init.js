/*
 * Declare file structure (used by Dojo loader/build system)
 * I've configured th Dojo 'modulePaths' setting so instead of specifying a file structure 
 * (e.g. Assets.Scripts.Classes.Init) 
 * I use the namespace in 'modulePaths'
 */
dojo.provide('Integralist.Init');

// Specify the file's dependencies
dojo.require('Integralist.Load');

/*
 * Create Class that will initialise the application.
 * @param {String},	The optional name of the Class to declare. The name will be stored in the property "declaredClass" in the created prototype.
 * @param {Class},	null (no base class) || an object (a base class) || an array of objects (multiple inheritance).
 * @param {Object},	an object whose properties are copied to the created prototype after all other inheritance has been solved.
 */
dojo.declare('MyApp', null, {
	// You can add an instance-initialization function by making it a property named "constructor".
	constructor: function(config) {
		this.version = config.version || '1.0';
		this.author = config.author || 'Unknown';
	}
});

var myapp = new MyApp({
	author: 'Mark McDonnell'
});

alert(myapp.author);
alert(myapp.version);