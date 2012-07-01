package com.jor.examples.liquidgui.events
{
  import flash.events.Event;
  //
  public class ThumbnailEvent extends Event
  {
    public static const LOADIMAGE:String = "loadimage";
    public var Path:String;
    /**
     * Constructor
     */
    public function ThumbnailEvent(path:String, type:String, bubbles:Boolean=false, cancelable:Boolean=false)
    {
      super (type, bubbles, cancelable);
      this.Path = path;
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