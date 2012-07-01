function canDrink(age) {
	if (typeof age != 'number') {
		age = parseInt(age);
	}
	return (age >= 18) ? true : false;
}