<%@LANGUAGE="VBSCRIPT"%>
<% option explicit
Response.Buffer = True
Response.Expires = -1500
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>read cookies</title>
</head>
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
	
    <%
		Dim strCookie
		strCookie = Request.Cookies("myWebsite")("fontSize")
		Response.Write("strCookie = " & strCookie)
	%>
    
    <br><br>
    <a href="delete.asp">click here to delete all cookies</a>
    
</body>
</html>
