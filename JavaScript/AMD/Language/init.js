require(['bind', 'create'], function(bind, create){
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	console.group('bind');
		x = 9; // global variable
		var module = {
				x: 81,
				getX: function(){ return this.x; }
			};
		
		console.log('module.getX() = ', module.getX()); // 81
		
		var getX = module.getX;
		console.log('getX() = ', getX()); // 9, because in this case, "this" refers to the global object
		
		// create a new function with 'this' bound to module
		var boundGetX = bind(getX, module);
		console.log('boundGetX() = ', boundGetX()); // 81
	console.groupEnd();
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
	console.group('create');
		var parent = { test: 'abc' },
			newObject = create(parent, { name: 'Mark' }); // we can also mixin new properties at same time as creation of new object
		console.log(
			'newObject.name = ', newObject.name, 
			'\nnewObject.test = ', newObject.test
		);
	console.groupEnd();
	
});