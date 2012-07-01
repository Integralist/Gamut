package
{
	// Import the required namespaces
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import fl.controls.Button;
	
	// Create the class
	public class QuizApp extends Sprite
	{
		// Define our class members (private variables) for managing questions:  
		private var quizQuestions:Array;
		private var currentQuestion:QuizQuestion; // When you create a custom class, you're also creating a custom data type at the same time
		private var currentIndex:int = 0;
		
		// Define our class members (private variables) for managing the buttons:  
		private var prevButton:Button;
		private var nextButton:Button;
		private var finishButton:Button;
		
		// Define our class members (private variables) for managing the scoring and messages:  
		private var status:TextField;
		private var score:int = 0;
		
		// Create the constructor
		public function QuizApp()
		{
			quizQuestions = new Array();
			createQuestions();
			createButtons();
			createStatusBox();
			addAllQuestions();
			hideAllQuestions();
			firstQuestion();
		}
		
		// Create the questions for this quiz
		private function createQuestions()
		{
			quizQuestions.push(new QuizQuestion('What color is an orange?',1,'Orange','Blue','Purple','Brown'));
			quizQuestions.push(new QuizQuestion('What is the shape of planet earth?',3,'Flat','Cube','Round','Shabby'));
			quizQuestions.push(new QuizQuestion('Who created SpiderMan?',2,'Jack Kirby','Stan Lee and Steve Ditko','Stan Lee','Steve Ditko','none of the above'));
			quizQuestions.push(new QuizQuestion('Who created Mad?',2,'Al Feldstein','Harvey Kurtzman','William M. Gaines','Jack Davis','none of the above'));
		}
		
		// Create the buttons for this quiz
		private function createButtons()
		{
			var yPosition:Number = stage.stageHeight - 40;
			
			prevButton = new Button();
			prevButton.label = 'Previous';
			prevButton.x = 30;
			prevButton.y = yPosition;
			prevButton.addEventListener(MouseEvent.CLICK, prevHandler);
			addChild(prevButton);
			
			nextButton = new Button();
			nextButton.label = 'Next';
			nextButton.x = prevButton.x + prevButton.width + 40;
			nextButton.y = yPosition;
			nextButton.addEventListener(MouseEvent.CLICK, nextHandler);
			addChild(nextButton);
			
			finishButton = new Button();
			finishButton.label = 'Finish';
			finishButton.x = nextButton.x + nextButton.width + 40;
			finishButton.y = yPosition;
			finishButton.addEventListener(MouseEvent.CLICK, finishHandler);
			addChild(finishButton);
		}
		
		private function prevHandler(e:MouseEvent)
		{
			showMessage('');
			
			if(currentIndex > 0)
			{
				currentQuestion.visible = false;
				currentIndex--;
				currentQuestion = quizQuestions[currentIndex];
				currentQuestion.visible = true;
			}
			else
			{
				showMessage('This is the first question, there are no previous ones');
			}
		}
		
		private function nextHandler(e:MouseEvent)
		{
			showMessage('');
			
			if(currentQuestion.userAnswer == 0) //userAnswer is getter function from "QuizQuestion.as". If it's still 0, the user haven't answered the question yet.
			{
				showMessage('Please answer the current question before continuing');
				return;
			}
			
			if(currentIndex < (quizQuestions.length - 1))
			{
				currentQuestion.visible = false;
				currentIndex++;
				currentQuestion = quizQuestions[currentIndex];
				currentQuestion.visible = true;
			}
			else
			{
				showMessage('That\'s all the questions! Click Finish to Score, or Previous to go back');
			}
		}
		
		private function finishHandler(e:MouseEvent)
		{
			showMessage('');
			var finished:Boolean = true;
			
			for (var i:int = 0; i < quizQuestions.length; i++)
			{
				if (quizQuestions[i].userAnswer == 0)
				{
					finished = false;
					break;
				}
			}
			
			if(finished)
			{
				prevButton.visible = false;
				nextButton.visible = false;
				finishButton.visible = false;
				hideAllQuestions();
				computeScore();
			}
			else
			{
				showMessage('You haven\'t answered all of the questions');
			}
		}
		
		private function firstQuestion()
		{
			currentQuestion = quizQuestions[0];
			currentQuestion.visible = true;
		}
		
		private function createStatusBox()
		{
			status = new TextField();
			status.autoSize = TextFieldAutoSize.LEFT;
			status.y = stage.stageHeight - 80;
			addChild(status);
		}
		
		private function showMessage(theMessage:String)
		{
			status.text = theMessage;
			status.x = (stage.stageWidth / 2) - (status.width / 2);
		}
		
		private function addAllQuestions()
		{
			for(var i:int = 0; i < quizQuestions.length; i++)
			{
				addChild(quizQuestions[i]);
			}
		}
		
		private function hideAllQuestions()
		{
			for(var i:int = 0; i < quizQuestions.length; i++)
			{
				quizQuestions[i].visible = false;
			}
		}
		
		private function computeScore()
		{
			for (var i:int = 0; i < quizQuestions.length; i++)
			{
				if (quizQuestions[i].userAnswer == quizQuestions[i].correctAnswer)
				{
					score++;
				}
			}
			
			showMessage('You answered ' + score + ' correct out of ' + quizQuestions.length + ' questions.');
		}
	}
}