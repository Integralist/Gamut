<?php
    include('Car.php');
	
	$myCar = new FastCar();
	echo("<b>" . $myCar->getMaximumSpeed() . "</b>");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
    </head>
    <body>
    	<p>An <em>interface</em> is a class-like structure that allows you to declare which methods an implementing class must declare. For example, interfaces are often used to declare an API without defining how it will be implemented.</p>
        <p>While similar to an abstract class, an interface may contain only method prototypes and must not contain any fully defined methods. This prevents the method conflicts that can arise with abstract classes and allows you to use more than one interface for a given implementing class. However, since you cannot define fully defined methods, if you wish to provide default functionality for inheritors, you must also provide a non-abstract base class separately.</p>
        <p>To declare an interface, you use the interface keyword:</p>
        <pre>
        interface IExampleInterface {}
        </pre>
        <p>NOTE: Many developers choose to prefix interface names with a capital I to clearly distinguish them from classes, both in code and in generated documentation.</p>
		<p>Instead of extending from the interface as you would an abstract class, use the implements keyword:</p>
        <pre>
        class ExampleClass implements IExampleInterface {}
        </pre>
        <p>If you mark a class as implementing an interface and fail to implement all the interface’s methods, you will see an error similar to this:</p>
        <pre>
        Fatal error: Class ExampleClass contains 1 abstract method 
        and must therefore be declared abstract or implement the remaining methods
		(IExampleInterface::exampleMethod)
        </pre>
        <p>This error means that if any method in an interface is not declared, it is assumed that the method is abstract. And since any class containing an abstract method must also be abstract, the class must be marked as abstract to be parsed successfully.</p>
        <p>As noted, one benefit of interfaces over abstract classes is that you may use more than one interface per class. When you wish to implement two or more interfaces in a class, you separate them with commas. For example if you had an array style object that you wanted to be both iterable and countable, you might define a class like this:</p>
        <pre>
        class MyArrayLikeObject implements Iterator, Countable {}
        </pre>
        <p>It is entirely possible to achieve the same operation as abstract classes using interfaces. Usually, you will use an abstract class where there is a logical hierarchy between the child and parent classes. You will generally use an interface where there is a specific interaction you wish to support between two or more objects that are dissimilar enough that an abstract class would not make sense.</p>
    </body>
</html>
