<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
   <head>
      <title></title>
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <meta http-equiv="content-language" content="en" />
   </head>
   <body>
      <?php
         require 'Class.Gallery.php';
         $gallery = new Gallery('images', 3, array('gif','jpg','png'));
         $gallery->display();
      ?>
   </body>
</html>