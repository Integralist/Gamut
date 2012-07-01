package classes 
{
	import flash.display.MovieClip;
	import fl.transitions.Tween;
	import fl.transitions.TweenEvent;
	import fl.transitions.easing.*; //I like to import them all so it's easy to play with later.
	
	public class Oscillator extends MovieClip
	{
		/*These constants allow me to change the tween without
		digging through my code to find it.  It's just good practice*/
		private const ANCHOR1:Number = 5;
		private const ANCHOR2:Number = 565;
		private const TIME:Number = 1.5;
		
		private var myTweenX:Tween;  //ALWAYS declare tweens as globals or properties
		private var weaponX:Boolean; //My Motion Toggle
		
		public function Oscillator() 
		{
			myTweenX = new Tween(this, "x", Regular.easeInOut, ANCHOR1, ANCHOR2, TIME, true);
			myTweenX.start();
			myTweenX.addEventListener(TweenEvent.MOTION_FINISH, yoyoTween);
			weaponX = true;
		}
		
		/*I wanted this method because it got annoying for me to watch the
		oscillating dot while proofreading my tutorial*/
		public function toggleMotion():void 
		{
			//click once will stop it
			if(weaponX)
			{
				myTweenX.stop();
				weaponX = false;
			}
			else 
			{
				//click a second time to start it
				myTweenX.resume();
				weaponX = true;
			}
		}
		
		//Yoyo simply runs the Tween in reverse.  And then reverse of the reverse (forward).
		private function yoyoTween(event:TweenEvent):void 
		{
			event.currentTarget.yoyo();
		}
	}
}