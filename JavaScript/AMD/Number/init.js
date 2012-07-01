require(['pad'], function(pad){
	
	console.group('pad');
		console.log(pad(1, 5));      // 00001
		console.log(pad(12, 5));     // 00012
		console.log(pad(123, 5));    // 00123
		console.log(pad(1234, 5));   // 01234
		console.log(pad(12345, 5));  // 12345
		console.log(pad(123456, 5)); // 123456
	console.groupEnd();
	
});