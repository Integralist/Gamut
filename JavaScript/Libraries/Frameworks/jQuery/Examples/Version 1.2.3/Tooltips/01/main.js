/*
 * Tooltip script 
 * powered by jQuery (http://www.jquery.com)
 * 
 * written by Alen Grakalic (http://cssglobe.com)
 * 
 * for more info visit http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery
 *
 */
 


this.tooltip = function()
{		
	/* CONFIG */		
		xOffset = 10;
		yOffset = 20;		
		// these 2 variable determine popup's distance from the cursor
		// you might want to adjust to get the right result		
	/* END CONFIG */	
	
	$("a.tooltip").hover(function(e){											  
		this.t = this.title; // get reference to title attribute value
		this.title = ""; // now we have copy of original value we set the attribute to null so it doesn't appear when mousing over the element
		$("body").append("<p id='tooltip'>"+ this.t +"</p>"); // add P element which holds tooltip text
		$("#tooltip")
			.css("top",(e.pageY - xOffset) + "px") // add css value to the new P element
			.css("left",(e.pageX + yOffset) + "px") // add css value to the new P element
			.fadeIn("fast"); // add alpha animation effect
    },
	function(){ // ON MOUSE OUT
		this.title = this.t; // set the attribute value from null to whatever it was originally
		$("#tooltip").remove(); // remove the P tag from the DOM
    });	
	
	$("a.tooltip").mousemove(function(e){ // MOVE TOOLTIP IN LINE WITH THE CURSOR
		$("#tooltip")
			.css("top",(e.pageY - xOffset) + "px")
			.css("left",(e.pageX + yOffset) + "px");
	});			
};

// starting the script on page load
$(document).ready(function(){
	tooltip();
});