require(['forEach', 'indexOf', 'filter', 'unique'], function(forEach, indexOf, filter, unique){
	
	var obj = { test:'abc' };
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
	function forEachCallback(value, index, array) {
		console.log(this, value, index, array);
	}
	
	console.group('forEach');
		forEach(['a','b','c'], forEachCallback, obj); // 3rd argument is value of 'this' (if not specified then global object used as 'this')
	console.groupEnd();
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	console.group('indexOf');
	console.log(
		indexOf(['a','b','c'], 'b'), // 1
		indexOf(['a','b','c'], 'x')  // -1
	);
	console.groupEnd();
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
	function filterCallback(value, index, array) {
		console.log(this, value, index, array);		
		
		return (value === 'a' || value === 'c') ? true : false; // keep either of these two values in new Array
		
	}
	
	console.group('filter');
		var A = filter(['a','b','c'], filterCallback),
			B = filter(['a','b','c'], filterCallback, obj);
		console.log(A, B);
	console.groupEnd();
	
	console.group('unique');
		console.log(unique(['a','b','c','a','b','c'])); // return a new Array of unique items
	console.groupEnd();
	
});