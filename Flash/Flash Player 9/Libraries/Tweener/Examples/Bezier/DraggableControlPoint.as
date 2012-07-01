/*
Draggable control point
Argh, need a duplicate class
*/

package {
	import flash.events.*;
	import flash.display.*;
	
	public class DraggableControlPoint extends DraggablePoint {

		public function DraggableControlPoint() {
			super();
			isBezier = true;
		}

	}

}
