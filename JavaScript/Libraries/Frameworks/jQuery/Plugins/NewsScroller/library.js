var Storm = {
	scroller: function() {
		jQuery("#scrollfeed").newsScroll({
			speed: 2000,
			delay: 5000
		});
	},
	init: function(components) {
		if (typeof components == "undefined") {
			components = {};
		}
		(components.scroller) ? this.scroller() : null;
	}
};