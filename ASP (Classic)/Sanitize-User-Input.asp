<%
Function CleanInput(strString)
	Const VALID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ0123456789-+,.=@/_<>&:; "

	Dim strResult
	Dim strChar
	Dim i
	
	strResult = ""
	
	For i = 1 to Len(strString)
		strChar = Mid(strString, i, 1)
		
		If Instr(1, VALID_CHARS, strChar, 0) > 0 Then
			strResult = strResult & strChar
		ElseIf strChar = "'" Then
			strResult = strResult & "''"
		ElseIf server.HTMLEncode(strChar) = "&quot;" Then
			strResult = strResult & """"
		End If
	Next

	CleanInput = strResult	
End Function

''''''''''''''''''''''''''''''''''''''
Function CleanInputMax(strString,iMax)
	Const VALID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ0123456789-,.@/_ "

	Dim strResult
	Dim strChar
	Dim i
	
	strResult = ""
	
	For i = 1 to Len(strString)
		strChar = Mid(strString, i, 1)
		
		If Instr(1, VALID_CHARS, strChar, 0) > 0 Then
			strResult = strResult & strChar
		ElseIf strChar = "'" Then
			strResult = strResult & "''"
		End If
	Next
	If len(strResult) > iMax Then
		CleanInputMax = left(strResult,iMax)
	Else
		CleanInputMax = strResult
	End If	
End Function

''''''''''''''''''''''''''''''''''''''
Function CleanPosNumericInput(strString)
	Const VALID_CHARS = "0123456789"

	Dim strResult
	Dim strChar
	Dim i
	
	strResult = ""
	
	For i = 1 to Len(strString)
		strChar = Mid(strString, i, 1)
		
		If Instr(1, VALID_CHARS, strChar, 0) > 0 Then
			strResult = strResult & strChar
		End If
	Next
	
	If strResult = "" Then
		strResult = "0"
	End If
	If 1*strResult < 0 Then
		'make positive
		strResult = strResult*-1
	End If
	If 1*strResult > 999999999 Then
		'make positive
		strResult = "999999999"
	End If

	CleanPosNumericInput = strResult	
End Function

''''''''''''''''''''''''''''''''''''''
Function CleanNumericInput(strString)
	Const VALID_CHARS = "0123456789"

	Dim strResult
	Dim strChar
	Dim i
	
	strResult = ""
	
	For i = 1 to Len(strString)
		strChar = Mid(strString, i, 1)
		
		If Instr(1, VALID_CHARS, strChar, 0) > 0 Then
			strResult = strResult & strChar
		End If
	Next
	
	If strResult = "" Then
		'strResult = "0"
	End If

	CleanNumericInput = strResult	
End Function
%>