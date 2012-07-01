package
{
	import flash.display.Sprite;
	import flash.events.KeyboardEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.Socket;
	import flash.ui.Keyboard;
	import flash.utils.ByteArray;

	[SWF(width='700', height='400', backgroundColor='#000000', frameRate='30')]

	public class FTP extends Sprite
	{
		private var ui:UI;
		private var sock:Socket;
		private var pass:Socket;
		private var ba:ByteArray;
		
		public function FTP()
		{
			ui = new UI();
			ui.it.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
			addChild(ui);
			ba = new ByteArray();
			sock = new Socket("ftp.2600.com", 21);
			sock.addEventListener(ProgressEvent.SOCKET_DATA, onData);
		}
		
		private function onData(e:ProgressEvent):void
		{
			var str:String = sock.readUTFBytes(sock.bytesAvailable);
			if(str.substring(0,3) == "227")
			{
				createPassiveSocket(str);
			}
			ui.rt.text = str + "\n" + ui.rt.text;
		}
		
		private function onBinaryData(e:ProgressEvent):void
		{
			var str:String = pass.readUTFBytes(pass.bytesAvailable);
			ui.rt.text = str + "\n" + ui.rt.text;
		}
		
		private function createPassiveSocket(str:String):void
		{
			var n:Array = str.substring(str.indexOf("(")+1, str.indexOf(")")).split(",");
			var host:String = n[0].toString()+"."+n[1].toString()+"."+
								n[2].toString()+"."+n[3].toString();
			var port:int =  int(n[4]*256) + int(n[5]);
			pass = new Socket();
			pass.addEventListener(ProgressEvent.SOCKET_DATA, onBinaryData);
			pass.addEventListener(SecurityErrorEvent.SECURITY_ERROR, function():void{});
			pass.connect(host, port);
		}
		
		private function onKeyUp(e:KeyboardEvent):void
		{
			if(e.keyCode == Keyboard.ENTER)
			{
				sock.writeUTFBytes(ui.it.text + "\n");
				ui.it.text = "";
			}
		}
	}
}