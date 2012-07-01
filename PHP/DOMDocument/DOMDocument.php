<?php
	define ('NUMBER_OF_RECORDS', 2);
	
	$file = 'http://twitter.com/statuses/user_timeline/18293449.rss';
	
	// check the id querystring exists and make sure it is just a numeric value
	if( isset($_GET['id']) && is_numeric($_GET['id']) ) {
		// the 'start' variable makes sure the loop starts at the correct record
		$start = $_GET['id'];
	} else {
		$start = 0;
	}
	
	// the 'end' variable makes sure the loop stops at the correct record
	$end = $start + 1;
	
	try {
		$doc = new DOMDocument();
		
		// check there isn't a problem loading the file (will return true if OK and false if failure)
		if(!$doc->load( $file )) {
			throw new Exception('<p>Apologies, I\'m just making some technical updates.</p><p>Check back shortly!</p><p>M.</p>');
		} 
		
		$list = $doc->getElementsByTagName( "item" );
		
		// find the total number of 'tweets'
		$length = $list->length;
		
		// find the total number of 'pages'
		$pages = round($length / NUMBER_OF_RECORDS);
	
		// determines current page in pagination set
		$current = 1;
		
		// this will be used to control the foreach loop and which records are displayed
		$currentIteration = -1;
		
		foreach( $list as $elem ) 
		{
			$currentIteration++;
			
			// make sure the loop doesn't display more records that we want
			if ($currentIteration < $start) {
				continue;
			} elseif ($currentIteration > $end) {
				$next = $end + 1;
				break;
			}
			
			// get the details from the RSS feed and display as necessary...
			$descriptions = $elem->getElementsByTagName( "description" );
			$description = $descriptions->item(0)->nodeValue;
			
			$pubDates = $elem->getElementsByTagName( "pubDate" );
			$pubDate = $pubDates->item(0)->nodeValue;
			
			$links = $elem->getElementsByTagName( "link" );
			$link = $links->item(0)->nodeValue;
			
			echo('<span class="twitter"><p class="intro">' . substr($description, 13) . '</p>');
			echo('<p>' . substr($pubDate, 0, strrpos($pubDate, ":")) . '<br><a href="' . $link . '" rel="external">' . $link . '</a></p></span>');
			echo('<img src="Assets/Images/Twitter-BoxBottom.png" alt="" class="twitter">');
		}
		
		// set the value for the 'prev' link
		$prev = $_GET['id'] - NUMBER_OF_RECORDS;
		
		// if there are no more records to go through then reset the 'next' link
		if(!$next) {
			$next = 0;
		}
		
		// if there are no prev records to go through then reset the 'prev' link to the last page
		if($prev < 0) {
			$prev = $length - 1;
		}
		
		// create the pagination system
		echo('<ul class="pagination">');
		echo('<li><a href="index.php?id=' . $prev . '">BACK</a></li>');
		echo('<li class="number">Page ' . $current . ' of ' . $pages . '</li>');
		echo('<li><a href="index.php?id=' . $next . '">NEXT</a></li></ul>');
		echo('</ul>');
	} catch( Exception $e ) {
		echo( $e->getMessage() );
		
		// send an email to the administrator to let them know an error occurred
		mail('email@domain.com', 'Subject: Website Error', $e->getMessage(), 'From: test@test.com');
	}
?>