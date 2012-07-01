package fvg
{
	/******************************
	* TextLink class:
	* Extends MovieClip to create a clickable text 
	* link with a rollover state.
	* -----------------------------
	* Developed by Dan Carr (dan@dancarrdesign.com) 
	* For Adobe Systems, Inc. - Adobe Developer Center
	* Last modified: March 2, 2007
	*/
	import flash.events.*;  
	import flash.text.TextField;
	import flash.display.MovieClip;
	
	public class TextLink extends MovieClip
	{
		/**
		* SymbolName for object
		*/
		public var symbolName:String = "TextLink";
		
		//***************************
		// Properties:
		
		public var label		:String;
		public var url			:String;
		
		// Internal
		protected var offset		:Number = 8;
		
		//***************************
		// Intialization:
		
		public function TextLink(){
			// Construct!
		}
		
		//***************************
		// Handle events:
		
		protected function rollOverHandler(event:MouseEvent):void
		{
			if( enabled )
			{
				lbl.background = true;
				lbl.backgroundColor = 0xddeeff;
			}
		}
		
		protected function rollOutHandler(event:MouseEvent):void
		{
			if( enabled )
			{
				lbl.background = false;
			}
		}
		
		protected function clickHandler(event:MouseEvent):void
		{
			if( enabled )
			{
				// Do something on click...
			}
		}
		
		//***************************
		// Public methods:
		
		public function setData(l:String, u:String):void
		{
			if (u != null){
				url = u;
			}else{
				lbl.textColor = 0x000000;
			}
			lbl.autoSize = "left";
			lbl.htmlText = label = l;
			lbl.width = lbl.textWidth + offset;
			lbl.addEventListener(MouseEvent.MOUSE_OVER, rollOverHandler,false,0,true);
			lbl.addEventListener(MouseEvent.MOUSE_OUT, rollOutHandler,false,0,true);
			lbl.addEventListener(MouseEvent.CLICK, clickHandler,false,0,true);
		}
	}
}