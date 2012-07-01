package
{
	// Import the required namespaces
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.events.Event;
	import fl.controls.RadioButton;
	import fl.controls.RadioButtonGroup;
	
	// Create the class
	public class QuizQuestion extends Sprite
	{
		// Define our class members (private variables)
		private var question:String;
		private var questionField:TextField;
		private var theCorrectAnswer:int;
		private var choices:Array;
		private var theUserAnswer:int;
		
		// Variables for positioning the questions/options:
		private var questionX:int = 25;
		private var questionY:int = 25;
		private var answerX:int = 60;
		private var answerY:int = 55;
		private var spacing:int = 25;
			
		// Create the constructor
		public function QuizQuestion(theQuestion:String, theAnswer:int, ...answers)
		{
			// Store the supplied arguments in the private variables:
			question = theQuestion;
			theCorrectAnswer = theAnswer;
			choices = answers; // answers is a 'catch-all' array of possible arguments
			
			// Create and position the TextField (question)
			questionField = new TextField();
			questionField.text = question;
			questionField.autoSize = TextFieldAutoSize.LEFT;
			questionField.x = questionX;
			questionField.y = questionY;
			addChild(questionField);
			
			// Create and position the radio buttons (answers):
			var myGroup:RadioButtonGroup = new RadioButtonGroup('group1');
			myGroup.addEventListener(Event.CHANGE, changeHandler);
			
			/*
				We create a RadioButtonGroup instance, and its constructor requires that we pass 
				it a string of text to use for its name property. We won't be using this name, 
				but we must supply one nonetheless. The important name is the variable name, 
				"myGroup," and that's the one we add the Event listener to.
			*/
			
			// Loop through all additional arguments in the answers array
			for(var i:int = 0; i<choices.length; i++)
			{
				var rb:RadioButton = new RadioButton();
				rb.textField.autoSize = TextFieldAutoSize.LEFT;
				rb.label = choices[i];
				rb.group = myGroup;
				rb.value = i + 1;
				rb.x = answerX;
				rb.y = answerY + (i * spacing);
				addChild(rb);
			}
		}
		
		private function changeHandler(e:Event)
		{
			theUserAnswer = e.target.selectedData;
		}
		
		public function get correctAnswer():int
		{
			return theCorrectAnswer;
		}
		
		public function get userAnswer():int
		{
			return theUserAnswer;
		}
	}
}