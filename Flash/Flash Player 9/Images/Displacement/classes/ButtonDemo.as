package {
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.BitmapDataChannel;
	import flash.display.Graphics;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.filters.BevelFilter;
	import flash.filters.BitmapFilterType;
	import flash.filters.DisplacementMapFilter;
	import flash.filters.GlowFilter;
	import flash.geom.Point;	

	/**
	 * Displacement Button Demo
	 * 
	 * @author Daniel Sedlacek, feel free to contact me at sedlacek.daniel@gmail.com
	 */
	public class ButtonDemo extends Sprite {

		private static const BUTTON_WIDTH : uint = 100;		private static const BUTTON_HEIGHT : uint = 50;		private static const BUTTON_ROUND : uint = 30;
		private static const DISP_AMPLITUDE : uint = 20;
		private static const DISP_COMPONENT : uint = BitmapDataChannel.RED;
		private static const DISP_NEUTRAL_COLOR : int = 0x800000;		private static const DISP_PLUS_COLOR : int = 0xFF0000;		private static const GLOW_BLUR : Number = 13;		private static const GLOW_STRENGTH : Number = 2;		private static const GLOW_QUALITY : int = 3;		private static const BEVEL_DISTANCE : Number = 10;		private static const BEVEL_ANGLE : Number = 45;		private static const BEVEL_LOW_COLOR : uint = 0x220000;		private static const BEVEL_HI_COLOR : uint = 0xFFEEEE;		private static const BEVEL_ALPHA : Number = .8;		private static const BEVEL_BLUR : Number = 12;		private static const BEVEL_STRENGTH : Number = 1.4;		private static const BEVEL_QUALITY : int = 3;
		private var baseImage : BaseImage;
		private var baseBitmap : Bitmap;
		private var dispShape : Shape;		private var bevelShape : Shape;
		private var dispBitmap : BitmapData;
		private var dispFilter : DisplacementMapFilter;				private var glowFilter : GlowFilter;				private var bevelFilter : BevelFilter;		

		
		public function ButtonDemo() {
			// first display image from library
			baseImage = new BaseImage();
			baseBitmap = new Bitmap(baseImage);
			this.addChild(baseBitmap);
			
			initDisplacement();			initBevel();
		
			this.stage.addEventListener(MouseEvent.MOUSE_DOWN, mouseDown);			this.stage.addEventListener(MouseEvent.MOUSE_UP, mouseUp);
			this.stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMove);
		}

		
		/**
		 * get a button like shape, apply inner glow to get a smooth color gradient and use it as displacement map   
		 */
		private function initDisplacement() : void {
			// get a button like shape			
			dispShape = buttonShape();
			
			// apply inner glow to get a smooth color gradient
			glowFilter = new GlowFilter(DISP_NEUTRAL_COLOR, 1, GLOW_BLUR, GLOW_BLUR, GLOW_STRENGTH, GLOW_QUALITY, true);
			dispShape.filters = [glowFilter];
			
			// prepare displacement map
			dispBitmap = new BitmapData(BUTTON_WIDTH, BUTTON_HEIGHT, false, DISP_NEUTRAL_COLOR);
			dispBitmap.draw(dispShape);
			
			// preview the bitmap on stage
			this.addChild(new Bitmap(dispBitmap));
			
			dispFilter = new DisplacementMapFilter(dispBitmap, new Point(0, 0), DISP_COMPONENT, DISP_COMPONENT, DISP_AMPLITUDE, DISP_AMPLITUDE);
		}

		
		/**
		 * get a button like shape, apply inner bevel with 'knockout' (true) 
		 */
		private function initBevel() : void {
			// first preview the bitmap on stage
			var bevelShapePreview : Shape = buttonShape();
			bevelShapePreview.x = BUTTON_WIDTH;
			this.addChild(bevelShapePreview);
			
			// get another shape			bevelShape = buttonShape();
			
			// apply inner bevel with 'knockout' (true) 
			bevelFilter = new BevelFilter(BEVEL_DISTANCE, BEVEL_ANGLE, BEVEL_HI_COLOR, BEVEL_ALPHA, BEVEL_LOW_COLOR, BEVEL_ALPHA, BEVEL_BLUR, BEVEL_BLUR, BEVEL_STRENGTH, BEVEL_QUALITY, BitmapFilterType.INNER, true);
			bevelShape.filters = [bevelFilter];
			
			this.addChild(bevelShape);
		}

		
		/**
		 * on mouse down use only half of BEVEL_DISTANCE and DISP_AMPLITUDE
		 */
		private function mouseDown(e : MouseEvent) : void {
			dispFilter.scaleX = dispFilter.scaleY = DISP_AMPLITUDE / 2;
			baseBitmap.filters = [dispFilter];
			
			bevelFilter.distance = BEVEL_DISTANCE / 2;
			bevelShape.filters = [bevelFilter];
		}


		/**
		 * on mouse up restore BEVEL_DISTANCE and DISP_AMPLITUDE
		 */
		private function mouseUp(e : MouseEvent) : void {
			dispFilter.scaleX = dispFilter.scaleY = DISP_AMPLITUDE;
			baseBitmap.filters = [dispFilter];
			
			bevelFilter.distance = BEVEL_DISTANCE;
			bevelShape.filters = [bevelFilter];			
		}
		
		
		/**
		 * on mouse move calculate new dispacement and drag the bevel shape
		 */
		private function mouseMove(e : MouseEvent) : void {
			dispFilter.mapPoint = new Point(this.mouseX - BUTTON_WIDTH / 2, this.mouseY - BUTTON_HEIGHT / 2);
			baseBitmap.filters = [dispFilter];		
			
			bevelShape.x = this.mouseX - BUTTON_WIDTH / 2;			bevelShape.y = this.mouseY - BUTTON_HEIGHT / 2;
		}


		/**
		 * draw button like shape used as dispacement map and bevel 
		 */			
		private function buttonShape() : Shape {
			var shape : Shape = new Shape();
			
			var g : Graphics = shape.graphics;
			g.beginFill(DISP_PLUS_COLOR);
			g.drawRoundRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_ROUND, BUTTON_ROUND);
			g.endFill();
			
			return shape;
		}
	}
}
