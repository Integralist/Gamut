<?php
    if ($_SERVER['HTTP_HOST'] === 'localhost') {
        define('ROOT', '/client-folder');
    } else {
        define('ROOT', '');
    }
?>

<?php require '../Assets/Includes/Config.php'; ?>
<?php require $_SERVER['DOCUMENT_ROOT'].ROOT.'/Assets/Includes/GZIP.php'; ?>