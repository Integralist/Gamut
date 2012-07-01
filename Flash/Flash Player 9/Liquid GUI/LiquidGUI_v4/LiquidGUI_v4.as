package 
{
  import flash.display.Sprite;
  import flash.display.StageAlign;
  import flash.display.StageScaleMode;
  import flash.events.Event;
  import com.jor.examples.liquidgui.ui.FooterUI;
  import com.jor.examples.liquidgui.ui.BodyUI;
  import com.jor.examples.liquidgui.ui.HeaderUI;
  import com.jor.examples.liquidgui.events.ThumbnailEvent;
  import com.jor.examples.liquidgui.events.BodyStateEvent;
  //
  public class LiquidGUI_v4 extends Sprite
  {
    private var _header:HeaderUI;  // Header UI Component
    private var _body:BodyUI;      // Body UI Component
    private var _footer:FooterUI;  // Footer UI Component
    private var _hh:Number;	       // Header Height
    private var _fh:Number;	       // Footer Height
    private var _hfh:Number;	   // Header + Footer Height
    /** 
     * Constructor
     */
    public function LiquidGUI_v4 ()
    { 
      // Tell the player not to scale assets
      stage.scaleMode = StageScaleMode.NO_SCALE;
      // Tell the player to put coords 0,0 to the top left corner
      stage.align = StageAlign.TOP_LEFT;
      // Listen for resizing events
      stage.addEventListener(Event.RESIZE, onResize);
      __configUI ();
    }
  	/**
  	 * Configures the user interface elements of this DisplayObject
  	 */
    private function __configUI ():void 
    {
      // Create and add the Body UI
      _body = BodyUI.getInstance (this);
      addChild (_body);
      // Create and add the Footer UI
      _footer = FooterUI.getInstance (this);
      addChild (_footer);
      // Create and add the Header UI
      _header = HeaderUI.getInstance (this);
      addChild (_header);
      // Adjust locations
      _hh = _header.height;
      _body.y = _header.height;
      _fh = _footer.height;
      _hfh = _hh + _fh;
      // Add event listeners so that the body component knows when
      // to change it's image rendering method
  	  _header.addEventListener (BodyStateEvent.ACTUAL, _body.onChangeState, false, 0.0, true);
  	  _header.addEventListener (BodyStateEvent.SCALED, _body.onChangeState, false, 0.0, true);
  	  // Add an event listener so that the body component knows when
  	  // to load a new image as well as which image to load
  	  _footer.addEventListener (ThumbnailEvent.LOADIMAGE, _body.onLoadImage, false, 0.0, true);
      // Size everything after creation to insure the app is drawn 
      // properly the first time it is seen prior to any user initiated resizing
      onResize (null);
    }
  	/**
  	 * Event handler listening to the Stage for resizing
  	 * @param   e   Event Object passed by the event tho not used
  	 */
  	public function onResize (event:Event):void 
  	{
	  	// Get the new stage size
	  	var sw:Number = stage.stageWidth;
	  	var sh:Number = stage.stageHeight;
	  	// The update the components with the new size
	  	_header.setSize (sw, 0);
	  	_body.setSize (sw, sh-_hfh);
	  	_footer.setSize (sw, 0);
	  	// Relocate components
	  	_footer.y = sh-_fh+1;
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