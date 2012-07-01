/**
* Author: Amen Kamaleldine
* Date: Feb 21 2008
* Action script 3 Photo Viewer Tutorial
* 
* 
* You are free to modify/use this file without any written permission
* Please give the author some credits ;)
*/
package {
	
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.SharedObject;
	import flash.events.MouseEvent;
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.display.Bitmap;
	import flash.external.ExternalInterface;
	import flash.display.BitmapData;
	
	import flash.display.MovieClip;
	import flash.net.LocalConnection;
	import flash.events.StatusEvent;
	import flash.geom.*;
	
	import flash.text.TextField;
	import flash.system.System;
	import flash.text.TextFormat;
	import flash.utils.*;


	public class PhotoViewer extends MovieClip {
		
		//Loader to load the xml
		private var xmlLoader:URLLoader;
		//when data is ready assigne it to an xml object
		private var xml:XML;
		//To retrieve each item in the xml object
		private var xmlList:XMLList;
		//represent the container of all the loaded image, will be always centered to the stage
		private var holder:MovieClip;
		//the menu item holder
		private var menuHolder:Sprite;
		//this image holder will sit inside the holder for the X sliding transition
		private var imgHolder:MovieClip;
		//the current position
		private var pos:Number;
		//Loader object to load an external image
		private var loader:Loader;
		//will contain the url of the image
		private var urlRequest:URLRequest;
		//which will be our resizer, after loading an image with the loader, we resize the fakeholder and 
		//retrieve the bitmap data
		private var fakeHolder:Sprite;
		//black background
		private var black:Sprite;
		
		//current bitmap data
		private var myBitmapData:BitmapData;
		//and ImageContainer object that holds a bitmapdata and it create its own reflexion
		private var imageContainer:ImageContainer;
		
		//the current image pos
		private var imgPos:Number;
		//the total images numver
		private var imgTotal:Number;
		//the stage Width (where the images will sit)
		private var stageW:Number;
		//same for the height
		private var stageH:Number;
		//final sliding X
		private var finalX:Number;
		//the difference between the initial and the final
		private var diffX:Number;
		//initial X
		private var xi:Number;
		
		//current X will describe its usage later
		private var cX;
		//also will be described later
		private  var _percentage;
		
		//a reference array to all the items
		private var item_array:Array;
		
		//Constructor
		public function PhotoViewer() {
			
			//set the scale mode to noscale and the alignement to top left
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			stage.addEventListener(Event.RESIZE, resizeHandler);
			
			
			//call the initialization function
			init();
		}
		private function init():void {
			//initializze the item_array
			item_array=[];
			
			//init the percent to 0
			this._percentage=0
			//the difference to 1
			diffX=1;
			//the finalX to 0
			finalX=0;
			//also the current X
			cX=0;
			
			stageW=stage.stageWidth;
			stageH=stage.stageHeight;
			//create the menu Holder
			menuHolder=new Sprite();
			//the black back ground
			black=new Sprite();
			//add it to stage
			addChild(black);
			//the draw it
			drawColorRect(black,0x000000,stageW,stageW);
			//create the holder
			holder=new MovieClip();
			//and the image holder
			imgHolder=new MovieClip();
			//attach the image holder to the holder
			holder.addChild(imgHolder);
			//add an on Enter frame to the holder
			holder.addEventListener(Event.ENTER_FRAME,dispatchOnEnterFrame);
			//add the holder to the stage
			addChild(holder);
			
			
			//initialize the loader object
			loader=new Loader();
			//add an onInit event to the contentLoadedInfo
			loader.contentLoaderInfo.addEventListener(Event.INIT, onImageLoaded);
			//create the fake holder
			fakeHolder=new Sprite();
			//and add to it the loader
			fakeHolder.addChild(loader);
			//no need to add it to the stage
			//
			//force the resizeHandler to be called
			resizeHandler(null);
			
			//Load the XML file
			xmlLoader=new URLLoader();
			//assign the Complete loading event
			xmlLoader.addEventListener(Event.COMPLETE,parseXML);
			//load the file
			xmlLoader.load(new URLRequest("data.xml"));
			//initialize the url request
			urlRequest=new URLRequest();
		}
		
		private function dispatchOnEnterFrame(e){
			//if the diffrence=0 do nothing
			if(diffX==0)return;
			//else update the sliding of our image holder with easing
			imgHolder.x+=(finalX-imgHolder.x)/6;
			//and also update the current X aside but with a greater easing coef to have some retard in time
			//between the 2 transition
			cX+=(finalX-cX)/12;
			//generate a percentage
			var per=100*(1-(finalX-cX)/diffX);
			//and ease the current percentage depending on the current generated percentage
			//this will assure the smoothing and the continus animation
			percentage+=(per-percentage)/12;
			//update the scaling to have the zoom in out effect
			holder.scaleX=1-(.5)*Math.sin(Math.PI*percentage/100);
			holder.scaleY=1-(.5)*Math.sin(Math.PI*percentage/100);
			
			
			
			
		}
		//on load complete of the xml parse the data
		private function parseXML(event){
			//generate the xml object
			xml=new XML(event.target.data);
			//ignorre the white spaces
			xml.ignoreWhitespace=true;
			//generate the xmlList object
			xmlList=xml.img;
			//init the image pos
			imgPos=0;
			//and the total image number
			imgTotal=xmlList.length();
			//add the menu holder to the stage
			addChild(menuHolder);
			//create a menu item variable
			var menuItem:Sprite;
			//and a textfield
			var menuText:TextField;
			//assign a new format for the text field
			var format:TextFormat = new TextFormat();
			format.font = "_sans";
			format.color = 0xFFFFFF;
			format.align='center';
			format.size = 10;
			//loop on the items to generate the menu
			for(var i=0;i<xmlList.length();i++){
				//the text field
				menuText=new TextField();
				//size fo the text
				menuText.width=15;
				menuText.height=15;
				menuText.defaultTextFormat=format;
				//set the text
				menuText.text=i;//
				//not selectable
				menuText.selectable=false
				//show border 
				menuText.border=true;
				menuText.borderColor=0xFFFFFF;
				//give it the name text
				menuText.name="text";
				
				menuItem=new Sprite();
				//add it to the menu item
				menuItem.addChildAt(menuText,0);
				//
				menuItem.x=i*(menuItem.width+10);
				//draw the back ground ot use the backgroundColor text field proprety instead
				menuItem.graphics.beginFill(0x333333,1);
				menuItem.graphics.drawRect(0,0,menuItem.width,menuItem.height);
				menuItem.graphics.endFill()
				//disable the mouse children
				menuItem.mouseChildren=false
				//enable the button mode and use the hand cursor
				menuItem.useHandCursor=true;
				menuItem.buttonMode=true;
				//add the on click event
				menuItem.addEventListener(MouseEvent.CLICK,handleItemClick);
				
				
				//add the menu item to the menu holder
				menuHolder.addChild(menuItem);
				
			}
			//reupdate the position of the childs
			resizeHandler(null);
			//start loading the images one after one			
			loadNextImage();
		}
		//handle the menu item click
		private function handleItemClick(e:Event){
			var item:Sprite=e.target as Sprite;
			//retrieve the text
			var _text:TextField=item.getChildByName("text") as TextField;
			//parse it to int and show the image at that position
			showImageAt(parseInt(_text.text));
			
		}
		//load the images via this function
		private function loadNextImage(){
			//Trivial Test to stop the loading
			if(imgPos==imgTotal){
				return;
			}
			//get the url
			var url:String=xmlList[imgPos].toString();
			//assign it to the urlRequest objecct
			urlRequest.url=url;
			//load it
			loader.load(urlRequest)
			
			
		}
		//getter setter of the percentage
		public function set percentage(value:Number){
			this._percentage=value;
		}
		
		public function get percentage():Number{
			return this._percentage;
		}
		//show the image at the position specified
		private function showImageAt(pos:Number){
			//current x and the initial x
			cX=xi=imgHolder.x;
			//the final X
			finalX=-(item_array[pos].x);
			//the difference between them
			diffX=finalX-xi;
			
			
		}
		//draw a colored rectangl in the _in sprite
		private function drawColorRect(_in:Sprite,color:Number,nW:Number,nH:Number) {
			
			_in.graphics.beginFill(color);
			_in.graphics.drawRect(0, 0, nW, nH);
			_in.graphics.endFill();

		}
		//on image loaded do this
		private function onImageLoaded(event:Event) {
			trace('onImageLoaded');
			
			//fix the size of the loaded which is inside the fakeHolder
				fixSize(loader);
				//create a new bitmap data
				myBitmapData= new BitmapData(loader.width, loader.height);
				//draw it from the fakeHolder to retrieve the data of the resized image
				myBitmapData.draw(fakeHolder);
				//creata a new image container
				var imgContainer:ImageContainer=new ImageContainer();
				imgContainer.imageData=myBitmapData;
				//set its position
				imgContainer.x=stageW*(imgPos)+imgPos*stageW/2;
				
				//add it to the image holder
				imgHolder.addChild(imgContainer);
				//and to the reference array
				item_array.push(imgContainer);
				//update the image position
				imgPos++;
				//triger the onAllImagesLoaded event
				if(imgPos>=imgTotal){
					onAllImagesLoaded();
					return;
				}else{
					//or load the next image
					loadNextImage();
				}

		}
		private function onAllImagesLoaded(){
			
			
		}
		//fix the size of the loader
		private function fixSize(loader:Loader) {

			var sw:Number=1;
			var sh:Number=1;

			loader.scaleX=1;
			loader.scaleY=1;
			//depending on the stageW and stageH and without loosing the ratio
			//the loaded is resized
			if (loader.width>stageW) {
				sw=stageW/loader.width;
			}
			if (loader.height>stageH) {
				sh=stageH/loader.height;
			}
			var s:Number=Math.min(sw,sh);

			loader.width*=s;
			loader.height*=s;


		}
		//resize handler function
		//update the positions of all the childs and the stageW and stageH
		private function resizeHandler(event:Event):void {
			drawColorRect(black,0x000000,stage.stageWidth,stage.stageHeight);
			//the the new stage width and height variabled
			stageW=stage.stageWidth-30;
			stageH=stage.stageHeight-30;
			//eanter the holder
			holder.x=stage.stageWidth/2;
			holder.y=stage.stageHeight/2;
			//and alwo the menu holder
			menuHolder.x=(stage.stageWidth-menuHolder.width)/2


		}
	}
}
import flash.display.MovieClip;
import flash.display.Bitmap;
import flash.display.BitmapData;
import flash.display.*;
import flash.geom.*;
//class to display a bitmap data with reflexion
class ImageContainer extends MovieClip {
	//bitmap object
	private var bmp:Bitmap;
	//reflection bitmap object
	private var reflexion:Bitmap;
	//ref bitmap data
	private var refData:BitmapData;
	//reflextion mask
	private var refmask:Sprite;

