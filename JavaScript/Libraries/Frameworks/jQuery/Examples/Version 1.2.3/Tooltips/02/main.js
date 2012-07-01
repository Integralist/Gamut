/*
 * Image preview script 
 * powered by jQuery (http://www.jquery.com)
 * 
 * written by Alen Grakalic (http://cssglobe.com)
 * 
 * for more info visit http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery
 *
 */
 
this.imagePreview = function()
{	
	/* CONFIG */		
		xOffset = 10;
		yOffset = 30;		
		// these 2 variable determine popup's distance from the cursor
		// you might want to adjust to get the right result		
	/* END CONFIG */
	
	$("a.preview").hover(function(e){
		this.t = this.title;
		this.title = "";	
		var c = (this.t != "") ? "<br/>" + this.t : ""; // if there is no title then dont add extra line break or try and display a tool tip under the photo
		$("body").append("<p id='preview'><img src='"+ this.href +"' alt='Image preview' />"+ c +"</p>"); // add image and tool tip under it							 
		$("#preview")
			.css("top",(e.pageY - xOffset) + "px") // add css style
			.css("left",(e.pageX + yOffset) + "px") // add css style
			.fadeIn("fast"); // fade in photo
    },
	function(){ // ON MOUSE OUT
		this.title = this.t; // reset title attribute value
		$("#preview").remove(); // remove photo from DOM
    });
	
	$("a.preview").mousemove(function(e){ // MOVE PHOTO WITH USERS CURSOR
		$("#preview")
			.css("top",(e.pageY - xOffset) + "px")
			.css("left",(e.pageX + yOffset) + "px");
	});			
};

// Start the script on page load
$(document).ready(function(){
	imagePreview();
});