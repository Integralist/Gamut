package {
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.BlendMode;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BlurFilter;
	import flash.geom.ColorTransform;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class Fire extends Sprite 
	{
		private var effect_width        :Number = stage.stageWidth;
		private var effect_height       :Number = stage.stageHeight;
		private var loadingMC           :Sprite;
		private var loadingBD           :BitmapData;
		private var perlin              :BitmapData;
		private var perlinBD            :Bitmap;
		private var perlin_temp         :BitmapData;
		private var scroll_speed        :Number = 2;
		private var mouseIsDown         :Boolean = false;
		private var tuto_status         :Number = 0;
		private var testSymbol			:Sprite;
		private var lineDrawing			:MovieClip
		
		public function Fire()
		{
			loadingBD = new BitmapData(effect_width, effect_height, false, 0);
			addChild(new Bitmap(loadingBD));
			
			perlin = new BitmapData(effect_width, effect_height, false, 0);
			perlin.perlinNoise(20, 40, 10, 0, true, true, 7, true);
			perlinBD = new Bitmap(perlin);
			perlinBD.visible = true;
			perlinBD.blendMode = BlendMode.OVERLAY;
			addChild(perlinBD);
			
			perlin_temp = new BitmapData(effect_width, 2, false, 0);
			
			loadingMC = new Sprite();
			loadingMC.buttonMode = true;
			loadingMC.doubleClickEnabled = true;
			
			loadingMC.graphics.beginFill(0xFF0000, 0);
			loadingMC.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			loadingMC.graphics.endFill();
			loadingMC.graphics.lineStyle(5, 0xFFFFFF);
			
			loadingMC.addEventListener(MouseEvent.MOUSE_DOWN, oMouseDown);
			loadingMC.addEventListener(MouseEvent.MOUSE_UP, oMouseUp);
			
			addChild(loadingMC);
			
			testSymbol = new TestSymbol();
			testSymbol.x = 100;
			testSymbol.y = 100;
			addChild(testSymbol);			
			
			lineDrawing = new MovieClip();
			addChild(lineDrawing);
			
			lineDrawing.graphics.lineStyle(2, 0xFFFFFF);			
			lineDrawing.graphics.moveTo(250, 80);
            lineDrawing.graphics.curveTo(300, 80, 300, 50);
            lineDrawing.graphics.curveTo(300, 100, 250, 100);
            lineDrawing.graphics.curveTo(200, 100, 200, 50);
            lineDrawing.graphics.curveTo(200, 80, 250, 80);
			
			addEventListener(Event.ENTER_FRAME, loop);
		}
		
		private function oMouseDown(e:MouseEvent):void 
		{
			mouseIsDown = true;
			loadingMC.graphics.moveTo(mouseX, mouseY);
		}
		
		private function oMouseUp(e:MouseEvent):void 
		{
			mouseIsDown = false;
		}
		
		private function loop(e:Event):void 
		{
			if (mouseIsDown) 
			{
				loadingMC.graphics.lineTo(mouseX, mouseY);
			}
			
			loadingBD.draw(lineDrawing);
			loadingBD.applyFilter(loadingBD, loadingBD.rect, new Point(), new BlurFilter(2, 2, 1));
			loadingBD.colorTransform(loadingBD.rect, new ColorTransform(1, 1, .5, 1, -5, -20, -20));
			loadingBD.scroll(0, -1);
			
			perlin_temp.copyPixels(perlin, new Rectangle(0, 0, effect_width, scroll_speed), new Point());
			perlin.scroll(0, -scroll_speed);
			perlin.copyPixels(perlin_temp, perlin_temp.rect, new Point(0, effect_height - scroll_speed));
		}
	}
}