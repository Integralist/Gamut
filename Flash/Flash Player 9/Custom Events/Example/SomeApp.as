package 
{
	/*
	To demonstrate the use of the ToggleEvent.TOGGLE event, 
	let’s create a simple example class, SomeApp. 
	
	The SomeApp class defines a method, toggleListener( ), and registers it with a 
	ToggleSwitch object for ToggleEvent.TOGGLE events. 
	
	For demonstration purposes, the SomeApp class also programmatically toggles the switch on, 
	triggering a ToggleEvent.TOGGLE event.
	*/
	
	import flash.display.*;
	
	// A generic application that demonstrates the use of the custom ToggleEvent.TOGGLE event
	public class SomeApp extends Sprite 
	{
		// Constructor
		public function SomeApp() 
		{
			// Create a ToggleSwitch
			var toggleSwitch:ToggleSwitch=new ToggleSwitch;
			
			// Register for ToggleEvent.TOGGLE events
			toggleSwitch.addEventListener(ToggleEvent.TOGGLE,toggleListener);
			
			// Toggle the switch (normally the switch would be toggled by the user, 
			// but for demonstration purposes, we toggle it programmatically)
			toggleSwitch.toggle();
		}
		
		// Listener executed whenever a ToggleEvent.TOGGLE event occurs
		private function toggleListener(e:ToggleEvent):void 
		{
			if (e.isOn) 
			{
				trace("The ToggleSwitch is now on.");
			}
			else
			{
				trace("The ToggleSwitch is now off.");
			}
		}
	}
}