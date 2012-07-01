addEvent(window, 'load', function()
{
	document.body.style.cursor = 'pointer';
});

/*
programme to an Interface(getBeerByIdBridge) not an implementation(getBeerById)!
*/

function getBeerById(id, callback) 
{ 
	// Make request for beer by ID, then return the beer data. 
	asyncRequest('GET', 'beer.php?id=' + id, function (resp) { 
		// callback response 
		callback(resp.responseText); 
	}); 
} 

addEvent(document, 'click', getBeerByIdBridge); 

function getBeerByIdBridge (e) 
{ 
	getBeerById(123, function (beer) 
	{ 
		console.log('Requested Beer: ' + beer); 
	}); 
} 