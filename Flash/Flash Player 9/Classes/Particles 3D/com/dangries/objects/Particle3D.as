/*
ActionScript 3 experiment by Dan Gries (djg@dangries.com) of www.dangries.com.
Dan is a friend of flashandmath.com.

Last modified: April 20, 2008.
*/

/*

Note: RGB and luminance values range from 0 to 255.

*/

package com.dangries.objects {
	import flash.display.*;
	import com.dangries.geom3D.*;
	public class Particle3D extends Point3D {
		
		//links, for creating linked lists
		public var next:Particle3D;
		public var prev:Particle3D;
		
		public var onScreen:Boolean;
		
		//velocity and acceleration vectors
		public var vel:Point3D = new Point3D();
		public var accel:Point3D = new Point3D();
		
		public var lastX:Number;
		public var lastY:Number;
		public var lastZ:Number;
		
		//projected coordinates
		public var projX:Number;
		public var projY:Number;
		
		//coords WRT viewpoint axes
		public var u:Number;
		public var v:Number;
		public var w:Number;
		
		//location in source picture
		public var picX:Number;
		public var picY:Number;
		
		//destination array
		public var dest:Array;
		
		//attributes
		public var color:uint;
		public var red:Number;
		public var green:Number;
		public var blue:Number;
		public var lum:Number;
		public var alpha:Number;
		
		public var initColor:uint;
		public var initRed:Number;
		public var initGreen:Number;
		public var initBlue:Number;
		public var initLum:Number;
		
		public var destColor:uint;
		public var destRed:Number;
		public var destGreen:Number;
		public var destBlue:Number;
		public var destLum:Number;
				
		public var colorChanging:Boolean;
		
		function Particle3D(thisColor=0xFFFFFFFF):void {
			this.dest = [];
			this.color = thisColor;
			this.red = getRed(thisColor);
			this.green = getGreen(thisColor);
			this.blue = getBlue(thisColor);
			this.alpha = getAlpha(thisColor);
			this.lum = 0.2126*this.red + 0.7152*this.green + 0.0722*this.blue;
			this.colorChanging = false;
			this.onScreen = true;
		}
		
		public function setColor(thisColor):void {
			this.color = thisColor;
			this.red = getRed(thisColor);
			this.green = getGreen(thisColor);
			this.blue = getBlue(thisColor);
			this.alpha = getAlpha(thisColor);
			this.lum = 0.2126*this.red + 0.7152*this.green + 0.0722*this.blue;
		}
		
		public function getAlpha(c):Number {
			return Number((c >> 24) & 0xFF);
		}
		public function getRed(c):Number {
			return Number((c >> 16) & 0xFF);
		}
		public function getGreen(c):Number {
			return Number((c >> 8) & 0xFF);
		}
		public function getBlue(c):Number {
			return Number(c & 0xFF);
		}
	}
}