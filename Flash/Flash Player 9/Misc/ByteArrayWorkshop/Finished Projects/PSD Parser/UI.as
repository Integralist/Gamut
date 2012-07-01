package
{
	import flash.display.Sprite;
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;

	public class UI extends Sprite
	{
		public var t:TextField;
		
		public function UI()
		{
			var tf:TextFormat = new TextFormat("Myriad Pro", 16, 0xFFFFFF);
			t = new TextField();
			t.type = TextFieldType.DYNAMIC;
			t.x = 15;
			t.y = 15;
			t.width = 300;
			t.height = 500;
			t.multiline = true;
			t.antiAliasType = AntiAliasType.ADVANCED;
			t.defaultTextFormat = tf;
			addChild(t);		
		}
		
	}
}