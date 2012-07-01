package {
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.ui.Keyboard;
	import bigroom.input.KeyPoll;
	
	public class Main extends MovieClip {
		
		var key:KeyPoll;
		var sw:Number = stage.width;
		var sh:Number = stage.height;
		var moveValue:Number = 5;
		
		public function Main() {
			key = new KeyPoll(this.stage);
			addEventListener(Event.ENTER_FRAME, enterFrame);
		}
		
		public function enterFrame(event:Event):void {
			if ( key.isDown(Keyboard.UP)) {
				ball_mc.y -= moveValue;
			}
			if ( key.isDown(Keyboard.DOWN)) {
				ball_mc.y += moveValue;
			}
			if ( key.isDown(Keyboard.LEFT)) {
				ball_mc.x -= moveValue;
			}
			if ( key.isDown(Keyboard.RIGHT)) {
				ball_mc.x += moveValue;
			}
			
			if (ball_mc.x < ball_mc.width/2) {
				ball_mc.x = ball_mc.width/2;
			} else if (ball_mc.x > sw - ball_mc.width/2) {
				ball_mc.x = sw - ball_mc.width/2;
			}
			if (ball_mc.y < ball_mc.height/2) {
				ball_mc.y = ball_mc.height/2;
			} else if (ball_mc.y > sh - ball_mc.height/2) {
				ball_mc.y = sh - ball_mc.height/2;
			}
		}
		
	}
}