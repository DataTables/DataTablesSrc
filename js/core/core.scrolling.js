/**
 * Add any control elements for the table - specifically scrolling
 *  @param {object} settings dataTables settings object
 *  @returns {node} Node to add to the DOM
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlTable ( settings )
{
	var table = $(settings.nTable);

	// Scrolling from here on in
	var scroll = settings.oScroll;

	if ( scroll.sX === '' && scroll.sY === '' ) {
		return settings.nTable;
	}

	var scrollX = scroll.sX;
	var scrollY = scroll.sY;
	var classes = settings.oClasses.scrolling;
	var caption = settings.captionNode;
	var captionSide = caption ? caption._captionSide : null;
	var headerClone = $( table[0].cloneNode(false) );
	var footerClone = $( table[0].cloneNode(false) );
	var footer = table.children('tfoot');
	var _div = '<div/>';
	var size = function ( s ) {
		return !s ? null : _fnStringToCss( s );
	};

	if ( ! footer.length ) {
		footer = null;
	}

	/*
	 * The HTML structure that we want to generate in this function is:
	 *  div - scroller
	 *    div - scroll head
	 *      div - scroll head inner
	 *        table - scroll head table
	 *          thead - thead
	 *    div - scroll body
	 *      table - table (master table)
	 *        thead - thead clone for sizing
	 *        tbody - tbody
	 *    div - scroll foot
	 *      div - scroll foot inner
	 *        table - scroll foot table
	 *          tfoot - tfoot
	 */
	var scroller = $( _div, { 'class': classes.container } )
		.append(
			$(_div, { 'class': classes.header.self } )
				.css( {
					overflow: 'hidden',
					position: 'relative',
					border: 0,
					width: scrollX ? size(scrollX) : '100%'
				} )
				.append(
					$(_div, { 'class': classes.header.inner } )
						.css( {
							'box-sizing': 'content-box',
							width: scroll.sXInner || '100%'
						} )
						.append(
							headerClone
								.removeAttr('id')
								.css( 'margin-left', 0 )
								.append( captionSide === 'top' ? caption : null )
								.append(
									table.children('thead')
								)
						)
				)
		)
		.append(
			$(_div, { 'class': classes.body } )
				.css( {
					position: 'relative',
					overflow: 'auto',
					width: size( scrollX )
				} )
				.append( table )
		);

	if ( footer ) {
		scroller.append(
			$(_div, { 'class': classes.footer.self } )
				.css( {
					overflow: 'hidden',
					border: 0,
					width: scrollX ? size(scrollX) : '100%'
				} )
				.append(
					$(_div, { 'class': classes.footer.inner } )
						.append(
							footerClone
								.removeAttr('id')
								.css( 'margin-left', 0 )
								.append( captionSide === 'bottom' ? caption : null )
								.append(
									table.children('tfoot')
								)
						)
				)
		);
	}

	var children = scroller.children();
	var scrollHead = children[0];
	var scrollBody = children[1];
	var scrollFoot = footer ? children[2] : null;

	// When the body is scrolled, then we also want to scroll the headers
	$(scrollBody).on( 'scroll.DT', function () {
		var scrollLeft = this.scrollLeft;

		scrollHead.scrollLeft = scrollLeft;

		if ( footer ) {
			scrollFoot.scrollLeft = scrollLeft;
		}
	} );

	// When focus is put on the header cells, we might need to scroll the body
	$('th, td', scrollHead).on('focus', function () {
		var scrollLeft = scrollHead.scrollLeft;

		scrollBody.scrollLeft = scrollLeft;

		if ( footer ) {
			scrollBody.scrollLeft = scrollLeft;
		}
	});

	$(scrollBody).css('max-height', scrollY);
	if (! scroll.bCollapse) {
		$(scrollBody).css('height', scrollY);
	}

	settings.nScrollHead = scrollHead;
	settings.nScrollBody = scrollBody;
	settings.nScrollFoot = scrollFoot;

	// On redraw - align columns
	settings.aoDrawCallback.push(_fnScrollDraw);

	return scroller[0];
}



