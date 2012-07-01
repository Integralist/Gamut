var moveElement = function(id, final_x, final_y) {
	var elem, x, y;
	
	if (!(elem = document.getElementById(id))) {
		return false;
	}
	
	x = parseInt(elem.style.left);
	y = parseInt(elem.style.top);
	
	if (x == final_x && y == final_y) {
		return true;
	}
	
	if (x < final_x) {
		x++;
	}
	
	if (y < final_y) {
		y++;
	}
	
	elem.style.left = x + 'px';
	elem.style.top = y + 'px';
	
	window.setTimeout(function() {
		console.log(x, y);
		moveElement(id, final_x, final_y);
	}, 10);
};