package com.jor.examples.liquidgui.ui
{
  import flash.display.Sprite;
  import flash.display.Loader;
  import flash.net.URLRequest;
  //
  public class ThumbnailUI extends Sprite
  {
  	private var _path:String;
  	public function get Path ():String
  	{
  	  return _path;
  	}
  	/**
  	 * Constructor
  	 */
  	public function ThumbnailUI (path:String)
  	{
  	  _path = path;
  	  __configUI ();
  	}
  	/**
  	 * Configures the user interface elements of this DisplayObject
  	 */
  	private function __configUI ():void
  	{
      buttonMode = true;
  	  var loader:Loader = new Loader ();
      loader.load (new URLRequest("images/sm_"+_path));
      addChild (loader);
  	}
  }
}
/**
 * Author: James O’Reilly - JOR
 *         www.jamesor.com
 *
 * This work is licensed under the Creative Commons attribution 2.5
 * This comment block must remain intact.
 */