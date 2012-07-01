Q.Sine = {
	i : function(time, begin, change, duration) {
		return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
	},
	o : function(time, begin, change, duration) {
		return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
	},
	io : function(time, begin, change, duration) {
		return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
	}
};