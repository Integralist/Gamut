
// DropDownMenu (C) Edvard Toth (03/2008)
//
// http://www.edvardtoth.com
//
// This source is free for personal use. Non-commercial redistribution is permitted as long as this header remains included and unmodified.
// All other use is prohibited without express permission. 


package {
	
	import flash.text.TextFormat;
	import flash.text.TextField;
	import flash.text.TextFormatAlign;
	import flash.utils.getTimer;
	import flash.geom.*;
	import flash.display.*;
	import fl.motion.Color;
	import flash.events.*;

	public class DropDownItem extends MovieClip
	{
		private var subMenuFlag:Boolean = false;
		
		private var clickSound:Clicksound = new Clicksound();
		private var soundPlayed:Boolean = false;
		
		private var elementActive:Boolean = false;

		private var startTime:Number;
		private var currentTime:Number;
		private var delayTime:Number = 20;
		
		private var itemCommand:String;
		private var itemArg:*;  // arguments can be multiple datatypes, so no type specified
		private var itemIsSubmenu:Boolean;
		private var padding:Number = 10;
		
		private var defaultColor:ColorTransform;
		private var selectedColor:ColorTransform = new ColorTransform (0,0,0,1,255,40,70,0);
		private var transPercent:Number = 0;
		private var transMod:Number = 0;
		
		private var defaultX:Number = 0;
		
		private var centeredFormat:TextFormat = new TextFormat (null, null, null, null, null, null, null, null, TextFormatAlign.CENTER);
		
		public function DropDownItem (inSubmenu:Boolean = false, inName:String = "undefined", inCommand:String = "doIntro", inArg:* = "")
		{
			itemCommand = inCommand;
			itemArg = inArg;
			itemIsSubmenu = inSubmenu;

			itemtext.text = inName;
			itemtext.width = itemtext.textWidth + padding;
			bkg.width = itemtext.width;
			
			defaultColor = bkg.transform.colorTransform;
			defaultX = this.x;	
			
			startTime = getTimer();
			
			addEventListener (MouseEvent.ROLL_OUT, rollOutHandler);
			addEventListener (MouseEvent.ROLL_OVER, rollOverHandler);				

			addEventListener (MouseEvent.CLICK, clickHandler);				
		}

		private function updateItem (event:Event):void
		{
			currentTime = getTimer();
			
			if (elementActive == true)
			{
				// waits 20 milliseconds between sounds to avoid continuous "rattle"
				if (currentTime - startTime > delayTime)
				{
						if (soundPlayed == false)
						{
							clickSound.play();
							soundPlayed = true;
						}
				}
			}
			
			// transPercent defines the state of the color-fade on activated menuitems in 0-to-1 terms
			transPercent += transMod;
			
				if (transPercent < 0)
				{
					transPercent = 0;				
				}
				if (transPercent > 1)
				{
					transPercent = 1;			
				}

				bkg.transform.colorTransform =	Color.interpolateTransform (defaultColor, selectedColor, transPercent);
				
					if (itemIsSubmenu == true)
					{
						// two birds with one stone: the position of activated menuitems is linked to the state of the color interpolation
						this.x = defaultX - transPercent * 10; 
					}
					
				// transMod here is also used to determine if initial rollover happened
				if (transPercent == 0 && transMod != 0 && elementActive == false)
				{
					transMod = 0;
					removeEventListener (Event.ENTER_FRAME, updateItem);
				}
		}
		
		
		public function centerName():void
		{
			this.itemtext.setTextFormat (centeredFormat);
		}
				
		private function rollOverHandler (event:MouseEvent):void
		{
			soundPlayed = false;
			
			if (transMod == 0)
			{
				addEventListener (Event.ENTER_FRAME, updateItem);
			}
			
			transMod = 0.2;
			startTime = getTimer();
			
			elementActive = true;
		}
		
		private function rollOutHandler (event:MouseEvent):void
		{
			transMod = -0.05;
			elementActive = false;
		}

		private function clickHandler (event:MouseEvent):void
		{
				clickSound.play();
			
				if (itemCommand == "displaySubMenu")
				{
					// turns off the submenu specified using the "arg" property
					DropDownMenu.getInstance().turnOffAllSubMenus(itemArg);			
				}
				else
				{
					DropDownMenu.getInstance().turnOffAllSubMenus(-1);				
				}
				
			// calls the function+arguments that belong to the clicked menuitem
			DropDownMenu.getInstance()[itemCommand](itemArg);			
		}
		
	}

}