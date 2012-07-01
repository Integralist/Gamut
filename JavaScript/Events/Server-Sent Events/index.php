<?php session_start() ?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
        <title>Server-Sent Events</title>
    </head>

    <body>
    	<?php echo 'Your ID: ' . session_id() ?>
    	<div id="stream">
        	
        </div>
		<script>
            var source = new EventSource('updates.php');
            source.onmessage = function (event) {
				var stream = document.getElementById("stream"),
					data = event.data.split("\n").join(", ");
				
				
				stream.innerHTML+= '<p>'+data+'</p>';
            }
        </script>
    </body>
</html>
