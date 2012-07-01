package co.uk.stormmedia.library
{
	import flash.display.*;
	import flash.events.*;
	
	public class Scrollbar extends MovieClip
	{
		private var yOffset:Number;
		private var yMin:Number;
		private var yMax:Number;
		
		public function Scrollbar():void
		{
			yMin = 0;
			yMax = track.height - thumb.height; // the thumb can't go beyond this number (this code keeps the thumb in the same area as the track and not have the top of the thumb movieclip sitting at the bottom of the track movieclip)
			
			thumb.addEventListener(MouseEvent.MOUSE_DOWN, thumbDown);
			stage.addEventListener(MouseEvent.MOUSE_UP, thumbUp); // no matter where the user releases the mouse button then the thumb will stop dragging
		}
		
		private function thumbDown(e:MouseEvent):void
		{
			stage.addEventListener(MouseEvent.MOUSE_MOVE, thumbMove); // this allows the thumb to move even if the mouse isn't hovered over the thumb but has moved the mouse off the thumb accidentally
			yOffset = mouseY - thumb.y; // this means that no matter where your mouse cursor is over the thumb, when clicking on the thumb the thumb movieclip will not suddently jump down to the mouseY co-ordinates but be offset by it
		}
		
		private function thumbUp(e:MouseEvent):void
		{
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, thumbMove);
		}
		
		private function thumbMove(e:MouseEvent):void
		{
			thumb.y = mouseY - yOffset; // to prevent the thumb snapping to the mouse position
			
			// setup the thumb constraints
			if(thumb.y <= yMin)
			{
				thumb.y = yMin;
			}
			if(thumb.y >= yMax)
			{
				thumb.y = yMax;
			}
			
			dispatchEvent(new ScrollbarEvent(thumb.y / yMax)); // this gives us a decimal percentage
			e.updateAfterEvent(); // this fixes a problem with flash waiting for the next frame to update the position (when uses move their mouse too quickly)
		}
	}
}