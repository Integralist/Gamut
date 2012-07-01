package fvg
{
	/******************************
	* VideoThumbnail class:
	* Extends MovieClip to act as a button for thumbnail
	* video selection in the Flash Video Gallery interface.
	* -----------------------------
	* Developed by Dan Carr (dan@dancarrdesign.com) 
	* For Adobe Systems, Inc. - Adobe Developer Center
	* Last modified: March 2, 2007
	*/
	import fl.containers.UILoader;
	import flash.display.*;
	import flash.events.*;
	import fl.video.*;
	
	public class VideoThumbnail extends MovieClip
	{
		/**
		* SymbolName for object
		*/
		public var symbolName:String = "VideoThumbnail";
		
		//***************************
		// Properties:		
		public var data					:Object;
		public var index				:Number;
		
		// Installed by gallery
		public var initFunction			:Function;
		
		// Assets
		protected var linkageLoader		:UILoader;
		protected var linkageMask		:Sprite;
		
		// Layout
		protected var cursorXOffset		:Number = -16;
		protected var cursorYOffset		:Number = -38;
		
		// Flag
		protected var useExternalVideo	:Boolean = false;
		
		//***************************
		// Intialization:
		
		public function VideoThumbnail()
		{
			// Construct!
			buttonMode = true;
			useHandCursor = true;
			outline.visible = false;
		}
		
		//***************************
		// Handle events:
		
		protected function rollOverHandler(event:MouseEvent):void
		{
			if( enabled )
			{
				// Adjust state
				outline.visible = true;
				scaleX = scaleY = 1.5;
				
				// Set tooltip
				var tooltip = root["tooltip"];
				tooltip.x = root.mouseX + cursorXOffset;
				tooltip.y = root.mouseY + cursorYOffset;
				tooltip.visible = true;
				tooltip.setLabel(data.title);
				
				// Play video
				playVideo();
				
				// Listen for mouse move
				addEventListener(MouseEvent.MOUSE_MOVE, moveHandler);
			}
		}
		
		protected function rollOutHandler(event:MouseEvent):void
		{
			if( enabled )
			{
				// Adjust state
				outline.visible = false;
				scaleX = scaleY = 1;
					
				// Set tooltip
				root["tooltip"].visible = false;
					
				// Pause content
				pauseVideo();
				
				// Remove listener
				removeEventListener(MouseEvent.MOUSE_MOVE, moveHandler);
			}
		}
		
		protected function moveHandler(event:MouseEvent):void
		{
			var tooltip = root["tooltip"];
			tooltip.x = root.mouseX + cursorXOffset;
			tooltip.y = root.mouseY + cursorYOffset;
		}
		
		protected function readyHandler(event:VideoEvent):void
		{
			// Signal that we're ready
			initFunction();
		}
		
		protected function completeHandler(event:VideoEvent):void
		{
			// Check to see if we're streaming,
			// in that case we won't loop and
			// risk a player crash while overlapping
			// with other video thumbnails...
			var path = data.@preview.toLowerCase();
			if( path.indexOf("rtmp") == -1 && 
				path.indexOf(".xml") == -1 )
			{
				// Loop video...
				display.seek(0);
				display.play();
			}
		}
		
		//***************************
		// Public methods:
		
		public function setData(i:Number,o:Object):void
		{
			// Save values
			index = i;
			data = o;
			
			// Load from linkage id or from external FLV
			var path = data.@preview.toLowerCase();
			if( path.indexOf(".flv") != -1 || 
				path.indexOf(".xml") != -1 )
			{
				// FLV
				useExternalVideo = true;
				display.source = path;
				display.addEventListener(VideoEvent.READY, readyHandler);
				display.addEventListener(VideoEvent.COMPLETE, completeHandler);
			}
			else{
				// Attach movie!
				linkageLoader = new UILoader();
				linkageLoader.scaleContent = false;
				linkageLoader.source = path;
				addChild(linkageLoader);
				
				// Create a mask
				linkageMask = new Sprite();
				linkageMask.graphics.beginFill(0xFF0000);
				linkageMask.graphics.drawRect(-29.5, -22.5, 59, 46);
				addChild(linkageMask);
				
				// Apply mask and stop video
				linkageLoader.mask = linkageMask;
			   (linkageLoader.content as MovieClip).stop();
			}
			
			// Float the topdetail movieclip to the top
			setChildIndex(topDetail, numChildren - 1);
			
			// Listen to mouse interactions
			addEventListener(MouseEvent.MOUSE_OVER, rollOverHandler,false,0,true);
			addEventListener(MouseEvent.MOUSE_OUT, rollOutHandler,false,0,true);
		}
		
		public function setActive(state:Boolean):void
		{
			enabled = state;
			alpha = state ? 1 : 0.15;
		}
		
		public function playVideo():void
		{
			if( useExternalVideo ){
				display.play();
			}else{
				(linkageLoader.content as MovieClip).play();
			}
		}
		
		public function pauseVideo():void
		{
			if( useExternalVideo ){
				display.pause();
			}else{
				(linkageLoader.content as MovieClip).stop();
			}
		}
		
		//***************************
		// Filtering methods:
		
		public function filterBy(filterType:Number,filterKey:Array):void
		{
			var filterMatchArr;
			var filterMatched = false;
			
			// Loop through filter type to see if we have a match
			switch(filterType)
			{
				case 1:
					// Examine filter1 for a match
					filterMatchArr = data.@filter1.toString().split(",");
					break;
				case 2:
					// Examine filter2 for a match
					filterMatchArr = data.@filter2.toString().split(",");
					break;
			}
			
			// Look for matches
			for(var n=0; n<filterMatchArr.length; n++)
			{
				for(var j=0; j<filterKey.length; j++)
				{
					if( filterMatchArr[n] == filterKey[j] ){
						filterMatched = true;
						break;
					}
				}
			}
			// Select or deselect this thumb
			setActive( filterMatched );
		}
	}
}