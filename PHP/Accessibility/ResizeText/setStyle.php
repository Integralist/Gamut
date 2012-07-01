<?php
   // start a session immediately
   session_start();

   // see if the user has requested the text size be changed
   if ($_GET['size']) {
      switch ($_GET['size']) {
         case 'small':
            $_SESSION['css'] = 'small';
            break;
         
         case 'medium':
            $_SESSION['css'] = 'medium';
            break;
         
         case 'large':
            $_SESSION['css'] = 'large';
            break;
         default:
            // an invalid value was set
      }
   } else {
      // no 'size' variable found in QueryString
   }
?>
