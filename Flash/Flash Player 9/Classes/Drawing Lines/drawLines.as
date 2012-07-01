package
{
    import flash.display.Sprite;
    import flash.events.Event;
    
    public class drawLines extends Sprite
    {
		// Private members
		private var fromX:Number;
        private var fromY:Number;
        private var toX:Number;
        private var toY:Number;
        private var dx:Number;
        private var dy:Number;
        private var increment:Number;
		private var nextLine:Number = 0;
		
		// Class constructor
        public function drawLines()
        {
			// draw a green line
			graphics.lineStyle( 28, 0x00ff00 )
			graphics.moveTo( 0, 100 );
			graphics.lineTo( 120, 100 );
			graphics.lineTo( 120, 0 );
			
			// draw a red line which animates
			// ( fromX, fromY, toX, toY )
			drawLineProgressively( 0, 100, 120, 100 );
				//drawLineProgressively( 0, 0, 120, 0 );
        }
        
		// Private object
        private function drawLineProgressively( fromX:Number, fromY:Number, toX:Number, toY:Number ):void
        {
			this.fromX = fromX;
			this.fromY = fromY;
			this.toX = toX;
			this.toY = toY;
			dx = toX - fromX;
			dy = toY - fromY;
			increment = Math.max( uint( dx ), uint( dy ) );
			dx /= increment;
			dy /= increment;
			graphics.lineStyle( 30, 0xff0000 )
			addEventListener( Event.ENTER_FRAME, _onEnterFrame );
        }
		
		// Private object
        private function _onEnterFrame( e:Event ):void
        {
			var tx:Number;
			var ty:Number;
			tx = fromX + dx;
			ty = fromY + dy;
			graphics.moveTo( fromX, fromY );
			graphics.lineTo( tx, ty );
			fromX = tx;
			fromY = ty;
			increment--;
			
			if(increment == 0)
			{
				nextLine++;
				switch( nextLine )
				{
					case 1:
						draw1();
						break;
				}
				removeEventListener( Event.ENTER_FRAME, _onEnterFrame );
			}
        }
		
		public function draw1()
		{ 
			drawLineProgressively( 120, 100, 0, 0 );
		}
    }
}