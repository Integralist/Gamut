package com.jor.controls
{
  import com.jor.controls.CustomRadio;
  import flash.display.Sprite;
  import flash.display.DisplayObject;
  //
  public class CustomRadioGroup extends Sprite
  {
    // Reference to the currently selected bar
    private var _selectedRadio:CustomRadio;
    /**
     * Constructor
     */
    public function CustomRadioGroup()
    {
      super ();
      __init ();
    }
  	/**
  	 * init()
  	 * Resets the holder to an initialized state
  	 */
  	public function __init ():void
  	{
  		SelectedRadio = null;
  	}
  	/**
  	 * SelectedRadio Property
  	 * Stores a local reference to the radio clicked on so that we
  	 * can un-select in when the next radio is clicked on without
  	 * needing to loop through all radios and un-select each one.
  	 *
  	 * @param	c	Reference to the Radio that has been clicked on
  	 */
  	public function set SelectedRadio (c:CustomRadio):void
  	{
      if (this._selectedRadio != null) {
        this._selectedRadio.unSelected ();
      }
      if (c != null) {
        this._selectedRadio = c;
        this._selectedRadio.onSelected ();
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