require(['replaceAccents', 'stripHtmlTags'], function(replaceAccents, stripHtmlTags){
	
	console.group('replaceAccents');
		console.log('spéçïãl çhârs = ', replaceAccents('spéçïãl çhârs')); // "special chars"
	console.groupEnd();
	
	console.group('stripHtmlTags');
		console.log('<p><em>lorem</em> <strong>ipsum</strong></p> = ', stripHtmlTags('<p><em>lorem</em> <strong>ipsum</strong></p>')); // "lorem ipsum"
	console.groupEnd();
	
});