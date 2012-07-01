package com.dangries.loaders {
	import flash.display.Loader;
	public class IndexedLoader extends Loader {
		public var which:Number;
		public var done:Boolean;
		
		function IndexedLoader(inputIndex):void {
			this.which = inputIndex;
			this.done = false;
		}
	}
}