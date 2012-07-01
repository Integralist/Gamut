package com.jor.examples.liquidgui.ui
{
  import com.jor.examples.liquidgui.IResizable;
  import com.jor.examples.liquidgui.ui.SizerRadioGroup;
  import flash.display.Sprite;
  import com.jor.examples.liquidgui.events.BodyStateEvent;
  //
  public class HeaderUI extends Sprite implements IResizable
  {
    public static var _instance:HeaderUI;
    // private vars
    private var _parent:Sprite;
    private var _sizergroup:SizerRadioGroup;
    public var bg:Sprite;
    public var title:Sprite;
    /**
     * Constructor
     */ 
    public function HeaderUI (p:Sprite)
    {
      _parent = p;
      __configUI ();
    }
  	/**
  	 * Configures the user interface elements of this DisplayObject
  	 */
    private function __configUI ():void 
    {
      // Create and add the background resource to the diaply list
      bg = new HeaderBG ();
      addChild (bg);
      // Create and add the title resource to the diaply list
      title = new HeaderTitle ();
      addChild (title);
      title.x = 23;
      // Create and add a group of radio buttons to the display list
      _sizergroup = new SizerRadioGroup ();
      addChild (_sizergroup);
      // Add event listeners for the radio buttons
	  _sizergroup.addEventListener (BodyStateEvent.ACTUAL, onChangeState, false, 0.0, true);
	  _sizergroup.addEventListener (BodyStateEvent.SCALED, onChangeState, false, 0.0, true);
    }
    /**
     * Event handler for when one of the sizer radio buttons has been selected
     */
    public function onChangeState (event:BodyStateEvent):void
    {
      dispatchEvent (new BodyStateEvent(event.type));
    }
    /**
     * Singleton implementation
     * @param   p   A reference to the parent
     * @returns HeaderUI singleton instance
     */
    public static function getInstance (p:Sprite):HeaderUI
    {
      if (_instance == null)
        _instance = new HeaderUI (p);
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