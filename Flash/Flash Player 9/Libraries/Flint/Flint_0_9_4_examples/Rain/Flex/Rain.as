
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
	import org.flintparticles.displayObjects.Line;
	import org.flintparticles.emitters.*;
	import org.flintparticles.initializers.*;
	import org.flintparticles.zones.*;	

	[SWF(width='400', height='400', frameRate='61', backgroundColor='#000000')]
	
	/**
	 * This example creates rain.
	 * 
	 * <p>This is the document class for the Flex project.</p>
	 */

	public class Rain extends Sprite
	{
		public function Rain()
		{
			var emitter:DisplayObjectEmitter = new DisplayObjectEmitter();

			emitter.setCounter( new Steady( 300 ) );
			
			emitter.addInitializer( new ImageClass( Line, 8 ) );
			emitter.addInitializer( new Position( new LineZone( new Point( 5, 5 ), new Point( 505, 5 ) ) ) );
			emitter.addInitializer( new Velocity( new PointZone( new Point( -60, 300 ) ) ) );
			emitter.addInitializer( new ColorInit( 0x66FFFFFF, 0x66FFFFFF ) );
			
			emitter.addAction( new Move() );
			emitter.addAction( new DeathZone( new RectangleZone( -10, -10, 510, 610 ), true ) );
			emitter.addAction( new RotateToDirection() );
			
			addChild( emitter );
			emitter.start();
			emitter.runAhead( 5, 30 );
		}
	}
}