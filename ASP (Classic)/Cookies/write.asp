<%@LANGUAGE="VBSCRIPT"%>
<% option explicit
Response.Buffer = True
Response.Expires = -1500

Response.Cookies("myWebsite")("fontSize") = "this is my font size setting"
Response.Cookies("myWebsite").Expires = DateAdd("d", 365, now)
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>write cookies</title>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
	
    <a href="read.asp">a cookie has been set, click here to read it</a>
    
</body>
</html>
