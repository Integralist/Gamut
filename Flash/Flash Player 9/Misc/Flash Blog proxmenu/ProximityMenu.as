package
{
	// Import Flash classes
	import flash.display.*;
	import flash.events.*;

	public class ProximityMenu extends MovieClip
	{
		private var ia:Array;
		
		public function ProximityMenu():void
		{
			ia = [im1, im2, im3, im4];
			for(var i:uint=0; i<4; i++)
			{
				ia[i].buttonMode = true;
				ia[i].ox = ia[i].x;
				ia[i].oy = ia[i].y;
				ia[i].tx = ia[i].ox;
				ia[i].ty = ia[i].oy;
				ia[i].addEventListener(MouseEvent.ROLL_OVER, onOver);
			}
			stage.addEventListener(Event.ENTER_FRAME, onMove);
		}
		
		private function onOver(e:MouseEvent):void
		{
			e.target.gotoAndPlay("over");
			addChild(MovieClip(e.target));
		}
		
		private function onMove(e:Event):void
		{
			for(var i:uint=0; i<4; i++)
			{
				var dist:Number =  getDist(mouseX, mouseY, ia[i].ox, ia[i].oy);
				if(dist < 70)
				{
					ia[i].tx = mouseX;
					ia[i].ty = mouseY;
				}
				else
				{
					ia[i].tx = ia[i].ox;
					ia[i].ty = ia[i].oy;
				}
				ia[i].x += Math.round((ia[i].tx - ia[i].x) * 0.3);
				ia[i].y += Math.round((ia[i].ty - ia[i].y) * 0.3);
			}
		}
		
		private function getDist(x1:Number, y1:Number, x2:Number, y2:Number):Number
		{
			var dx:Number = x2 - x1;
			var dy:Number = y2 - y1;
			return Math.sqrt(dx*dx + dy*dy);
		}
	}
}

