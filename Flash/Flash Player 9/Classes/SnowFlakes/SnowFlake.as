package
{
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.filters.BlurFilter;	

	// start the main class
	public class SnowFlake extends MovieClip
	{
		private var speedMultiplier:int = 5;
		private var speedVariMultiplier:int = 10;		

		private var speed:uint = Math.random()*speedMultiplier;
		private var speedVariation = Math.random()*speedVariMultiplier+1;		

		private var viewWidth:int = 450;
		private var viewHeight:int = 450;		

		private var drift:int;		

		// start the constructor
		function SnowFlake()
		{
			setSpeed(speed);
			readyFlake();
			moveMe();
		}		

		private function setSpeed(n:uint):void
		{
			this.speed = (n * speedVariation)+1;
		}		

		private function readyFlake():void
		{
			getDrift();				

			this.y = Math.random()*viewHeight*-1;
			this.x = Math.random()*viewWidth;

			var bf:BlurFilter = new BlurFilter(drift*2,speed/2,2);
			
			this.filters = [bf];			

			if(speed/2 < speedVariation)
			{
				this.scaleX = this.scaleY = .5;
			}
		}		

		private function getDrift():void
		{
			drift = Math.random()*3;			

			var driftDirection:int = Math.random()*10;

			if(driftDirection < 5)
			{
				drift *= -1;
			}
		}

		private function moveMe():void
		{
			this.addEventListener(Event.ENTER_FRAME,everyFrame);
		}	

		private function everyFrame(e:Event):void
		{
			this.y += speed;
			this.x += drift;

			if(this.y > viewHeight || this.x < 0 || this.x > viewWidth)
			{
				readyFlake();
			}
		}
	}

}