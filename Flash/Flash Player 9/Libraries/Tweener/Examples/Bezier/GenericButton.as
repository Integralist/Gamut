/*
Generic Button
*/

package {
	import flash.events.*;
	import flash.display.*;
	import caurina.transitions.Tweener;
	
	public class GenericButton extends MovieClip {

		public function GenericButton() {
			alpha = 0.5;
			
			addEventListener(MouseEvent.ROLL_OVER, fadeInAnim);
			addEventListener(MouseEvent.ROLL_OUT, fadeOutAnim);

			buttonMode = true;
			useHandCursor = true;
		}

		private function fadeInAnim(e:MouseEvent):void {
			Tweener.addTween(this, {alpha:1, time:0.2, transition:"linear"});
		}
		private function fadeOutAnim(e:MouseEvent):void {
			Tweener.addTween(this, {alpha:0.5, time:0.2, transition:"linear"});
		}

	}

}
