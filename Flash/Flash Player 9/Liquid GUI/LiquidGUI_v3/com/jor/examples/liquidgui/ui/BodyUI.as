package com.jor.examples.liquidgui.ui
{
  import com.jor.examples.liquidgui.IResizable;
  import flash.display.Sprite;
  //
  public class BodyUI extends Sprite implements IResizable
  {    
    public static var _instance:BodyUI;
    public var bg:Sprite;
    private var _parent:Sprite;
    /**
     * Constructor
     */
    public function BodyUI (p:Sprite)
    {
      _parent = p;
      __configUI ();
    }
  	/**
  	 * Configures the user interface elements of this DisplayObject
  	 */
    private function __configUI ():void 
    {
      bg = new BodyBG ();
      addChild (bg);
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
    }
  }
}