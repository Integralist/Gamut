package 
{
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.Stage;
	
	public class TopLevel extends MovieClip 
	{
		public static  var stage:Stage;
		public static  var root:DisplayObject;
		
		public function TopLevel() 
		{
			TopLevel.stage = this.stage;
			TopLevel.root = this;
		}
	}
}