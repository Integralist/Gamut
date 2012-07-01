<?php
	##############
	# set arrays #
	##############
	
	// indexed arrays
		$name[0] = 'mark mcdonnell';
		$name[1] = 'x x';
		$name[2] = 'y y';
		$name[3] = 'z z';
		
	// associative array
		$book['title'] = 'PHP Solutions: Dynamic Web Design Made Easy';
		$book['author'] = 'David Powers';
		$book['publisher'] = 'friends of ED';
		$book['ISBN'] = '1-59059-731-1';
		
	// multidimensional array
		$mixture= array(
			/* $mixture[0] */ array('width' => '5px', 'height' => '105px'),
			/* $mixture[1] */ array('width' => '10px', 'height' => '110px'),
			/* $mixture[2] */ array('width' => '15px', 'height' => '115px')
		);
		
	// superglobal arrays
		/*
			$_POST: this contains values sent through the post method.
			$_GET: This contains values sent through the URL query string.
			$_SERVER: This contains information stored by the web server (such as filename, pathname, hostname).
			$_FILES: This contains details of file uploads.
			$_SESSION: This stores information that you want to preserve so that its available to other pages.
			
			Remember that PHP is case-sensitive so UPPERCASE is used for superglobal arrays
		*/
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" type="text/css" href="/php/Assets/Styles/Import.css" media="screen">
<script type="text/javascript" src="/php/Assets/Scripts/Functions.js"></script>
<title>php. arrays</title>
</head>
<body>

	<h1>Arrays</h1>
	
	<p>
		The below PHP arrays are both 'indexed' and 'associative' arrays.
	</p>
	
	<em>Indexed array:</em><br>
	<dl style="margin-top: 0px;">
		<dt><strong>Names:</strong></dt>
		<dd><?php echo($name[0]); ?></dd>
		<dd><?php echo($name[1]); ?></dd>
		<dd><?php echo($name[2]); ?></dd>
		<dd><?php echo($name[3]); ?></dd>
	</dl>
	
	<em>Associative array:</em><br>
	<dl style="margin-top: 0px;">
		<dt><strong>Book Details:</strong></dt>
		<dd><?php echo($book['title']); ?></dd>
		<dd><?php echo($book['author']); ?></dd>
		<dd><?php echo($book['publisher']); ?></dd>
		<dd><?php echo($book['ISBN']); ?></dd>
	</dl>
	
	<hr>
	
	<p>
		The below array is a multidimensional array.
	</p>
	<p>
		The below example code:
		<br><br>
		
		<code>
			echo('0 width = ' . $mixture[0]['width'] . '&lt;br&gt;&lt;br&gt;');
			<br>
			echo('0 height = ' . $mixture[0]['height'] . '&lt;br&gt;&lt;br&gt;');
		</code>
	</p>
	<p>
		<?php
			echo('0 width = ' . $mixture[0]['width'] . '<br>');
			echo('0 height = ' . $mixture[0]['height'] . '<br><br>');
			
			echo('1 width = ' . $mixture[1]['width'] . '<br>');
			echo('1 height = ' . $mixture[1]['height'] . '<br><br>');
			
			echo('2 width = ' . $mixture[2]['width'] . '<br>');
			echo('2 height = ' . $mixture[2]['height']);
		?>
	</p>
	
	<hr>
	
	<h1>Multidimensional associated arrays:</h1>
	<p>
		<code>
			$books = array(array('title' => 'xxx', 'author' => 'aaa'),array('title' => 'yyyy', 'author' => 'bbbb'));
		</code>
	</p>
	<?php
		$books = array(
			array(
				'title' => 'abc',
				'author' => 'def'
				),
			array(
				'title' => 'xyz',
				'author' => '123'
				)
		);
	?>
	<ul>
		<li><?php echo('<strong>Author:</strong> ' . $books[1]['author']); ?></li>
		<li><?php echo('<strong>Title:</strong> ' . $books[1]['title']); ?></li>
	</ul>
	
	<ul>
		<li><?php echo('<strong>Author:</strong> ' . $books[0]['author']); ?></li>
		<li><?php echo('<strong>Title:</strong> ' . $books[0]['title']); ?></li>
	</ul>
	
	<hr>
	
	<p>
		Use <code>print_r()</code> to inspect an array (REMEMBER THAT <code>var_dump($arrayName);</code> gives you far more information on the data in the Array). Never use <code>print()</code> or <code>echo()</code>
	</p>
	<p>
		<code>print_r($books);</code>
	</p>
	<p>
		<?php print_r($books); ?>
	</p>
	<p>
		In the source code the PHP prints the books array as follows:
	</p>
	<p>
		<code>
			Array
			<br>
			(
			<br>
				[0] => Array
			<br>
					(
			<br>
						[title] => abc
			<br>
						[author] => def
			<br>
					)
			<br>
			<br>			
				[1] => Array
			<br>
					(
			<br>
						[title] => xyz
			<br>
						[author] => 123
			<br>
					)
			<br>
			<br>
			)
		</code>
	</p>
	
	<hr>
	
	<h1>foreach loops:</h1>
	<p>
		<code>
			foreach($newbooks as $key => $value)
			<br>
			{
			<br>
				echo("The value of $key is $value &lt;br&gt;");
			<br>
			}
		</code>
	</p>
	<?php
		$newbooks['Author'] = 'xyz';
		$newbooks['Title'] = '...';
		$newbooks['Published'] = 1995;
		
		foreach($newbooks as $key => $value)
		{
			// notice the use of double quotes which 'display' variables! Saves time with concatenation of single quotes and varaibles.
				echo("The value of <strong>$key</strong> is <strong>$value</strong><br>");
		}
	?>

</body>
</html>
