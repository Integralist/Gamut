package fvg
{
	/******************************
	* DetailView class:
	* Extends MovieClip to create a detail view display
	* when a thumbnail is clicked in the video gallery.
	* -----------------------------
	* Developed by Dan Carr (dan@dancarrdesign.com) 
	* For Adobe Systems, Inc. - Adobe Developer Center
	* Last modified: March 2, 2007
	*/
	import flash.net.*;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.display.SimpleButton;
	import flash.display.MovieClip;
	import fl.video.VideoEvent;
	
	public class DetailView extends MovieClip
	{
		/**
		* SymbolName for object
		*/
		public var symbolName:String = "DetailView";
		
		//***************************
		// Properties:		
		public var labels 			:*;
		public var details 			:*;
		
		// Installed by gallery
		public var closeFunction	:Function;
		
		//***************************
		// Intialization:
		
		public function DetailView()
		{
			// Set FLVPlayback components
			display.playPauseButton = playPause_btn;
			display.stopButton = stop_btn;
			display.muteButton = mute_btn;
			display.fullScreenButton = full_btn;
			
			// Add button listener
			close.addEventListener(MouseEvent.CLICK, closeHandler);
		}
		
		//***************************
		// Event handlers:
		
		// Video begins playing
		protected function readyHandler(event:VideoEvent):void
		{
			loadingBar.visible = false;
		}
			
		// Close button clicked
		protected function closeHandler(event:MouseEvent):void
		{
			closeFunction();
		}
		
		// Link clicked
		protected function clickHandler(event:MouseEvent):void
		{
			// Call URL
			var url = event.currentTarget.url;
			var request:URLRequest = new URLRequest(url);
			try {            
				navigateToURL(request);
			}
			catch (e:Error) {
				// Handle error...
			}
		}
		
		//***************************
		// Public methods:
		
		public function setData(l,o):void
		{
			labels = l;
			details = o;
			
			// Set labels
			title.htmlText = o.title;
			description.htmlText = o.description;
			
			// Set display state
			var path = o.@flv.toLowerCase();
			if( path != undefined )
			{
				// Progressive video uses a loadingbar
				// whereas streaming video does not...
				if( path.indexOf("rtmp") == -1 && 
					path.indexOf(".xml") == -1 )
				{
					// Set loading state
					loadingBar.visible = true;
				}else{
					loadingBar.visible = false;
				}
				display.source = o.@flv;
			}
			display.addEventListener(VideoEvent.READY, readyHandler);
			
			// Set text link
			moreInfo.setData(o.moreInfo,o.moreInfo.@url);
			moreInfo.addEventListener(MouseEvent.CLICK, clickHandler);
		}
		
		public function reset():void
		{
			if( display.playing ){
				display.stop();
			}
			loadingBar.visible = true;
		}
	}
}