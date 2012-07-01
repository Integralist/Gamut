// This promise is tiny. It's also fast.
// There are a few major problems with this promise that keep it from
// being useful outside of a constrained environment:
// 1. It modifies it's own public API:
//    The then(), resolve(), and reject() methods are rewritten when the promise
//    is completed (i.e. resolved or rejected). There's nothing inherently wrong
//    with this unless some other code is overriding or hijacking the public 
//    methods (in which case, they'd be overriding the obsolete methods).
// 2. It doesn't distinguish between the "front end" API and the "back end" API:
//    If some other code decided to call our reject() method, it could. We would
//    typically want to hide our back end API from outside code.
// But if you're looking for the tiniest implementation of a promise, this is
// about as small as you're going to get (in terms of LOC).
// This promise is a copy from my gist at https://gist.github.com/814052

function Promise () {
	this._thens = [];
}

Promise.prototype = {

	/* This is the "front end" API. */
	
	/**
	 * This method stores the callback functions to be executed once a Promise is resolved/rejected.
	 * 
	 * @param onResolve { Function } method to be notified when the promise is complete
	 * @param onReject { Function } method to be notified when the promise has failed
	 * @return this { Object } the Promise constructor
	 */
	then: function (onResolve, onReject) {
		this._thens.push({ resolve: onResolve, reject: onReject });
		return this;
	},

	/* This is the "back end" API. */
	
	// Some promise implementations also have a cancel() front end API that
	// calls all of the onReject() callbacks (aka a "cancelable promise").
	// cancel: function (reason) {},
	
	/**
	 * This method is called when a Promise is resolved.
	 * The resolved value (if any) is passed by the resolver to this method.
	 * All waiting onResolve callbacks are called and any future ones are, too, each being passed the resolved value.
	 * 
	 * @param val { Primitive } the resolved value could be any valid JavaScript primitive (Boolean, String, Number, Null, Undefined) or an Object.
	 * @return undefined {  } no explicitly returned value
	 */
	resolve: function (val) { 
		this._complete('resolve', val); 
	},

	/**
	 * This method is called when a Promise cannot be resolved.
	 * Typically, you'd pass an exception as the single parameter, but any other argument, including none at all, is acceptable.
	 * All waiting (and all future) onReject callbacks are called when reject() is called and are passed the exception parameter.
	 * 
	 * @param ex { x } the exception value
	 * @return undefined {  } no explicitly returned value
	 */
	reject: function (ex) { 
		this._complete('reject', ex); 
	},

	// Some promises may have a progress handler. 
	// The back end API to signal a progress "event" has a single parameter. 
	// The contents of this parameter could be just about anything and is specific to your implementation.
	// progress: function (data) {},
	
	/**
	 * This is a private method which determines which methods to be executed.
	 * 
	 * @param which { String } either 'resolve' or 'reject'
	 * @param arg { Primitive } the resolved value could be any valid JavaScript primitive (Boolean, String, Number, Null, Undefined) or an Object.
	 * @return undefined {  } no explicitly returned value
	 */
	_complete: function (which, arg) {
		// Switch over to sync then()
		this.then = which === 'resolve' ?
			function (resolve, reject) { 
				resolve && resolve(arg); return this; 
			} :
			function (resolve, reject) { 
				reject && reject(arg); return this; 
			};
			
		// Disallow multiple calls to resolve or reject
		this.resolve = this.reject = function () { 
			throw new Error('Promise already completed.'); 
		};
			
		// Complete all waiting (async) then()s
		var aThen, i = 0;
		
		while (aThen = this._thens[i++]) { 
			aThen[which] && aThen[which](arg); 
		}
		
		delete this._thens;
	}

};