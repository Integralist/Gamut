package
{
	// http://www.everydayflash.com/blog/index.php/tutorials/reflection-effect/
	
	import flash.display.Sprite;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.filters.BlurFilter;
	
	public class Reflection extends Sprite
	{
		private var picture:Sprite;
		private var reflection:BitmapData; // The reflection BitmapData is our canvas on which we will paint the reflected image.
		private var reflectionHolder:Bitmap; // We need this because a BitmapData does not extend DisplayObject, which means it cannot be added to the display list. So to see a BitmapData on the stage we need to wrap it into a special class designed especially for this purpose, and this is exactly the Bitmap class.
		
		public function Reflection()
		{
			picture = new Picture();
			picture.x = 110;
			picture.y = 15;
			addChild(picture);
			
			createReflection();
		}
		
		private function createReflection():void
		{
			reflection = new BitmapData(picture.width, picture.height, true, 0x00ffffff); // We create our BitmapData object, and we give it the same size - width & height - as our picture has. We are also declaring that it will support transparency (3rd argument - "true") and paint it all in fully transparent white color (last argument).
			
			/*
			 * Unfortunately, even though the Flash IDE has a "Flip vertical" option in the menu, 
			 * in AS3 there is no such command, so we need to use a combination of a few other 
			 * methods to achieve the desired effect.
			 * 
			 * To flip the reflection bitmap we are using a matrix. 
			 * A matrix is basically a one or two dimensional Array. 
			 * This particular flash.geom.Matrix class is 3 x 3 matrix. 
			 * Those 9 values are used to store information about the transformations 
			 * applied to a Sprite.
			 * 
			 * Those transformations include scaling, rotating, moving and skewing the Sprite. 
			 * Some of those values can be set manually, but fortunately Adobe provided us 
			 * with some very handy methods to manipulate them.
			*/
			var flipMatrix:Matrix = new Matrix();
			flipMatrix.rotate(Math.PI); // To flip the image we are first rotating it by 180 degrees. This is what the rotate method does. But be careful, because it takes as argument a value expressed in radians not in degrees, so we can't just put "180" in there, we need to put Math.PI, which is 180 degrees in radians. The general formula to transform degrees into radians is: rad = deg * Math.PI / 180. So 180 * Math.PI / 180 gives us exactly Math.PI.
			flipMatrix.scale(-1, 1); // By passing -1 as argument, we achieve exactly what we want - we flip our image around the vertical axis. The second argument equals to 1, which means "do not scale". It is ok - we do not want to flip it around the horizontal axis.
			flipMatrix.translate(0, picture.height); // We need to translate our reflection ('translate' is just a wise word for 'move'). Now you might think: "Rotating? I get it! Flipping? ok! But why do I have to move the picture?". This is because our initial picture has its registration point in the top left corner. If you would set it in the middle of the Sprite you wouldn't have to do this, but since most of the time it is better to have the registration point in the top left corner, here we do it like this.
			
			reflection.draw(picture, flipMatrix); // We use the draw method to copy our picture to the BitmapData object. The second argument is a transformation matrix that we declare above.
			
			/*
			 * The BitmapData class has two interesting methods that we will use: 
			 * getPixel32(x, y) and setPixel32(x, y, color). 
			 * The first one returns the color value in the ARGB format for pixel at the x,y coordinates of the bitmap. 
			 * The second method, as you might have guessed, does the opposite. 
			 * The ARGB format stand for Alpha-Red-Green-Blue and is a 32 bit value, 
			 * with 8 bit of information for each component.
			 * 
			 * What we will do now, is to traverse the reflection bitmap row by row and apply a new alpha (A) value for each pixel in each row while conserving its color components (RGB). 
			 * To do this we need perform some low level operations on bytes.
			 * 
			 * When you compile the FLA file now you will see a lot of values being traced. 
			 * It will start with 1 and at the end will have a value very close to 0. 
			 * These are the values by which we will multiply the alpha value of each pixel in each row of the bitmap. 
			 * I subtract (i / picture.height) from 1 because I need them inverted - the closer we are to the top of the reflected picture 
			 * (i.e. closer to the original picture) the closer to 1 the alpha multiplier value should be.
			*/
			
			reflection.lock(); // First of all you need now to lock the bitmap before proceeding to the transformation.
			for (var i:int = 0; i < picture.height; i++) // This loop traverses the bitmap row by row.
			{
				var rowFactor:Number = 1 - (i / picture.height);
				
				/*
				 * There is one last tweak we can do. 
				 * I think that only a part of the picture should be visible in the reflection 
				 * and it should fade out quicker, and also that it is a little bit too bright. 
				 * One small modification will fix all those problems. 
				 * The line above where the rowFactor value is calculated, change the line to this:
				*/
				//var rowFactor:Number = Math.max(0, 0.5 - (i / picture.height)); 
				
				//trace(rowFactor);
				for (var j:int = 0; j < picture.width; j++) // This loop traverses pixel by pixel in each bitmap row.
				{
					/*
					 * We can calculate the rowFactor in the outer loop, 
					 * because the same value will be applied to each pixel in a row. 
					 * Inside the inner loop comes the actual pixel manipulation.
					*/
					var pixelColor:uint = reflection.getPixel32(j, i); // First we use getPixel32() to get the ARGB value of the pixel at the position where we currently are.
					var pixelAlpha:uint = pixelColor >>> 24; // We extract the alpha component value from the ARGB color definition. For this we use a bitwise unsigned right shift operator (see: http://livedocs.adobe.com/flex/2/langref/operators.html#bitwise_unsigned_right_shift). For the moment all we need to know is that the pixelAlpha variable will now hold the alpha value (A) for our pixel extracted this way from the ARGB code.
					var pixelRGB:uint = pixelColor & 0xffffff; // This line features again one of those terrible bitwise operators, this one is called bitwise AND. All we need to know here is that it chops the Alpha channel information from the ARGB color definition - and thus we and up with just RGB. This way we split the color to two variables: 'pixelAlpha' that holds A (Alpha) and the 'pixelRGB:uint' that holds the RGB (Red-Green-Blue) values.
					var resultAlpha:uint = pixelAlpha * rowFactor; // Now it is time for the rowFactor multiplier. We multiply the 'pixelAlpha' value by the 'rowFactor' for the current row. After that we put back the ARGB color value together, using the new alpha value ('resultAlpha') and the RGB value that we extracted just before. That is what happens in the line with the call to the setPixel32() method. You can see two other bitwise operators: the '<<', called bitwise left shift and the '|' AKA bitwise OR. And this operation is performed for each pixel of the image. So with our picture being 300x200 pixels, there are 60000 pixels to traverse and modify.
					reflection.setPixel32(j, i, resultAlpha << 24 | pixelRGB);
				}
			}
			
			reflection.applyFilter(reflection, 
                       reflection.rect, 
                       new Point(0, 0), 
                       new BlurFilter(4, 4, 3)); // Add some blur effect. The basic philosophy of the applyFilter() method is that we do not apply the effect to the reflection bitmap, but rather overwrite it with another bitmap - the bitmap that is passed as the first argument here. It is like saying: take this bitmap, apply the effect to it and paint the result back on the object that invokes the method.
			
			reflection.unlock(); // Once the transformation is complete, unlock the bitmap.
			
			reflectionHolder = new Bitmap(reflection);
			reflectionHolder.y = picture.y + picture.height;
			reflectionHolder.x = picture.x;
			
			/*
			 * There is another way to apply a blur filter,
			 * but it needs to be added after the x / y properties for the reflectionHolder. 
			 * The difference is that this way the bitmap is blurred also on the edges,
			 * while the applyFilter() method blurred the inside picture but kept the edges sharp.
			 * Personally, I prefer the other method, but they are both valid 
			 * and in some situations this one may give a better effect.
			*/ 
			//reflectionHolder.filters = [new BlurFilter(4, 4, 3)];
		 
			addChild(reflectionHolder);
		}
	}
}