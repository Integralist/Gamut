require(['split', 'toTimeString'], function(split, toTimeString){
	
	console.group('split');
		console.log(2348765454, split(2348765454)); 	// {days: 27, hours: 4, minutes: 26, seconds:5, milliseconds: 454}
	console.groupEnd();
	
	console.group('toTimeString');
		console.log(12513, toTimeString(12513));   		// "00:00:12"
		console.log(951233, toTimeString(951233));  	// "00:15:51"
		console.log(8765235, toTimeString(8765235)); 	// "02:26:05"
	console.groupEnd();
	
});