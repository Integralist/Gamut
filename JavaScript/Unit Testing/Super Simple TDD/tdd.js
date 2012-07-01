(function(win, doc){
	
	var tdd = function(
	  a, // a object holding test functions
	  b, // a logging function, taking multiple arguments
	  c, // placeholder 
	  d, // placeholder
	  e, // placeholder
	  f  // placeholder
	){
	  c = d = e = 0;    // initialize asserts, failures and exception counts to 0
	  for (             // iterate
	    f               // over all tests
	    in              // in
	    a               // the test object
	  )
	  try {             // for each test, catch any exceptions
	    a[f](           // run the test function
	      function(     // argument is our "assert" function
	        g,          // expression to assert
	        h           // memo/log entry to print if assert fails
	      ) {
	        g ?         // check if the expression is true
	        c++ :       // if so, increment the assert count
	        (
	         d++,       // if not, increment the failure count
	         b(f,'F',h) // log failure as test name F memo
	        )
	      }
	    )
	  }
	  catch (i)         // if an exception occurs during the test function
	  { 
	    e++;            // increment exception count
	    b(f,'E',i)      // log exception as test name E exception description
	  }
	  
	  b(                // log final results
	    c+'A',          // number of assertions
	    d+'F',          // number of failures
	    e+'E'           // number of exceptions
	  )
	}
	
	win.test = tdd;
	
}(this, document))