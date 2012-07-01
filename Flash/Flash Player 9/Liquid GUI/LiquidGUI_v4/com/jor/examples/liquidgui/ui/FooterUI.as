package com.jor.examples.liquidgui.ui
{
  import com.jor.examples.liquidgui.IResizable;
  import com.jor.examples.liquidgui.ui.ThumbnailUI;
  import flash.display.Sprite;
  import flash.events.MouseEvent;
  import com.jor.examples.liquidgui.events.ThumbnailEvent;
  //
  public class FooterUI extends Sprite implements IResizable
  {
    public static var _instance:FooterUI;
    public var bg:Sprite;    
    private var _parent:Sprite;    
 
    /**
     * Constructor
     */
    public function FooterUI (p:Sprite)
    {
      _parent = p;
      __configUI ();
    }
  	/**
  	 * Configures the user interface elements of this DisplayObject
  	 */
    private function __configUI ():void 
    {
		bg = new FooterBG ();
		addChild (bg);
		// Add the thumbnail list
		var newX:Number = 15;	    // X Location of first thumbail image
		var newY:Number = 7;		// Y Location of first thumbail image
		var padding:Number = 10;	// Space between each thumbnail image
		var thumb:ThumbnailUI;
		// hardcoded list of images for sake of simplicity
		var imageList:Array = new Array(4);
		imageList[0] = "image1.jpg";
		imageList[1] = "image2.jpg";
		imageList[2] = "image3.jpg";
		imageList[3] = "image4.jpg";
		// Add an icon for each image in the list
		for (var i:String in imageList) {
			thumb = new ThumbnailUI (imageList[i]);
			thumb.addEventListener (MouseEvent.CLICK, onClick, false, 0.0, true);
			addChild (thumb);
			thumb.x = newX;
			thumb.y = newY;
			newX += 75 + padding;
		}
    }
    /**
  	 * Called when a thumbail image is clicked on so that a 
  	 * onLoadImage event can be dispatched to BodyUI
  	 * @param   event   Event object sent by the Mouse Click Event
  	 * @returns void
  	 */
    public function onClick (event:MouseEvent):void 
    {
  		dispatchEvent (new ThumbnailEvent(event.currentTarget.Path, ThumbnailEvent.LOADIMAGE));
    }
    /**
     * Singleton implementation
     * @param   p   A reference to the parent
     * @returns FooterUI singleton instance
     */
    public static function getInstance (p:Sprite):FooterUI
    {
      if (_instance == null)
        _instance = new FooterUI (p);
      return _instance;
    }
  	/**
  	 * Implemented method of IResizable interface
  	 */
  	public function setSize (w:Number, h:Number):void 
  	{
  		bg.width = w;
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