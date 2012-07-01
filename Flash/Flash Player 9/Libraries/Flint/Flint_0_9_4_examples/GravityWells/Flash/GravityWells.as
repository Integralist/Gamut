
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
	import flash.filters.BlurFilter;
	import flash.filters.ColorMatrixFilter;
	import flash.geom.Point;
	
	import org.flintparticles.actions.*;
	import org.flintparticles.counters.*;
	import org.flintparticles.emitters.*;
	import org.flintparticles.initializers.*;
	import org.flintparticles.zones.*;	

	/**
	 * This example creates an abstract effect using 5 GravityWells and thousands of particles.
	 * 
	 * <p>This is the document class for the Flash project.</p>
	 */
	public class GravityWells extends Sprite
	{
		public function GravityWells()
		{
			var emitter:PixelEmitter = new PixelEmitter();

			emitter.addFilter( new BlurFilter( 2, 2, 1 ) );
			emitter.addFilter( new ColorMatrixFilter( [ 1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0.99,0 ] ) );

			emitter.setCounter( new Blast( 4000 ) );
			
			emitter.addInitializer( new ColorInit( 0xFFFF00FF, 0xFF00FFFF ) );
			emitter.addInitializer( new Position( new DiscZone( new Point( 200, 200 ), 200 ) ) );

			emitter.addAction( new Move() );
			emitter.addAction( new GravityWell( 25, 200, 200 ) );
			emitter.addAction( new GravityWell( 25, 75, 75 ) );
			emitter.addAction( new GravityWell( 25, 325, 325 ) );
			emitter.addAction( new GravityWell( 25, 75, 325 ) );
			emitter.addAction( new GravityWell( 25, 325, 75 ) );
			
			addChild( emitter );
			emitter.start();
		}
	}
}