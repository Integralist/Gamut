<%@LANGUAGE="VBSCRIPT"%>
<% option explicit
Response.Buffer = True
Response.Expires = -1500

Dim qs
qs = Request.QueryString("size")

Response.Cookies("settings")("fontSize") = qs
Response.Cookies("settings").Expires = DateAdd("d", 365, now)

Response.Redirect("mypage.asp")
%>