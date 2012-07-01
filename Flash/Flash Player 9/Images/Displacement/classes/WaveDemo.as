package {
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.BitmapDataChannel;
	import flash.display.GradientType;
	import flash.display.Graphics;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.filters.DisplacementMapFilter;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.Timer;	

	/**
	 * Displacement Wave Demo
	 * 
	 * @author Daniel Sedlacek, feel free to contact me at sedlacek.daniel@gmail.com
	 */
	public class WaveDemo extends Sprite {

		private static const FPS : uint = 30;		private static const WAWE_RADIUS : uint = 100;		private static const WAWE_DURATION : uint = 800;		private static const WAWE_AMPLITUDE : uint = 25;		private static const DISP_COMPONENT : uint = BitmapDataChannel.RED;		private static const DISP_NEUTRAL_COLOR : int = 0x00800000;		private static const DISP_PLUS_COLOR : int = 0xFF0000;		private static const DISP_MINUS_COLOR : int = 0x000000;
		private var baseImage : BaseImage;		private var baseBitmap : Bitmap;		private var dispShape : Shape;		private var dispBitmap : BitmapData;
		private var dispFilter : DisplacementMapFilter;
		private var clickPoint : Point;
		private var timer : Timer;
		
		public function WaveDemo() {
			// first display image from library
			baseImage = new BaseImage();
			baseBitmap = new Bitmap(baseImage);
			this.addChild(baseBitmap);
			
			// get a wave like graphic			dispShape = waveShape();
			
			// prepare dispalcement bitmap
			dispBitmap = new BitmapData(WAWE_RADIUS * 2, WAWE_RADIUS * 2, false, DISP_NEUTRAL_COLOR);
			
			// preview the displacement bitmap on stage
			var bitmap:Bitmap = new Bitmap(dispBitmap);
			bitmap.scaleX = bitmap.scaleY = .5;
			this.addChild(bitmap);
			
			this.stage.addEventListener(MouseEvent.CLICK, onMouseClick);
		}

		
		/**
		 * start wave animation
		 */
		private function onMouseClick(e : MouseEvent) : void {
			clickPoint = new Point(this.mouseX - WAWE_RADIUS, this.mouseY - WAWE_RADIUS);
			
			var repeats : uint = FPS * WAWE_DURATION / 1000;
			timer = new Timer(WAWE_DURATION / FPS, repeats);
			timer.addEventListener(TimerEvent.TIMER, applyFilter);
			timer.start();			
		}

		
		/**
		 * scale and apply filter during animation 
		 */
		private function applyFilter(e : TimerEvent) : void {
			// scale up the wave shape size
			var repeats : uint = FPS * WAWE_DURATION / 1000;
			var scale : Number = timer.currentCount / repeats;
			
			// scale down the wave amplitude			var transScale : Number = (repeats - timer.currentCount) / repeats;
			var matrix : Matrix = new Matrix(scale, 0, 0, scale, WAWE_RADIUS, WAWE_RADIUS);
			
			// clear displacement bitmap - fill it with neutral color
			dispBitmap.fillRect(new Rectangle(0, 0, WAWE_RADIUS * 2, WAWE_RADIUS * 2), DISP_NEUTRAL_COLOR);
			
			// draw teh scaled shape to displacement bitmap
			dispBitmap.draw(dispShape, matrix);
			
			// create the filter using the displacement bitmap and other settings
			dispFilter = new DisplacementMapFilter(dispBitmap, clickPoint, DISP_COMPONENT, DISP_COMPONENT, WAWE_AMPLITUDE * transScale, WAWE_AMPLITUDE * transScale);
			
			// apply the filter (while discard the old one)
			baseBitmap.filters = [dispFilter];			
		}


		/**
		 * draw wave like graphic
		 */
		private function waveShape() : Shape {
			var shape : Shape = new Shape();
			
			// very usefull matrix method in use with gradient fills
			var matrix : Matrix = new Matrix();  
			matrix.createGradientBox(WAWE_RADIUS * 2, WAWE_RADIUS * 2, 0, -WAWE_RADIUS, -WAWE_RADIUS); 
			
			var g : Graphics = shape.graphics;
			g.clear();
			g.beginGradientFill(GradientType.RADIAL, [DISP_PLUS_COLOR, DISP_MINUS_COLOR, DISP_PLUS_COLOR,DISP_NEUTRAL_COLOR], [1,1,1,1], [(1 * 255 / 4),(2 * 255 / 4),(3 * 255 / 4),(4 * 255 / 4)], matrix);			g.drawCircle(0, 0, WAWE_RADIUS);
			g.endFill();
			
			return shape;
		}
	}
}
