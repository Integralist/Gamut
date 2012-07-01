package
{
	import flash.display.MovieClip;
	import flash.utils.Timer;
	import flash.events.TimerEvent;
	
	// the main timeline is usually referred to as a MovieClip
	public class myClassFile extends MovieClip
	{
		private var timer:Timer = new Timer(100); // runs ten times a second
		
		// all classes need a constructor which is a function that is initialized when the class is loaded
		public function myClassFile():void
		{
			timer.addEventListener(TimerEvent.TIMER, makeStar);
			timer.start();
		}
		
		// create the method that will create the stars for the movie
		private function makeStar(event:TimerEvent):void
		{
			// create a new instance of the Star movieclip 
			// this was setup from our Flash movie 'Export for ActionScript' and we gave it a class name
			var star:Star = new Star();
			
			// randomise the scale of the star
			star.scaleX = star.scaleY = Math.random();
			
			// randomise the position of the star
			// the 'this' keyword refers to our document class which is controlling our main movie
			star.x = Math.random() * this.stage.stageWidth;
			star.y = Math.random() * this.stage.stageHeight;
			
			// add the star to our 'display list'
			this.addChild(star);
		}
	}
}