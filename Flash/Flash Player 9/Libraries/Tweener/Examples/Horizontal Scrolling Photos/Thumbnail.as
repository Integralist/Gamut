package {
	import flash.display.Sprite;
	import flash.display.Loader;
	import flash.net.URLRequest;
	

	public class Thumbnail extends Sprite {

		private var url:String;
		private var loader:Loader;
		private var urlRequest:URLRequest;

		function Thumbnail(source:String):void {
			url=source;
			drawLoader();

		}
		private function drawLoader():void {
			urlRequest=new URLRequest(url);
			loader=new Loader  ;
			loader.mouseEnabled=false;
			loader.load(urlRequest);
			loader.x=-50;
			loader.y=-50;
			addChild(loader);
		}
	}
}