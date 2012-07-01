package
{
	import flash.display.MovieClip;
 	import flash.display.Loader;
    import flash.display.LoaderInfo;
	import flash.events.*;
	import flash.net.URLLoader;
    import flash.net.URLRequest;
	import flash.utils.Timer;
	import fl.transitions.Tween;
	import fl.transitions.easing.*;
	
	public class slides extends MovieClip
	{
		var xmlLoader:URLLoader;
		var theXML:XML;
		var photos:XMLList;
		var photoLoader:Loader;
		var photoArray:Array;
		var fade:Tween;
		var curr:Number;
		var timer:Timer;
		var timey:timeDisplay;

		public function slides():void
		{
			xmlLoader = new URLLoader();
			xmlLoader.load(new URLRequest("photos.xml"));
			xmlLoader.addEventListener(Event.COMPLETE, getXML);
			photoArray = new Array();
			curr = 0;
			timer = new Timer(5000);
			timer.addEventListener(TimerEvent.TIMER, switchPhoto);
			timey = new timeDisplay();
			timey.x = 275;
			timey.y = 360;
		}
		
		private function getXML(e:Event):void
		{
			theXML = new XML(e.target.data);
			photos = new XMLList(theXML.photo);
			for(var i:int=0;i<photos.length();i++)
			{
				photoArray.push(photos[i].@url);
			}
			timer.start();
			switchPhoto(null);
		}
		
		private function switchPhoto(e:TimerEvent):void
		{
			if(curr < photoArray.length)
			{
				photoLoader = new Loader();
				photoLoader.load(new URLRequest(photoArray[curr]));
				curr++;
				photoLoader.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS, showProgress);
				photoLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, removeTimey);
			}
			else
			{
				curr = 0;
				switchPhoto(null);
				photoLoader.unload();
			}
		}
		
		private function showProgress(e:ProgressEvent):void
		{
			this.addChild(timey);
			var perc:Number = Math.floor(e.bytesLoaded / e.bytesTotal * 100);
			timey.timerText.text = perc + "%";
		}
		
		private function removeTimey(e:Event):void
		{
			this.addChild(photoLoader);
			fade = new Tween(photoLoader,"alpha",None.easeNone,0,1,2,true);
		}		
		
	}
}



