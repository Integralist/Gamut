package com.dangries.geom3D {
	public class Quaternion {
		public var w;
		public var x;
		public var y;
		public var z;
		
		public function Quaternion(_w=0,_x=0, _y=0, _z=0) {
			this.w = _w;
			this.x = _x;
			this.y = _y;
			this.z = _z;
		}
		
		public function clone():Quaternion {
			return new Quaternion(this.w, this.x, this.y, this.z);
		}
	}
}
