<?php
$passwordFromDatabase = 'hello, this will be encrypted';
$sentPassword = $_GET['encryptedData'];

if ( $sentPassword === sha1( $passwordFromDatabase ) )
{
    echo( "the encryption matched! <br>" );
	echo( $sentPassword );
    exit;
}
else
{
	echo( "something doesn't match up?" );
}
?>