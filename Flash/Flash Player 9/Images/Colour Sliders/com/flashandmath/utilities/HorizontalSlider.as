/* ***********************************************************************
ActionScript 3 Tutorial by Barbara Kaskosz

www.flashandmath.com

Last modified: April 2, 2008
************************************************************************ */


package com.flashandmath.utilities {
	
	/*
	We import the built-in AS3 classes that our class needs and
	then begin our class. The class extends the Sprite class.
	Hence, it will inherit all properties and methods
	of the Sprite class.
	*/
	
    import flash.display.Sprite;
	
	import flash.display.Shape;
  
    import flash.events.*;
	
	import flash.geom.Rectangle;
   
  public class HorizontalSlider extends Sprite {
	  
	 /*
	 The Sprite class is a subclass of the EventDispatcher class. Thus,
	 every Sprite can dispatch events. Our HorizontalSlider will dispatch
	 a custom event, HorizontalSlider.SLIDER_CHANGE (or "sliderChange")
	 when the position of the knob changes as the user drags it.
	 To create a custom event, we begin by declaring a public static
	 (common to all instances) constant holding the name of the event.
	 */
	  
	public static const SLIDER_CHANGE:String = "sliderChange";
	
	/*
	In this class, we use the access modifier 'protected' rather than 'private'.
	This means that all variables and methods will be accessible to a developer
	who wishes to extend the class. Most of the variables hold the information about
	the appearnce of an instance of HorizontalSlider.
	*/
	
	protected var nLength:Number;
	
	protected var shTrack:Shape;
	
	protected var spKnob:Sprite;
	
	protected var nKnobColor:Number;
	
	protected var nKnobOpacity:Number;
	
	protected var nKnobSize:Number;
	
	protected var nKnobRightLine:Number;
	
	protected var nKnobLeftLine:Number;
	
	protected var nTrackOutColor:Number;
	
	protected var nTrackInColor:Number;
	
	protected var sStyle:String;
	
	protected var rBounds:Rectangle;
	
	protected var _isPressed:Boolean;
	
	protected var prevX:Number;
	
	/*
	The constructor takes two parameters: the length of an instance and the type of the knob.
	Two types are available in this version of the class: 'rectangle' and 'triangle'.
	If a different type is entered, the knob will not be drawn. The constructor
	initializes most of the variables, calls the functions that draw and activate the slider,
	and sets the initial position of the knob at 0.
	*/
	
	public function HorizontalSlider(len:Number,style:String){
		
		this.nLength=len;
		
		this._isPressed=false;
		
		this.nKnobColor=0x666666;
		
		this.nKnobOpacity=1.0;
		
		this.nKnobSize=8;
		
		this.nKnobRightLine=0x000000;
	
	    this.nKnobLeftLine=0xFFFFFF;
	
	    this.nTrackOutColor=0x333333;
	
	    this.nTrackInColor=0xFFFFFF;
		
		this.sStyle=style;
		
		rBounds=new Rectangle(0,0,nLength,0);
		
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
		
		shTrack.graphics.moveTo(0,3);
		shTrack.graphics.lineTo(nLength,3);
		shTrack.graphics.moveTo(nLength,0);
		shTrack.graphics.lineTo(0,0);
		
		shTrack.graphics.lineStyle(0,nTrackInColor);
		shTrack.graphics.moveTo(1,1);
		shTrack.graphics.lineTo(nLength,1);
		
		shTrack.graphics.lineStyle(0,nTrackOutColor);
		shTrack.graphics.moveTo(0,3);
		shTrack.graphics.lineTo(0,-8);
		shTrack.graphics.moveTo(nLength/2,0);
		shTrack.graphics.lineTo(nLength/2,-8);
		shTrack.graphics.moveTo(nLength,4);
		shTrack.graphics.lineTo(nLength,-8);
		shTrack.graphics.moveTo(nLength/4,0);
		shTrack.graphics.lineTo(nLength/4,-5);
		shTrack.graphics.moveTo(3*nLength/4,0);
		shTrack.graphics.lineTo(3*nLength/4,-5);
		
		if(sStyle=="triangle"){
		
		spKnob.graphics.lineStyle(0,nKnobLeftLine);
		spKnob.graphics.beginFill(nKnobColor,nKnobOpacity);
		spKnob.graphics.moveTo(0,1);
		spKnob.graphics.lineTo(-nKnobSize,2*nKnobSize);
		spKnob.graphics.lineStyle(0,nKnobRightLine);
		spKnob.graphics.lineTo(nKnobSize,2*nKnobSize);
		spKnob.graphics.lineTo(0,1);
		spKnob.graphics.endFill();
		
		} else if(sStyle=="rectangle"){
		
		spKnob.graphics.lineStyle(0,nKnobLeftLine);
		spKnob.graphics.beginFill(nKnobColor,nKnobOpacity);
		spKnob.graphics.moveTo(-nKnobSize/2,nKnobSize);
		spKnob.graphics.lineTo(-nKnobSize/2,-nKnobSize);
		spKnob.graphics.lineTo(nKnobSize/2,-nKnobSize);
		spKnob.graphics.lineStyle(0,nKnobRightLine);
		spKnob.graphics.lineTo(nKnobSize/2,nKnobSize);
		spKnob.graphics.lineTo(-nKnobSize/2,nKnobSize);
		spKnob.graphics.endFill();
		
		} else {    }
		
		
		
	}
	
	/*
	The protected function 'activateSlider' adds event listeners to the knob
	that will start and stop dragging. Note that in 'downKnob' listener,
	we add a listener to 'stage' that listens to the MOUSE_UP event. 
	The listener will prevent dragging to continue if the mouse
	is pressed over the knob but relased outside the knob. 
	We do not want to use ROLL_OUT event to stop dragging when the mouse
	pointer leaves the knob as that would make dragging a small
	knob difficult for the user.
	
	We also add to 'stage' a listener that listens to MOUSE_MOVE.
	This listener will trigger the custom event SLIDER_CHANGE
	as the postion of the knob changes when being dragged.
	It will also makes dragging smoother as with MOUSE_MOVE event we can use
	'updateAfterEvent' method.
	*/
	
	protected function activateSlider(): void {
		
		spKnob.addEventListener(MouseEvent.MOUSE_DOWN,downKnob);
		
		spKnob.addEventListener(MouseEvent.MOUSE_UP,upKnob);
		
	}
	
	protected function downKnob(e:MouseEvent): void {
		
		spKnob.startDrag(false,rBounds);
		
		stage.addEventListener(MouseEvent.MOUSE_UP,upOutsideKnob);
		
		stage.addEventListener(MouseEvent.MOUSE_MOVE,handleMove);
		
		prevX=spKnob.x;
		
		_isPressed=true;
		
	}
	
	protected function handleMove(e:MouseEvent):void {
		
	  var curX=spKnob.x;
	
	if(_isPressed){
	
		if(Math.abs(curX-prevX)>0){
		
		prevX=curX;
		
		//Our custom event is being dispatched. Note the syntax.
		
		dispatchEvent(new Event(HorizontalSlider.SLIDER_CHANGE));
		
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
	
	
	/*
	We create a getter for the protected '_isPressed' property without creating a setter.
	That will make 'isPressed' behave like a public, read-only property.
	*/
	
	
	public function get isPressed():Boolean {
		
		return _isPressed;
		
	}
	
	//Public methods.
	
	//The names of most public methods explain they actions.
	
	public function setKnobPos(a:Number):void {
		
		spKnob.x=a;
		
	}
	
	
	
	public function getKnobPos():Number {
		
		return spKnob.x;
		
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
	
	public function changeKnobRightLine(colo:Number):void {
		
		nKnobRightLine=colo;
		
		drawSlider();
		
	}
	
	public function changeKnobLeftLine(colo:Number):void {
		
		nKnobLeftLine=colo;
		
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
	
	/*
	'destroy' method should be called is an instance of HorizontalSlider is to be 
	removed at runtime. In particular, the method removes all the event listeners created
	by the instance which may otherwise linger on.
	*/
	
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