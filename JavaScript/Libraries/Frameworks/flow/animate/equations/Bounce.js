Q.Bounce = function() {
	var proto = Flow.Animate;
	return {
		o : function(time, begin, change, duration) {
			if ((time /= duration) < (1 / 2.75)) {
				return change * (7.5625 * time * time) + begin;
			} else if (time < (2 / 2.75)) {
				return change * (7.5625 * (time -= (1.5 / 2.75)) * time + 0.75) + begin;
			} else if (time < (2.5 / 2.75)) {
				return change * (7.5625 * (time -= (2.25 / 2.75)) * time + 0.9375) + begin;
			} else {
				return change * (7.5625 * (time -= (2.625 / 2.75)) * time + 0.984375) + begin;
			}
		},
		i : function(time, begin, change, duration) {
			var that = (this.o) ? this : proto.equations.Bounce;
			return change - that.o(duration - time, 0, change, duration) + begin;
		},
		io : function(time, begin, change, duration) {
			var that = proto.equations.Bounce;
			if (time < duration / 2) {
				return that.i(time * 2, 0, change, duration) * 0.5 + begin;
			} else {
				return that.o(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
			}
		}
	};
}();