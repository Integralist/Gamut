Q.Back = {
	i : function(time, begin, change, duration) {
		if (s == undefined) {
			var s = 1.70158;
		}
		return change * (time /= duration) * time * ((s + 1) * time - s) + begin;
	},
	o : function(time, begin, change, duration) {
		if (s == undefined) {
			var s = 1.70158;
		}
		return change * ((time = time / duration - 1) * time * ((s + 1) * time + s) + 1) + begin;
	},
	io : function(time, begin, change, duration) {
		if (s == undefined) {
			var s = 1.70158;
		}
		if ((time /= duration / 2) < 1) {
			return change / 2 * (time * time * (((s *= (1.525)) + 1) * time - s)) + begin;
		}
		return change / 2 * ((time -= 2) * time * (((s *= (1.525)) + 1) * time + s) + 2) + begin;
	}
};