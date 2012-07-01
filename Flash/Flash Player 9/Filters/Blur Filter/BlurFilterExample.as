package {
    import flash.display.Sprite;
    import flash.filters.BitmapFilter;
    import flash.filters.BitmapFilterQuality;
    import flash.filters.BlurFilter;

	// create the main class
    public class BlurFilterExample extends Sprite
	{
        private var bgColor:uint = 0xFFCC00;
        private var size:uint    = 80;
        private var offset:uint  = 50;

        // create the constructor
		public function BlurFilterExample()
		{
            draw();
            var filter:BitmapFilter = getBitmapFilter();
            var myFilters:Array = new Array();
            myFilters.push(filter);
            filters = myFilters;
        }

        private function getBitmapFilter():BitmapFilter
		{
            var blurX:Number = 30;
            var blurY:Number = 30;
            return new BlurFilter(blurX, blurY, BitmapFilterQuality.HIGH);
        }

        private function draw():void
		{
            graphics.beginFill(bgColor);
            graphics.drawRect(offset, offset, size, size);
            graphics.endFill();
        }
    }
}