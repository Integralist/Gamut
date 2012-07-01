/**
 * Concrete implementation of the IBodyState interface
 * used to provide behaviour to mcBody through
 * state changing composition
 */
package com.jor.examples.liquidgui
{
  import com.jor.examples.liquidgui.IBodyState;
  import flash.display.Sprite;
  //
  public class ScaledSizeState implements IBodyState
  {
  	// Private references to target object
  	private var _target:Sprite;
  	/**
  	 * Class Constructor
  	 */
  	public function ScaledSizeState (target:Sprite)
  	{
  		_target = target;
  	}
  	/**
  	 * Implemented method of IBodyState interface
  	 * Provides behaviour to resize the image to
  	 * a best-fit size and center it within the
  	 * component.
  	 */
  	public function resizeImage ():void
  	{
  	  with (_target)
  	  {
  			var bw:Number = bg.width;
  			var bh:Number = bg.height;
  			var w:Number = bw-20;
  			var h:Number = w/aspratio;
  			if (h > bh-20) {
  				h = bh-20;
  				w = h*aspratio;
  			}
  			image.width = w;
  			image.height = h;
  			image.x = Math.floor((bw-w)/2);
  			image.y = Math.floor((bh-h)/2);
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