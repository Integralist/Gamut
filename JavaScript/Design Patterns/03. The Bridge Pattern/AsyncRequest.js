var asyncRequest = (function() { 
	function handleReadyState(o, callback) { 
		var poll = window.setInterval( 
			function() 
			{ 
				if (o && o.readyState == 4) { 
					window.clearInterval(poll); 
					if (callback) { 
						callback(o); 
					} 
				} 
			}, 
			50 
		); 
	}
	
	var getXHR = function() 
	{ 
		var http; 
		try { 
			http = new XMLHttpRequest; 
			getXHR = function() 
			{ 
				return new XMLHttpRequest; 
			}; 
		} 
		catch(e) { 
			var msxml = [ 
				'MSXML2.XMLHTTP.3.0', 
				'MSXML2.XMLHTTP', 
				'Microsoft.XMLHTTP' 
			]; 
			
			for (var i= 0, len = msxml.length; i < len; ++i) { 
				try { 
					http = new ActiveXObject(msxml[i]); 
					getXHR = function() 
					{ 
						return new ActiveXObject(msxml[i]); 
					}; 
					break; 
				} 
				catch(e) {} 
			} 
		} 
		return http; 
	}; 
	
	return function (method, uri, callback, postData) 
	{ 
		var http = getXHR(); 
		http.open(method, uri, true); 
		handleReadyState(http, callback); 
		http.send(postData || null); 
		return http; 
	}; 
})();