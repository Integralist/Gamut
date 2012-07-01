var moveElement = function(id, final_x, final_y) {
	var elem, x, y, distance, easing;
	
	if (!(elem = document.getElementById(id))) {
		return false;
	}
	
	x = parseInt(elem.style.left);
	y = parseInt(elem.style.top);
	easing = 20;
	
	if (x == final_x && y == final_y) {
		return true;
	}
	
	if (x < final_x) {
		// one-tenth fraction, which we round up to be safe (e.g. when the distance between x and final_x is less than 10!)
		// this will be used as a way to mimic a very basic 'easing' movement
		distance = Math.ceil((final_x - x)/easing);
		x += distance;
	}
	
	if (x > final_x) {
		// if x is greater than final_x then the distance to travel is calculated 
		// and then subtracted from x to bring the element closer to its final destination
		distance = Math.ceil((x - final_x)/easing);
		x -= distance;
	}
	
	if (y < final_y) {
		distance = Math.ceil((final_y - y)/easing);
		y += distance;
	}
	
	if (y > final_y) {
		distance = Math.ceil((y - final_y)/easing);
		y -= distance;
	}
	
	elem.style.left = x + 'px';
	elem.style.top = y + 'px';
	
	window.setTimeout(function() {
		console.log(x, y);
		moveElement(id, final_x, final_y);
	}, 10);
};