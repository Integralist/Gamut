<?php
    // Get data
    $data = $_POST['imgdata'];

    // Remove the "data:image/png;base64," part
    $uri =  substr($data, strpos($data, ",") + 1);
    
    // Save the file to the machine (try to make it unique)
    file_put_contents("./Generated/card-" . mt_rand() . ".png", base64_decode($uri));
?>