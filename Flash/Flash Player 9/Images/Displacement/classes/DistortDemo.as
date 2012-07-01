package {
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.BitmapDataChannel;
	import flash.display.GradientType;
	import flash.display.Graphics;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.filters.DisplacementMapFilter;
	import flash.geom.Matrix;
	import flash.geom.Point;	

	/**
	 * Displacement Distort Demo
	 * 
	 * @author Daniel Sedlacek, feel free to contact me at sedlacek.daniel@gmail.com
	 */
	public class DistortDemo extends Sprite {

		private static const DISTORT_RADIUS : uint = 50;
		private static const DISTORT_AMPLITUDE : uint = 50;		private static const DISORT_PRESURE : uint = 2;
		private static const DISP_COMPONENT : uint = BitmapDataChannel.RED;
		private static const DISP_NEUTRAL_COLOR : int = 0x00800000;
		private static const DISP_PLUS_COLOR : int = 0xFF0000;

		private var baseImage : BaseImage;
		private var baseBitmap : Bitmap;
		private var dispShape : Shape;
		private var dispBitmap : BitmapData;
		private var dispFilter : DisplacementMapFilter;		
		private var clickPoint : Point;
		private var isMouseDown : Boolean;

		
		public function DistortDemo() {
			// first display image from library
			baseImage = new BaseImage();
			baseBitmap = new Bitmap(baseImage);
			this.addChild(baseBitmap);
			
			// get a graphic shape used as dispacement map
			dispShape = distortShape();
			
			// prepare dispalcement bitmap
			dispBitmap = new BitmapData(DISTORT_RADIUS * 2, DISTORT_RADIUS * 2, false, DISP_NEUTRAL_COLOR);
			dispBitmap.draw(dispShape);
			
			// preview the bitmap on stage
			this.addChild(new Bitmap(dispBitmap));
			
			// initialize displacement filter
			dispFilter = new DisplacementMapFilter(dispBitmap, new Point(0, 0), DISP_COMPONENT, DISP_COMPONENT);
			
			this.stage.addEventListener(MouseEvent.MOUSE_UP, mouseUp);			this.stage.addEventListener(MouseEvent.MOUSE_DOWN, mouseDown);			this.stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMove);
		}

		
		/**
		 * on mouse up apply the filter to base image permanently 
		 */
		private function mouseUp(e : MouseEvent) : void {
			isMouseDown = false;
			baseBitmap.filters = [];
			baseImage.applyFilter(baseImage, baseImage.rect, new Point(0, 0), dispFilter);
		}


		/**
		 * on mouse down start to distort the image 
		 */		
		private function mouseDown(e : MouseEvent) : void {
			isMouseDown = true;
			clickPoint = new Point(this.mouseX, this.mouseY);
			dispFilter.mapPoint = new Point(this.mouseX - DISTORT_RADIUS, this.mouseY - DISTORT_RADIUS);
		}


		/**
		 * displace the image to any side
		 */
		private function mouseMove(e : MouseEvent) : void {
			if (isMouseDown) {
				var distX : Number = (clickPoint.x - this.mouseX) * DISORT_PRESURE;				var distY : Number = (clickPoint.y - this.mouseY) * DISORT_PRESURE;
				
				// here I limit the scale (mouse offset) to stay under DISTORT_AMPLITUDE radius
				var sin : Number = Math.sin(distX / Math.sqrt(distX * distX + distY * distY));				var cos : Number = Math.sin(distY / Math.sqrt(distX * distX + distY * distY));
				var limitedX : Number = sin * DISTORT_AMPLITUDE;				var limitedY : Number = cos * DISTORT_AMPLITUDE;
				
				// by changing the scaleX and scaleY properties displace the image to any side
				dispFilter.scaleX = (Math.abs(distX) < Math.abs(limitedX)) ? distX : limitedX;
				dispFilter.scaleY = (Math.abs(distY) < Math.abs(limitedY)) ? distY : limitedY;
				
				// apply the filter temporary 
				baseBitmap.filters = [dispFilter];			
			}
		}

		
		/**
		 * draw graphic shape used as dispacement map
		 */		
		private function distortShape() : Shape {
			var shape : Shape = new Shape();
			
			// very usefull matrix method in use with gradient fills
			var matrix : Matrix = new Matrix(); 
			matrix.createGradientBox(DISTORT_RADIUS * 2, DISTORT_RADIUS * 2, 0, 0, 0); 
			
			var g : Graphics = shape.graphics;
			g.beginGradientFill(GradientType.RADIAL, [DISP_PLUS_COLOR, DISP_NEUTRAL_COLOR], [1,1], [0, 255], matrix);
			g.drawCircle(DISTORT_RADIUS, DISTORT_RADIUS, DISTORT_RADIUS);
			g.endFill();
			
			return shape;
		}
	}
}
