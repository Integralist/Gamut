Q.Circ = {
	i : function(time, begin, change, duration) {
		return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + begin;
	},
	o : function(time, begin, change, duration) {
		return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
	},
	io : function(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) {
			return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
		}
		return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
	}
};