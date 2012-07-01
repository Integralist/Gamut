package 
{
	/*
	Our custom event will be represented by its own class, ToggleEvent. 
	The ToggleEvent class has the following two purposes:
	
		• Define the constant for the toggle event (ToggleEvent.TOGGLE)
		• Define a variable, isOn, which listeners use to determine the state of the target ToggleSwitch object
	
	The code for the ToggleEvent class follows. 
	Note that every custom Event subclass must override both clone( ) and toString( ), 
	providing versions of those methods that account for any custom variables in the subclass (e.g., isOn).
	
	The toggle switch code in this section focuses solely on the implementation of the
	toggle event; the code required to create interactivity and graphics is omitted.
	*/
	
	
	import flash.events.*;
	
	// A class representing the custom "toggle" event
	public class ToggleEvent extends Event 
	{
		// A constant for the "toggle" event type
		public static  const TOGGLE:String="toggle";
		
		// Indicates whether the switch is now on or off
		public var isOn:Boolean;
		
		// Constructor
		public function ToggleEvent(type:String,bubbles:Boolean=false,cancelable:Boolean=false,isOn:Boolean=false) 
		{
			// Pass constructor parameters to the superclass constructor
			super(type,bubbles,cancelable);
			
			// Remember the toggle switch's state so it can be accessed within ToggleEvent.TOGGLE listeners
			this.isOn=isOn;
		}
		
		// Every custom event class must override clone( )
		public override  function clone():Event 
		{
			return new ToggleEvent(type,bubbles,cancelable,isOn);
		}
		
		// Every custom event class must override toString( ).
		// Note that "eventPhase" is an instance variable relating to the event flow.
		public override  function toString():String 
		{
			return formatToString("ToggleEvent","type","bubbles","cancelable","eventPhase","isOn");
		}
	}
}