<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Flash Deep Linking</title>
<script type="text/javascript">
	function changeURL(url)
	{
		document.location.href = "http://localhost/code/Flash/Deep%20Linking/deeplinking.php?section=" + url;
	}
</script>
</head>
<body>

	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="300" height="300">
        <param name="movie" value="DeepLinking.swf">
        <param name="menu" value="false">
        <param name="wmode" value="opaque">
        <param name="flashvars" value="<?php echo($_GET['section']) ?>">
            <!--[if !IE]>-->
                <object menu="false" flashvars="section=<?php echo($_GET['section']) ?>" wmode="opaque" type="application/x-shockwave-flash" data="DeepLinking.swf" width="300" height="300">
            <!--<![endif]-->
                    MY ALTERNATIVE CONTENT
            <!--[if !IE]>-->
                </object>
            <!--<![endif]-->
    </object>

</body>
</html>
