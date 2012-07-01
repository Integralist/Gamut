package {
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.SampleDataEvent;
	import flash.media.Sound;
	import flash.net.URLRequest;
	import flash.utils.ByteArray;

	public class ExtractSound extends Sprite
	{
		private var input:Sound;
		private var output:Sound;
		
		public function ExtractSound()
		{
			input = new Sound(new URLRequest("die.mp3"));
			input.addEventListener(Event.COMPLETE, onComplete);
			
			output = new Sound();
			output.addEventListener(SampleDataEvent.SAMPLE_DATA, onData);
		}
		
		private function onComplete(e:Event):void
		{
			output.play();
		}
		
		private function onData(e:SampleDataEvent):void
		{
			var ba:ByteArray = new ByteArray();
			input.extract(ba, 4096);
			e.data.writeBytes(shiftBytes(ba));
		}
		
		private function shiftBytes(ba:ByteArray):ByteArray
		{
			var rb:ByteArray = new ByteArray();
			ba.position = 0;
			while(ba.bytesAvailable)
			{
				rb.writeFloat(ba.readFloat());
				rb.writeFloat(ba.readFloat());
				ba.position += 4;
			}
			return rb;
		}
	}
}
