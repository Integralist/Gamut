<aside id="aside">
   <form class="box" method="post" action="Post.php">
      <div>
         <h1 class="title">Enquire about this Video <span class="arrow"></span></h1>
         <p>Want to find out more about this video? Call a member of our team on <strong>xxx</strong> or fill in our call-back form below and we'll contact you at a convenient time.</p>
         <textarea name="message"></textarea><span id="speechbubble"></span>
         <table>
            <tbody>
               <tr>
                  <th scope="row"><label for="field-fullname">Name<strong class="mandatory">*</strong></label></th>
                  <td><input type="text" id="field-fullname" name="field-fullname"></td>
               </tr>
               <tr>
                  <th scope="row"><label for="field-email">Email<strong class="mandatory">*</strong></label></th>
                  <td><input type="email" id="field-email" name="field-email"></td>
               </tr>
               <tr>
                  <th scope="row"><label for="field-tel">Phone<strong class="mandatory">*</strong></label></th>
                  <td><input type="tel" id="field-tel" name="field-tel"></td>
               </tr>
               <tr style="position:absolute;left:-999em;">
                  <th scope="row"><label for="tester" style="color:#F00;">IGNORE THIS FIELD!</label></th>
                  <td><input type="text" id="tester" name="tester"></td>
               </tr>
            </tbody>
         </table>
		 <input type="hidden" name="pagename" value="<?php echo $_SERVER['SCRIPT_NAME']; ?>">
		 <?php	
		 	$url = $_SERVER['SCRIPT_NAME']; // returns the directory path back to the root (e.g. /folder/file.php?id=anyQueryStringData)
		 	$file = basename($url, ".php"); // returns just the filename without the .php (unless there is a querystring! then it returns .php with querystring)
		 	echo "<input type='hidden' name='returnpage' value='$file'>";
		 ?>
		 <p id="field-furtherinfo">If you require information via post please tick <input type="checkbox" id="furtherinfo" name="furtherinfo"></p>
         <section id="additional-fields">
            <table>
               <tbody>
                  <tr>
                     <th scope="row"><label for="field-address">Address</label></th>
                     <td><textarea id="field-address" name="field-address"></textarea></td>
                  </tr>
                  <tr>
                     <th scope="row"><label for="field-postcode">Postcode</label></th>
                     <td><input type="email" id="field-postcode" name="field-postcode"></td>
                  </tr>
               </tbody>
            </table>
         </section>
         <input type="image" src="<?php echo ROOT; ?>Assets/Images/Healthcare/button-submit.png" alt="Submit" name="submit">
      </div>
   </form>
</aside>