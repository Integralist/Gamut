package 
{
	import flash.display.Sprite;

	public class BitShifting extends Sprite
	{
		public function BitShifting()
		{
			var color:uint = 0xFF56E9;
			trace(Bin.print(color));
			
			//EXTRACT RED
			var red:uint = color >> 16;
			trace(Bin.print(red));
			
			//EXTRACT GREEN
			var green:uint = color >> 8 & 0xFF;
			trace(Bin.print(green));
			
			//EXTRACT BLUE
			var blue:uint = color & 0xFF;
			trace(Bin.print(blue));
		}
	}
}
