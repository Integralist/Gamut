/* ***********************************************************************
ActionScript 3 Tutorial by Barbara Kaskosz

www.flashandmath.com

Last modified: April 2, 2008
************************************************************************ */

/*
The class is alomost identical to the HorizontalSlider class except for
the way some elements (like tick marks) are drawn. Please see HorizontalSlider class
for comments. Since both classes inherit the rotation property of the Sprite class,
you can make a vertical slider horizonatal and vice-versa by rotating by 90 degrees.
*/

package com.flashandmath.utilities {
	
    import flash.display.Sprite;
	
	import flash.display.Shape;
  
    import flash.events.*;
	
	import flash.geom.Rectangle;
   
  public class VerticalSlider extends Sprite {
	  
	public static const SLIDER_CHANGE:String = "sliderChange";
	
	protected var nLength:Number;
	
	protected var shTrack:Shape;
	
	protected var spKnob:Sprite;
	
	protected var nKnobColor:Number;
	
	protected var nKnobOpacity:Number;
	
	protected var nKnobSize:Number;
	
	protected var nKnobLowerLine:Number;
	
	protected var nKnobUpperLine:Number;
	
	protected var nTrackOutColor:Number;
	
	protected var nTrackInColor:Number;
	
	protected var sStyle:String;
	
	protected var rBounds:Rectangle;
	
	protected var _isPressed:Boolean;
	
	protected var prevY:Number;
	
	public function VerticalSlider(len:Number,style:String){
			
		this.sStyle=style;
		
		if(sStyle=="rectangle"){
			
		this.nKnobSize=10;
		
		} else {
			
			this.nKnobSize=8;
			
		} 
			
		this.nLength=len;
		
		this._isPressed=false;
		
		this.nKnobColor=0x666666;
		
		this.nKnobOpacity=1.0;
			
		this.nKnobLowerLine=0x000000;
	
	    this.nKnobUpperLine=0xFFFFFF;
	
	    this.nTrackOutColor=0x333333;
	
	    this.nTrackInColor=0xFFFFFF;
		
		rBounds=new Rectangle(0,0,0,nLength);
		
		shTrack=new Shape();
		
		this.addChild(shTrack);
		
		spKnob=new Sprite();
		
		this.addChild(spKnob);
		
		drawSlider();
		
		activateSlider();
		
		setKnobPos(0);
		
		
	}
	
	
	protected function drawSlider():void {
		
		shTrack.graphics.clear();
		spKnob.graphics.clear();
		
		shTrack.graphics.lineStyle(0,nTrackOutColor);
		
		shTrack.graphics.moveTo(3,0);
		shTrack.graphics.lineTo(3,nLength);
		shTrack.graphics.moveTo(0,nLength);
		shTrack.graphics.lineTo(0,0);
		
		shTrack.graphics.lineStyle(0,nTrackInColor);
		shTrack.graphics.moveTo(1,1);
		shTrack.graphics.lineTo(1,nLength);
		
		shTrack.graphics.lineStyle(0,nTrackOutColor);
		shTrack.graphics.moveTo(9,0);
		shTrack.graphics.lineTo(-5,0);
		shTrack.graphics.moveTo(9,nLength/2);
		shTrack.graphics.lineTo(-5,nLength/2);
		shTrack.graphics.moveTo(9,nLength);
		shTrack.graphics.lineTo(-5,nLength);
		shTrack.graphics.moveTo(7,nLength/4);
		shTrack.graphics.lineTo(-3,nLength/4);
		shTrack.graphics.moveTo(7,3*nLength/4);
		shTrack.graphics.lineTo(-3,3*nLength/4);
		
		if(sStyle=="rectangle"){
		
		spKnob.graphics.lineStyle(0,nKnobUpperLine);
		spKnob.graphics.beginFill(nKnobColor,nKnobOpacity);
		spKnob.graphics.moveTo(nKnobSize+2,-nKnobSize/2);
		spKnob.graphics.lineTo(-nKnobSize+2,-nKnobSize/2);
		spKnob.graphics.lineTo(-nKnobSize+2,nKnobSize/2);
		spKnob.graphics.lineStyle(0,nKnobLowerLine);
		spKnob.graphics.lineTo(nKnobSize+2,nKnobSize/2);
		spKnob.graphics.lineTo(nKnobSize+2,-nKnobSize/2);
		spKnob.graphics.endFill();
		
		}
		
		if(sStyle=="triangle"){
		
		spKnob.graphics.lineStyle(0,nKnobUpperLine);
		spKnob.graphics.beginFill(nKnobColor,nKnobOpacity);
		spKnob.graphics.moveTo(1,0);
		spKnob.graphics.lineTo(2*nKnobSize,-nKnobSize);
		spKnob.graphics.lineStyle(0,nKnobLowerLine);
		spKnob.graphics.lineTo(2*nKnobSize,nKnobSize);
		spKnob.graphics.lineTo(1,0);
		spKnob.graphics.endFill();
		
		}
		
		
	}
	
	protected function activateSlider(): void {
		
		spKnob.addEventListener(MouseEvent.MOUSE_DOWN,downKnob);
		
		spKnob.addEventListener(MouseEvent.MOUSE_UP,upKnob);
		
	}
	
	protected function downKnob(e:MouseEvent): void {
		
		spKnob.startDrag(false,rBounds);
		
		stage.addEventListener(MouseEvent.MOUSE_UP,upOutsideKnob);
		
		stage.addEventListener(MouseEvent.MOUSE_MOVE,handleMove);
		
		prevY=spKnob.y;
		
		_isPressed=true;
		
		
		
	}
	
	protected function handleMove(e:MouseEvent):void {
		
	  var curY=spKnob.y;
	
	if(_isPressed){
	
		if(Math.abs(curY-prevY)>0){
		
		prevY=curY;
		
		dispatchEvent(new Event(VerticalSlider.SLIDER_CHANGE));
		
		e.updateAfterEvent();
		
		}
		
	}
		
	}
	
	protected function upOutsideKnob(e:MouseEvent): void {
		
		spKnob.stopDrag();
		
		stage.removeEventListener(MouseEvent.MOUSE_UP,upOutsideKnob);
		
		stage.removeEventListener(MouseEvent.MOUSE_MOVE,handleMove);
		
		_isPressed=false;
		
	}
	
	protected function upKnob(e:MouseEvent): void {
		
		spKnob.stopDrag();
		
		stage.removeEventListener(MouseEvent.MOUSE_UP,upOutsideKnob);
		
		stage.removeEventListener(MouseEvent.MOUSE_MOVE,handleMove);
		
		_isPressed=false;
		
		
	}
	
	
	public function get isPressed():Boolean {
			
		return _isPressed;
		
	}
	
	public function setKnobPos(a:Number):void {
		
		spKnob.y=a;
		
	}
	
	
	
	public function getKnobPos():Number {
		
		return spKnob.y;
		
		
	}
	
	public function changeKnobSize(s:Number):void {
		
		nKnobSize=s;
		
		drawSlider();
		
	}
	
	public function changeKnobColor(colo:Number):void {
		
		nKnobColor=colo;
		
		drawSlider();
		
	}
	
	public function changeKnobOpacity(opac:Number):void {
		
		nKnobOpacity=opac;
		
		drawSlider();
		
	}
	
	public function changeKnobLowerLine(colo:Number):void {
		
		nKnobLowerLine=colo;
		
		drawSlider();
		
	}
	
	public function changeKnobUpperLine(colo:Number):void {
		
		nKnobUpperLine=colo;
		
		drawSlider();
		
	}
	
	public function changeTrackOutColor(colo:Number):void {
		
		nTrackOutColor=colo;
		
		drawSlider();
		
	}
	
	public function changeTrackInColor(colo:Number):void {
		
		nTrackInColor=colo;
		
		drawSlider();
		
	}
	
	public function getSliderLen():Number{
		
		return nLength;
		
	}
	
	public function destroy():void {
		
		spKnob.removeEventListener(MouseEvent.MOUSE_DOWN,downKnob);
		
		spKnob.removeEventListener(MouseEvent.MOUSE_UP,upKnob);
		
		stage.removeEventListener(MouseEvent.MOUSE_UP,upOutsideKnob);
		
		stage.removeEventListener(MouseEvent.MOUSE_MOVE,handleMove);
		
		spKnob.graphics.clear();
		
		shTrack.graphics.clear();
		
		this.removeChild(spKnob);
		
		this.removeChild(shTrack);
		
		shTrack=null;
		
		spKnob=null;
		
		
	}
	
		
}

}