Q.Elastic = {
	i : function(time, begin, change, duration, a, p) {
		if (time === 0) {
			return begin;
		}
		if ((time /= duration) == 1) {
			return begin + change;
		}
		if (!p) {
			p = duration * 0.3;
		}
		
		var s;
		if (!a || a < Math.abs(change)) {
			a = change;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(change / a);
		}

		return -(a * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p)) + begin;
	},
	o : function(time, begin, change, duration, a, p) {
		if (time === 0) {
			return begin;
		}
		if ((time /= duration) == 1) {
			return begin + change;
		}
		if (!p) {
			p = duration * 0.3;
		}
		
		var s;
		if (!a || a < Math.abs(change)) {
			a = change;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(change / a);
		}
		
		return (a * Math.pow(2, -10 * time) * Math.sin((time * duration - s) * (2 * Math.PI) / p) + change + begin);
	},
	io : function(time, begin, change, duration, a, p) {
		if (time === 0) {
			return begin;
		}
		if ((time /= duration / 2) == 2) {
			return begin + change;
		}
		if (!p) {
			p = duration * (0.3 * 1.5);
		}
		
		var s;
		if (!a || a < Math.abs(change)) {
			a = change;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin (change / a);
		}
		if (time < 1) {
			return -0.5 * (a * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p)) + begin;
		}
		return a * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p) * 0.5 + change + begin;
	}
};