	public function ImageContainer() {
		//initialize the bmp and the reflexion object
		bmp=new Bitmap();
		reflexion=new Bitmap();
		
		//and add it to the image container
		this.addChild(bmp);

	}
	//setter for the bitmap data
	public function set imageData(value:BitmapData) {
		//if the old value is not null dispose the data
		if (bmp.bitmapData!=null) {
			bmp.bitmapData.dispose();
		}
		//set the new data
		bmp.bitmapData=value;
		//update the position
		reflexion.x=bmp.x=-bmp.width/2;
		bmp.y=-bmp.height/2;
		//flip the reflexion object
		reflexion.scaleY=-1;
		//force the smoothing
		bmp.smoothing=true;
		//create the reflextion bitmap data
		refData=new BitmapData(bmp.width,bmp.height/4);
		//and copy  the pixel for the bmp bitmapdata
		refData.copyPixels(bmp.bitmapData,new Rectangle(0,3*bmp.height/4,bmp.width,bmp.height/4),new Point(0,0));
		
		//set the bitmap objects bitmap data
		reflexion.bitmapData=refData;
		//set the smoothing to true
		reflexion.smoothing=true;
		//update the reflextion position
		reflexion.y=bmp.height/2+reflexion.height+5;
		//create the mask
		refmask=new Sprite();
		//fill it with a gradient color (see help files)
		var fillType:String = GradientType.LINEAR;
		  var colors:Array = [0xFFFFFF, 0xFFFFFF];
		  var alphas:Array = [0.5, 0];
		  var ratios:Array = [0x00, 0xFF];
		  var matr:Matrix = new Matrix();
		  matr.createGradientBox(reflexion.width, reflexion.height, Math.PI/2, 0, 0);
		  var spreadMethod:String = SpreadMethod.PAD;
		  refmask.graphics.beginGradientFill(fillType, colors, alphas, ratios, matr, spreadMethod);  
		  refmask.graphics.drawRect(0,0,reflexion.width, reflexion.height);
		 //see help files
		  
		  //update the ref mask postion
		  refmask.x=reflexion.x;
		  refmask.y=reflexion.y-reflexion.height;
		  //cash as bitmap both the relexion mask and reflexion sprite 
		  refmask.cacheAsBitmap=true;
		  reflexion.cacheAsBitmap=true;
		  //set the mask on the reflextion
		 reflexion.mask=refmask;
		 //add the mask
		addChild(refmask);
		
		this.scaleX=1;
		this.scaleY=1;
		//add reflexion
		addChild(reflexion);
	}
}