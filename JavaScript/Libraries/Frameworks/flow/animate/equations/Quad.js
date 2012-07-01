Q.Quad = {
	i : function(time, begin, change, duration) {
		return change * (time /= duration) * time + begin;
	},
	o : function(time, begin, change, duration) {
		return -change * (time /= duration) * (time - 2) + begin;
	},
	io : function(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) {
			return change / 2 * time * time + begin;
		}
		return -change / 2 * ((--time) * (time - 2) - 1) + begin;
	}
};