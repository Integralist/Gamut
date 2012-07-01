Q.Expo = {
	i : function(time, begin, change, duration) {
		return (time === 0) ? begin : change * Math.pow(2, 10 * (time / duration - 1)) + begin;
	},
	o : function(time, begin, change, duration) {
		return (time == duration) ? begin + change : change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
	},
	io : function(time, begin, change, duration) {
		if (time === 0) {
			return begin;
		}
		if (time == duration) {
			return begin + change;
		}
		if ((time /= duration / 2) < 1) {
			return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
		}
		return change / 2 * (-Math.pow(2, -10 * --time) + 2) + begin;
	}
};