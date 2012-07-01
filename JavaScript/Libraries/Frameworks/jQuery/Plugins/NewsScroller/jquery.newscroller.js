(function($) {

	$.fn.newsScroll = function(options) {
		
		// For each item in the wrapped set, perform the following. 
		return this.each(function() {	
		  
		  	// Caches this - or the ul widget(s) that was passed in.
			var self = $(this);
			
			// Default configuration if no user settings supplied. 
			var defaults = {
				speed: 400,
				delay: 3000,
				list_item_height: self.children('li').outerHeight()
			};
			
			// Create a new object that merges the defaults and the user's "options" (the latter takes precedence).
			var settings = $.extend({}, defaults, options);
			 
			// This sets an interval that will be called continuously.
			window.setInterval(function() {
			
				// Get the very first list item in the wrapped set.
				self.children('li:first')
					.animate({ 
						marginTop : '-' + settings.list_item_height, // Shift this first item upwards.
						opacity: 'hide' }, // Fade the li out.
							
						// Over the course of however long is 
						// passed in. (settings.speed)
						settings.speed, 
							
						// When complete, run a callback function.
						function() {
													
							// Get that first list item again. 
							self.children('li:first')
								.appendTo(self) // Move it the very bottom of the ul.
									  
								// Reset its margin top back to 0. 
								// Otherwise, it will still contain the negative value that we set earlier.
								.css('marginTop', 0) 
								.fadeIn(300); // Fade in back in.
								
						}
					);
				}, settings.delay);
		});
	};

}(jQuery));