
// DropDownMenu (C) Edvard Toth (03/2008)
//
// http://www.edvardtoth.com
//
// This source is free for personal use. Non-commercial redistribution is permitted as long as this header remains included and unmodified.
// All other use is prohibited without express permission. 

package {
	
	import flash.display.InteractiveObject;
	import flash.display.MovieClip;
	import fl.transitions.*;
	import fl.transitions.easing.*;
	
	import flash.net.*;
		
	public class DropDownMenu extends MovieClip  
	{
		private static var instance:DropDownMenu;
        private static var singleInstance:Boolean = false;

		// The menu tree is an XML structure. The "command" property contains a corresponding function that should be called when the menuitem is
		// clicked, and the "arg" property contains arguments for the function.
		// The "arg" property is used as a numerical identifier for menuitems that have subitems to display.
		
		private var menu:XML = 
		<menu>
		<item name="KNOX IN BOX"										command="displaySubMenu"	arg="0">
				<subitem name="Bricks and blocks"						command="accessContent"		arg="bricks"/>
				<subitem name="Chicks and clocks"						command="accessContent"		arg="chicks"/>			
				<subitem name="Quick trick"								command="accessContent"		arg="quick"/>			
				<subitem name="Brick stack"								command="accessContent"		arg="stacks"/>			
			</item>
		<item name="TICKS AND TOCKS"									command="displaySubMenu"	arg="1">
				<subitem name="Tweetle"				 					command="accessContent"		arg="tweetle"/>
				<subitem name="Beetle" 									command="accessContent"		arg="beetle"/>
				<subitem name="Noodle Poodle"	 						command="accessContent"		arg="noodle"/>
				<subitem name="Muddled" 								command="accessContent"		arg="muddle"/>
				<subitem name="Duddled"			 						command="accessContent"		arg="duddle"/>
				<subitem name="Fuddled Wuddled"		 					command="accessContent"		arg="fuddle"/>
			</item>
		<item name="FOX IN SOCKS"	 									command="displaySubMenu"	arg="2">
				<subitem name="Freezy breeze"							command="accessContent"		arg="breezy"/>
				<subitem name="Made these"								command="accessContent"		arg="made"/>
				<subitem name="Three trees"								command="accessContent"		arg="trees"/>
				<subitem name="Freeze"									command="accessContent"		arg="freeze"/>
			</item>
		<item name="wwww.edvardtoth.com" 								command="accessSite" 		arg="http://www.edvardtoth.com/"/>
		</menu>;
		
		
		private var dropDownItem:DropDownItem;
		private var dropDownItemSub:DropDownItem;
				
		private var itemName:String;
		private var itemCommand:String;
		private var itemArg:*;
		private var itemOffset:Number = 0;

		private var subitemName:String;
		private var subitemCommand:String;
		private var subitemArg:*;
		private var subitemWidth:Number = 0;
		private var originalOffset:Number = 22;
		private var subitemOffset:Number = originalOffset;
		
		private var subMenuList:Array = new Array();
		private var subID:Number = 0;

		private var xTween:Tween;
		
		private var xGap:Number = 5;
		private var yGap:Number = 20;
		
		
		// this is a Singleton-like setup to make sure that only one instance of DropDownMenu exists at any given time,
		// and access to it from other classes is straightforward
		public static function getInstance():DropDownMenu
        {
			if( !instance )
            {
				singleInstance = true;
                instance = new DropDownMenu();
                singleInstance = false;
            }
            return instance;
		}

				
		public function DropDownMenu()
		{
			if ( !singleInstance ) 
			{
				throw new Error( "Use .getInstance() to access the single instance of this class." );
			}
		
			itemBuild();
		}

		
		// build menu elements
		private function itemBuild():void
		{
			for each (var item:XML in menu.item)
			{
				itemName = item.@name;
				itemCommand = item.@command;
				itemArg = item.@arg;

				dropDownItem = new DropDownItem(false, itemName, itemCommand, itemArg);
				
				addChild (dropDownItem);
				dropDownItem.x += itemOffset;
				dropDownItem.centerName(); // top level menu items have centered text, submenuitems are left justified
				
					var subitemCheck:String = item.children().toString();
							
					if (subitemCheck.length != 0)
					{
						subitemBuild (item);				
					}
			
				itemOffset += dropDownItem.itemtext.width + xGap;
			}

		}
		
		// build submenu elements
		private function subitemBuild(inItem:XML):void
		{
			// submenus are basically collections of menuitems displayed at the same time			
			var subMenu:SubMenuHolder = new SubMenuHolder();
			addChild (subMenu);
					
			subMenu.x += itemOffset;
			
			subMenuList.push (subMenu);
			
			for each (var subitem:XML in inItem.subitem)
			{
				subitemName = (" ") + subitem.@name;
				subitemCommand = subitem.@command;
				subitemArg = subitem.@arg;

				dropDownItemSub = new DropDownItem(true, subitemName, subitemCommand, subitemArg);
					
				subMenu.addChild (dropDownItemSub);
				dropDownItemSub.x = 0;
				dropDownItemSub.y += subitemOffset;
				
				subitemOffset += yGap;
			}

			subitemOffset = originalOffset;
		}
		
		
		public function displaySubMenu (inID:Number):void
		{
			subID = inID; // to make it accessible to functions
			
			turnOffAllSubMenus (subID);
			
			if (subMenuList[subID].visible == false)
			{
				tweenSubMenu();
			}
			else 
			{
				subMenuList[subID].turnOff();
			}
		}
				
				private function tweenSubMenu():void
				{
					submenuX = subMenuList[subID].x;
					subMenuList[subID].visible = true;
					
					xTween = new Tween (subMenuList[subID], "x", Elastic.easeOut, submenuX - 30, submenuX, 0.5, true);
					xTween.addEventListener (TweenEvent.MOTION_FINISH, endSubMenuTween);
				}
			
				private function endSubMenuTween (event:TweenEvent):void
				{
					subMenuList[subID].turnOn();
				}


		// will receive -1 from menuitems that don't have submenus
		public function turnOffAllSubMenus(inID:Number):void
		{
			for (var i:Number = 0; i < subMenuList.length; i++)
			{
				if (i != inID)
				{
					subMenuList[i].turnOff();							
				}
			}
		}
		
		
		// here the incoming argument is used as a simple string
		public function accessContent(inArg:String):void
		{
			trace ("You clicked on '" + inArg + "'.");
		}
		
		// here the incoming argument is used as an URL
		public function accessSite(inSite:String):void
		{
			navigateToURL (new URLRequest (inSite), "_blank");			
		}
		
		
			
	} // end class
} // end package