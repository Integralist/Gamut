package {
	import flash.display.Sprite;
	import fl.containers.UILoader;
	import caurina.transitions.*;
	import flash.events.MouseEvent;
	
	public class Thumbnail extends Sprite 
	{
		private var nume:String;
		private var url:String;
		private var id:int;
		private var loader:UILoader;
		
		function Thumbnail(source:String,itemNr:int,numeThumb:String):void 
		{
			url = source;
			id = itemNr;
			this.nume = numeThumb;
			drawLoader();
			addEventListener(MouseEvent.MOUSE_OVER,onOver);
			addEventListener(MouseEvent.MOUSE_OUT,onOut);
			scaleThumb();
		}
		
		private function drawLoader():void 
		{
			loader = new UILoader();
			loader.source = url;
			loader.mouseEnabled = false;
			loader.x = -50;
			loader.y = -50;
			addChild(loader);
		}
		
		private function onOver(event:MouseEvent):void 
		{
			Tweener.addTween(this, {scaleX:1,scaleY:1, time:1, transition:"easeoutelastic"});
			Tweener.addTween(this, {alpha:1, time:1, transition:"easeoutelastic"});
		}
		
		private function onOut(event:MouseEvent):void 
		{
			Tweener.addTween(this, {scaleX:.9,scaleY:.9, time:1, transition:"easeoutelastic"});
			Tweener.addTween(this, {alpha:.5, time:1, transition:"easeoutelastic"});
		}
		
		private function scaleThumb():void 
		{
			this.scaleX = .9;
			this.scaleY = .9;
			this.alpha = .5;
		}
	}
}