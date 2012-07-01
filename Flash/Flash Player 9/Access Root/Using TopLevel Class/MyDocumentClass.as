package
{
	public class MyDocumentClass extends TopLevel
	{
		public function MyDocumentClass()
		{
			trace("this = " + this);
			trace("stage = " + stage);
			trace("root = " + root);
			trace("TopLevel.stage = " + TopLevel.stage);
		}
	}
}