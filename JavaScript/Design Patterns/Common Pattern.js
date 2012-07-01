// Common design pattern with JavaScript libraries is to have a IIFE (Immediately Invoked Function Expression... in a lot of older texts you see this referenced as a self-executing function) and passing in some host objects as arguments.
// Doing this we keep the global namespace clean from global variables and any naming conflicts that occur with globals.
// The self-executing function is the 'JSLint safe' version. i.e. brackets wrap entire function expression including executing parentheses.
// We pass in 'this' which in the global scope refers to the Window object (for browsers anyway).
// We're not passing in undefined as a parameter, so when the function runs the 3rd argument we've called undefined will actually be a *genuine* undefined type within the context of the function.
// The reason we do this is to avoid the 'asshole effect' (e.g. someone else writes 'undefined = true' outside your self-executing function) thus ensuring checks for 'undefined' still work as expected.
// Rare that happens, but it's better to code defensively.
// Other benefits of this pattern are scope lookups are slightly improved as the JavaScript engine doesn't have to go all the way up to the document level to find the document reference.
// Also, minification of the code is a lot easier now (e.g. YUI Compressor and Google Compiler can more easily munge variables and properties when passed in as arguments).
(function(window, document, undefined) {
	
}(this, document));


// Recursive executing through named function instead of using deprecated 'arguments.callee'
// We could have used setInterval but this causes problems when the function to be executed takes longer than the interval specified (e.g. if doStuff takes longer than 100ms it will still be called again even though it's not finished executing!)
// This pattern avoids that situation. As well as a slight performance gain over using 'arguments.callee'.
function doStuff() {
	// do stuff that takes longer than 100ms to execute
}
(function myNamedFunction() {
	doStuff(); // this function takes longer than 100ms to execute
	window.setTimeout(myNamedFunction, 100); // The closure that has been created allows us to reference the named function 'myNamedFunction' rather than using arguments.callee
}());