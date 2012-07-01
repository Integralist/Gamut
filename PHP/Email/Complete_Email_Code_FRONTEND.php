<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>

	<?php
		if (isset($_GET['status'])) {
			if ($_GET['status'] === 'success') {
	?>
			<h1>Thank you</h1>
			<p>Your details have been received successfully and we will hope to reply within 24 hours, Monday to Friday.</p>
	<?php
			} elseif ($_GET['status'] === 'fail') {
	?>
				<h1>Sorry&hellip;</h1>
				<p class="failure">There was a problem submitting your details.</p>
	<?php
				if (isset($_GET['reason'])) {
					switch ($_GET['reason']) {
						case 'spambot':
	?>
							<p class="failure">It appears you have filled in our spambot protection field which should have been left empty.</p>
	<?php
							break;
						case 'fullname':
	?>
							<p class="failure">It appears you have not entered your name.</p>
	<?php
							break;
						case 'email':
	?>
							<p class="failure">It appears you have not entered a valid email address.</p>
	<?php
							break;
					}
				} else {
					?>
						<p>Please try again later.</p>
					<?php
				}
			}
		} else {
	?>
			<h1>Enquiry form&hellip;</h1>
			<form action="Post.php" method="post">
				<ul>
					<li title="Name" id="fullname"><input type="text" name="fullname" /></li>
					<li title="Email" id="email"><input type="text" name="email" /></li>
					<li title="Contact Telephone Number" id="telephone"><input type="text" name="telephone" /></li>
					<li title="Where did you hear about us?" id="hear"><input type="text" name="hear" /></li>
					<li title="How can we help you" id="message"><textarea name="message"></textarea></li>
				</ul>
				<p class="spambot"><input type="text" name="tester" value="" /></p>
				<p><input type="submit" name="submit" value="submit" /></p>
			</form>
	<?php
		}
	?>	

</body>
</html>