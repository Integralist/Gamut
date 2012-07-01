/* The Bicycle interface. */
var Bicycle = new Interface ('Bicycle', ['assemble', 'wash', 'ride', 'repair']);

/* BicycleShop class (abstract) */

var BicycleShop = function() {};
BicycleShop.prototype = {
	sellBicycle: function (model) 
	{
		var bicycle = this.createBicycle(model);
		
		bicycle.assemble();
		bicycle.wash();
		
		return bicycle;
	},
	
	/**
	 * You define a createBicycle method, but it will throw an error if it is actually invoked. 
	 * BicycleShop is now abstract; it should not be instantiated, only subclassed.
	 * To create a subclass that uses a specific bicycle manufacturer, 
	 * extend BicycleShop and override the createBicycle method. 
	 */
	createBicycle: function (model) 
	{
		throw new Error ('Unsupported operation on an abstract class.');
	}
};

/* AcmeBicycleShop class. */

var AcmeBicycleShop = function() {};

// Extend the AcmeBicycleShop Class so it inherits all the methods from the BicycleShop Class
extend(AcmeBicycleShop, BicycleShop);

AcmeBicycleShop.prototype.createBicycle = function(model) 
{
	var bicycle;
	
	switch (model) {
		case 'The Speedster':
			bicycle = new AcmeSpeedster();
			break;
		case 'The Lowrider':
			bicycle = new AcmeLowrider();
			break;
		case 'The Flatlander':
			bicycle = new AcmeFlatlander();
			break;
		case 'The Comfort Cruiser':
		default:
			bicycle = new AcmeComfortCruiser();
	}
	
	// Make sure the 'bicycle' object implements the Bicycle interface
	Interface.ensureImplements(bicycle, Bicycle);
	
	return bicycle;
};

/* GeneralProductsBicycleShop class. */

var GeneralProductsBicycleShop = function() {};

// Extend the GeneralProductsBicycleShop Class so it inherits all the methods from the BicycleShop Class
extend(GeneralProductsBicycleShop, BicycleShop);

GeneralProductsBicycleShop.prototype.createBicycle = function(model) 
{
	var bicycle;

	switch (model) {
		case 'The Speedster':
			bicycle = new GeneralProductsSpeedster();
			break;
		case 'The Lowrider':
			bicycle = new GeneralProductsLowrider();
			break;
		case 'The Flatlander':
			bicycle = new GeneralProductsFlatlander();
			break;
		case 'The Comfort Cruiser':
		default:
			bicycle = new GeneralProductsComfortCruiser();
	}
	
	// Make sure the 'bicycle' object implements the Bicycle interface
	Interface.ensureImplements(bicycle, Bicycle);
	
	return bicycle;
};

/**
 * NOTE: I've only created two of the Sub Classes ('AcmeLowrider' and 'GeneralProductsLowrider')
 * I've done this to simplify/shorten the code example
 */
var AcmeLowrider = function() { /* implements Bicycle */ };
AcmeLowrider.prototype = {
	assemble: function() 
	{
		alert('AcmeLowrider assemble');
	},
	
	wash: function() 
	{
		alert('AcmeLowrider wash');
	},
	
	ride: function() 
	{
		alert('AcmeLowrider ride');
	},
	
	repair: function() 
	{
		alert('AcmeLowrider repair');
	}
};

var GeneralProductsLowrider = function() { /* implements Bicycle */ };
GeneralProductsLowrider.prototype = {
	assemble: function() 
	{
		alert('GeneralProductsLowrider assemble');
	},
	
	wash: function() 
	{
		alert('GeneralProductsLowrider wash');
	},
	
	ride: function() 
	{
		alert('GeneralProductsLowrider ride');
	},
	
	repair: function() 
	{
		alert('GeneralProductsLowrider repair');
	}
};

/**
 * All of the objects created from these factory methods respond to the Bicycle interface,
 * so any code written can treat them as being completely interchangeable.
 * Selling bicycles is done in the same way as before,
 * only now you can create shops that sell either Acme or General Products bikes:
 */
var alecsCruisers = new AcmeBicycleShop();
var yourNewBike = alecsCruisers.sellBicycle('The Lowrider');

var bobsCruisers = new GeneralProductsBicycleShop();
var yourSecondNewBike = bobsCruisers.sellBicycle('The Lowrider');
