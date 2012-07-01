<?php 
	/**
	 * http://www.php.net/manual/en/class.domdocument.php#domdocument.props.formatoutput
	 */
	 
	$doc = new DOMDocument();
	$doc->load( 'http://twitter.com/statuses/user_timeline/18293449.rss' );
	
	$list = $doc->getElementsByTagName( "item" );
	
	foreach( $list as $elem ) {
		$descriptions = $elem->getElementsByTagName( "description" );
		$description = $descriptions->item(0)->nodeValue;
		
		$pubDates = $elem->getElementsByTagName( "pubDate" );
		$pubDate = $pubDates->item(0)->nodeValue;
		
		$links = $elem->getElementsByTagName( "link" );
		$link = $links->item(0)->nodeValue;
		
		echo "$description <br> $pubDate <br> <a href='$link'>$link</a> <br><br>";
	}
?>