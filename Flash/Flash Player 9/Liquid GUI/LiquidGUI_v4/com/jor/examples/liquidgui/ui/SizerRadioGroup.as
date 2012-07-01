package com.jor.examples.liquidgui.ui
{
  import com.jor.controls.CustomRadio;
  import com.jor.controls.CustomRadioGroup;
  import com.jor.examples.liquidgui.events.BodyStateEvent;
  import com.jor.examples.liquidgui.ui.SizerRadio;
  import flash.display.Sprite;
  //
  public class SizerRadioGroup extends CustomRadioGroup
  {
  	// Private references to child objects
  	private var _actualsizer:SizerRadio;
  	private var _scaledsizer:SizerRadio;
	/**
	 * Constructor
	 */ 
    public function SizerRadioGroup()
    {
		super ();
		__configUI ();
    }
  	/**
  	 * Configures the user interface elements of this DisplayObject
  	 */
    private function __configUI ():void
    {
		_scaledsizer = new SizerRadio (this, BodyStateEvent.SCALED, ScaledSizeIcon);
		addChild (_scaledsizer);
		_scaledsizer.x = 10;
		_scaledsizer.y = 26;
		_actualsizer = new SizerRadio (this, BodyStateEvent.ACTUAL, ActualSizeIcon);
		addChild (_actualsizer);
		_actualsizer.x = 40;
		_actualsizer.y = 26;
		// Set the "Scaled Size" button as the initial selection
		SelectedRadio = _actualsizer;
    }
  }
}