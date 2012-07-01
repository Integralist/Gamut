package {
	// import flash classes
	import flash.events.Event;
	
	// create class
	public class CustomEvent extends Event {
		// public properties
		public static const CUSTOM:String = "custom"; // This is the constant that will allow a scripter to specify this event, the same way you use CLICK to declare a click event of the MouseEvent class.
		public var arg:*; // This is a public property for any data you want to send with the event. In this simple case, the value is typed using the asterisk, which will prevent type checking allowing any data type to be used.
		
		// constructor
		public function CustomEvent(type:String, 
									customArg:*=null, 
									bubbles:Boolean=false, 
									cancelable:Boolean=false) { // Only the custom argument (customArg) is different from a standard event. It is placed second in the list of parameters so you can omit the last few parameters from the event dispatch. 
			// call the Event constructor
			super(type, bubbles, cancelable);
			
			// set public property
			this.arg = customArg;
		}
		
		// override the Event class' "clone" method
		public override function clone():Event {
			return new CustomEvent(type, arg, bubbles, cancelable);
			
			/* 
			This is necessary to insure that your event will behave properly if you ever need to redispatch it. 
			The clone() method is called automatically for a built-in class 
			but, when extending a class, you must account for the new features of your class and override the original method. 
			Without including this override, none of the event attributes will carry through and you will receive an error.
			*/
		}
		
		// override the Event class' "toString" method
		public override function toString():String {
			return formatToString("CustomEvent", "type", "arg", "bubbles", "cancelable", "eventPhase");
			
			/*
			If you override the toString() method as well, 
			including your class name, custom argument, and original event attributes (type, bubbles, and cancelable), 
			your custom class info will appear in any trace of the event. 
			This is handy for quick references to property names.
			*/
		}
	}
}