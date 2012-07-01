package 
{
	/*
	The ToggleSwitch class represents the toggle switch. 
	The ToggleSwitch class’s sole method, toggle( ), changes the state of the toggle switch, 
	and then dispatches a ToggleEvent.TOGGLE event indicating that the switch’s state has changed. 
	The following code shows the ToggleSwitch class. 
	
	Notice that the ToggleSwitch class extends Sprite, which provides support for onscreen display. 
	As a descendant of EventDispatcher, the Sprite class also provides the required 
	eventdispatching capabilities:
	*/

	import flash.display.*;
	import flash.events.*;

	// Represents a simple toggle-switch widget
	public class ToggleSwitch extends Sprite 
	{
		// Remembers the state of the switch
		private var isOn:Boolean;
		
		// Constructor
		public function ToggleSwitch() 
		{
			// The switch is off by default
			isOn=false;
		}
		
		// Turns the switch on if it is currently off, or off if it is currently on
		public function toggle():void 
		{
			// Toggle the switch state
			isOn=! isOn;
			
			// Ask ActionScript to dispatch a ToggleEvent.TOGGLE event,
			// targeted at this ToggleSwitch object
			dispatchEvent(new ToggleEvent(ToggleEvent.TOGGLE,true,false,isOn));
		}
	}
}