package 
{
  import flash.display.Sprite;
  import flash.display.StageAlign;
  import flash.display.StageScaleMode;
  import flash.events.Event;
  import com.jor.examples.liquidgui.ui.BodyUI;
  import com.jor.examples.liquidgui.ui.FooterUI;
  import com.jor.examples.liquidgui.ui.HeaderUI;
  //
  public class LiquidGUI_v3 extends Sprite
  {
    public static var hh:Number = 54;	  // Static Header Height
    public static var fh:Number = 75;	  // Static Footer Height
    public static var hfh:Number = 129;	  // Static Header + Footer Height
    private var _header:HeaderUI;
    private var _body:BodyUI;
    private var _footer:FooterUI;
    /** 
     * Constructor
     */
    public function LiquidGUI_v3 ()
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
      _body.y = _header.height;
      // Size everything after creation to insure the app is drawn 
      // properly the first time it is seen prior to any user initiated resizing
      onResize (null);
    }    
  	/**
  	 * Event handler listening to the Stage for resizing
  	 * @param   event   Event Object passed by the event tho not used
  	 */
  	public function onResize (event:Event):void 
  	{
  		// Get the new stage size
  		var sw:Number = stage.stageWidth;
  		var sh:Number = stage.stageHeight;
  		// The update the components with the new size
  		_header.setSize (sw, 0);
  		_body.setSize (sw, sh-hfh);
  		_footer.setSize (sw, 0);
  		// Relocate components
  		_footer.y = sh-fh;
  	}
  }
}
