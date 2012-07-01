/*
Draggable point
*/

package {
	import flash.events.*;
	import flash.display.*;
	
	public class DraggablePoint extends MovieClip {

		var isBezier:Boolean;

		public function DraggablePoint() {
			addEventListener(MouseEvent.MOUSE_DOWN, startToDrag);
			useHandCursor = true;
			buttonMode = true;
			addEventListener(MouseEvent.CLICK, function() {});
		}

		private function startToDrag(e:MouseEvent):void {
			startDrag();
			Main(parent).setSelectedPoint(this);
			addEventListener(MouseEvent.MOUSE_UP, stopToDrag);
			addEventListener(MouseEvent.MOUSE_MOVE, mouseMove);
		}
		private function stopToDrag(e:MouseEvent):void {
			stopDrag();
			Main(parent).playBall();
			removeEventListener(MouseEvent.MOUSE_UP, stopToDrag);
			removeEventListener(MouseEvent.MOUSE_MOVE, mouseMove);
		}
		private function mouseMove(e:MouseEvent):void {
			Main(parent).redraw();
			e.updateAfterEvent();
		}
	}
}
