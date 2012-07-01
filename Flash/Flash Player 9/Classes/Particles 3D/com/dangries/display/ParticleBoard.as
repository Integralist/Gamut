/*
ActionScript 3 experiment by Dan Gries (djg@dangries.com) of www.dangries.com.
Dan is a friend of flashandmath.com.

Last modified: April 20, 2008.
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
					ParticleBoard in a project, the holder.x and
					holder.y coordinates should be used for positioning.


methods:

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
	import com.dangries.objects.Particle3D;
	import com.dangries.geom3D.*;
	public class ParticleBoard extends Bitmap {
		
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
		
		
		/*
		frame = new Shape();
		frame.graphics.lineStyle(2,0x444444);
		frame.graphics.drawRect(0,0,board.width,board.height);
		frame.x = 0;
		frame.y = 0;
		
		boardHolder = new Sprite();
		boardHolder.x = stage.stageWidth/2 - board.width/2;
		boardHolder.y = stage.stageHeight/2 - board.height/2;
		stage.addChild(boardHolder);
		boardHolder.addChild(board);
		boardHolder.addChild(frame);
		*/
		
		public function ParticleBoard(w, h, transp=true, fillColor = 0x00000000, _fLen=200) {
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

		public function drawParticles(particles:Array, q:Quaternion):void {
			
			//clear the zBuffer
			clearBoard(particles);

			for (var i:Number = 0; i<=particles.length-1; i++) {
				p = particles[i];
				
				//viewpoint-relative coordinates found by quaternion rotation.
				//Quaternion has been converted to rotation matrix, using
				//common subexpressions for efficiency.
				//(Efficient algorithm found on Wikipedia!)
				
				X2 = 2*q.x;
				Y2 = 2*q.y;
				Z2 = 2*q.z;
				wX = q.w*X2;
				wY = q.w*Y2;
				wZ = q.w*Z2;
				xX = q.x*X2;
				xY = q.x*Y2;
				xZ = q.x*Z2;
				yY = q.y*Y2;
				yZ = q.y*Z2;
				zZ = q.z*Z2;
				
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
	}//end of class definition
}