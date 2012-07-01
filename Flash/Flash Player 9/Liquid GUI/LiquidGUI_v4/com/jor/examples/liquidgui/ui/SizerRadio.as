package com.jor.examples.liquidgui.ui
{
  import com.jor.controls.CustomRadio;
  import com.jor.controls.CustomRadioGroup;
  import flash.display.Sprite;
  import flash.display.DisplayObjectContainer;
  import flash.display.Shape;
  import flash.display.GradientType;
  import flash.geom.Matrix;
  import flash.geom.ColorTransform;
  //
  public class SizerRadio extends CustomRadio
  {
    /**
     * Constructor
     */
    public function SizerRadio (parent:CustomRadioGroup, id:String, icon:Class)
    {
      var upState:Sprite = new Sprite();
      __drawButton (upState, false, new icon, .8);
      var overState:Sprite = new Sprite();
      __drawButton (overState, true, new icon, 1);
      var downState:Sprite = new Sprite();
      __drawButton (downState, false, new icon, .25);
      super (parent, id, upState, overState, downState);
    }
    /**
     * Draws the graphics for what the button state should look like
     * @param   d       A reference to the Sprite to draw on
     * @param   showBg  True if this state should display the background fill
     * @param   icon    A reference to the Sprite to add as the icon
     * @param   alpha   The alpha transparency level to draw the icon
     * @returns void
     */ 
    private function __drawButton (d:Sprite, showBg:Boolean, icon:Sprite, alpha:Number):void 
    {
      var child:Shape = new Shape ();
      if (showBg) {
        child.graphics.lineStyle (1, 0xD2D0C5, 1, true);
        var myMatrix:Matrix = new Matrix ();
        myMatrix.createGradientBox (26, 24, Math.PI/2, 0, 0);
        var colors:Array = [0xFFFFFF, 0xECE9D8];
        var alphas:Array = [100, 100];
        var ratios:Array = [0, 0xFF];
        child.graphics.beginGradientFill (GradientType.LINEAR, colors, alphas, ratios, myMatrix);
      } else {
        child.graphics.beginFill (0xECE9DB);
      }
      child.graphics.drawRoundRect (0, 0, 26, 24, 9);
      child.graphics.endFill ();
      d.addChild (child);
      icon.transform.colorTransform = new ColorTransform (1, 1, 1, alpha);
      d.addChild (icon);
    }
  }
}