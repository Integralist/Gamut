package fvg
{
	/******************************
	* FlashVideoGallery class:
	* Extends MovieClip to act as a manager class for the video 
	* gallery application. This object loads XML data, initializes 
	* it in its sub-objects, and handles events from the sub-objects...
	* -----------------------------
	* Developed by Dan Carr (dan@dancarrdesign.com) 
	* For Adobe Systems, Inc. - Adobe Developer Center
	* Last modified: March 2, 2007
	*/
	import fvg.*;
	import flash.net.*;
	import flash.events.*;    
	import flash.display.*;
	import flash.text.TextField;
	import fl.controls.CheckBox;
	import fl.controls.RadioButton;   
	
	public class FlashVideoGallery extends MovieClip
	{
		/**
		* SymbolName for object
		*/
		public var symbolName:String = "FlashVideoGallery";
		
		//***************************
		// HTTP:
		protected var loader				:URLLoader;
		protected var settingsXML			:XML;
		protected var settingsPath			:String = "Settings.xml";
		
		// Thumbnail layout:
		protected var thumbXBegin			:Number = 38;
		protected var thumbYBegin			:Number = 60;
		protected var thumbXSpacing			:Number = 1;
		protected var thumbYSpacing			:Number = 1;
		protected var thumbsPerRow			:Number = 6;
		protected var thumbsLoaded			:Number = 0;
		protected var useExternalVideo 		:Boolean = false;
		
		// Checkbox layout:
		protected var checkBoxWidth			:Number = 200;
		protected var filter1XBegin			:Number = 20;
		protected var filter1YBegin			:Number = 400;
		protected var filter1YSpacing		:Number = -4;
		protected var filter2XBegin			:Number = 194;
		protected var filter2YBegin			:Number = 400;
		protected var filter2YSpacing		:Number = -4;
		
		// Filter lookup
		protected var currentFilterGroup	:Number = 1;
		protected var filterMaxLength		:Number = 2;
		protected var filterOptionsMaxLength:Number = 4;
		
		// Detail view
		protected var detailViewCreated  	:Boolean = false;
		protected var detailView			:*;
		
		// Current thumb
		public var selectedItem				:*;
		public var currentItem				:*;
		
		//***************************
		// Intialization:
		
		public function FlashVideoGallery()
		{
			// Load data!
			loader = new URLLoader();
			loader.load(new URLRequest(settingsPath));
			loader.addEventListener(Event.COMPLETE, onDataHandler);
		}
		
		//***************************
		// Event handlers:
		
		// Data loaded
		protected function onDataHandler(event:Event):void
		{
			if((event.target as URLLoader) != null )
			{
				settingsXML = new XML(loader.data);
				layout();
			}
		}
		
		// Thumbnail rollOver
		protected function thumbOverHandler(event:MouseEvent):void
		{  
			currentItem = event.currentTarget as MovieClip;
			setChildIndex(currentItem, numChildren - 1);
		}
			
		// Thumbnail clicked
		protected function thumbClickHandler(event:MouseEvent):void
		{   
			// Validate
			if( selectedItem == event.currentTarget ){
				return;
			}
			// Save selection
			selectedItem = event.currentTarget;
			
			// Load a video detail
			showDetail(true, selectedItem.index);
		}
			
		// Link clicked
		protected function linkClickHandler(event:MouseEvent):void
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
		
		// Filter clicked
		protected function filterClickHandler(event:MouseEvent):void
		{
			// Find which filter group to use (Radio button)
			for(var j=0; j<filterMaxLength; j++)
			{
				var radio = "radio"+(j+1);
				if( getChildByName(radio) != null )
				{
					if( this[radio].selected ){
						currentFilterGroup = j+1;
						break;
					}
				}
			}
			
			// Get selections (Related checkboxes)
			var filterByArr:Array = new Array();
			for(var n=0; n<filterOptionsMaxLength; n++)
			{
				var check = "checkbox"+(currentFilterGroup == 2 ? (n+1+filterOptionsMaxLength) : n+1);
				if( getChildByName(check) != null )
				{
					if( this[check].selected ){
						filterByArr.push(settingsXML.filters[currentFilterGroup-1].filter[n+1].@id);
					}
				}
			}
			
			// Set filters on thumbnails (All thumbnails)
			for(var i=0; i<numChildren; i++)
			{
				var item = getChildAt(i);
				if( item is VideoThumbnail ){
					item.filterBy(currentFilterGroup,filterByArr);
				}
			}
		}
		
		//***************************
		// Layout:
			
		protected function layout():void
		{
			// 1. LABELS (Set labels)
			var obj;
			for each(var prop1:XML in settingsXML.labels.label )
			{
				// Set labels if a matching object exists
				if( getChildByName(prop1.@name) != null )
				{
					obj = this[prop1.@name];
					obj.htmlText = prop1;
				}
			}
			
			// 2. LINKS (Set links on main screen)
			for each(var prop2:XML in settingsXML.links.link )
			{
				// Set labels if a matching object exists
				if( getChildByName(prop2.@name) != null )
				{
					obj = this[prop2.@name];
					obj.setData(prop2,prop2.@url);
					obj.addEventListener(MouseEvent.CLICK, linkClickHandler);
				}
			}
			
			// 3. FILTER 1 (Layout filter 1 labels)
			for each(var prop3:XML in settingsXML.filters[0].filter )
			{
				if( getChildByName(prop3.@name) != null ){
					obj = this[prop3.@name];
					if( prop3.toString().length > 0 )
					{
						obj.label = prop3;
						obj.selected = (prop3.@view == 1) ? true : false;
						obj.addEventListener(MouseEvent.CLICK, filterClickHandler);
					}
					else{
						obj.visible = false;
					}
				}
			}
			
			// 4. FILTER 2 (Layout filter 2 labels)
			for each(var prop4:XML in settingsXML.filters[1].filter )
			{
				if( getChildByName(prop4.@name) != null ){
					obj = this[prop4.@name];
					if( prop4.toString().length > 0 )
					{
						obj.label = prop4;
						obj.selected = (prop4.@view == 1) ? true : false;
						obj.addEventListener(MouseEvent.CLICK, filterClickHandler);
					}
					else{
						obj.visible = false;
					}
				}
			}
			
			// 5. THUMBNAILS (Layout the video thumbnails) - data.@preview
			var i = 0;
			for each(var prop5:XML in settingsXML.videos.video )
			{
				var data = settingsXML.videos.video[i];
				if( data.@preview.toString().indexOf(".flv") != -1 ){
					useExternalVideo = true;
				}
				var deltaX = i - Math.floor(i / thumbsPerRow) * thumbsPerRow;
				obj = new VideoThumbnail();
				obj.x = deltaX * (obj.width + thumbXSpacing) + thumbXBegin;
				obj.y = Math.floor(i / thumbsPerRow) * (obj.height + thumbYSpacing) + thumbYBegin;
				obj.setData(i,data);
				obj.initFunction = setThumbCount;
				obj.addEventListener(MouseEvent.MOUSE_OVER, thumbOverHandler);
				obj.addEventListener(MouseEvent.CLICK, thumbClickHandler);
				addChild(obj);
				i++;
			}
			
			// If using embedded thumbnail videos, then
			// display the interface now. Otherwise wait
			// for the external FLVs to load first...
			if(!useExternalVideo){
				showGallery();
			}
		}
		
		//***************************
		// Thumbnail FLV timing hook:
		
		public function setThumbCount():void
		{
			thumbsLoaded++;
			if( thumbsLoaded == settingsXML.videos.video.length() ){
				showGallery();
			}
		}
		
		//***************************
		// Screen loading timing hook:
		
		public function showGallery():void
		{
			root["loading_mc"].visible = false;
			root["cover_mc"].visible = false;
		}
		
		//***************************
		// Load video details:
		
		public function showDetail(state:Boolean,index:Number):void
		{
			// Create the clip if needed
			if(!detailViewCreated)
			{
				detailView = new DetailView();
				detailView.closeFunction = hideDetail;
				detailView.x = 458;
				detailView.y = 31;
				addChild(detailView);
				detailViewCreated = true;
			}
			// Show or hide the detail
			if( state )
			{
				var labels = settingsXML.labels.label;
				var details = settingsXML.videos.video[index];
				// Set data!
				detailView.setData(labels,details);
			}
			else{
				detailView.reset();
			}
			detailView.visible = state;
		}
		
		public function hideDetail():void
		{
			showDetail(false,-1);
		}
	}
}