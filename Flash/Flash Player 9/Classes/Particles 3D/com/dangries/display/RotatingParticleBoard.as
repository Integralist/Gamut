/*
ActionScript 3 experiment by Dan Gries (djg@dangries.com) of www.dangries.com.
Dan is a friend of flashandmath.com.

Last modified: April 21, 2008.
*/

/*

Notes: the coordinates of an object in 3D-space are denoted by x,y, and z.
The viewpoint-relative coordinates are u, v, and w, with the observer facing
the origin from a distance fLen, looking down the w-axis.

Thanks to Barbara Kaskosz and Doug Ensley of www.flashandmath.com for tutorials on 3D methods.

properties:

	zBuffer:Array - stores information about distance 
					from observer of particle currently rendered in
					a viewplane position.  The array has been made 
					one-dimensional for efficiency.  The status of
					pixel (i,j) is stored in zBuffer[i+height*j].  If no
					particle occupies a given position, the depth there
					is either NaN or NEGATIVE_INFINITY.
		
	fLen:Number - length used for perspective distortion, which represents
					 the distance from observer to the origin in xyz space.
		
	projOriginX:Number,	projOriginY:Number; - pixel-based coordinates for 
											  the origin in the 2D viewplane.
											  
	frame:Shape - a frame for the display area.  It is drawn by the 
				  makeFrame function.
				  
	holder:Sprite - a Sprite to hold the display (which allows mouse 
					interaction).  When placing an instance of the
					RotatingParticleBoard in a project, the holder.x
					and holder.y coordinates should be used for positioning.
											  
	
	arcballRad:Number - The radius for the Arcball used for mouse-driven 
						rotations.  The default value is half of the length
						of the diagonal of the board.
	
	currentQ:Quaternion - the current rotation of the coordinate system,
						  expressed as a unit quaternion.
	
	autoQuaternion:Quaternion - the rotation to use when the mouse
								is not dragging.
		
	easingRatio:Number - How far to rotate towards the requested rotation
						 in each frame of the animation.  This variable
						 should be set to something greater than 0 and
						 less than or equal to 1.


methods:

	makeFrame(thick:Number, c:uint, inputAlpha:Number):void

	setDepthDarken(unityDepth:Number, halfDepth:Number, _maxBrighten:Number):void
		Sets useDepthDarken to true, and computes exponential parameters
		to use for darkening of pixels according to depth.  The inputs unityDepth
		and halfDepth are w-coordinates where luminance is unaltered, and where
		luminance reaches half the original luminance of the particle, 
		respectively.  The input _maxBrighten is the maximum factor that a red,
		green, or blue component will be increased by.  Value should normally be
		1, but a number higher than one can be used.  This may have the effect
		of "whitening" a particle (thus changing its hue) when it is closer than
		the distance unityDepth.  But this can increase the vibrance of the
		picture, and it might look nice.
		
		Note: In drawParticles, depth darkening is used	only when the Boolean
		variable depthDarkening is set to true, which must be done by calling
		setDepthDarken.
	
	clearBoard(particles:Array):void
		For each pixel occupied by a particle in the array particles, the 
		corresponding position in the zBuffer is set to NEGATIVE_INFINITY.
		Code could also be inserted here to erase these particles (it is 
		presently commented out).
		The argument particles must be an array consisting of members of the
		custom class Particle3D.
	
	drawParticles(particles:Array, quaternion):void
		Renders the particles in the inputted array, with rotation given
		by inputted quaternion.  Only draws a particle when
		(1)it is not occluded by a particle closer to the observer,
		(2)the projected coordinates are within the viewplane, and 
		(3)the particle	is at least one pixel length in front of the observer.
		
events:  none.


*/

