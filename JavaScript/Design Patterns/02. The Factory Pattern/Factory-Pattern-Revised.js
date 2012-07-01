// @kitgoncharov
// An alternative implementation of the Factory/Constructor Pattern in JavaScript: https://gist.github.com/759335

var Factory = function (argument) {
	return new Factory.prototype.initialize(argument);
};

Factory.prototype = {
	'constructor': Factory,
	
	'initialize': function (argument) {
		this.argument = argument;
		return this;
	}
};

Factory.prototype.initialize.prototype = Factory.prototype;

// Examples...
var instance = Factory('Argument');
console.log(instance.argument === 'Argument');
console.log(instance instanceof Factory);
console.log(instance instanceof Factory.prototype.initialize);

// Hooray!
console.log(instance.constructor === Factory);

// Also...
console.log(instance.initialize('Different Argument'));
console.log(instance.argument === 'Different Argument');