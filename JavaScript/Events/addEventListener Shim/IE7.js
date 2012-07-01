// IE8 allows access to 'Element' Interface (so we can easily augment all Elements with addEventListener)
// But IE7 doesn't so for that browser we use a .htc file to hack it together.
// You'll see the .htc file uses an Element function as a constructor
Element = function(){};

/*
The secret is that rather than manually looping through every element in the page and extending each element we use 'behaviours'

http://delete.me.uk/2004/09/ieproto.html
DHTML behaviours, like the Mozilla project's XBL, allow you to bind Javascript (hence behaviours) to the DOM elements in a document.
Dynamic HTML (DHTML) behaviors are components that encapsulate specific functionality or behavior on a page. 
When applied to a standard HTML element on a page, a behavior enhances that element's default behavior.
Behaviours can be bound to elements using either a CSS property or progmatically using Javascript. 
This allows us to add Javascript methods and variables to all the HTML objects in a document using a CSS wildcard, the universal selector.
*/