
// DropDownMenu (C) Edvard Toth (03/2008)
//
// http://www.edvardtoth.com
//
// This source is free for personal use. Non-commercial redistribution is permitted as long as this header remains included and unmodified.
// All other use is prohibited without express permission. 

package {
	
	import flash.display.MovieClip;
	import flash.utils.getTimer;
	import flash.events.*;
	import fl.transitions.*;
	import fl.transitions.easing.*;
	
	public class SubMenuHolder extends MovieClip
	{
		private var startTime:Number;
		private var currentTime:Number;
		private var delayTime:Number = 1000;
				
		private var xPos:Number;
		
		private var deactivated:Boolean = false;
		
		
		public function SubMenuHolder()
		{
			this.visible = false;
			
			xPos = this.x;
			
			addEventListener (MouseEvent.MOUSE_OVER, mouseOverHandler);
			addEventListener (MouseEvent.MOUSE_OUT, mouseOutHandler);
		}
	
		private function updateFrame (event:Event):void
		{
			currentTime = getTimer();
			
			// turn off the submenu if the mouse is not over it, and a certain time has passed
			if (deactivated == true)
			{
				if (currentTime - startTime > delayTime)
				{
					this.turnOff();
				}
			}
		}
		
		public function turnOn():void
		{
			currentTime = getTimer();
			startTime = getTimer();
			
			addEventListener (Event.ENTER_FRAME, updateFrame);
		}
		
		
		public function turnOff():void
		{
			this.visible = false;
			removeEventListener (Event.ENTER_FRAME, updateFrame);
		}
		
		
		private function mouseOverHandler (event:MouseEvent):void
		{
			deactivated = false;
		}
		
		private function mouseOutHandler (event:MouseEvent):void
		{
			deactivated = true;
			startTime = getTimer();
		}
		
		
	} // end class
} // end package