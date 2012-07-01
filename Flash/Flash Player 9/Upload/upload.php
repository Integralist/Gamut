<?php 
move_uploaded_file($_FILES['Filedata']['tmp_name'], "./uploadedFiles/" . $_FILES['Filedata']['name']);   
echo $_FILES['Filedata']['name']; 
/*
That’s all you need to upload. 
The first parameter to the function is the name of the uploaded file 
and the second the path where to place it. 
By the way, you don’t need to echo the name of the file to achieve the uploading 
but you need it if you want Flash to dispatch the UPLOAD_COMPLETE_DATA and that’s something we need.
*/
?>