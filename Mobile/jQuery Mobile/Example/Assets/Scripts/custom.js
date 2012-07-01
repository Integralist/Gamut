// 'pagecreate': triggered when the page has been created in the DOM (via ajax or other) 
// but before all widgets have had an opportunity to enhance the contained markup.
$(document).bind('pagecreate', function(event){

	// iOS bug (currently effects up to version 5.0) means page doesn't re-scale properly on orientation change
	// The following browser sniff (FUGLY!) and corresponding event handler resolves the issue.
	
	var meta_tag = $('meta[name="viewport"]'),
		ua = navigator.userAgent;
		
	function handler() {
		meta_tag.attr('content', 'width=device-width, minimum-scale=0.25, maximum-scale=1.6');
	}
	
	if (/iPad/i.test(ua) || /iPhone/i.test(ua) || /iPod/i.test(ua)) {
		meta_tag.attr('content', 'width=device-width, minimum-scale=1.0, maximum-scale=1.0');
		$('body')[0].addEventListener('gesturestart', handler, false);
	}
	
});

/*
	Can't load individual script tags per page, so have to check the current page and lazy-load scripts
*/
$(document).bind('pagechange', function(event){

	var pages = $('div[data-role="page"]'),
		currentPage = pages[pages.length-1],
		attr = currentPage.getAttribute('data-url');
	
	if (attr.indexOf('home.html') !== -1) {
		insertScript('search', currentPage);
	}
	
	if (attr.indexOf('profile.html') !== -1) {
		insertScript('profile', currentPage);
	}
	
});

function insertScript(script, container) {
	var elem = document.createElement('script');
	elem.type = 'text/javascript';
	elem.src = 'Assets/Scripts/' + script + '.js';
	container.appendChild(elem);
}