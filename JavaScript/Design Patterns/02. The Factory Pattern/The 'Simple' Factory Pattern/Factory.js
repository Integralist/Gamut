/* The Bicycle interface. */
var Bicycle = new Interface('Bicycle', ['assemble', 'wash', 'ride', 'repair']);

/* BicycleFactory namespace. */

var BicycleFactory = {
	createBicycle: function(model) 
	{
		var bicycle;
		
		switch(model) {
			case 'The Speedster':
				bicycle = new Speedster();
				break;
			case 'The Lowrider':
				bicycle = new Lowrider();
				break;
			case 'The Comfort Cruiser':
			default:
				bicycle = new ComfortCruiser();
		}
		
		// Make sure the 'bicycle' object implements the Bicycle interface
		Interface.ensureImplements(bicycle, Bicycle);
		
		return bicycle;
	}
};

/* BicycleShop class. */

var BicycleShop = function() {};
BicycleShop.prototype = {
	sellBicycle: function(model) 
	{
		// We created a Factory to handle the instantiation of the relevant bicycle
		// We have now 'de-coupled' this functionality from the BicycleShop Class
		var bicycle = BicycleFactory.createBicycle(model);
		
		bicycle.assemble();
		bicycle.wash();
		
		return bicycle;
	}
};

/* Speedster class. */

var Speedster = function() { /* implements Bicycle */ };
Speedster.prototype = {
	assemble: function() 
	{
		alert('assemble');
	},
	
	wash: function() 
	{
		alert('wash');
	},
	
	ride: function() 
	{
		alert('ride');
	},
	
	repair: function() 
	{
		alert('repair');
	}
};

// To sell a certain model of bike, call the sellBicycle method:
var californiaCruisers = new BicycleShop();
var yourNewBike = californiaCruisers.sellBicycle('The Speedster');
