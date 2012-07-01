// first create the package and import the required classes
	package
	{
		import flash.display.Sprite;
		import flash.events.*;
		import flash.media.Video;
		import flash.net.NetConnection;
		import flash.net.NetStream;
		
		// now create the class
			public class MyVideo extends Sprite
			{
				// create private variables
					private var _videoURL:String = 'Video.flv';
					private var _conn:NetConnection;
				
				// now create the constructor
					public function MyVideo()
					{
						_conn = new NetConnection();
						_conn.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
						_conn.connect(null);
					}
					
				// check the connection to the video
					private function netStatusHandler(event:NetStatusEvent):void
					{
						switch(event.info.code)
						{
							case 'NetConnection.Connect.Success' :
								trace('Success! you\'re now connected');
								connectStream();
								break;
								
							case 'NetStream.Play.StreamNotFound' :
								trace('Error? we are unable to locate the video ' + _videoURL);
								break;
						}
					}
					
				// create a new netstream and add event listeners for status and async
					private function connectStream():void
					{
						var stream:NetStream = new NetStream(_conn);
						stream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
						stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, asyncErrorHandler);
						
						// create a new video object to playout the video content
							var video:Video = new Video();
							video.attachNetStream(stream);
							stream.play(_videoURL);
							
						// now add the video to the stage
							addChild(video);
					}
					
				// this function handles the async error
					private function asyncErrorHandler(e:AsyncErrorEvent):void
					{
						trace(e);
					}
			}
	}