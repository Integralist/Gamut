package com.jor.examples.liquidgui.events
{
  import flash.events.Event;
  //
  public class BodyStateEvent extends Event
  {
    public static const ACTUAL:String = "actual";
    public static const SCALED:String = "scaled";
    /**
     * Constructor
     */
    public function BodyStateEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
    {
      super (type, bubbles, cancelable);
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