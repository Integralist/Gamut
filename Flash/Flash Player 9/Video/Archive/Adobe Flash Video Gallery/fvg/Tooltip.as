package fvg
{
	/******************************
	* Tooltip class:
	* Extends MovieClip to create a tooltip display
	* for the video thumbnails.
	* -----------------------------
	* Developed by Dan Carr (dan@dancarrdesign.com) 
	* For Adobe Systems, Inc. - Adobe Developer Center
	* Last modified: February 24, 2007
	*/
	import flash.text.TextField;
	import flash.display.MovieClip;
	
	public class Tooltip extends MovieClip
	{
		/**
		* SymbolName for object
		*/
		public var symbolName:String = "Tooltip";
		
		//***************************
		// Properties:
		
		public var text:String = "";
		
		//***************************
		// Intialization:
		
		public function Tooltip()
		{
			// Construct!
			lbl.autoSize = "left";
		}
		
		//***************************
		// Public methods:
		
		public function setLabel(l:String):void
		{
			lbl.htmlText = text = l;
			skin_mc.width = Math.round(lbl.textWidth) + 20;
		}
	}
}