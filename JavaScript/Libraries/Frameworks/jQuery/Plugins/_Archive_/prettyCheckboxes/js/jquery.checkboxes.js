/* ------------------------------------------------------------------------
	prettyCheckboxes
	
	Developped By: Stephane Caron (http://www.no-margin-for-errors.com)
	Inspired By: All the non user friendly custom checkboxes solutions ;)
	Version: 1.0
	
	Copyright: Feel free to redistribute the script/modify it, as
			   long as you leave my infos at the top.
------------------------------------------------------------------------- */
	
	jQuery.fn.prettyCheckboxes = function(settings) {
		settings = jQuery.extend({
					checkboxWidth: 17,
					checkboxHeight: 17,
					className : 'prettyCheckbox',
					display: 'list'
				}, settings);

		$(this).each(function(){
			// Find the label
			$label = $('label[for='+$(this).attr('id')+']');

			// Add the checkbox holder to the label
			$label.prepend("<span class='holderWrap'><span class='holder'></span></span>");

			// If the checkbox is checked, display it as checked
			if($(this).is(':checked')) { $label.addClass('checked'); };

			// Assign the class on the label
			$label.addClass(settings.className).addClass($(this).attr('type')).addClass(settings.display);

			// Assign the dimensions to the checkbox display
			$label.find('span.holderWrap').width(settings.checkboxWidth).height(settings.checkboxHeight);
			$label.find('span.holder').width(settings.checkboxWidth);

			// Hide the checkbox
			$(this).addClass('hiddenCheckbox');

			// Associate the click event
			$label.bind('click',function(){
				$('input#' + $(this).attr('for')).triggerHandler('click');
				
				if($('input#' + $(this).attr('for')).is(':checkbox')){
					$(this).toggleClass('checked');
					$('input#' + $(this).attr('for')).checked = true;
				}else{
					$toCheck = $('input#' + $(this).attr('for'));

					// Uncheck all radio
					$('input[name='+$toCheck.attr('name')+']').each(function(){
						$('label[for=' + $(this).attr('id')+']').removeClass('checked');	
					});

					$(this).addClass('checked');
					$toCheck.checked = true;
				};
			});
			
			$('input#' + $label.attr('for')).bind('keypress',function(e){
				if(e.keyCode == 32){
					if($.browser.msie){
						$('label[for='+$(this).attr('id')+']').toggleClass("checked");
					}else{
						$(this).trigger('click');
					}
					return false;
				};
			});
		});
	};