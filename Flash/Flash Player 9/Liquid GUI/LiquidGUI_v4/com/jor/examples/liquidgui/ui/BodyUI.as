package com.jor.examples.liquidgui.ui
{
  import com.jor.examples.liquidgui.events.BodyStateEvent;
  import com.jor.examples.liquidgui.IResizable;
  import com.jor.examples.liquidgui.IBodyState;
  import com.jor.examples.liquidgui.ScaledSizeState;
  import com.jor.examples.liquidgui.ActualSizeState;
  import com.jor.examples.liquidgui.events.ThumbnailEvent;
  import flash.display.Sprite;
  import flash.display.Loader;
  import flash.events.Event;
  import flash.net.URLRequest;
  //
  public class BodyUI extends Sprite implements IResizable
  {    
  	// State Pattern state holders
  	private var _current_state:IBodyState;
  	private var _scaledsize_state:IBodyState;
  	private var _actualsize_state:IBodyState;
	
    public static var _instance:BodyUI;
    
    public var image:Loader;
    public var bg:Sprite;
  	public var aspratio:Number;
  	public var origw:Number;
  	public var origh:Number;    
  	// Private fields
    private var _parent:Sprite;
  	private var _isImageLoaded:Boolean;
    /**
     * Constructor
     */
    public function BodyUI (p:Sprite)
    {
      _parent = p;
  	  _isImageLoaded = false;
  	  // Instantiate the different behaviours
  	  _scaledsize_state = new ScaledSizeState (this);
  	  _actualsize_state = new ActualSizeState (this);
      __configUI ();
    }
  	/**
  	 * Configures the user interface elements of this DisplayObject
  	 */
    private function __configUI ():void 
    {
  	  // Assign one as the current state
  	  _current_state = _actualsize_state;
  	  // Create and display the background image
      bg = new BodyBG ();
      addChild (bg);
      // Create and display the image holder
      image = new Loader ();
      image.contentLoaderInfo.addEventListener (Event.COMPLETE, onLoadComplete);
      addChild (image);
    }
    /**
     * Scales and recenters image
     */
  	private function __resizeImage ():void
  	{
  		if (_isImageLoaded)
  			_current_state.resizeImage ();
  	}
	  /**
  	 * onLoadImage event handler
  	 * @returns void
  	 */
    public function onLoadImage (event:ThumbnailEvent):void
    {
      image.unload ();
  	  // Flag that there is no image loaded
  	  _isImageLoaded = false;
  	  image.load (new URLRequest ("images/"+event.Path));
    }
  	/**
  	 * onLoadComplete event handler
  	 * @returns void
  	 */
  	public function onLoadComplete (event:Event):void 
  	{
	  _isImageLoaded = true;
	  // Store original dimensions as aspect ratio
	  origw = image.width;
	  origh = image.height;
	  aspratio = origw/origh;
	  // Scale and re-center the image
	  __resizeImage ();
  	}
  	/**
  	 * onChangeState event handler
  	 * @returns void
  	 */
  	public function onChangeState (event:BodyStateEvent):void 
  	{
  		// Composite the appropriate State Manager
  		switch (event.type) {
  			case "actual":
  				_current_state = _actualsize_state;
  				break;
  			case "scaled":
  				_current_state = _scaledsize_state;
  				break;
  			default:
  				// Unknown state so do nothing
  				break;
  		}
  		// Scale and re-center the image
  		__resizeImage ();
  	}
    /**
     * Singleton implementation
     * @param   p   A reference to the parent
     * @returns BodyUI singleton instance
     */
    public static function getInstance (p:Sprite):BodyUI
    {
      if (_instance == null)
        _instance = new BodyUI (p);
      return _instance;
    }
  	/**
  	 * Implemented method of IResizable interface
  	 */
    public function setSize(w:Number, h:Number):void
    {
	  bg.width = w;
	  bg.height = h;
	  // Scale and re-center the image
	  __resizeImage ();
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