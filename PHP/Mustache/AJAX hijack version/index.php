<!doctype html>
<html dir="ltr" lang="en">
<head>
	<title>Mustache.php</title>
   <meta charset="utf-8">
   <link rel="stylesheet" href="Styles.css">
</head>
<body>
	<p id="link"><a href="Winner.php">Click here to view Winner</a></p>
	<div id="loadingArea">
		<div id="error"></div>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
	<script type="text/javascript">
		jQuery(function(){
			// Hijack the link to the 'Winner' page
			jQuery('#link').bind('click', function(e){
				// Prevent the link from processing it's default action of following the URL
				e.preventDefault();
				
				// Display the compiled data
				jQuery('#loadingArea').load('Winner.php #content', function(response, status, xhr) {
					if (status == "error") {
						var msg = "Sorry but there was an error: ";
						jQuery("#error").html(msg + xhr.status + " " + xhr.statusText);
					}
				});
			});
		});
	</script>
</body>
</html>