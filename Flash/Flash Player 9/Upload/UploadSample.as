﻿package{	import flash.display.MovieClip;	import flash.text.TextField;	import flash.display.Bitmap;	import flash.display.Loader;	import flash.display.LoaderInfo;	import flash.net.URLLoader;	import flash.net.URLRequest;	import flash.net.FileFilter;	import flash.net.FileReference;	import flash.events.Event;	import flash.events.ProgressEvent;	import flash.events.MouseEvent;	import flash.events.DataEvent;	import flash.display.StageScaleMode;	public class UploadSample extends MovieClip	{		protected var file:FileReference;		protected var image:Bitmap;		public function UploadSample()		{			stage.scaleMode = StageScaleMode.NO_SCALE			progressBar.visible = false;			uploadButton.addEventListener(MouseEvent.CLICK, uploadImage_click);		}				protected function uploadImage_click(e:MouseEvent):void		{ 			file = new FileReference();			file.addEventListener(Event.SELECT, file_selected);			file.browse( [new FileFilter("Images", "*.jpg;*.gif;*.png")] );		}				protected function file_selected(e:Event):void		{			if (image != null)			{				container.removeChild(image);			}						file.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, file_uploaded);			file.addEventListener(ProgressEvent.PROGRESS, file_progress);			if (file.size < 512000)			{//set a max size limit of 500 kb				progressBar.visible = true;				file.upload( new URLRequest("/flashUpload/upload.php")  );			}		}				protected function file_progress(e:ProgressEvent):void		{			progressBar.visible = true;		}				protected function file_uploaded(e:Event):void		{ 			progressBar.visible = false;						var loader:Loader = new Loader();			loader.load ( new URLRequest( "http://www.domain.com/uploads/" + file.name ) );			loader.contentLoaderInfo.addEventListener(Event.COMPLETE, file_loaded);			loader.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS, file_progress);		}				protected function file_loaded(e:Event):void		{ 			progressBar.visible = false;			var loaderInfo:LoaderInfo = LoaderInfo(e.currentTarget);			image = Bitmap(loaderInfo.content);			container.addChild( image );			image.x = container.width / 2 - image.width / 2;			image.y = container.height / 2 - image.height / 2		} 	}}