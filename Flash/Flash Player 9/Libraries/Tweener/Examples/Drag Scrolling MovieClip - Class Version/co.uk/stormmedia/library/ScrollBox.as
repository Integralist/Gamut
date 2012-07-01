package co.uk.stormmedia.library
{
	import flash.display.*;
	import flash.events.*;
	import caurina.transitions.*;
	
	public class ScrollBox extends MovieClip
	{
		public function ScrollBox():void
		{
			sb.addEventListener(ScrollbarEvent.VALUE_CHANGED, sbChanged);
		}
		
		private function sbChanged(e:ScrollbarEvent):void
		{
			// the negative value (-) before the math calculation reverses the value so the content movieclip moves up rather than down
			Tweener.addTween(content, {y:(-e.scrollPercent * (content.height - masker.height)), time:1});
		}
	}
}