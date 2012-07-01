(function($){
	var initLayout = function() {
		var hash = window.location.hash.replace('#', '');
		var currentTab = $('ul.navigationTabs a')
							.bind('click', showTab)
							.filter('a[rel=' + hash + ']');
		if (currentTab.size() == 0) {
			currentTab = $('ul.navigationTabs a:first');
		}
		showTab.apply(currentTab.get(0));
		
		// There needs to be an instance of DatePicker before using 'addDays' method
		// That's because datepicker.js extends the Date object but only after instantiating DatePicker() 
		// This is terrible design, as I have to instantiate for no reason other than being able to use addDays method?
		$('#non-existent-element').DatePicker();
		
		var now = new Date();
		  //now.addDays(-1); // minus 1 to show current day
		
		var end = new Date();
			end.addDays(45);
		
		var markDate = new Date(),
			markDay = markDate.getDate(),
			markMonth = (markDate.getMonth()+1 < 10) ? "0" + (markDate.getMonth()+1) : markDate.getMonth()+1,
			markYear = markDate.getFullYear(),
			markToday = markYear + '-' + markMonth + '-' + markDay;
		
		var inputWrapper = $('#date'),
			input = inputWrapper[0].getElementsByTagName('input')[0];
			input.style.display = 'none';
			
		inputWrapper.DatePicker({
			flat: true,
			date: now, // ['2012-04-12']
			format: 'Y-m-d',
			calendars: 2,
			mode: 'single',
			onRender: function(date) {
				return {
					disabled: (date.valueOf() < now.valueOf()),
					disabled2: (date.valueOf() > end.valueOf()) // had to add another conditional to datepicker.js to set a range
				}
			},
			onChange: function(formated, dates) {
				input.value = formated;
			}
		});
			
	};
	
	var showTab = function(e) {
		var tabIndex = $('ul.navigationTabs a')
							.removeClass('active')
							.index(this);
		$(this)
			.addClass('active')
			.blur();
		$('div.tab')
			.hide()
				.eq(tabIndex)
				.show();
	};
	
	EYE.register(initLayout, 'init');
})(jQuery)