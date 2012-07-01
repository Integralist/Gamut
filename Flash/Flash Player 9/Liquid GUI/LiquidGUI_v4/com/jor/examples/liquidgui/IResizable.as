package com.jor.examples.liquidgui
{
  /**
   * com.jor.examples.liquidgui.IResizable
   * All Sprites wishing to handle their own resizing
   * will implement this custom interface.
   */
  public interface IResizable {
  	/**
  	 * setSize
  	 * This method handles all of the internal resizing
  	 * needed by this DisplayObject and passes the info along
  	 * to any children that implement their own resizing.
  	 * @param   w   Width to resize to
  	 * @param   h   Height to resize to
  	 * @returns void
  	 */
  	function setSize (w:Number, h:Number):void;
  }
}
/**
 * Author: James O’Reilly - JOR
 *         www.jamesor.com
 *
 * This work is licensed under the Creative Commons attribution 2.5
 * This comment block must remain intact.
 */