/**
 * Update the header, footer and body tables for resizing - i.e. column
 * alignment.
 *
 * Welcome to the most horrible function DataTables. The process that this
 * function follows is basically:
 *   1. Re-create the table inside the scrolling div
 *   2. Correct colgroup > col values if needed
 *   3. Copy colgroup > col over to header and footer
 *   4. Clean up
 *
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnScrollDraw ( settings )
{
	// Given that this is such a monster function, a lot of variables are use
	// to try and keep the minimised size as small as possible
	var
		scroll         = settings.oScroll,
		barWidth       = scroll.iBarWidth,
		divHeader      = $(settings.nScrollHead),
		divHeaderInner = divHeader.children('div'),
		divHeaderTable = divHeaderInner.children('table'),
		divBodyEl      = settings.nScrollBody,
		divBody        = $(divBodyEl),
		divFooter      = $(settings.nScrollFoot),
		divFooterInner = divFooter.children('div'),
		divFooterTable = divFooterInner.children('table'),
		header         = $(settings.nTHead),
		table          = $(settings.nTable),
		footer         = settings.nTFoot && $('th, td', settings.nTFoot).length ? $(settings.nTFoot) : null,
		browser        = settings.oBrowser,
		headerCopy, footerCopy;

	// If the scrollbar visibility has changed from the last draw, we need to
	// adjust the column sizes as the table width will have changed to account
	// for the scrollbar
	var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
	
	if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
		settings.scrollBarVis = scrollBarVis;
		_fnAdjustColumnSizing( settings );
		return; // adjust column sizing will call this function again
	}
	else {
		settings.scrollBarVis = scrollBarVis;
	}

	// 1. Re-create the table inside the scrolling div
	// Remove the old minimised thead and tfoot elements in the inner table
	table.children('thead, tfoot').remove();

	// Clone the current header and footer elements and then place it into the inner table
	headerCopy = header.clone().prependTo( table );
	headerCopy.find('th, td').removeAttr('tabindex');
	headerCopy.find('[id]').removeAttr('id');

	if ( footer ) {
		footerCopy = footer.clone().prependTo( table );
		footerCopy.find('[id]').removeAttr('id');
	}

	// 2. Correct colgroup > col values if needed
	// It is possible that the cell sizes are smaller than the content, so we need to
	// correct colgroup>col for such cases. This can happen if the auto width detection
	// uses a cell which has a longer string, but isn't the widest! For example 
	// "Chief Executive Officer (CEO)" is the longest string in the demo, but
	// "Systems Administrator" is actually the widest string since it doesn't collapse.
	// Note the use of translating into a column index to get the `col` element. This
	// is because of Responsive which might remove `col` elements, knocking the alignment
	// of the indexes out.
	if (settings.aiDisplay.length) {
		// Get the column sizes from the first row in the table. This should really be a
		// [].find, but it wasn't supported in Chrome until Sept 2015, and DT has 10 year
		// browser support
		var firstTr = null;
		var start = _fnDataSource( settings ) !== 'ssp'
			? settings._iDisplayStart
			: 0;

		for (i=start ; i<start + settings.aiDisplay.length ; i++) {
			var idx = settings.aiDisplay[i];
			var tr = settings.aoData[idx].nTr;

			if (tr) {
				firstTr = tr;
				break;
			}
		}

		if (firstTr) {
			var colSizes = $(firstTr).children('th, td').map(function (vis) {
				return {
					idx: _fnVisibleToColumnIndex(settings, vis),
					width: $(this).outerWidth()
				};
			});

			// Check against what the colgroup > col is set to and correct if needed
			for (var i=0 ; i<colSizes.length ; i++) {
				var colEl = settings.aoColumns[ colSizes[i].idx ].colEl[0];
				var colWidth = colEl.style.width.replace('px', '');

				if (colWidth !== colSizes[i].width) {
					colEl.style.width = colSizes[i].width + 'px';

					if (scroll.sX) {
						colEl.style.minWidth = colSizes[i].width + 'px';
					}
				}
			}
		}
	}

	// 3. Copy the colgroup over to the header and footer
	divHeaderTable
		.find('colgroup')
		.remove();

	divHeaderTable.append(settings.colgroup.clone());

	if ( footer ) {
		divFooterTable
			.find('colgroup')
			.remove();

		divFooterTable.append(settings.colgroup.clone());
	}

	// "Hide" the header and footer that we used for the sizing. We need to keep
	// the content of the cell so that the width applied to the header and body
	// both match, but we want to hide it completely.
	$('th, td', headerCopy).each(function () {
		$(this.childNodes).wrapAll('<div class="dt-scroll-sizing">');
	});

	if ( footer ) {
		$('th, td', footerCopy).each(function () {
			$(this.childNodes).wrapAll('<div class="dt-scroll-sizing">');
		});
	}

	// 4. Clean up
	// Figure out if there are scrollbar present - if so then we need the header and footer to
	// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
	var isScrolling = Math.floor(table.height()) > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
	var paddingSide = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );

	// Set the width's of the header and footer tables
	var outerWidth = table.outerWidth();

	divHeaderTable.css('width', _fnStringToCss( outerWidth ));
	divHeaderInner
		.css('width', _fnStringToCss( outerWidth ))
		.css(paddingSide, isScrolling ? barWidth+"px" : "0px");

	if ( footer ) {
		divFooterTable.css('width', _fnStringToCss( outerWidth ));
		divFooterInner
			.css('width', _fnStringToCss( outerWidth ))
			.css(paddingSide, isScrolling ? barWidth+"px" : "0px");
	}

	// Correct DOM ordering for colgroup - comes before the thead
	table.children('colgroup').prependTo(table);

	// Adjust the position of the header in case we loose the y-scrollbar
	divBody.trigger('scroll');

	// If sorting or filtering has occurred, jump the scrolling back to the top
	// only if we aren't holding the position
	if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
		divBodyEl.scrollTop = 0;
	}
}
