// first create a package and import the required classes
	package
	{
		import flash.text.TextFieldAutoSize;
		import flash.text.TextField;
		import flash.display.Sprite;
		
		// now create our class and give it all the properties of the 'Sprite' class
			public class MyHTMLText extends Sprite
			{
				private var _mylabel:TextField;
				
				// now create the constructor
					public function MyHTMLText()
					{
						createText();
						
						// now the _mylabel is created we can set the text
							sText = "<font face='Verdana' size='20'><i>Hello Web Designer you rock</i></font>";
					}
					
				// now create the 'setter' function (notice the 'set' keyword)
					public function set sText(str:String):void
					{
						_mylabel.htmlText = str;
					}
					
				// now define the 'createText' function
					private function createText():void
					{
						// set the label
							_mylabel = new TextField();
							_mylabel.autoSize = TextFieldAutoSize.LEFT;
							_mylabel.x = 100;
							_mylabel.y = 100;
							
						// add the label to the stage
							addChild(_mylabel);
					}
			}
	}