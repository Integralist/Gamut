
// DropDownMenu (C) Edvard Toth (03/2008)
//
// http://www.edvardtoth.com
//
// This source is free for personal use. Non-commercial redistribution is permitted as long as this header remains included and unmodified.
// All other use is prohibited without express permission.

package {
	
	import flash.display.*;
	import flash.events.*;
	import flash.utils.Timer;
	
	public class Main extends MovieClip
	{
		private var dropDownMenu:DropDownMenu = DropDownMenu.getInstance();
		
		private var delayTimer:Timer = new Timer(60, 1);
		
		public function Main()
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			
			delayTimer.addEventListener (TimerEvent.TIMER_COMPLETE, prepareFrame);
			delayTimer.start();
		}
		
		// waits 60 milliseconds to make sure everything is rendered
		private function prepareFrame (event:TimerEvent):void
		{
			addChild (dropDownMenu);
			
			setupMain();
			stage.addEventListener (Event.RESIZE, onResize);
		}
		
		private function onResize (event:Event):void
		{
			setupMain();
		}

		private function setupMain():void
		{
			createBackground();

			dropDownMenu.x = 15;
			dropDownMenu.y = 15;
		}
		
		
		private function createBackground ():void
		{
			this.graphics.clear();
			
			this.graphics.beginFill (0xffffff, 1);
			this.graphics.drawRect (0, 0, stage.stageWidth, stage.stageHeight);
			this.graphics.endFill();
		}
		
	}
	
}