/**
 * The following code is an example of a Singleton
 * and also implements 'lazy loading' to help efficiency.
 *
 * @pattern {Singleton}
 * @param {Object}
 * @return {Object}
 */
 
/**
 * The MyNameSpace global namespace object.  
 * If MyNameSpace is already defined the existing MyNameSpace object will not be overwritten
 *
 * @class MyNameSpace
 * @static
 */
if (typeof MyNameSpace == "undefined" || !MyNameSpace) {
	var MyNameSpace = {};
}

MyNameSpace.Singleton = (function() 
{
	/**
	 * We use a 'self-executing' function to create a Closure.
	 * Closure's help create 'private' members
	 */
	
	// Private attribute that holds the single instance
	var uniqueInstance;
	
	// Private method which holds all of the normal singleton code
	function Constructor() 
	{
		// Private members
		var privateAttribute1 = false;
		var privateAttribute2 = [1, 2, 3];
		
		// Private method
		function privateMethod() 
		{
			return 'my private method';
		}
		
		return {
			publicAttribute1: true,
			publicAttribute2: 10,
			
			publicMethod: function()
			{
				alert('privateAttribute1 = ' + privateAttribute1);
				alert('privateAttribute2 = ' + privateAttribute2);
				alert('this.publicAttribute1 = ' + this.publicAttribute1);
				alert('this.publicAttribute2 = ' + this.publicAttribute2);
				alert('privateMethod() = ' + privateMethod());
			}
		}
	}
	
	return {
		getInstance: function()
		{
			// Instantiate only if the instance doesn't exist.
			if (!uniqueInstance) {
				uniqueInstance = Constructor();
			}
			
			return uniqueInstance;
		}
	}
})();
	
/**
 * Now this singleton uses 'lazy loading' we must make sure we use the correct function calls
 *
 * e.g. 
 * MyNamespace.Singleton.getInstance().publicMethod1();
 *
 * Notice we can 'chain' the methods because 'getInstance' returns the function object itself rather than a value.
 */
 
MyNameSpace.Singleton.getInstance().publicMethod();
