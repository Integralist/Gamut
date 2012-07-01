$(document).ready(function() {
	/*
	we want jQuery to hide all elements inside of ‘div#tabvanilla’ 
	except the one which corresponds with the tab which has been selected.
	
	This tells the browser to look out for a ul list inside of an element with the ID of tabvanilla, 
	and to use the tabs function to interact with.
	
	We also define two animation effects (fx:) – toggling the height and opacity.
	This will cause the area to “fade and slide” when switching tabs.
	*/
	$('#tabvanilla > ul').tabs({ fx: { height: 'toggle', opacity: 'toggle' } });
	
	/*
	This tells your browser to use the tabs function to interact with 
	the ul list inside the #featuredvid element. 
	
	We aren’t defining any animation effects this time as due to the nature of 
	the content in these boxes (video), effects tend not to work very well.
	
	One problem that occurs with this effect is that Internet Explorer will not pause 
	the video in a tab when you switch to another – causing the sound to continue playing the background. 
	This does not happen in Firefox, Opera or Safari.
	*/
	$('#featuredvid > ul').tabs();
});
