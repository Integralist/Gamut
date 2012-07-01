package
{
	import flash.display.Sprite;
	import flash.display.Bitmap;
	
	public class Content extends Sprite
	{
		public function Content()
		{
			var oPic1:Picture1 = new Picture1(0,0);
			var bmp1:Bitmap = new Bitmap(oPic1);
			bmp1.x = 0;
			bmp1.y = 0;
			addChild(bmp1);
			
			var oPic2:Picture2 = new Picture2(0,0);
			var bmp2:Bitmap = new Bitmap(oPic2);
			bmp2.x = 10;
			bmp2.y = 10;
			addChild(bmp2);
			
			var oPic3:Picture3 = new Picture3(0,0);
			var bmp3:Bitmap = new Bitmap(oPic3);
			bmp3.x = 25;
			bmp3.y = 25;
			addChild(bmp3);
		}
	}
}