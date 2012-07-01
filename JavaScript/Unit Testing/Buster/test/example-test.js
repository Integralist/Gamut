// Create a new assertion
buster.assertions.add('myIsArray', {
	assert: function (obj) {
		return Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
	}
});

// Typically, you have one test case per file
buster.testCase('My test module', {
    
    // Can't have empty setUp/tearDown methods, but I leave them here to remember the syntax
    
    setUp: function(){
    	this.clock = this.useFakeTimers(); // needed for async tests - modifies setTimeout/Interval to be synchronous (see: http://sinonjs.org/docs/#clock)
    },
    
    tearDown: function(){
        this.clock.restore(); // put back the original asynchronous versions of setTimeout/Interval
    },
    
    // Two forward slashes at the start of a test case's name indicates that it should be ignored but shown in the results as 'deferred'    
    '//A test that I want to comment out for a while but not hide from the test results': function(){
    	var num = 123;
    	assert.match(num, 123);
    },
    
    'an async test': function(){
    	var num;
    	
        window.setTimeout(function(){
    		num = 123;
    	}, 10000);
    	
    	this.clock.tick(10000);
    	
    	assert.match(num, 123);
    },
    
    // Test case
    'A bad test (as it tests random stuff when it should test specific functionality)': function(){
    	// See all assertions: http://busterjs.org/docs/assertions/
		
		/* Assertion: assert
		 *******************/
		
		var user = canDrink(18);
		assert(user);
		
		/*
		var mytest = false;
		assert(mytest, 'my failure message taken from the assert that failed!');
		*/
		
		/* Assertion: match (regex)
		 **************************/
		
		var test = 'This is my string with some {{data}} inside of {{template}} brackets';
		assert.match(test, /{{[a-z]+}}/i);
		
		/* Assertion: match (element)
		 ****************************/
		
		var elem = document.createElement('h1'),
			txt = document.createTextNode('some text');
		
		elem.className = 'myClass';
		elem.appendChild(txt);
		
		assert.match(elem, {
			tagName: 'h1',
			className: 'myClass',
			innerHTML: 'some text'
		});
		
		/* Assertion: same (===)
		 ***********************/
		 
		var str1 = 'a',
			str2 = 'a',
			str3 = 'c',
			str4 = 'd';
			
		assert.same(str1, str2);
		refute.same(str3, str4);
		
		/* Assertion: equals (checks properties)
		 ***************************************/

		var obj1 = { name:'bob', age:123 },
			obj2 = { name:'bob', age:123 },
			obj3 = { name:'sam', age:123 },
			obj4 = { name:'jon', age:456 };
			
		assert.equals(obj1, obj2);
		refute.equals(obj3, obj4);
		
		/* Assertion: typeOf
		 *******************/

		/*
		assert.typeOf({}, 'object', 'This will pass');
		assert.typeOf({}, 'object');
		assert.typeOf('bobby', 'string');
		refute.typeOf(null, 'function');
		refute.typeOf([], 'array'); // doesn't use Object.prototype.toString.call() to see inner [[Class]] property so [] equals 'object'
		assert.myIsArray([]); // so we build our own
		*/
		
		/* Assertion: defined (if the value is anything other than undefined)
		 ********************************************************************/

		assert.defined.message = 'my specified item seems to be undefined?'; // changed default message
		var a;
		assert.defined({});
		refute.defined(a);
		
		/* Assertion: isNull (fails if the object is not null)
		 *****************************************************/

		assert.isNull(null, 'This will pass');
		refute.isNull({});
		
		/* Assertion: isObject (fails if object is null or not an object)
		 ****************************************************************/

		assert.isObject({});
		assert.isObject([1, 2, 3]);
		refute.isObject(42);
		refute.isObject(function(){});
		
		/* Assertion: isFunction (fails if object is not a function)
		 ***********************************************************/

		refute.isFunction({});
		refute.isFunction(42);
		assert.isFunction(function(){});
		
		/* Assertion: tagName (Fails if the element either does not specify a tagName property, or if its value is not a case-insensitive match with the expected tagName)
		 *****************************************************************************************************************************************************************/

		assert.tagName(document.createElement('p'), 'p');
		assert.tagName(document.createElement('h2'), 'H2');
		refute.tagName(document.createElement('p'), 'li');
		
		/* Assertion: className (Fails if the element either does not specify a className property, or if its value is not a space-separated list of all class names in classNames)
		 **************************************************************************************************************************************************************************/
		 
		var el = document.createElement('p');
		el.className = 'feed item blog-post';
		
		assert.className(el, 'item');
		assert.className(el, 'blog-post feed');
		assert.className(el, ['item', 'feed']);
		refute.className(el, 'feed items');
		refute.className(el, 'news');
    }
    
});