package 
{ 
  import flash.display.MovieClip;
 
  public class Particle extends MovieClip 
  { 
    //We need different speeds for different particles.
    //These variables can be accessed from the main movie, because they are public.
    public var speedX:Number;
    public var speedY:Number;
    public var partOfExplosion:Boolean = false;
 
    function Particle ():void 
	{
 		
    }
  }
}