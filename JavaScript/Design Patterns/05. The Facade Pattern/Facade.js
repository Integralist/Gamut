/* BASIC EXAMPLE */

function setStyle(elements, prop, val) 
{ 
	for (var i = 0, len = elements.length; i< len; ++i) { 
		alert(elements[i]);
		document.getElementById(elements[i]).style[prop] = val; 
	} 
} 

function setCSS(el, styles) 
{ 
	for (var prop in styles) { 
		if (!styles.hasOwnProperty(prop)) {
			continue;
		}
		
		setStyle(el, prop, styles[prop]); 
	} 
} 

/* MORE ADVANCED EXAMPLE */

var STORM = {};
STORM.util = {};

STORM.util.Event = { 
	getEvent: function(e) 
	{ 
		return e || window.event; 
	},
	
	getTarget: function(e) 
	{ 
		return e.target || e.srcElement; 
	}, 
	
	stopPropagation: function(e) 
	{ 
		if (e.stopPropagation) { 
			e.stopPropagation(); 
		} else { 
			e.cancelBubble = true; 
		} 
	}, 
	
	preventDefault: function(e) 
	{ 
		if (e.preventDefault) { 
			e.preventDefault(); 
		} else { 
			e.returnValue = false; 
		} 
	}, 
	
	stopEvent: function(e) 
	{ 
		this.stopPropagation(e); 
		this.preventDefault(e); 
	} 
};

/* NOW TRY OUT BOTH VERSIONS */

window.onload = function() 
{
	//SIMPLE VERSION
	setCSS(['foo', 'bar', 'baz'], { 
		color: 'white', 
		background: 'black', 
		fontSize: '16px', 
		fontFamily: 'georgia, times, serif' 
	});
	
	//ADVANCED VERSION
	$('example').style.cursor = 'pointer';
	addEvent($('example'), 'click', function(e) 
	{ 
		// Who clicked me. 
		alert('the target = ' + STORM.util.Event.getTarget(e)); 
		
		// Stop propagating and prevent the default action. 
		STORM.util.Event.stopEvent(e); 
	});	
}