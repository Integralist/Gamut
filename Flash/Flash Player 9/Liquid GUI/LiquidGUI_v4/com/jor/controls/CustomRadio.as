package com.jor.controls
{
  import com.jor.controls.CustomRadioGroup;
  import flash.display.DisplayObject;
  import flash.display.Sprite;
  import flash.events.MouseEvent;
  import com.jor.examples.liquidgui.events.BodyStateEvent;
  //
  public class CustomRadio extends Sprite
  {
  	// Private fields
    private var _id:String;
    private var _parent:CustomRadioGroup;
    private var _upState:DisplayObject;
    private var _overState:DisplayObject;
    private var _downState:DisplayObject;
    private var _currState:DisplayObject;
    private var _isSelected:Boolean;
    private var _size:uint = 50;
    private var _backgroundColor:uint = 0xFFCC00;
    private var _overColor:uint = 0xCCFF00;
    private var _downColor:uint = 0x00CCFF;
    /**
     * Constructor
     */
    public function CustomRadio(parent:CustomRadioGroup, 
      id:String,
      upState:DisplayObject, 
      overState:DisplayObject,
      downState:DisplayObject)
    {
      _parent = parent;
      _id = id;
      _upState = upState;
      _overState = overState;
      _downState = downState;
      _isSelected = false;
      buttonMode = true;
      addEventListener (MouseEvent.MOUSE_OVER, mouseOverHandler);
      addEventListener (MouseEvent.MOUSE_OUT, mouseOutHandler);
      addEventListener (MouseEvent.MOUSE_DOWN, mouseDownHandler);
      __configUI ();
    }
  	/**
  	 * Configures the user interface elements of this DisplayObject
  	 */
    private function __configUI ():void
    {
      _currState = _upState;
      addChild (_currState);
    }
    /**
     * removes the current state's display object, then adds the
     * new state's display object to the display list
     */
    private function __changeState (newstate:DisplayObject):void 
    {
		  removeChild (_currState);
		  _currState = newstate;
		  addChild (_currState);
    }
  	/**
  	 * mouseOverHandler Event Handler
  	 * @returns void
  	 */
    public function mouseOverHandler(event:MouseEvent):void 
    {
  		if (!_isSelected)
  		  __changeState (_overState);
    }
  	/**
  	 * mouseOutHandler Event Handler
  	 * @returns void
  	 */
    public function mouseOutHandler(event:MouseEvent):void 
    {
  		if (!_isSelected)
  		  __changeState (_upState);
    }
  	/**
  	 * mouseDownHandler Event Handler
  	 * @returns void
  	 */
    public function mouseDownHandler(event:MouseEvent):void 
    {
      if (!_isSelected)
			  _parent.SelectedRadio = this;
    }
  	/**
  	 * unSelected Event Handler
  	 * Called from parent to unselect this radio
  	 * @returns void
  	 */
  	public function unSelected ():void
  	{
      buttonMode = true;
  		_isSelected = false;
  		__toggleSelect (_isSelected);
  	}
  	/**
  	 * onSelected Event Handler
  	 * Called from parent to select this radio
  	 * @returns void
  	 */
  	public function onSelected ():void
  	{
      buttonMode = false;
  		_isSelected = true;
  		__toggleSelect (_isSelected);
  	}
  	/**
  	 * Toggles a button between it's on and off states
  	 * @param   b   Select this button? (true/false)
  	 * @returns void
  	 */
  	private function __toggleSelect (b:Boolean):void
  	{
  		if (b) {
  		  __changeState (_downState);
  			_parent.dispatchEvent (new BodyStateEvent(_id));
  		}
  		else {
  		  __changeState (_upState);
  		}
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