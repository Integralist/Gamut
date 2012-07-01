/*
 * jTPS - table sorting, pagination, and animated page scrolling
 *	version 0.4
 * Author: Jim Palmer
 * Released under MIT license.
 */
 (function($) {

	// apply table controls + setup initial jTPS namespace within jQuery
	$.fn.jTPS = function ( opt ) {

		$(this).data('tableSettings', $.extend({
			perPages:			[5, 6, 10, 20, 50, 'ALL'],				// the "show per page" selection
			perPageText:		'Show per page:',						// text that appears before perPages links
			perPageDelim:		'<span style="color:#ccc;">|</span>',	// text or dom node that deliminates each perPage link 
			perPageSeperator:	'..',									// text or dom node that deliminates split in select page links
			scrollDelay:		30,										// delay (in ms) between steps in anim. - IE has trouble showing animation with < 30ms delay
			scrollStep:			1,										// how many tr's are scrolled per step in the animated vertical pagination scrolling
			fixedLayout:		true									// autoset the width/height on each cell and set table-layout to fixed after auto layout
		}, opt));
		
		// generic pass-through object + other initial variables
		var pT = $(this), page = page || 1, perPages = $(this).data('tableSettings').perPages, perPage = perPage || perPages[0],
			rowCount = $('tbody tr', this).length;

		// append jTPS class "stamp"
		$(this).addClass('jTPS');
		
		// setup the fixed table-layout so that the animation doesn't bounce around - faux grid for table
		if ( $(this).data('tableSettings').fixedLayout ) {
			// "fix" the table layout and individual cell width & height settings
			if ( $(this).css('table-layout') != 'fixed' ) {
				// find max tbody td cell height
				var maxCellHeight = 0;

				// set width style on the TH headers (rely on jQuery with computed styles support)
				$('thead th', this).each(function () { $(this).css('width', $(this).width()); });

				// ensure browser-formated widths for each column in the thead and tbody
				var tbodyCh = $('tbody', this)[0].childNodes, tmpp = 0;
				// loop through tbody children and find the Nth <TR>
				for ( var tbi=0, tbcl=tbodyCh.length; tbi < tbcl; tbi++ )
					if ( tbodyCh[ tbi ].nodeName == 'TR' )
						maxCellHeight = Math.max( maxCellHeight, tbodyCh[ tbi ].offsetHeight );

				// now set the height attribute and/or style to the first TD cell (not the row)
				for ( var tbi=0, tbcl=tbodyCh.length; tbi < tbcl; tbi++ )
					if ( tbodyCh[ tbi ].nodeName == 'TR' )
						for ( var tdi=0, trCh=tbodyCh[ tbi ].childNodes, tdcl=trCh.length; tdi < tdcl; tdi++ )
							if ( trCh[ tdi ].nodeName == 'TD' ) {
								trCh[ tdi ].style.height = maxCellHeight + 'px';
								tdi = tdcl;
							}

				// now set the table layout to fixed
				$(this).css('table-layout','fixed');
			}
		}

		// remove all stub rows
		$('.stubCell', this).remove();

		// add the stub rows
		var stubCount=0, cols = $('tbody tr:first td', this).length, 
			stubs = ( perPage - ( $('tbody tr', this).length % perPage ) ),
			stubHeight = $('tbody tr:first td:first', this).css('height');
		for ( ; stubCount < stubs && stubs != perPage; stubCount++ )
			$('tbody tr:last', this).after( '<tr class="stubCell"><td colspan="' + cols + '" style="height: ' + stubHeight + ';">&nbsp;</td></tr>' );

		// paginate the result
		if ( rowCount > perPage )
			$('tbody tr:gt(' + (perPage - 1) + ')', this).addClass('hideTR');

		// bind sort functionality to theader onClick
		$('thead th[sort]', this).each(
			function (tdInd) {
				$(this).addClass('sortableHeader').unbind('click').bind('click',
					function () {
						var desc = $(pT).find('thead th:eq(' + tdInd + ')').hasClass('sortAsc') ? true : false;
						// sort the rows
						sort( pT, tdInd, desc );
						// show first perPages rows
						var page = parseInt( $(pT).find('.hilightPageSelector:first').html() ) || 1;
						$(pT).find('tbody tr').removeClass('hideTR').filter(':gt(' + ( ( perPage - 1 ) * page ) + ')').addClass('hideTR');
						$(pT).find('tbody tr:lt(' + ( ( perPage - 1 ) * ( page - 1 ) ) + ')').addClass('hideTR');
						// scroll to first page
						$(pT).find('.pageSelector:first').click();
						// hilight the sorted column header
						$(pT).find('thead .sortDesc, thead .sortAsc').removeClass('sortDesc').removeClass('sortAsc');
						$(pT).find('thead th:eq(' + tdInd + ')').addClass( desc ? 'sortDesc' : 'sortAsc' );
						// hilight the sorted column
						$(pT).find('tbody').find('td.sortedColumn').removeClass('sortedColumn');
						$(pT).find('tbody tr:not(.stubCell)').each( function () { $(this).find('td:eq(' + tdInd + ')').addClass('sortedColumn'); } );
						clearSelection();
					}
				);
			}
		);

		// add perPage selection link + delim dom node
		$('tfoot .selectPerPage', this).empty();
		var pageSel = perPages.length;
		while ( pageSel-- ) 
			$('tfoot .selectPerPage', this).prepend( ( (pageSel > 0) ? $(this).data('tableSettings').perPageDelim : '' ) + 
				'<span class="perPageSelector">' + perPages[pageSel] + '</span>' );

		// now draw the page selectors
		drawPageSelectors( this, page || 1 );

		// prepend the instructions and attach select hover and click events
		$('tfoot .selectPerPage', this).prepend( $(this).data('tableSettings').perPageText ).find('.perPageSelector').each(
			function () {
				if ( ( parseInt($(this).html()) || rowCount ) == perPage )
					$(this).addClass('perPageSelected');
				$(this).bind('mouseover mouseout', 
					function (e) { 
						e.type == 'mouseover' ? $(this).addClass('perPageHilight') : $(this).removeClass('perPageHilight');
					}
				);
				$(this).bind('click', 
					function () { 
						// set the new number of pages
						perPage = parseInt( $(this).html() ) || rowCount;
						if ( perPage > rowCount ) perPage = rowCount;
						// remove all stub rows
						$('.stubCell', this).remove();
						// redraw stub rows
						var stubCount=0, cols = $(pT).find('tbody tr:first td').length, 
							stubs = ( perPage - ( $(pT).find('tbody tr').length % perPage ) ), 
							stubHeight = $(pT).find('tbody tr:first td:first').css('height');
						for ( ; stubCount < stubs && stubs != perPage; stubCount++ )
							$(pT).find('tbody tr:last').after( '<tr class="stubCell"><td colspan="' + cols + '" style="height: ' + stubHeight + ';">&nbsp;</td></tr>' );
						// set new visible rows
						$(pT).find('tbody tr').removeClass('hideTR').filter(':gt(' + ( ( perPage - 1 ) * page ) + ')').addClass('hideTR');
						$(pT).find('tbody tr:lt(' + ( ( perPage - 1 ) * ( page - 1 ) ) + ')').addClass('hideTR');
						// back to the first page
						$(pT).find('.pageSelector:first').click();
						$(this).siblings('.perPageSelected').removeClass('perPageSelected');
						$(this).addClass('perPageSelected');
						// redraw the pagination
						drawPageSelectors( pT, 1 );
						// update status bar
						var cPos = $('tbody tr:not(.hideTR):first', pT).prevAll().length,
							ePos = $('tbody tr:not(.hideTR):not(.stubCell)', pT).length;
						$('tfoot .status', pT).html( 'Showing ' + ( cPos + 1 ) + ' - ' + ( cPos + ePos ) + ' of ' + rowCount + '' );
						clearSelection();
					}
				);
			}
		);
		
		// show the correct paging status
		var cPos = $('tbody tr:not(.hideTR):first', this).prevAll().length, ePos = $('tbody tr:not(.hideTR)', this).length;
		$('tfoot .status', this).html( 'showing ' + ( cPos + 1 ) + ' - ' + ( cPos + ePos ) + ' of ' + rowCount );

		// clear selected text function
		function clearSelection () {
			if ( document.selection && typeof(document.selection.empty) != 'undefined' )
				document.selection.empty();
			else if ( typeof(window.getSelection) === 'function' && typeof(window.getSelection().removeAllRanges) === 'function' )
				window.getSelection().removeAllRanges();
		}

		// render the pagination functionality
		function drawPageSelectors ( target, page ) {

			// add pagination links
			$('tfoot .pagination', target).empty();
			var pages = (perPage >= rowCount) ? 0 : Math.ceil( rowCount / perPage ), totalPages = pages;
			while ( pages-- ) 
				$('tfoot .pagination', target).prepend( '<div class="pageSelector">' + ( pages + 1 ) + '</div>' );
		
			var pageCount = $('tfoot .pageSelector', target).length;
			$('tfoot .pageSelector.hidePageSelector', target).removeClass('hidePageSelector');
			$('tfoot .pageSelector.hilightPageSelector', target).removeClass('hilightPageSelector');
			$('tfoot .pageSelectorSeperator', target).remove();
			$('tfoot .pageSelector:lt(' + ( ( page > ( pageCount - 4 ) ) ? ( pageCount - 5 ) : ( page - 2 ) ) + '):not(:first)', target).addClass('hidePageSelector')
				.eq(0).after( '<div class="pageSelectorSeperator">' + $(target).data('tableSettings').perPageSeperator + '</div>' );
			$('tfoot .pageSelector:gt(' + ( ( page < 4 ) ? 4 : page ) + '):not(:last)', target).addClass('hidePageSelector')
				.eq(0).after( '<div class="pageSelectorSeperator">' + $(target).data('tableSettings').perPageSeperator + '</div>' );
			$('tfoot .pageSelector:eq(' + ( page - 1 ) + ')', target).addClass('hilightPageSelector');

			// remove the pager title if no pages necessary
			if ( perPage >= rowCount )
				$('tfoot .paginationTitle', target).css('display','none');
			else
				$('tfoot .paginationTitle', target).css('display','');
			
			// bind the pagination onclick
			$('tfoot .pagination .pageSelector', target).each(
				function () {
					$(this).bind('click',
						function () {

							// if double clicked - stop animation and jump to selected page - this appears to be a tripple click in IE7
							if ( $(this).hasClass('hilightPageSelector') ) {
								if ( $(this).parent().queue().length > 0 ) {
									// really stop all animations and create new queue
									$(this).parent().stop().queue( "fx", [] ).stop();
									// set the user directly on the correct page without animation
									var beginPos = ( ( parseInt( $(this).html() ) - 1 ) * perPage ), endPos = beginPos + perPage;
									$('tbody tr', pT).removeClass('hideTR').addClass('hideTR');
									$('tbody tr:gt(' + (beginPos - 2) + '):lt(' + ( perPage ) + ')', pT).andSelf().removeClass('hideTR');
									// update status bar
									var cPos = $('tbody tr:not(.hideTR):first', pT).prevAll().length,
										ePos = $('tbody tr:not(.hideTR):not(.stubCell)', pT).length;
									$('tfoot .status', pT).html( 'Showing ' + ( cPos + 1 ) + ' - ' + ( cPos + ePos ) + ' of ' + rowCount + '' );
								}
								clearSelection();
								return false;
							}

							// hilight the specific page button
							$(this).parent().find('.hilightPageSelector').removeClass('hilightPageSelector');
							$(this).addClass('hilightPageSelector');

							// really stop all animations
							$(this).parent().stop().queue( "fx", [] ).stop().dequeue();

							// setup the pagination variables
							var beginPos = $('tbody tr:not(.hideTR):first', pT).prevAll().length,
								endPos = ( ( parseInt( $(this).html() ) - 1 ) * perPage );
							if ( endPos > rowCount )
								endPos = (rowCount - 1);
							// set the steps to be exponential for all the page scroll difference - i.e. faster for more pages to scroll
							var sStep = $(pT).data('tableSettings').scrollStep * Math.ceil( Math.abs( ( endPos - beginPos ) / perPage ) );
							if ( sStep > perPage ) sStep = perPage;
							var steps = Math.ceil( Math.abs( beginPos - endPos ) / sStep );

							// start scrolling
							while ( steps-- ) {
								$(this).parent().animate({'opacity':1}, $(pT).data('tableSettings').scrollDelay,
									function () {
										// reset the scrollStep for the remaining items
										if ( $(this).queue("fx").length == 0 )
											sStep = ( Math.abs( beginPos - endPos ) % sStep ) || sStep;
										/* scoll up */
										if ( beginPos > endPos ) {
											$('tbody tr:not(.hideTR):first', pT).prevAll(':lt(' + sStep + ')').removeClass('hideTR');
											if ( $('tbody tr:not(.hideTR)', pT).length > perPage )
												$('tbody tr:not(.hideTR):last', pT).prevAll(':lt(' + ( sStep - 1 ) + ')').andSelf().addClass('hideTR');
											// if scrolling up from less rows than perPage - compensate if < perPage
											var currRows =  $('tbody tr:not(.hideTR)', pT).length;
											if ( currRows < perPage )
												$('tbody tr:not(.hideTR):last', pT).nextAll(':lt(' + ( perPage - currRows ) + ')').removeClass('hideTR');
										/* scroll down */
										} else {
											var endPoint = $('tbody tr:not(.hideTR):last', pT);
											$('tbody tr:not(.hideTR):lt(' + sStep + ')', pT).addClass('hideTR');
											$(endPoint).nextAll(':lt(' + sStep + ')').removeClass('hideTR');
										}
										// update status bar
										var cPos = $('tbody tr:not(.hideTR):first', pT).prevAll().length,
											ePos = $('tbody tr:not(.hideTR):not(.stubCell)', pT).length;
										$('tfoot .status', pT).html( 'Showing ' + ( cPos + 1 ) + ' - ' + ( cPos + ePos ) + ' of ' + rowCount + '' );
									}
								);
							}

							// redraw the pagination
							drawPageSelectors( pT, parseInt( $(this).html() ) );

						}
					);
				}
			);
			
		};

		/* sort function */
		function sort ( target, tdIndex, desc ) {

			var sorted = $('thead th:eq(' + tdIndex + ')', target).hasClass('sortAsc') ||
				$('thead th:eq(' + tdIndex + ')', target).hasClass('sortDesc') || false,
				nullChar = String.fromCharCode(0), re = /([-]{0,1}[0-9.]{1,})/g,
				rows = $('tbody tr:not(.stubCell)', target).get(), procRow = [];

			$(rows).each(
				function(key, val) {
					// setup temp-scope variables for comparison evauluation
					var x = ( $('td:eq(' + tdIndex + ')', val).html() || '' ).toString().toLowerCase() || '',
						xN = x.replace(re, nullChar + '$1' + nullChar).split(nullChar),
						tD = (new Date(x)).getTime(), xNl = xN.length;
					if ( tD )
						procRow.push( tD + ',' + (procRow.length) );
					else {
						var dS = [];
						for (var i=0; i < xNl; i++)
							dS.push( (new Date( xN[ i ] )).getTime() || parseFloat( xN[ i ] ) || xN[ i ] );
						procRow.push( dS.join(',') + ',' + (procRow.length) );
					}
				}
			);

			if ( !sorted ) {
				// use the quick sort algorithm
				quickSort( procRow, 0, (rows.length - 1) );
				// properly position order of sort
				if ( !desc )
					procRow.reverse();
			}

			// now re-order the parent tbody based off the quick sorted tbody map
			$('tbody:first', target).before('<tbody></tbody>');
			var nr = procRow.length, tf = $('tbody:first', target)[0];
			// move the row from old tbody to new tbody in order of new tbody with replaceWith to retain original tbody row positioning
			if ( sorted )
				while ( nr-- )
					tf.appendChild( rows[ nr ] );
			else
				while ( nr-- )
					tf.appendChild( rows[ parseInt( procRow[ nr ].split(',').pop() ) ] );
			// remove the old table
			$('tbody:last', target).remove();
			// redraw stub rows
			var stubCount=0, cols = $('tbody tr:first td', target).length, 
				stubs = ( perPage - ( $('tbody tr', target).length % perPage ) ), 
				stubHeight = $('tbody tr:first td:first', target).css('height');
			for ( ; stubCount < stubs && stubs != perPage; stubCount++ )
				$('tbody tr:last', target).after( '<tr class="stubCell"><td colspan="' + cols + '" style="height: ' + stubHeight + ';">&nbsp;</td></tr>' );

		}

		/* Quick Sort algorithm - instantiation of Michael Lamont's Quick Sort pseudocode from http://linux.wku.edu/~lamonml/algor/sort/quick.html */
		function quickSort ( numbers, left, right ) {
			var l_hold = left, r_hold = right, pivot = numbers[left];
			// natural sort comparison "operator overload"
			var chCompare = function ( a, b ) {
				var ca = a.split(',').slice( 0, ( a.length - 1 ) ), 
					cb = b.split(',').slice( 0, ( a.length - 1 ) );
				for ( var cLoc=0, nMin = Math.min( ca.length, cb.length ), nMax = Math.max( ca.length, cb.length ); cLoc < nMax; cLoc++ ) {
					if ( ( parseFloat( ca[ cLoc ] ) || ca[ cLoc ] ) < ( parseFloat( cb[ cLoc ] ) || cb[ cLoc ] ) )
						return -1;
					if ( ( parseFloat( ca[ cLoc ] ) || ca[ cLoc ] ) > ( parseFloat( cb[ cLoc ] ) || cb[ cLoc ] ) )
						return 1;
					if ( cLoc > nMin && cLoc <= nMax )
						return 0;
				}
				return 0;
			}
			while (left < right) {
				while ( ( chCompare( numbers[right], pivot ) >= 0 ) && ( left < right ) )
					right--;
				if (left != right) {
					numbers[left] = numbers[right];
					left++;
				}
				while ( ( chCompare( numbers[left], pivot ) <= 0 ) && ( left < right ) )
					left++;
				if (left != right) {
					numbers[right] = numbers[left];
					right--;
				}
			}
			numbers[left] = pivot;
			pivot = left;
			left = l_hold;
			right = r_hold;
			if (left < pivot)
				quickSort( numbers, left, ( pivot - 1 ) );
			if (right > pivot)
				quickSort( numbers, ( pivot + 1 ), right );
		};

		// chainable
		return this;
	};

})(jQuery);