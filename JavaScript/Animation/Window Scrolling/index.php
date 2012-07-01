<!doctype html>
<!-- Explanation: http://www.phpied.com/conditional-comments-block-downloads/ -->
<!--[if IE]><![endif]-->
<html dir="ltr" lang="en">
<head>
	<title></title>
   <meta charset="utf-8">
   <meta name="description" content="" />
   <meta name="author" content="Storm Creative" />
   <!--[if lte IE 8]>
   <script src="Assets/Scripts/html5.min.js"></script>
   <![endif]-->
   <link rel="stylesheet" href="Assets/Styles/layout.css" />
	<link rel="stylesheet" media="screen and (-webkit-min-device-pixel-ratio:0)" href="Assets/Styles/webkit.css" />
	<!--[if IE]>
	<link rel="stylesheet" href="Assets/Styles/IE.css" />
   <![endif]-->
	<!--[if IE 9]>
	<link rel="stylesheet" href="Assets/Styles/IE9.css" />
   <![endif]-->
   <!--[if IE 8]>
	<link rel="stylesheet" href="Assets/Styles/IE8.css" />
   <![endif]-->
   <!--[if IE 7]>
	<link rel="stylesheet" href="Assets/Styles/IE7.css" />
   <![endif]-->
</head>
<?php flush(); ?>
<body>
	<?php require 'Assets/Includes/IE6.php'; ?>    
   <div id="container">
		<span id="speakers"></span>
		<span id="girls"></span>
		<span id="logo"></span>
		<span id="launch"></span>
		<div id="buttons">
			<span title="Sign up"></span>
			<span title="Contact us"></span>			
			<form id="signup" data-id="signup">
				<input placeholder="Email Address">
				<input placeholder="Password (min 6 letters)" type="password">
				<input type="image" src="Assets/Images/Buttons/sign-up.png">
			</form>
			<form id="contactus" data-id="contactus">
				<input placeholder="Name">
				<input placeholder="Email Address">
				<input type="image" src="Assets/Images/Buttons/send-msg.png">
				<textarea placeholder="Message"></textarea>
			</form>
		</div>
   </div>
   <div id="reasons">
   	<span title="Five Reasons to Love the Lick!"></span>
   	<article>
   		<span></span>
   		
   		<div class="venue">
	   		<span class="right"></span>
	   		<h1>Title</h1>
	   		<p>Text</p>
   		</div>
   		
   		<div class="social">
	   		<span class="left"></span>
	   		<h2>Get social&hellip;</h2>
	   		<p>Want to plan your next night out? - You can on Company! Find out who’s going where and why. Chat online through our slick new interface with all the tools you need at the click of a button. You can even create your own pages and share videos, pictures and audio with your friends.</p>
   		</div>
			
			<div class="offers">
	   		<span class="right"></span>
	   		<h3>The best offers on the move&hellip;</h3>
	   		<p>Company is packed with offers from all your favourite venues. From VIP entry into clubs, to drinks deals in bars, there’s the perfect offer for every night out. And if you’re on the move and want to find where to go, you can, with all the info and promotions delivered straight to your phone via our mobile site or one of our apps.</p>
   		</div>
   		
   		<div class="gallery">
	   		<span class="left"></span>
	   		<h4>Company gallery&hellip;</h4>
	   		<p>Missed out on a big night? Or do you simply want to be reminded of how good yours was? Our galleries are packed with the coolest photos and videos from the hottest nights out.</p>
   		</div>
   		
   		<div class="comps">
	   		<span class="right"></span>
	   		<h5>Competitions&hellip;</h5>
	   		<p>Company has something for everyone. With prizes ranging from rubber ducks through to holidays abroad. And if that’s not your thing then why not give your friends a lift to your local venue in one of the brand new cars we have to giveaway.</p>
   		</div>
   	</article>
   	
   	<span id="boxBottom"></span>
   	<ul id="socials">
   		<li><a href="http://www.facebook.com/Company" title="Facebook">Facebook</a></li>
   		<li><a href="http://twitter.com/Company" title="Twitter">Twitter</a></li>
   		<li><a href="http://www.myspace.com/Company" title="MySpace">MySpace</a></li>
   	</ul>
   </div>
   <?php flush(); ?>
   <!-- LABjs allows loading other scripts in parallel (without blocking) by inserting script tags dynamically -->
   <script src="Assets/Scripts/LAB.js"></script>
   <script>
		$LAB
		.setOptions({ AlwaysPreserveOrder:true, BasePath:'Assets/Scripts/' })
			.script('Standardizer.js')
			.script('library.js').wait(function(){ Storm.init(); });
   </script>
</body>
</html>
