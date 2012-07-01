var Lib = Lib || {};
 
Lib.when = function(dfd) {
	return dfd.promise();
}
 
Lib.Promise = function(then, fail) {
	this.then = then;
	this.fail = fail;
}

Lib.Deferred = function() {
	var dfd = this,
		 completed = false,
		 val, error,
		 successFns = [],
		 failureFns = [],
		 i, len,
		 then = function(success) {
			if (completed) {
				if (typeof val !== "undefined") {
					success(val);
				}
			} else {
				successFns.push(success);
			}
			return myPromise;
		 },
		 fail = function(failure) {
			if (completed) {
				if (typeof error !== "undefined") {
					failure(val);
				}
			} else {
				failureFns.push(failure);
			}
			return myPromise;
		 },   
		 myPromise = new Lib.Promise(then, fail);
        
	this.promise = function() {
		return myPromise;
	};
	
	this.resolve = function(returnVal) {
		if (!completed) {
			completed = true;
			val = returnVal;
			for (i = 0, len = successFns.length; i < len; i++) {
				successFns[i](val);
			}
		}
	};
	
	this.reject = function(returnError) {
		if (!completed) {
			completed = true;
			error = returnError;
			for (i = 0, len = failureFns.length; i < len; i++) {
				failureFns[i](error);
			}
		}
	};
}