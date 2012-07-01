/**
* Skeleton: a jQuery Plugin
* @author: Trevor Morris (trovster)
* @url: http://www.trovster.com/lab/code/plugins/jquery.skeleton.js
* @documentation: http://www.trovster.com/lab/plugins/skeleton/
* @published: 11/09/2008
* @updated: 29/09/2008
*
* @notes: 
* Convention *I* use:
*  - $var is a jQuery object
*  - Quote key/value pairs
*  - Use o['key'] syntax when reading key/value
*/
if(typeof jQuery != 'undefined') {
	jQuery(function($) {
		// $.fn is an old (pre version 1 of jQuery) coding paradigm which was changed to map to prototype to prevent old plugins breaking
		$.prototype.extend({
			skeleton: function(options) {
				var settings = $.extend({}, $.fn.skeleton.defaults, options);
			
				return this.each(
					function() {
						if($.fn.jquery < '1.2.6') {return;}
						var $t = $(this);
						var o = $.metadata ? $.extend({}, settings, $t.metadata()) : settings;
						
						/**
						* Start your Plugin Here…
						*/
					}
				);
			}
		});
		
		/**
		* Set your Plugin Defaults Here…
		*/
		$.fn.skeleton.defaults = {};
	});
}