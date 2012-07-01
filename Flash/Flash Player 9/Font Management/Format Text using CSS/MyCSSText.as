// first create a package and import the required classes
	package
	{
		import flash.display.Sprite;
		import flash.text.*;
		import flash.events.*;
		import flash.net.*;
		
		// now create our class
			public class MyCSSText extends Sprite
			{
				// now create our constructor
					public function MyCSSText()
					{
						// assign an event listener to carry out loading the CSS
							var loadCSS:URLLoader = new URLLoader();
							loadCSS.addEventListener(Event.COMPLETE, loadComplete);
							loadCSS.load(new URLRequest('Styles.css'));
					}
					
				// create a StyleSheet object to load the CSS into	
					private function loadComplete(e:Event):void
					{
						var newStyleSheet:StyleSheet = new StyleSheet();
						newStyleSheet.parseCSS(e.target.data);
						
						// now create a new instance of the 'TextField' object
							var tf:TextField = new TextField();
							tf.autoSize = TextFieldAutoSize.LEFT;
							tf.wordWrap = true;
							tf.x = 100;
							tf.y = 100;
							
							// now assign the style sheet (attached to the variable) to the textfield instance
								tf.styleSheet = newStyleSheet;
								tf.htmlText = '<p class="wd">Web Designer Rocks</p><br>';
								tf.htmlText += '<p>so don\'t hide the love</p>';
							
							// now add the text field to the stage
								addChild(tf);
					}
			}
	}