package com.dangries.display {
	import flash.display.*;
	import flash.events.*;
	import com.dangries.objects.Particle3D;
	import com.dangries.geom3D.*;
	import flash.events.MouseEvent;
	public class RotatingParticleBoard extends Bitmap {
		
		public var zBuffer:Array;
		
		public var fLen:Number;
		public var projOriginX:Number;
		public var projOriginY:Number;
		
		//darkening related variables
		private var useDepthDarken:Boolean;
		private var A:Number;
		private var expRate:Number;
		private var maxBrighten:Number;
		
		private var bgColor;
		
		//Vars used in functions
		private var f:Number;
		private var m:Number;
		private var dColor:uint;
		private var intX:int;
		private var intY:int;
		private var p:Particle3D;
		private var X2:Number;
		private var Y2:Number;
		private var Z2:Number;
		private var wX:Number;
		private var wY:Number;
		private var wZ:Number;
		private var xX:Number;
		private var xY:Number;
		private var xZ:Number;
		private var yY:Number;
		private var yZ:Number;
		private var zZ:Number;
		
		public var frame:Shape;
		public var holder:Sprite;
		
		private var v1:Point3D;
		private var v2:Point3D;
		private var rSquare:Number;
		private var invR:Number;
		
		private var mouseDragging:Boolean;
		private var lastQ:Quaternion;
		private var changeQ:Quaternion;
		private var requestQ:Quaternion;
		private var inside:Boolean;
		private var numRadii:Number;
		
		public var arcballRad:Number;
		public var currentQ:Quaternion;
		public var autoQuaternion:Quaternion;
		
		public var easingRatio:Number;
		
		private var s:Number;
		
		public function RotatingParticleBoard(w, h, transp=true, fillColor = 0x00000000, _fLen=200) {
			var thisData:BitmapData = new BitmapData(w, h, transp, fillColor)
			this.bitmapData = thisData;
			this.zBuffer = [];
			this.useDepthDarken = false; //changed to true in setDepthDarken
			this.projOriginX = w/2;
			this.projOriginY = h/2;
			this.fLen = _fLen;
			this.bgColor = fillColor;
			
			this.holder = new Sprite();
			this.holder.addChild(this);
			this.x = 0;
			this.y = 0;
			
			this.arcballRad = 0.5*Math.sqrt(Math.pow(w,2)+Math.pow(h,2));
			this.lastQ = new Quaternion();
			this.currentQ = new Quaternion(1,0,0,0);
			this.autoQuaternion = new Quaternion(1,0,0,0);
			this.lastQ = this.currentQ.clone();
			this.requestQ = new Quaternion();
			this.changeQ = new Quaternion(1,0,0,0);
			
			this.v1 = new Point3D;
			this.v2 = new Point3D;
				
			this.mouseDragging = false;
			
			this.easingRatio = 0.4;
			
			this.holder.addEventListener(Event.ADDED_TO_STAGE, addListeners);
		}
		
		private function addListeners(evt:Event):void {
			this.holder.removeEventListener(Event.ADDED_TO_STAGE, addListeners);
			this.holder.addEventListener(MouseEvent.MOUSE_DOWN, onDown);
			this.holder.root.addEventListener(MouseEvent.MOUSE_UP, onUp);
		}
		
		public function makeFrame(thick:Number, c:uint, inputAlpha:Number):void {
			this.frame = new Shape();
			this.frame.graphics.lineStyle(thick, c, inputAlpha);
			this.frame.graphics.drawRect(0,0,this.width,this.height);
			this.frame.x = 0;
			this.frame.y = 0;
			this.holder.addChild(frame);
		}
		
		public function setDepthDarken(unityDepth:Number, halfDepth:Number, _maxBrighten):void {
			this.useDepthDarken = true;
			this.A = Math.pow(2, unityDepth/(halfDepth-unityDepth));
			this.expRate = Math.LN2/(unityDepth-halfDepth);
			this.maxBrighten = _maxBrighten;
		}
		
		public function clearBoard(particles:Array):void {
			for (var i:Number = 0; i<=particles.length-1; i++) {
				p = particles[i];
				if (p.onScreen) {
					intX = int(p.projX);
					intY = int(p.projY);
					zBuffer[intX+this.height*intY] = Number.NEGATIVE_INFINITY;
					
					//could also insert the code below to erase pixels,
					//but my method has been to use a blur filter and
					//a colorTransform applied to whole bitmap, which
					//creates "ghost" which fades out after a few frames.
					
					//this.bitmapData.setPixel32(intX, intY, bgColor);
				}
			}
		}//end of clearBoard

		public function drawParticles(particles:Array):void {
			
			clearBoard(particles);
			
			///////////
			//viewpoint change by mouse
			if (mouseDragging) {
				v2.x = (holder.mouseX-projOriginX)/arcballRad;
				v2.y = (holder.mouseY-projOriginY)/arcballRad;
				rSquare = v2.x*v2.x + v2.y*v2.y;
				//for mouse position outside Arcball perimeter:
				if (rSquare > 1) {
					invR = 1/Math.sqrt(rSquare);
					v2.x = v2.x*invR;
					v2.y = v2.y*invR;
					v2.z = 0;
				}
				//for mouse position inside Arcball perimeter:
				else {
					v2.z = Math.sqrt(1 - rSquare);
					inside = true;
				}
		
				//interpret mouse movement as request for rotation change
				requestQ.w = v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
				requestQ.x = v1.y*v2.z - v2.y*v1.z;
				requestQ.y = -v1.x*v2.z + v2.x*v1.z;
				requestQ.z = v1.x*v2.y - v2.x*v1.y;
				
				//smooth movement is accomplished by rotating only 40% towards the 
				//requested rotation in each frame.  After about ten frames,
				//the rotation will be within 1% of the requested rotation.
				changeQ.w += easingRatio*(requestQ.w - changeQ.w);
				changeQ.x += easingRatio*(requestQ.x - changeQ.x);
				changeQ.y += easingRatio*(requestQ.y - changeQ.y);
				changeQ.z += easingRatio*(requestQ.z - changeQ.z);
				//ensure that the change quaternion is a unit quaternion:
				s = 1/Math.sqrt(changeQ.w*changeQ.w +changeQ.x*changeQ.x+changeQ.y*changeQ.y+changeQ.z*changeQ.z);
				changeQ.w *= s;
				changeQ.x *= s;
				changeQ.y *= s;
				changeQ.z *= s;
			}
			else {
				lastQ = currentQ.clone();
				changeQ.w = autoQuaternion.w;
				changeQ.x = autoQuaternion.x;
				changeQ.y = autoQuaternion.y;
				changeQ.z = autoQuaternion.z;
			}
			
			//find current resultant rotation by quaternion multiplication
			//of lastQ and changeQ	
			currentQ.w = changeQ.w*lastQ.w - changeQ.x*lastQ.x - changeQ.y*lastQ.y - changeQ.z*lastQ.z;
			currentQ.x = changeQ.w*lastQ.x + lastQ.w*changeQ.x + changeQ.y*lastQ.z - lastQ.y*changeQ.z;
			currentQ.y = changeQ.w*lastQ.y + lastQ.w*changeQ.y - changeQ.x*lastQ.z + lastQ.x*changeQ.z;
			currentQ.z = changeQ.w*lastQ.z + lastQ.w*changeQ.z + changeQ.x*lastQ.y - lastQ.x*changeQ.y;
			
			
			///////////
			for (var i:Number = 0; i<=particles.length-1; i++) {
				p = particles[i];
				
				//viewpoint-relative coordinates found by quaternion rotation.
				//Quaternion has been converted to rotation matrix, using
				//common subexpressions for efficiency.
				//(Efficient algorithm found on Wikipedia!)
				
				X2 = 2*currentQ.x;
				Y2 = 2*currentQ.y;
				Z2 = 2*currentQ.z;
				wX = currentQ.w*X2;
				wY = currentQ.w*Y2;
				wZ = currentQ.w*Z2;
				xX = currentQ.x*X2;
				xY = currentQ.x*Y2;
				xZ = currentQ.x*Z2;
				yY = currentQ.y*Y2;
				yZ = currentQ.y*Z2;
				zZ = currentQ.z*Z2;
				
				p.u = (1-(yY+zZ))*p.x + (xY-wZ)*p.y + (xZ+wY)*p.z;
				p.v = (xY+wZ)*p.x + (1-(xX+zZ))*p.y + (yZ-wX)*p.z;
				p.w = (xZ-wY)*p.x + (yZ+wX)*p.y + (1-(xX+yY))*p.z;
				
				//Projection coordinates
				m = fLen/(fLen - p.w);
				p.projX = p.u*m + projOriginX;
				p.projY = p.v*m + projOriginY;
				
				//test if particle is in viewable region
				if ((p.projX > this.width)||(p.projX<0)||(p.projY<0)||(p.projY>this.height)||(p.w>fLen-1)) {
					p.onScreen = false;
				}
				else {
					p.onScreen = true;
				}
				
				//drawing
				intX = int(p.projX);
				intY = int(p.projY);
				if (p.onScreen) {
					if (!(p.w < zBuffer[intX+this.height*intY])) {
						if (this.useDepthDarken) {
							//position-based darkening - exponential
							f = A*Math.exp(expRate*p.w);
							if (f>maxBrighten) {
								f = maxBrighten;
							}
							dColor = (0xFF000000) |(Math.min(255,f*p.red) << 16) | (Math.min(255,f*p.green) << 8) | (Math.min(255,f*p.blue));
							this.bitmapData.setPixel32(intX, intY, dColor);
						}
						else {
							this.bitmapData.setPixel32(intX, intY, p.color);
						}
												
						this.zBuffer[intX+this.height*intY] = p.w;
					}
				}
			}
		}//end of drawParticles
		
		private function onDown(evt:MouseEvent):void {
			mouseDragging = true;
			changeQ = new Quaternion(1,0,0,0);
			lastQ = currentQ.clone();
			v1.x = (holder.mouseX-projOriginX)/arcballRad;
			v1.y = (holder.mouseY-projOriginY)/arcballRad;
			rSquare = v1.x*v1.x + v1.y*v1.y;
			if (rSquare > 1) {
				invR = 1/Math.sqrt(rSquare);
				v1.x = v1.x*invR;
				v1.y = v1.y*invR;
				v1.z = 0;
				inside = false;
			}
			else {
				v1.z = Math.sqrt(1 - rSquare);
				inside = true;
			}
		}
		
		private function onUp(evt:MouseEvent):void {
			mouseDragging = false;
		}
		
	}//end of class definition
}