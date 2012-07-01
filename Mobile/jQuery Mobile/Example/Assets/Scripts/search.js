var filterContainer = $('#home-search-filter'),
	filterUL = filterContainer.find('ul')[0];

function getUsers(self) {
	$.mobile.showPageLoadingMsg();
	return $.ajax({ url: 'search.html' });
}

function filterHandler() {
	getUsers().then(function(response){
		filterContainer.off('focus', 'input', filterHandler);
		$(filterUL).html(response);
		$.mobile.hidePageLoadingMsg();
		$(filterUL).listview('refresh');
	}, function(){
		console.log('failure');
	});
}
	
filterContainer.on('focus', 'input', filterHandler);