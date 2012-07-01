<%@LANGUAGE="VBSCRIPT"%>
<% option explicit
Response.Buffer = True
Response.Expires = -1500

Dim strCookie
strCookie = Request.Cookies("settings")("fontSize")

response.Write("is this cookie a numerical value = " & IsNumeric(strCookie) & "<br>")
response.Write("character length of cookie = " & len(strCookie) & "<br>")
response.Write("cookie value = " & strCookie)

if len(strCookie) < 1 or IsNumeric(strCookie) <> true then
	response.Write("<br><br><hr>SOMETHING WRONG!<br> len(strCookie) = " & len(strCookie) & "<br> IsNumeric(strCookie) = " & IsNumeric(strCookie) & "<hr>")
else
	Response.Write("<style type='text/css'>")
	Response.Write("p { color: red; font-size: " & strCookie & "%; };")
	Response.Write("</style>")
end if
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>choose a font size</title>
</head>
<body>

	<p>
    	some text in a <code>&lt;p&gt;</code> tag
    </p>

	<a href="enlargeFontSize.asp?size=100">enlarge font size (A)</a>
    <br />
    <a href="enlargeFontSize.asp?size=120">enlarge font size (AA)</a>
    <br />
    <a href="enlargeFontSize.asp?size=160">enlarge font size (AAA)</a>
    
    <br /><br />
    
    <a href="delete.asp">delete any existing cookies</a>

</body>
</html>
