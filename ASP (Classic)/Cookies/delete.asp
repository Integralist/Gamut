<%@ LANGUAGE="VBSCRIPT" %>
<% option explicit
Response.Buffer = True
Response.Expires = -1500

Dim strCookies
For Each strCookies in Request.Cookies()
	Response.Cookies(strCookies).Expires = Date - 1
Next

Response.Write(Request.Cookies())
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Untitled</title>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
	
    <br><br>
    <a href="write.asp">all cookies have been deleted, please click here to re-write them</a>
    
</body>
</html>
