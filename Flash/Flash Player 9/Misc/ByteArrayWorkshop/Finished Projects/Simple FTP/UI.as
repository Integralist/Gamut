package
{
	import flash.display.Sprite;
	import flash.events.KeyboardEvent;
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;

	public class UI extends Sprite
	{
		public var it:TextField;
		public var rt:TextField;
		
		public function UI()
		{
			var tf:TextFormat = new TextFormat("Monaco", 14, 0xFFFFFF);
			it = new TextField();
			it.type = TextFieldType.INPUT;
			it.x = 15;
			it.y = 15;
			it.width = 500;
			it.height = 25;
			it.border = true;
			it.borderColor = 0xFFFFFF;
			it.multiline = false;
			it.antiAliasType = AntiAliasType.NORMAL;
			it.defaultTextFormat = tf;
			addChild(it);		
			
			rt = new TextField();
			rt.type = TextFieldType.DYNAMIC;
			rt.x = 15;
			rt.y = 60;
			rt.width = 660;
			rt.height = 320;
			rt.border = true;
			rt.borderColor = 0xFFFFFF;
			rt.antiAliasType = AntiAliasType.NORMAL;
			rt.defaultTextFormat = tf;
			addChild(rt);
		}
	}
}