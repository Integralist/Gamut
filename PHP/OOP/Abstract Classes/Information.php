<?php
    include('Car.php');
    
    $street1 = new Street();
    $street1->addCar(new FastCar());

    $street2 = new Street();
    $street2->addCar(new SlowCar());
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <style type="text/css">
			p span
			{ color: red; font-weight: bold; }
        </style>
    </head>
    <body>
        <p><em>Abstract classes</em> involve the use of a common base class when you want to leave certain details up to its inheritors—specifically, when you need to create a foundational object whose methods are not fully defined. You will find that by using abstraction, you can create very extensible architecture within your development projects.</p>
        <p>For example, file-format parsing lends itself particularly well to the abstract approach. In this case, you know that the object will need a set of methods, like getData() or getCreatedDate(), in order for it to interoperate with other classes; however, you want to leave the parsing methods up to inheriting classes that are designed for a specific file format. By using abstract classes, you can define that a parse() method must exist, without needing to specify how it should work. You can place this abstract requirement and the fully defined methods in a single class for easier implementation.</p>
        <p>To get the most out of abstract classes, you should remember the following rules:</p>
        <ul>
            <li>Any class that contains even one abstract method must also be declared abstract.</li>
            <li>Any method that is declared abstract, when implemented, must contain the same or weaker access level. For example, if a method is protected in the abstract class, it must be protected or public in the inheriting class; it may not be private.</li>
            <li>You cannot create an instance of an abstract class using the new keyword.</li>
            <li>Any method declared as abstract must not contain a function body.</li>
            <li>You may extend an abstract class without implementing all of the abstract methods if you also declare your extended class abstract. This can be useful for creating hierarchical objects.</li>
        </ul>
        <p>To declare a class as abstract you use the abstract modifier in the class declaration {see 'Car.php' source code}.</p>
        <p><span>Abstract classes are not without their limitations, however. PHP supports extending from only a single base class, so you cannot derive from two or more abstract classes. The ability to extend from two or more base classes is commonly called multiple inheritance and is illegal by design in PHP. The reasoning is that descending from multiple classes can cause unwanted complexity when two or more classes define fully defined methods with the same prototype. When you find that you want to descend from two or more abstract classes, an alternative is to split out the base class methods and use interfaces to achieve the same goals.</span></p>
    </body>
</html>
