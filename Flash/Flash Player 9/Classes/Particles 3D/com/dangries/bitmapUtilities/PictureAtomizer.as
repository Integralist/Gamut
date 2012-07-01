/*
ActionScript 3 experiment by Dan Gries (djg@dangries.com) of www.dangries.com.
Dan is a friend of flashandmath.com.

Last modified: April 20, 2008.
*/

/*

PictureAtomizer Class

properties:

	pic:Bitmap - picture being used to create particles.
	sampling:Number - distance between samples from picture.
	spread:Number - dilation factor when setting picX and picY coords.
	originX:Number, 
	originY:Number - origin for picX and picY coords
	sampleFuzzX:Number
	sampleFuzzY:Number
	particleArray:Array - obtained by get method.  Each object in the array
						  is a Particle3D (custom class).

methods:
		
	createParticles(inputPic:Bitmap):void
		- creates the array particleArray, and dispatches
		  PARTICLES_CREATED when complete.
	
	setProjectionCoords(fLen:Number):void
		- sets p.projX and p.projY for each particle p in particleArray.
	
	setPositionsByPic(z0:Number):void 
		- For each particle p in particleArray, sets 
		  p.x = p.picX, p.y = p.picY, p.z = z0.
 
	setGlobalAlpha(globalAlpha:Number):void
		- changes alpha of each particle in particleArray to the
		  same value globalAlpha.
	
	buildDestinationArrays(numDestinations:Number):void
		- builds the dest array for each Particle3D.

events:

	PARTICLES_CREATED: Dispatched when particleArray creation is complete.


*/

package com.dangries.bitmapUtilities {
	import flash.display.*;
	import flash.events.*;
	import com.dangries.geom3D.*;
	import com.dangries.objects.Particle3D;
	public class PictureAtomizer extends EventDispatcher {
		
		public static const PARTICLES_CREATED:String="particlesCreated";
		
		public var pic:Bitmap;
		public var sampling:Number;
		public var spread:Number;
		public var originX:Number;
		public var originY:Number;
		public var sampleFuzzX:Number; 
		public var sampleFuzzY:Number;
		private var _particleArray:Array;
		
		public function PictureAtomizer(inputSampling=1, inputSpread=1, inputOriginX=0, inputOriginY=0, inputFuzzX=0, inputFuzzY=0):void {
			this.sampling = inputSampling;
			this.spread = inputSpread;
			this.originX = inputOriginX;
			this.originY = inputOriginY;
			this.sampleFuzzX = inputFuzzX;
			this.sampleFuzzY = inputFuzzY;
			this._particleArray = [];
		}

		public function createParticles(inputPic:Bitmap):void {
			var c:uint;
			var m:Number;
			var num:Number = 0;
			var x0:Number;
			var y0:Number;
			
			this.pic = inputPic;

			//separate picture pixels into layers
			for (var i:Number=0; i<=pic.width-1; i = i + sampling) {
				for (var j:Number=0; j<=pic.height-1; j = j + sampling) {
					
					//read pixel (i,j)
					x0 = i + sampleFuzzX*sampling*(2*Math.random()-1);
					y0 = j + sampleFuzzY*sampling*(2*Math.random()-1);
					
					//create particle
					c = pic.bitmapData.getPixel32(x0,y0);
					var p:Particle3D = new Particle3D(c);
					
					//set picture-based coordinates
					p.picX =  spread*(x0 - originX);
					p.picY =  spread*(y0 - originY);
					
					//add to array			
					this.particleArray.push(p);
				}
			}
			dispatchEvent(new Event(PictureAtomizer.PARTICLES_CREATED));
		}
		
		public function setProjectionCoords(fLen:Number):void {
			var m:Number;
			var p:Particle3D;
			for (var t=0; t<= _particleArray.length - 1; t++) {
				p = _particleArray[t];
				m = fLen/(fLen - p.w);
				p.projX = p.u*m + originX;
				p.projY = p.v*m + originY;
			}
		}
		
		public function setPositionsByPic(offsetX:Number, offsetY:Number, z0:Number):void {
			var p:Particle3D;
			for (var t=0; t<= _particleArray.length - 1; t++) {
				p = _particleArray[t];
				p.x = p.picX + offsetX;
				p.y = p.picY + offsetY;
				p.z = z0;
			}
		}
		
		public function setGlobalAlpha(globalAlpha:Number):void {
			var c:uint;
			var p:Particle3D;
			trace(_particleArray.length);
			for (var t=0; t<= _particleArray.length - 1; t++) {
				p = _particleArray[t];
				p.setColor((uint(255*globalAlpha) << 24) | (p.color & 0x00FFFFFF));
			}
		}
		
		public function buildDestinationArrays(numDestinations:Number):void {
			var p:Particle3D;
			for (var t=0; t<= _particleArray.length - 1; t++) {
				p = _particleArray[t];
				for (var n:Number = 0; n <= numDestinations-1; n++) {
					var thisPoint3D:Point3D = new Point3D();
					p.dest.push(thisPoint3D);
				}
			}
		}
		
		public function get particleArray():Array {
			return _particleArray;
		}
		
	}
}