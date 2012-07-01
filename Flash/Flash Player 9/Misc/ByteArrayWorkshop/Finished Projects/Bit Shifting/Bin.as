package
{
	public class Bin
	{
		public static function print(num:Number):String
		{
			var str:String = num.toString(2);
			while(str.length < 8)
				str = "0" + str;
			return str;
		}
	}
}