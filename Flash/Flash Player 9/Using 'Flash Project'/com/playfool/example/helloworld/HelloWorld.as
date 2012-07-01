package com.playfool.example.helloworld
{
	public class HelloWorld
	{
		private var _fullString:String;
		
		// Constructor
			public function HelloWorld(you:String)
			{
				_fullString = 'Hello ' + you + MyName.mySurname;
			}
			
		// Return the new String
			public function sayHello():String
			{
				return _fullString;
			}
	} // End Class
} // End Package

class MyName
{
	public static function get mySurname():String
	{
		return ' McDonnell';
	}
}