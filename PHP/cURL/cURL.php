<?php
    $curl_handle = curl_init();
    curl_setopt($curl_handle, CURLOPT_URL, 'http://www.domain.com/');
    curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2); // if the requested file takes longer than 2 seconds then timeout
    curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1); // if nothing returned then display a message
    //curl_exec($curl_handle);
    $buffer = curl_exec($curl_handle); // now we are using 'CURLOPT_RETURNTRANSFER' we'll store the returned data (e.g. the HTML code from the requested URL) in a variable
    curl_close($curl_handle);

    if (empty($buffer)) {
        echo('this is a message that gets shown when nothing is returned');
    } else {
        echo($buffer);
    }
?>