/*
*	jQuery Tweet v0.1
*	written by Diego Peralta
*
*	Copyright (c) 2010 Diego Peralta (http://www.bahiastudio.net/)
*	Dual licensed under the MIT (MIT-LICENSE.txt)
*	and GPL (GPL-LICENSE.txt) licenses.
*	Built using jQuery library 
*
*	Options:
*		- container (string): HTML code to hold the tweets
*		- before (string): HTML code before the tweet.
*		- after (string): HTML code after the tweet.
*		- tweets (numeric): number of tweets to display.
*	
*	Example: 
*	
*		<script type="text/javascript" charset="utf-8">
*   		$(document).ready(function() {
*      			$('#tweets').tweets({
*          			tweets:4,
*          			username: "diego_ar"
*      			});
*  			});
*		</script>
*
*	Modified by Mark McDonnell to include 'container' property.
*	Reason being, I wanted to display tweets in a <ul> (as that is the most appropriate/semantic element)
*	But I didn't like the idea of having an empty <ul> element in the page if the twitter service failed to return results.
*	I think it's OK to have an empty element like <div> if that's the case.
*	So I create <div id="..."> as a hook for the initialisation code and then use the 'container' property to insert that element.
*	Then the rest of the script works as before, but now inserts into the new 'container' element and not the element used as the Js hook.
*
*/
(function($){
	$.fn.tweets = function(options) {
		$.ajaxSetup({ cache: true });
		var defaults = {
			tweets: 5,
			container: '<ul id="tweets">',
			before: '<li>',
			after: '</li>'
		};
		var options = $.extend(defaults, options);
		return this.each(function() {
			$(this).append(options.container);
			var obj = $('#tweets')[0];
			$.getJSON('http://search.twitter.com/search.json?callback=?&rpp='+options.tweets+'&q=from:'+options.username,
		        function(data) {
		            $.each(data.results, function(i, tweet) {
		                if(tweet.text !== undefined) {
		                    $(obj).append(options.before + tweet.text + options.after);
		                }
		            });
		        }
		    );
		});
	};
})(jQuery);