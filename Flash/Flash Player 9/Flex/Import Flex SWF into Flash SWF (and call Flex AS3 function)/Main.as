package 
{
	/*
	Load an external flex swf into a flash project and communicate with him.
	
	Loading the swf is easy; 
	you can make a normal loader and load it. 
	And now the tricky part, if the swf is a swf flash file you can call the 
	function you want, but in flex, because it have 2 frames, (first frame is 
	just for loading), you need to wait until frame 2 is available, you can’t also 
	access directly to a swf, you have to refer application before, so there’s the code:
	*/
	
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.net.URLRequest;
	import flash.utils.Timer;

	[SWF(width='1024',height='768',backgroundColor='0x000000',frameRate='25')]

	public class Main extends Sprite
	{
		
		private var _swfTimer:Timer;
		private var _loader:Loader;
		
		public function Main()
		{
			_loader = new Loader();
			_loader.load(new URLRequest("Flex.swf"));
			_loader.contentLoaderInfo.addEventListener(Event.COMPLETE,loadIt);
			addChild(_loader);
		}
			
		private function loadIt(e:Event):void
		{
			_swfTimer = new Timer(10);
			_swfTimer.addEventListener(TimerEvent.TIMER,checkSwfLoader);
			_swfTimer.start();
		}
		
		private function checkSwfLoader(e:Event):void
		{	
			var myclip:MovieClip = _loader.content as MovieClip;
			if (myclip.application != null)
			{
				_swfTimer.stop();
				
				// call the function here eg: traceFunction("Hello World")				
				myclip.application.callFlex();
				
				/*
					the text field in the Flex.swf says "default text"
					I wrote a function within Flex.swf called "callFlex"
					which changes the text field content to 
					"this text was changed by a flex function"
					but now I call that function directly from Flash so I get to use
					the GUI enhancements of Flex with Flash
				*/
			}
		}
		
		/*
			you can also add Event Listener's to myClip.application, 
			like myClip.addEventLIstener(“ON_CHANGE”,function),
			so by this way you can embed flex swf into an flash application
			and communicate with him by calling function and receiving events.
		*/
		
	}
}