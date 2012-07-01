package 
{
	import flash.display.Sprite;
	import flash.events.SampleDataEvent;
	import flash.media.Sound;

	public class DynamicSound extends Sprite
	{
		private var sound:Sound;
		private var phase:Number;
		private const FREQ:Number = 44100;
		
		public function DynamicSound()
		{
			phase = 0;
			sound = new Sound();
			sound.addEventListener(SampleDataEvent.SAMPLE_DATA, onSampleData);
			sound.play();
		}
		
		private function onSampleData(e:SampleDataEvent):void
		{			
			for(var i:int=0; i<2200; ++i)
			{
				phase += stage.mouseX / FREQ;
				var note:Number = phase * Math.PI * 2;
				var sample:Number = Math.sin(phase);
				e.data.writeFloat(sample);
				e.data.writeFloat(sample);	
			}
		}
	}
}
