package {
	import com.utils.sha1Encrypt;
	import flash.text.*;
	import flash.events.*;
	import flash.net.*;
	import flash.display.MovieClip;
	
	public class sha1 extends MovieClip 
	{
		private var enc:sha1Encrypt = new sha1Encrypt( true );
		
		public function sha1():void
		{
			var encrypted:String = sha1Encrypt.encrypt( "hello, this will be encrypted" )
			
			//trace( encrypted ); // send this to PHP file
			
			// Create a URLRequest to contain the data to send to descrypt.php
			var req:URLRequest = new URLRequest( "decrypt.php" );
			
			// Create name-value pairs to send to the server
			var variables:URLVariables = new URLVariables();
			variables.encryptedData = encrypted;
			req.data = variables;
			
			navigateToURL(req, "_self");
			
			/*
			// Create a URLLoader to send the data and receive a response
			var loader:URLLoader = new URLLoader();
			
			// Listen for the complete event to read the server response
			loader.addEventListener( Event.COMPLETE, handleComplete );
			
			// Send the data in the URLRequest off to the script
			loader.load( req );*/
			function handleComplete( e:Event ):void
			{
				myText.text = e as String;
			}
		}
	}
}
