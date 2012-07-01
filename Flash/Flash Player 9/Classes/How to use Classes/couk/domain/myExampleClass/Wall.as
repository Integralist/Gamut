package couk.stormmedia.myExampleClass
{
	import couk.stormmedia.myExampleClass.Brick;
	
	public class Wall
	{
		public var wallWidth:uint;
     	public var wallHeight:uint;
		
		public function Wall(w:uint, h:uint)
		{
			wallWidth = w;
			wallHeight = h;
			build();
		}
		
		public function build():void 
		{
			/*
				this function builds a wall based on the amount of rows/cols 
				specified by the main .fla file
			*/
			
			for(var i:uint=0; i<wallHeight; i++) // create first row of the wall
			{
				for(var j:uint=0; j<wallWidth; j++) // add bricks for the current row
				{
					var brick:Brick = new Brick();
				}
			}
		}
	}
}