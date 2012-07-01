package
{
	import flash.display.MovieClip;
	import flash.display.Bitmap;
	import flash.display.DisplayObject;	
	import flash.utils.Timer;
	import flash.events.Event;
	import flash.events.TimerEvent;
	
	public class Content extends MovieClip
	{
		private var crossPosition:int = 100;
		private var oTimer:Timer;
		private var oCross:DisplayObject;
		private var oPacMan;
		
		public function Content()
		{
			// Create multiple cross clips for the PacMan to eat
			for(var i=1; i<11; i++)
			{
				createCross(i);
			}
		}
		
		public function createCross(i):void
		{
			// Create a new cross instance
			var oCross = new Cross();
			oCross.y = 190;
			oCross.x = crossPosition;
			
			// Give each cross a unique nsme
			oCross.name = "oCross" + i;
			
			// Hide each cross to begin with so they can be faded in later
			oCross.alpha = 0;
			
			// Increment each cross position so they don't overlap
			crossPosition += 20;
			
			// Add each cross to the stage
			addChild(oCross);
			
			// Create Timer instance (used in "fadeInCross")
			oTimer = new Timer(1000, 0);
			oTimer.addEventListener("timer", setTimer);
			
			// Fade in the Cross
			oCross.addEventListener(Event.ENTER_FRAME, fadeInCross);
		}
		
		public function fadeInCross(e:Event):void
		{
			// Grab a reference to the specific cross instance
			oCross = getChildByName(e.currentTarget.name);
			
			// Either remove the event listener, or, keep fading in the movie clip
			if(oCross.alpha >= 1){ e.currentTarget.removeEventListener(Event.ENTER_FRAME, fadeInCross); oTimer.start();}
			else{ oCross.alpha += 0.1; }
		}
		
		public function setTimer(e:TimerEvent):void
		{
			if(oTimer.currentCount == 1)
			{
				// Add the PacMan movieclip to the stage and animate it
				oPacMan = new PacMan();
				oPacMan.x = 70;
				oPacMan.y = 191;
				addChild(oPacMan);
				
				// Stop the timer
				oTimer.removeEventListener("timer", setTimer);
				
				// Create a new Timer instance to check the PacMan animation
				oTimer = new Timer(100, 0);
				oTimer.addEventListener("timer", displayEnter);
				oTimer.start();
			}
		}
		
		public function displayEnter(e:Event):void
		{
			try
			{
				if(oPacMan.oEat.currentFrame == 35)
				{
					oTimer.removeEventListener("timer", displayEnter);
				}
			}
			catch(err)
			{
				// Do nothing with these errors
			}
		}
	}
}