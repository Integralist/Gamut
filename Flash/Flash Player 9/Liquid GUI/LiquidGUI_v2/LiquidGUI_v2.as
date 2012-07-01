package 
{
  import flash.display.Sprite;
  import flash.display.StageAlign;
  import flash.display.StageScaleMode;
  import flash.events.Event;
  //
  public class LiquidGUI_v2 extends Sprite
  {
    public static var ow:Number = 550;  // Original Stage Height
    public static var oh:Number = 400;  // Original Stage Width
    public static var hh:Number = 54;   // Static Header Height
    public static var fh:Number = 75;   // Static Footer Height
    public static var hfh:Number = 129; // Static Header + Footer Height
    // Graphic resources
    private var _header:Sprite;
    private var _body:Sprite;
    private var _footer:Sprite;
    /** 
     * Constructor
     */
    public function LiquidGUI_v2 ()
    {
      // Tell the player not to scale assets
      stage.scaleMode = StageScaleMode.NO_SCALE;
      // Tell the player to put coords 0,0 to the top left corner
      stage.align = StageAlign.TOP_LEFT;
      // Listen for resizing events
      stage.addEventListener(Event.RESIZE, onResize);
      // Create and add the body resource to the display list
      _body = new BodyBG ();
      addChild (_body);
      // Create and add the footer resource to the display list
      _footer = new FooterBG ();
      addChild (_footer);
      // Create and add the header resource to the display list
      _header = new HeaderBG ();
      addChild (_header);
      // Adjust locations
      _body.y = _header.height;
      // Size everything after creation to insure the app is drawn 
      // properly the first time it is seen prior to any user 
      // initiated resizing
      onResize (null);
    }    
    /**
     * onResize
     * Event handler listening to the Stage for resizing
     * @param   event   Event Object passed by the event
     */
    public function onResize (event:Event):void 
    {
      // Get the new stage size
      var sw:Number = stage.stageWidth;
      var sh:Number = stage.stageHeight;
      // The update the children with this new size
      _header.width = _body.width = _footer.width = sw;
      _body.height = sh-hfh;
      _footer.y = sh-fh;
    }
  }
}
