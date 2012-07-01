/* =========================================================
// jquery.multimedia-portfolio.js
// Author: OpenStudio (Arnault PACHOT)
// Mail: apachot@openstudio.fr
// Web: http://www.openstudio.fr
// Copyright (c) 2007 Arnault Pachot
// licence : GPL
========================================================= */


(function($) {

$.fn.multimedia_portfolio = function(options) {
	
	this.each(function(){ 	
				
		$(this).wrap("<div class='portfolio-container'></div>");
		var portfolio = $(this);
		var settings = {
			width: 700,
			baseDir: '.'
		};
		if(options) $.extend(settings, options);
		var def_element_width = settings.width/3;
		var portfolio_height = parseInt(settings.width/4 + 50);
		var elements = $(this).children().not('.portfolio-loading-bar');
		var dimensions_elements = new Array();
		var totlength = elements.length * def_element_width;
		$(".portfolio-container").css("width", settings.width+'px').css("height", portfolio_height+'px');
		for ( var i = 0; i < elements.length; i++ ) {
				$(elements[i]).css('width', def_element_width+'px');
				$(elements[i]).find('img').not('.portfolio-mp3, .portfolio-loading-bar').each(function(){
					$(this).removeAttr('width').removeAttr('height');
				});
				var currenthref;
				if ((currenthref= $(elements[i]).children().filter("a").attr('href'))!= null)	
				{
					if (currenthref.toLowerCase().indexOf('.flv') > 0) {
						var currentwidth = $(elements[i]).find('img').attr('width'); if (currentwidth==null) currentwidth='320';
						var currentheight = $(elements[i]).find('img').attr('height'); if (currentheight==null) currentheight='240';
						var currentstartimage = $(elements[i]).find('img').attr('src'); if (currentstartimage==null) currentstartimage='';
						var currenttitle = $(elements[i]).find('img').attr('title'); if (currenttitle==null) currenttitle='';
						if (jQuery.browser.msie) 
							$(elements[i]).empty().append("<object type='application/x-shockwave-flash' data='"+settings.baseDir+"/player_flv_multi.swf' width='"+currentwidth+"' height='"+currentheight+"' title='"+currenttitle+"' ><param name='movie' value='"+settings.baseDir+"/player_flv_multi.swf' /><param name='FlashVars' value='flv="+currenthref+"&amp;bgcolor1=black&amp;bgcolor2=black&amp;startimage="+currentstartimage+"&amp;width="+currentwidth+"&amp;height="+currentheight+"' /><param name='wmode' value='transparent' /><param name='scale' value='showall'/><p>you need to install a flash player to view this video (<a href='"+currenthref+"' alt='download the FLV file'>download the FLV file</a>)</p></object>");
						else 
							$(elements[i]).empty().append("<object type='application/x-shockwave-flash' data='"+settings.baseDir+"/player_flv_maxi.swf' width='"+currentwidth+"' height='"+currentheight+"' title='"+currenttitle+"' ><param name='movie' value='"+settings.baseDir+"/player_flv_maxi.swf' /><param name='FlashVars' value='flv="+currenthref+"&amp;bgcolor1=black&amp;bgcolor2=black&amp;startimage="+currentstartimage+"' /><param name='wmode' value='transparent' /><param name='scale' value='showall'/><p>you need to install a flash player to view this video (<a href='"+currenthref+"' alt='download the FLV file'>download the FLV file</a>)</p></object>");
							
					}
					if (currenthref.toLowerCase().indexOf('.mp3') > 0) {
						var currentwidth = $(elements[i]).find('img').attr('width'); if (currentwidth==null) currentwidth='320';
						var currentheight = $(elements[i]).find('img').attr('height'); if (currentheight==null) currentheight='240';
						var currentstartimage = $(elements[i]).find('img').attr('src'); if (currentstartimage==null) currentstartimage='';
						var currenttitle = $(elements[i]).find('img').attr('title'); if (currenttitle==null) currenttitle='';
						
						$(elements[i]).empty().append("<span class='portfolio-mp3-container'><object type='application/x-shockwave-flash' class='portfolio-mp3' width='150' height='20' data='"+settings.baseDir+"/player_mp3.swf?mp3="+currenthref+"' title='"+currenttitle+"'><param name='movie' value='"+settings.baseDir+"/player_mp3.swf?mp3="+currenthref+"' /><param name='wmode' value='transparent' /><p style='background: black'>you need to install a flash player to listen this record (<a href='"+currenthref+"' alt='download the MP3 file'>download the MP3 file</a>)</p></object></span><img src='"+currentstartimage+"' title='"+currenttitle+"'/>");
						
					}

				}			


				if ($(elements[i]).find('img, embed, object, applet').not('.portfolio-mp3, .portfolio-loading-bar').attr("title") != null) {
					currenttitle = $(elements[i]).find('img, embed, object, applet').not('.portfolio-mp3, .portfolio-loading-bar').attr("title");
					$(elements[i]).append("<div class='portfolio-title'>"+currenttitle+"</div>");
				}
				var new_width;var oldwidth,oldheight;
				dimensions_elements[i] =new Array();
				$(elements[i]).find('img, embed, object, applet').not('.portfolio-mp3, .portfolio-loading-bar').each(function(){
					if(((oldwidth = parseInt($(this).attr("width")))>0)&&((oldheight = parseInt($(this).attr("height")))>0)) {
						dimensions_elements[i][0] = oldwidth;
						dimensions_elements[i][1] = oldheight;
					}
					else {
						dimensions_elements[i][0] = 0;
						dimensions_elements[i][1] = 0; 
					}
					
				});
				$(elements[i]).find('embed, object, applet').not('.portfolio-mp3, .portfolio-loading-bar').each(function(){
					$(this).wrap($("<div class='portfolio-object-border'>"));
				});
				
		};
		
		var totlength = 0, dim3 = parseInt((settings.width / 4) -30);
		
		$(".portfolio-container").append("<div class='slider-container'></div>");
		$(".slider-container").css('width','100%').append("<div class='ui-slider-1'></div>");
		$(".ui-slider-1").css('width', '100%').append("<div class='ui-slider-handle'></div>");
		$(window).bind("load",function(){
			 $(".ui-slider-1").slider({steps: elements.length*3, minValue: 0, maxValue: 100, startValue: 50, slide: function(e,ui) {caroussel_portfolio_vue((elements.length * ui.slider.curValue /100), portfolio, elements, dim3, portfolio_height, settings, def_element_width, false, dimensions_elements);}});
		});
		
		function moveright(){
			$(".ui-slider-handle").css("left", (parseInt($(".ui-slider-handle").css("left"))+1)+'px')
			if (parseInt($(".ui-slider-handle").css("left")) > (parseInt($(".slider-container").css("width"))-(def_element_width))){
				 $(".ui-slider-handle").css("left", 0);
			}
			var newx = (((parseInt($(".ui-slider-handle").css("left")))/parseInt($(".slider-container").css("width"))) * 100);
			mytimer = setTimeout(moveright, 10);
			
			caroussel_portfolio_vue((elements.length * newx /100), portfolio, elements, dim3, portfolio_height, settings, def_element_width, false);
		}
		$(".portfolio-container").append("<img class='portfolio-scroll-left' src='"+settings.baseDir+"/css/left_handle.png' />");
		$(".portfolio-container").append("<img class='portfolio-scroll-right' src='"+settings.baseDir+"/css/right_handle.png'/>");
		$(".portfolio-scroll-left").bind('click', function(){
					$(".ui-slider-handle").css("left", (parseInt($(".ui-slider-handle").css("left"))-(parseInt(settings.width/6)))+'px')
					if (parseInt($(".ui-slider-handle").css("left")) <= 0) $(".ui-slider-handle").css("left", (parseInt(settings.width))+'px');
					
					var newx = (((parseInt($(".ui-slider-handle").css("left")))/parseInt(settings.width)) * 100);
					caroussel_portfolio_vue((elements.length * newx /100), portfolio, elements, dim3, portfolio_height, settings, def_element_width, true, dimensions_elements);
		
		});
		$(".portfolio-scroll-right").bind('click', function(){
					$(".ui-slider-handle").css("left", (parseInt($(".ui-slider-handle").css("left"))+(parseInt(settings.width/6)))+'px')
					if (parseInt($(".ui-slider-handle").css("left")) > parseInt(settings.width)) $(".ui-slider-handle").css("left", 0);
					var newx = (((parseInt($(".ui-slider-handle").css("left")))/parseInt(settings.width)) * 100);
					caroussel_portfolio_vue((elements.length * newx /100), portfolio, elements, dim3, portfolio_height, settings, def_element_width, true, dimensions_elements);
		});
		caroussel_portfolio_vue((elements.length * 50 /100), portfolio, elements, dim3, portfolio_height, settings, def_element_width, false, dimensions_elements);
		$(".portfolio-container").show();
		
	});
		
			
		
};
function max(a,b) { if(a > b) return a; else return b; }
function min(a,b) { if(a < b) return a; else return b; }


function caroussel_portfolio_vue(current, portfolio, elements, dim3, portfolio_height, settings, def_element_width, slide, dimensions_elements) {
	
	if (slide) {
		portfolio.animate({left : (-parseInt(def_element_width*(current-1)))}, 500);
	} else {
		portfolio.css('left',(-parseInt(def_element_width*(current-1)))+'px');
		
	}
	for ( var i = max(parseInt(current)-3, 0); i < min(parseInt(current)+4, elements.length); i++ ) {
			var delta = ((elements.length) - Math.abs(i - current)) / (elements.length);
			delta = delta*delta*delta;
			var new_height = parseInt(dim3*delta);
			$(elements[i]).find('img, embed, object, applet').not('.portfolio-mp3, .portfolio-loading-bar').each(function(){
				var new_width;
				if(parseInt(dimensions_elements[i][0]) > 0) {
					new_width = parseInt(new_height * parseInt(dimensions_elements[i][0]) / parseInt(dimensions_elements[i][1]));
					$(this).attr("width", new_width);
					$(this).attr("height", new_height);
					$(elements[i]).find('.portfolio-object-border').css("width", (new_width+6)+'px');
				}
				$(this).css('height', new_height+'px');
				$(elements[i]).css('padding-top', parseInt((portfolio_height-50-new_height)/2)+'px' );
			});
			$(elements[i]).find('.portfolio-title').css("font-size", delta+"em");
	}
	
	
	for ( var i = 0; i < elements.length; i++ ) {
		$(elements[i]).find('embed, object, applet').each(function(){
			if (((-parseInt((def_element_width)*(current-1)))+(i*def_element_width) < 0)||((-parseInt((def_element_width)*(current-1)))+((i+1)*def_element_width) > settings.width)) {
				$(this).css('visibility','hidden');
			} else {
				$(this).css('visibility','visible');}
		});
	}
	
};

})(jQuery);


