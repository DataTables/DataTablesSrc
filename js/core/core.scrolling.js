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
	var classes = settings.oClasses;
	var caption = table.children('caption');
	var captionSide = caption.length ? caption[0]._captionSide : null;
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
	var scroller = $( _div, { 'class': classes.sScrollWrapper } )
		.append(
			$(_div, { 'class': classes.sScrollHead } )
				.css( {
					overflow: 'hidden',
					position: 'relative',
					border: 0,
					width: scrollX ? size(scrollX) : '100%'
				} )
				.append(
					$(_div, { 'class': classes.sScrollHeadInner } )
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
			$(_div, { 'class': classes.sScrollBody } )
				.css( {
					position: 'relative',
					overflow: 'auto',
					width: size( scrollX )
				} )
				.append( table )
		);

	if ( footer ) {
		scroller.append(
			$(_div, { 'class': classes.sScrollFoot } )
				.css( {
					overflow: 'hidden',
					border: 0,
					width: scrollX ? size(scrollX) : '100%'
				} )
				.append(
					$(_div, { 'class': classes.sScrollFootInner } )
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
	if ( scrollX ) {
		$(scrollBody).on( 'scroll.DT', function (e) {
			var scrollLeft = this.scrollLeft;

			scrollHead.scrollLeft = scrollLeft;

			if ( footer ) {
				scrollFoot.scrollLeft = scrollLeft;
			}
		} );
	}

	$(scrollBody).css('max-height', scrollY);
	if (! scroll.bCollapse) {
		$(scrollBody).css('height', scrollY);
	}

	settings.nScrollHead = scrollHead;
	settings.nScrollBody = scrollBody;
	settings.nScrollFoot = scrollFoot;

	// On redraw - align columns
	settings.aoDrawCallback.push( {
		"fn": _fnScrollDraw,
		"sName": "scrolling"
	} );

	return scroller[0];
}



/**
 * Update the header, footer and body tables for resizing - i.e. column
 * alignment.
 *
 * Welcome to the most horrible function DataTables. The process that this
 * function follows is basically:
 *   1. Re-create the table inside the scrolling div
 *   2. Take live measurements from the DOM
 *   3. Apply the measurements to align the columns
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
		scrollX        = scroll.sX,
		scrollXInner   = scroll.sXInner,
		scrollY        = scroll.sY,
		barWidth       = scroll.iBarWidth,
		divHeader      = $(settings.nScrollHead),
		divHeaderStyle = divHeader[0].style,
		divHeaderInner = divHeader.children('div'),
		divHeaderInnerStyle = divHeaderInner[0].style,
		divHeaderTable = divHeaderInner.children('table'),
		divBodyEl      = settings.nScrollBody,
		divBody        = $(divBodyEl),
		divBodyStyle   = divBodyEl.style,
		divFooter      = $(settings.nScrollFoot),
		divFooterInner = divFooter.children('div'),
		divFooterTable = divFooterInner.children('table'),
		header         = $(settings.nTHead),
		table          = $(settings.nTable),
		tableEl        = table[0],
		tableStyle     = tableEl.style,
		footer         = settings.nTFoot ? $(settings.nTFoot) : null,
		browser        = settings.oBrowser,
		ie67           = browser.bScrollOversize,
		dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
		headerTrgEls, footerTrgEls,
		headerSrcEls, footerSrcEls,
		headerCopy, footerCopy,
		headerWidths=[], footerWidths=[],
		headerContent=[], footerContent=[],
		idx, correction, sanityWidth,
		zeroOut = function(nSizer) {
			var style = nSizer.style;
			style.paddingTop = "0";
			style.paddingBottom = "0";
			style.borderTopWidth = "0";
			style.borderBottomWidth = "0";
			style.height = 0;
		};

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

	/*
	 * 1. Re-create the table inside the scrolling div
	 */

	// Remove the old minimised thead and tfoot elements in the inner table
	table.children('thead, tfoot').remove();

	if ( footer ) {
		footerCopy = footer.clone().prependTo( table );
		footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
		footerSrcEls = footerCopy.find('tr');
		footerCopy.find('[id]').removeAttr('id');
	}

	// Clone the current header and footer elements and then place it into the inner table
	headerCopy = header.clone().prependTo( table );
	headerTrgEls = header.find('tr'); // original header is in its own table
	headerSrcEls = headerCopy.find('tr');
	headerCopy.find('th, td').removeAttr('tabindex');
	headerCopy.find('[id]').removeAttr('id');


	/*
	 * 2. Take live measurements from the DOM - do not alter the DOM itself!
	 */

	// Remove old sizing and apply the calculated column widths
	// Get the unique column headers in the newly created (cloned) header. We want to apply the
	// calculated sizes to this header
	if ( ! scrollX )
	{
		divBodyStyle.width = '100%';
		divHeader[0].style.width = '100%';
	}

	$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
		idx = _fnVisibleToColumnIndex( settings, i );
		el.style.width = settings.aoColumns[idx].sWidth;
	} );

	if ( footer ) {
		_fnApplyToChildren( function(n) {
			n.style.width = "";
		}, footerSrcEls );
	}

	// Size the table as a whole
	sanityWidth = table.outerWidth();
	if ( scrollX === "" ) {
		// No x scrolling
		tableStyle.width = "100%";

		// IE7 will make the width of the table when 100% include the scrollbar
		// - which is shouldn't. When there is a scrollbar we need to take this
		// into account.
		if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
			divBody.css('overflow-y') == "scroll")
		) {
			tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
		}

		// Recalculate the sanity width
		sanityWidth = table.outerWidth();
	}
	else if ( scrollXInner !== "" ) {
		// legacy x scroll inner has been given - use it
		tableStyle.width = _fnStringToCss(scrollXInner);

		// Recalculate the sanity width
		sanityWidth = table.outerWidth();
	}

	// Hidden header should have zero height, so remove padding and borders. Then
	// set the width based on the real headers

	// Apply all styles in one pass
	_fnApplyToChildren( zeroOut, headerSrcEls );

	// Read all widths in next pass
	_fnApplyToChildren( function(nSizer) {
		var style = window.getComputedStyle ?
			window.getComputedStyle(nSizer).width :
			_fnStringToCss( $(nSizer).width() );

		headerContent.push( nSizer.innerHTML );
		headerWidths.push( style );
	}, headerSrcEls );

	// Apply all widths in final pass
	_fnApplyToChildren( function(nToSize, i) {
		nToSize.style.width = headerWidths[i];
	}, headerTrgEls );

	$(headerSrcEls).css('height', 0);

	/* Same again with the footer if we have one */
	if ( footer )
	{
		_fnApplyToChildren( zeroOut, footerSrcEls );

		_fnApplyToChildren( function(nSizer) {
			footerContent.push( nSizer.innerHTML );
			footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, footerSrcEls );

		_fnApplyToChildren( function(nToSize, i) {
			nToSize.style.width = footerWidths[i];
		}, footerTrgEls );

		$(footerSrcEls).height(0);
	}


	/*
	 * 3. Apply the measurements
	 */

	// "Hide" the header and footer that we used for the sizing. We need to keep
	// the content of the cell so that the width applied to the header and body
	// both match, but we want to hide it completely. We want to also fix their
	// width to what they currently are
	_fnApplyToChildren( function(nSizer, i) {
		nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
		nSizer.childNodes[0].style.height = "0";
		nSizer.childNodes[0].style.overflow = "hidden";
		nSizer.style.width = headerWidths[i];
	}, headerSrcEls );

	if ( footer )
	{
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = footerWidths[i];
		}, footerSrcEls );
	}

	// Sanity check that the table is of a sensible width. If not then we are going to get
	// misalignment - try to prevent this by not allowing the table to shrink below its min width
	if ( Math.round(table.outerWidth()) < Math.round(sanityWidth) )
	{
		// The min width depends upon if we have a vertical scrollbar visible or not */
		correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
			divBody.css('overflow-y') == "scroll")) ?
				sanityWidth+barWidth :
				sanityWidth;

		// IE6/7 are a law unto themselves...
		if ( ie67 && (divBodyEl.scrollHeight >
			divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
		) {
			tableStyle.width = _fnStringToCss( correction-barWidth );
		}

		// And give the user a warning that we've stopped the table getting too small
		if ( scrollX === "" || scrollXInner !== "" ) {
			_fnLog( settings, 1, 'Possible column misalignment', 6 );
		}
	}
	else
	{
		correction = '100%';
	}

	// Apply to the container elements
	divBodyStyle.width = _fnStringToCss( correction );
	divHeaderStyle.width = _fnStringToCss( correction );

	if ( footer ) {
		settings.nScrollFoot.style.width = _fnStringToCss( correction );
	}


	/*
	 * 4. Clean up
	 */
	if ( ! scrollY ) {
		/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
		 * the scrollbar height from the visible display, rather than adding it on. We need to
		 * set the height in order to sort this. Don't want to do it in any other browsers.
		 */
		if ( ie67 ) {
			divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
		}
	}

	/* Finally set the width's of the header and footer tables */
	var iOuterWidth = table.outerWidth();
	divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
	divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );

	// Figure out if there are scrollbar present - if so then we need a the header and footer to
	// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
	var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
	var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
	divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";

	if ( footer ) {
		divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
		divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
		divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
	}

	// Correct DOM ordering for colgroup - comes before the thead
	table.children('colgroup').insertBefore( table.children('thead') );

	/* Adjust the position of the header in case we loose the y-scrollbar */
	divBody.trigger('scroll');

	// If sorting or filtering has occurred, jump the scrolling back to the top
	// only if we aren't holding the position
	if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
		divBodyEl.scrollTop = 0;
	}
}



/**
 * Apply a given function to the display child nodes of an element array (typically
 * TD children of TR rows
 *  @param {function} fn Method to apply to the objects
 *  @param array {nodes} an1 List of elements to look through for display children
 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
 *  @memberof DataTable#oApi
 */
function _fnApplyToChildren( fn, an1, an2 )
{
	var index=0, i=0, iLen=an1.length;
	var nNode1, nNode2;

	while ( i < iLen ) {
		nNode1 = an1[i].firstChild;
		nNode2 = an2 ? an2[i].firstChild : null;

		while ( nNode1 ) {
			if ( nNode1.nodeType === 1 ) {
				if ( an2 ) {
					fn( nNode1, nNode2, index );
				}
				else {
					fn( nNode1, index );
				}

				index++;
			}

			nNode1 = nNode1.nextSibling;
			nNode2 = an2 ? nNode2.nextSibling : null;
		}

		i++;
	}
}

