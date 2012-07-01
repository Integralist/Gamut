package
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.net.FileReference;
	import flash.utils.ByteArray;

	[SWF(width='850', height='500', backgroundColor='#000000', frameRate='30')]

	public class PSDParser extends Sprite
	{
		private var fr:FileReference;
		private var ba:ByteArray;
		private var ui:UI;
		
		public function PSDParser()
		{
			ui = new UI();
			addChild(ui);
			stage.addEventListener(MouseEvent.CLICK, init);
		}
		
		private function init(e:MouseEvent):void
		{
			fr = new FileReference();
			fr.addEventListener(Event.COMPLETE, onComplete);
			fr.addEventListener(Event.SELECT, function():void{fr.load();});
			fr.browse();
		}
		
		private function onComplete(e:Event):void
		{
			ba = fr.data as ByteArray;
			parsePSD();
		}
		
		private function parsePSD():void
		{
			// READ HEADER
			ba.position = 14;
			var height:int = ba.readInt();
			var width:int = ba.readInt();
			ba.position += 4;
			
			// COLOR DATA
			var len:int = ba.readInt();
			ba.position += len;
			
			// IMAGE RESOURCES
			len = ba.readInt();
			ba.position += len;
			
			// LAYERS AND MASKS
			len = ba.readInt();
			ba.position += len;
			
			ba.position += 2;
			
			var counts:Vector.<int> = new Vector.<int>(height*3, true);			
			var i:int;
			
			// GET THE BYTE COUNTS FOR ALL LINES
			for(i=0; i<height*3; ++i)
			{
				counts[i] = ba.readUnsignedShort();			
			}
			
			var r:ByteArray = new ByteArray();
			var g:ByteArray = new ByteArray();
			var b:ByteArray = new ByteArray();
			var line:ByteArray;
			
			// EXTRACT THE RED CHANNELS
			for(i=0; i<height; ++i)
			{
				line = new ByteArray();
				ba.readBytes(line, 0, counts[i]);
				r.writeBytes(uncompress(line)); 		
			}	
			
			// EXTRACT THE GREEN CHANNELS
			for(i=0; i<height; ++i)
			{
				line = new ByteArray();
				ba.readBytes(line, 0, counts[height+i]);
				g.writeBytes(uncompress(line)); 		
			}	
			
			// EXTRACT THE BLUE CHANNELS
			for(i=0; i<height; ++i)
			{
				line = new ByteArray();
				ba.readBytes(line, 0, counts[2*height+i]);
				b.writeBytes(uncompress(line)); 		
			}				
			
			var bmd:BitmapData = new BitmapData(width, height);

			r.position = 0;
			g.position = 0;
			b.position = 0;
			
			for(var y:int=0; y<height; ++y)
			{
				for(var x:int=0; x<width; ++x)
				{
					bmd.setPixel(x, y, r.readUnsignedByte()<<16 | g.readUnsignedByte()<<8 | b.readUnsignedByte());
				}			
			}	
			
			var bm:Bitmap = new Bitmap(bmd);
			bm.x = 330;
			bm.y = 15;		
			addChild(bm);
		}
		
		//EXPANDS THE PACKBITS RLE COMPRESSION 
		private function uncompress(b:ByteArray):ByteArray
		{
			var n:int;
			var count:int;
			var byte:int;
			var i:int;
			var rb:ByteArray = new ByteArray();
			
			while(b.bytesAvailable)
			{
				n = b.readByte();
				if(n >= 0)
				{
					count = n+1;
					for(i=0; i<count; ++i)
					{
						rb.writeByte(b.readByte());
					}
				}
				else
				{
					byte = b.readByte();
					count = 1 - n;
					for(i=0; i<count; ++i)
					{
						rb.writeByte(byte);
					}
				}
			}
			return rb;
		}
	}
}