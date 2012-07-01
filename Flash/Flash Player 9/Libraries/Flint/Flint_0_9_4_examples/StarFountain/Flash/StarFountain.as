
/*
 * FLINT PARTICLE SYSTEM
 * .....................
 * 
 * Author: Richard Lord
 * Copyright (c) Big Room Ventures Ltd. 2008
 * http://flintparticles.org/
 * 
 * Licence Agreement
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package
{
	import flash.display.Sprite;
	import flash.geom.Point;
	
	import org.flintparticles.actions.*;
	import org.flintparticles.counters.*;
	import org.flintparticles.displayObjects.Star;
	import org.flintparticles.emitters.*;
	import org.flintparticles.initializers.*;
	import org.flintparticles.zones.*;	

	/**
	 * This example creates a fountain of stars.
	 * 
	 * <p>This is the document class for the Flash project.</p>
	 */

	public class StarFountain extends Sprite
	{
		public function StarFountain()
		{
			var emitter:DisplayObjectEmitter = new DisplayObjectEmitter();

			emitter.setCounter( new Steady( 50 ) );
			
			emitter.addInitializer( new ImageClass( Star, 12 ) );
			emitter.addInitializer( new ColorInit( 0xFFFF33FF, 0xFF33FFFF ) );
			
			emitter.addInitializer( new Position( new PointZone( new Point( 0, 0 ) ) ) );
			emitter.addInitializer( new Velocity( new DiscSectorZone( new Point( 0, 0 ), 260, 360, -3 * Math.PI/5, -2 * Math.PI / 5 ) ) );
			emitter.addInitializer( new RotateVelocity( -4, 4 ) );
			
			emitter.addInitializer( new Lifetime( 6 ) );
			
			emitter.addAction( new Move() );
			emitter.addAction( new Rotate() );
			emitter.addAction( new Accelerate( 0, 150 ) );
			
			emitter.addAction( new Age() );
			emitter.addAction( new Scale( 0.5, 3 ) );
			emitter.addAction( new DeathOffStage() );
			
			addChild( emitter );
			emitter.x = 250;
			emitter.y = 450;
			emitter.start( );
		}
	}
}