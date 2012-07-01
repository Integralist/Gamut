package com.jor.examples.liquidgui.ui
{
  import com.jor.examples.liquidgui.IResizable;
  import flash.display.Sprite;
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