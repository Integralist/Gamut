/*

properties:

	.pictureArray:Array - an array of bitmap images - use get method
	
	.useFailPic:Boolean - whether to use fail picture in place of intended load
	
	.failPicSize:Number - side length of square fail pic
	
methods:

	PictureLoader(_useFailPic = true, _failPicSize = 16)
	
	loadPics(inputURLArray:Array):void

events:

	ALL_PICS_LOADED
	



*/


package com.dangries.loaders {
	import flash.display.*;
	import flash.events.*;
	import flash.net.URLRequest;
	import com.dangries.loaders.IndexedLoader;
	
	public class PictureLoader extends EventDispatcher {
		
		public static const ALL_PICS_LOADED:String="allPicsLoaded";
		
		private function dispatch():void {
			dispatchEvent(new Event(PictureLoader.ALL_PICS_LOADED));
		}

		public var picURLArray:Array = [];
		private var picLoader:Array = [];
		private var pic:Array=[];
		private var loadCount:Number;
		public var failPicSize:Number;  
		public var useFailPic:Boolean;

		
		public function PictureLoader(_useFailPic = true, _failPicSize = 16) {
			this.useFailPic = _useFailPic;
			this.failPicSize = _failPicSize;
		}
				
		public function loadPics(inputURLArray:Array):void {
			picURLArray = inputURLArray;
			pic = [];
			loadCount = 0;
			setUpLoaders();
		}
		
		private function failPic():Sprite {
			var thisPic:Sprite = new Sprite();
			thisPic.graphics.lineStyle(2,0xdddddd);
			thisPic.graphics.beginFill(0x000000);
			thisPic.graphics.drawRect(0,0,failPicSize,failPicSize);
			thisPic.graphics.endFill();
			thisPic.graphics.lineStyle(2,0xdd0000);
			thisPic.graphics.moveTo(2,2);
			thisPic.graphics.lineTo(failPicSize-2,failPicSize-2);
			thisPic.graphics.moveTo(failPicSize-2,2);
			thisPic.graphics.lineTo(2,failPicSize-2);
			return thisPic;
		}
				
		private function cleanUp():void {
			var errorPic:Array = [];
			for (var n:Number=0; n<= picURLArray.length-1; n++) {
				if (pic[n]==null) {
					//trace("Picture "+String(n)+" not loaded.");
					picLoader[n].contentLoaderInfo.removeEventListener(Event.INIT, initListener);
					picLoader[n].contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, errorHandler);
					errorPic.push(n);
				}
			}
			if (useFailPic) {
				//place fail pic in bad spots
				if (errorPic.length != 0) {
					for (n = 0; n<= errorPic.length - 1; n++) {
						var thisBitmapData:BitmapData = new BitmapData(failPicSize, failPicSize);
						var thisBitmap:Bitmap = new Bitmap(thisBitmapData);
						thisBitmapData.draw(failPic());
						pic[errorPic[n]] = thisBitmap;			
					}
				}
			}
			else {
				//remove error pics from pic array
				if (errorPic.length != 0) {
					for (n = 0; n<= errorPic.length - 1; n++) {
						pic.splice(errorPic[n],1);
					}
				}
			}
		}
		
		private function setUpLoaders():void {
			var thisURL:URLRequest;
			//create a loader for each picture, to load simultaneously.
			for (var n:Number=0; n<= picURLArray.length-1; n++) {
				var thisLoader:IndexedLoader = new IndexedLoader(n);
				picLoader.push(thisLoader);
				picLoader[n].load(new URLRequest(picURLArray[n]));
				picLoader[n].contentLoaderInfo.addEventListener(Event.INIT, initListener);
				picLoader[n].contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);
			}
		}
		
		private function errorHandler(evt:ErrorEvent):void {
			loadCount++;
			if (loadCount == picURLArray.length) {
				cleanUp();
				dispatch();
			}
		}
		
		private function initListener(evt:Event):void {
			//copy loaded picture to pic array
			try {
				var n:Number = evt.currentTarget.loader.which;
				//trace("picture "+String(n)+" loaded.");
				pic[n] = Bitmap(picLoader[n].content);
			}
			catch (err:Error) {
				//trace("picture "+String(n)+" unsuccessful.");
			}
			//remove event listener
			picLoader[n].contentLoaderInfo.removeEventListener(Event.INIT, initListener);
			loadCount++;
			if (loadCount == picURLArray.length) {
				cleanUp();
				dispatch();
			}
		}
		
		public function get picArray():Array {
			return pic;
		}
	}
}
		
