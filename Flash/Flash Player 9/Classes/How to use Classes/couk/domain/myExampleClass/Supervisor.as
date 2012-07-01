package couk.stormmedia.myExampleClass
{
	public class Supervisor
	{
		public function Supervisor(worker:iNameOfInterface):void
		{
			worker.work();
			
			if(worker is Teacher)
			{
				var teacher:Teacher = worker as Teacher;
				trace(teacher);
			}
			
			if(worker is Student)
			{
				var student:Student = worker as Student;
				trace(student);
			}
			
			/*
				the is keyword checks whether the worker instance passed to the
				constructor is of the specific type Teacher or of the type Student.
				
				If it is a teacher instance using the as keyword, you are able to 
				type cast the instance to that specific class, so you can access its 
				specific methods and properties.
				
				The same holds true if we're dealing with a student instance. If the 
				is keyword confirms that you are working with a student, you can type cast
				the generic 'iNameOfInterface' instance to a student instance.
			*/
		}
	}
}