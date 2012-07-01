package com.jor.examples.liquidgui.ui
{
  import com.jor.examples.liquidgui.IResizable;
  import flash.display.Sprite;
  //
  public class HeaderUI extends Sprite implements IResizable
  {
    public static var _instance:HeaderUI;
    public var bg:Sprite;
    public var title:Sprite;
    private var _parent:Sprite;
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