<?php require('setStyle.php'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
   <head>
      <title></title>
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <meta http-equiv="content-language" content="en" />
      <meta name="description" content="" />
      <meta name="keywords" content="" />
      <?php
         if (isset($_SESSION['css'])) {
            echo('<link rel="stylesheet" media="screen" href="' . $_SESSION['css'] . '.css" />');
         } else {
            // do nothing
         }
      ?>
   </head>
   <body>
      <ul>
         <li><a href="?size=small">small</a></li>
         <li><a href="?size=medium">medium</a></li>
         <li><a href="?size=large">large</a></li>
      </ul>
      <p>Here is some text</p>
      <ul>
         <li><a href="index.php">Page 1</a></li>
         <li><a href="page2.php">Page 2</a></li>
         <li><a href="page2.php">Page 3</a></li>
      </ul>
   </body>
</html>