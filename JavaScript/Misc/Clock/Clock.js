// this clock requires jQuery

clock: function()
{
	$('.header').html('<p class="datetime"></p>');
	
	setInterval(time,"1000");
	
	var today = new Date();
	var day = today.getDay();
	var date = today.getDate();
	var month = today.getMonth();
	var year = today.getFullYear();
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var string = weekday[day] + " " + date + " " + months[month] + " " + year;
	
	function time()
	{
		var localtoday = new Date();
		var hours = localtoday.getHours();
		var minutes = localtoday.getMinutes();
		
		if ( hours > 12 ) { hours = hours - 12; }
		if ( minutes < 10 ) { minutes = "0" + minutes; }
		
		var time = hours + ":" + minutes;
		$('.datetime').html(time + "&nbsp;&nbsp;&nbsp;" + string);
	}
}