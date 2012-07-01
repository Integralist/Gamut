package
{
	// import the nedded packages
	import flash.display.*;
	import flash.events.*;
	import flash.text.*;
	import flash.net.*;
	import flash.media.Video;	
	
	// declare YouTube class
	public class YouTube extends Sprite 
	{		
		private var videoBtn:Button;
		private var videoTxt:TextInput;
		private var videoPlayer:Video;
		
		private var loader:Loader;
		private var req:URLRequest;
		
		private var nc:NetConnection=new NetConnection();
		private var ns:NetStream;
		
		private var youtubeURL:String = 'http://youtube.com/v/';
		private var videoID:String;
		private var flvURL:String;		
		
		//constructor		
		public function YouTube()
		{
			trace('YouTube instantiated.')
			
			// reference the components on stage.
			videoBtn = this["video_btn"];
			videoTxt = this["video_txt"];
			videoPlayer = this["player"];
			
			// set up click listener
			videoBtn.addEventListener(MouseEvent.CLICK, clickHandler);
		}
		
		private function getVideo():void
		{
			// set up loader/urlrequest objects...
			loader = new Loader()
			req = new URLRequest(youtubeURL+videoID);
			req.method = URLRequestMethod.GET;
			
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE, loaded);
			loader.load(req)
		}
		
		private function loaded(e:Event):void
		{			
			var urlVars:URLVariables = new URLVariables();
			urlVars.decode(loader.contentLoaderInfo.url.split("?")[1])
			
			var token:String = urlVars.t;
			flvURL =  "http://www.youtube.com/get_video.php?video_id=" +videoID+"&t="+token;
			loader.unload();
			playVideo()
		}
		
		private function playVideo():void
		{
			nc.connect(null)			
			ns=new NetStream(nc);
			ns.client = this;
			videoPlayer.attachNetStream(ns)
			ns.play(flvURL)
		}
		
		private function clickHandler(e:MouseEvent):void
		{
			videoID = videoTxt.text;
			getVideo();
		}
		
		public function onMetaData(e:Object):void
		{
		}
	} 
}