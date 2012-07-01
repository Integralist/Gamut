// we need to define the 'package' by first importing some child 'classes'
	package
	{
		import flash.text.TextFieldAutoSize;
		import flash.text.TextFormat;
		import flash.text.TextField;
		
		// 'Sprite' has all the Movie Clip functions apart from the ones associated with the timeline
			import flash.display.Sprite;
			
		// we create our class 'MyText' and tell it to have all the features that 'Sprite' has
			public class MyText extends Sprite
			{
				private var _mylabel:TextField;
				
				// the first function to be called within a class is called 'the constructor'
					public function MyText()
					{
						createText();
						
						// now the '_mylabel' is created we can set the text.
							sText = "Hello Web Designer you rock";
					}
					
				// this is the 'setter' function (notice the 'set' keyword)
					public function set sText(str:String):void
					{
						_mylabel.text = str;
					}
					
				// the 'createtext()' function is private, which means access can only be gained inside the class
				// this function is creating a new text field and setting some of the properties
					private function createText():void
					{
						// set the label
							_mylabel = new TextField();
							
							_mylabel.autoSize = TextFieldAutoSize.LEFT;
							_mylabel.background = true;
							_mylabel.backgroundColor = 0x0;
							_mylabel.border = true;
							_mylabel.borderColor = 0xFF0000;
							_mylabel.x = 100;
							_mylabel.y = 100;
							
						// we now create a new instance of the 'TextFormat' object
						// this has properties such as font colour, size, weight
							var format:TextFormat = new TextFormat();
							
							format.font = "Verdana";
							format.color = 0xFFFFFF;
							format.size = 20;
							format.underline = true;
							
						// assign the above formatting to the text field
							_mylabel.defaultTextFormat = format;
							
						// now add the text field on the stage
							addChild(_mylabel);
					}
			}
	}