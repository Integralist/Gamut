/**
 * --------------------------------------------------------------------
 * jQuery-Plugin "preloadCssImages"
 * by Scott Jehl, scott@filamentgroup.com
 * http://www.filamentgroup.com
 * reference article: http://www.filamentgroup.com/lab/update_automatically_preload_images_from_css_with_jquery/
 * demo page: http://www.filamentgroup.com/examples/preloadImages/index_v2.php
 * 
 * Copyright (c) 2008 Filament Group, Inc
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
 *
 * Version: 3.0, 06.21.2008
 * Changelog:
 * 	02.20.2008 initial Version 1.0
 *    06.04.2008 Version 2.0 : removed need for any passed arguments. Images load from any and all directories.
 *    06.21.2008 Version 3.0 : Added options for loading status. Fixed IE abs image path bug (thanks Sam Pohlenz).
 * --------------------------------------------------------------------
 */
jQuery.preloadCssImages = function(settings){
	var settings = jQuery.extend({
		statusTextEl: null,
		statusBarEl: null
	}, settings);
	
	var allImgs = [];//new array for all the image urls  
	var k = 0; //iterator for adding images
	var sheets = document.styleSheets;//array of stylesheets
	
	for(var i = 0; i<sheets.length; i++){//loop through each stylesheet
		var cssPile = '';//create large string of all css rules in sheet
		var csshref = (sheets[i].href) ? sheets[i].href : 'window.location.href';
		var baseURLarr = csshref.split('/');//split href at / to make array
		baseURLarr.pop();//remove file path from baseURL array
		var baseURL = baseURLarr.join('/');//create base url for the images in this sheet (css file's dir)
		if(baseURL!="") baseURL+='/'; //tack on a / if needed
		if(document.styleSheets[i].cssRules){//w3
			var thisSheetRules = document.styleSheets[i].cssRules; //w3
			for(var j = 0; j<thisSheetRules.length; j++){
				cssPile+= thisSheetRules[j].cssText;
			}
		}
		else {
			cssPile+= document.styleSheets[i].cssText;
		}
		
		//parse cssPile for image urls and load them into the DOM
		var imgUrls = cssPile.match(/[^\(]+\.(gif|jpg|jpeg|png)/g);//reg ex to get a string of between a "(" and a ".filename"
		var loaded = 0; //number of images loaded
		if(imgUrls != null && imgUrls.length>0 && imgUrls != ''){//loop array\
			var arr = jQuery.makeArray(imgUrls);//create array from regex obj	 
			jQuery(arr).each(function(){
				allImgs[k] = new Image(); //new img obj
				allImgs[k].src = (this.charAt(0) == '/' || this.match('http://')) ? this : baseURL + this;	//set src either absolute or rel to css dir
				
				$(allImgs[k]).load(function(){
						loaded++;
						//send updates to status elements if applicable
						if(settings.statusTextEl) {$(settings.statusTextEl).html('<span class="numLoaded">'+loaded+'</span> of <span class="numTotal">'+allImgs.length+'</span> loaded (<span class="percentLoaded">'+(loaded/allImgs.length*100).toFixed(0)+'%</span>) <span class="currentImg">Now Loading: <span>'+allImgs[loaded-1].src.split('/')[allImgs[loaded-1].src.split('/').length-1]+'</span></span>');
					}
					if(settings.statusBarEl) {
						var barWidth = $(settings.statusBarEl).width();
						$(settings.statusBarEl).css('background-position', -(barWidth-(barWidth*loaded/allImgs.length).toFixed(0))+'px 50%');
					}
				});
				k++;
			});
		}
	}//loop
	return allImgs;
}				
		



