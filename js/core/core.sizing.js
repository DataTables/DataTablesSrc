

var __re_html_remove = /<.*?>/g;


/**
 * Calculate the width of columns for the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnCalculateColumnWidths ( oSettings )
{
	var
		table = oSettings.nTable,
		columns = oSettings.aoColumns,
		scroll = oSettings.oScroll,
		scrollY = scroll.sY,
		scrollX = scroll.sX,
		scrollXInner = scroll.sXInner,
		columnCount = columns.length,
		visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
		headerCells = $('th', oSettings.nTHead),
		tableWidthAttr = table.getAttribute('width'), // from DOM element
		tableContainer = table.parentNode,
		userInputs = false,
		i, column, columnIdx, width, outerWidth,
		browser = oSettings.oBrowser,
		ie67 = browser.bScrollOversize;

	var styleWidth = table.style.width;
	if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
		tableWidthAttr = styleWidth;
	}

	/* Convert any user input sizes into pixel sizes */
	for ( i=0 ; i<visibleColumns.length ; i++ ) {
		column = columns[ visibleColumns[i] ];

		if ( column.sWidth !== null ) {
			column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );

			userInputs = true;
		}
	}

	/* If the number of columns in the DOM equals the number that we have to
	 * process in DataTables, then we can use the offsets that are created by
	 * the web- browser. No custom sizes can be set in order for this to happen,
	 * nor scrolling used
	 */
	if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
	     columnCount == _fnVisbleColumns( oSettings ) &&
	     columnCount == headerCells.length
	) {
		for ( i=0 ; i<columnCount ; i++ ) {
			var colIdx = _fnVisibleToColumnIndex( oSettings, i );

			if ( colIdx !== null ) {
				columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
			}
		}
	}
	else
	{
		// Otherwise construct a single row, worst case, table with the widest
		// node in the data, assign any user defined widths, then insert it into
		// the DOM and allow the browser to do all the hard work of calculating
		// table widths
		var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
			.css( 'visibility', 'hidden' )
			.removeAttr( 'id' );

		// Clean up the table body
		tmpTable.find('tbody tr').remove();
		var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );

		// Clone the table header and footer - we can't use the header / footer
		// from the cloned table, since if scrolling is active, the table's
		// real header and footer are contained in different table tags
		tmpTable.find('thead, tfoot').remove();
		tmpTable
			.append( $(oSettings.nTHead).clone() )
			.append( $(oSettings.nTFoot).clone() );

		// Remove any assigned widths from the footer (from scrolling)
		tmpTable.find('tfoot th, tfoot td').css('width', '');

		// Apply custom sizing to the cloned header
		headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );

		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];

			headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
				_fnStringToCss( column.sWidthOrig ) :
				'';

			// For scrollX we need to force the column width otherwise the
			// browser will collapse it. If this width is smaller than the
			// width the column requires, then it will have no effect
			if ( column.sWidthOrig && scrollX ) {
				$( headerCells[i] ).append( $('<div/>').css( {
					width: column.sWidthOrig,
					margin: 0,
					padding: 0,
					border: 0,
					height: 1
				} ) );
			}
		}

		// Find the widest cell for each column and put it into the table
		if ( oSettings.aoData.length ) {
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				columnIdx = visibleColumns[i];
				column = columns[ columnIdx ];

				$( _fnGetWidestNode( oSettings, columnIdx ) )
					.clone( false )
					.append( column.sContentPadding )
					.appendTo( tr );
			}
		}

		// Tidy the temporary table - remove name attributes so there aren't
		// duplicated in the dom (radio elements for example)
		$('[name]', tmpTable).removeAttr('name');

		// Table has been built, attach to the document so we can work with it.
		// A holding element is used, positioned at the top of the container
		// with minimal height, so it has no effect on if the container scrolls
		// or not. Otherwise it might trigger scrolling when it actually isn't
		// needed
		var holder = $('<div/>').css( scrollX || scrollY ?
				{
					position: 'absolute',
					top: 0,
					left: 0,
					height: 1,
					right: 0,
					overflow: 'hidden'
				} :
				{}
			)
			.append( tmpTable )
			.appendTo( tableContainer );

		// When scrolling (X or Y) we want to set the width of the table as 
		// appropriate. However, when not scrolling leave the table width as it
		// is. This results in slightly different, but I think correct behaviour
		if ( scrollX && scrollXInner ) {
			tmpTable.width( scrollXInner );
		}
		else if ( scrollX ) {
			tmpTable.css( 'width', 'auto' );
			tmpTable.removeAttr('width');

			// If there is no width attribute or style, then allow the table to
			// collapse
			if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
				tmpTable.width( tableContainer.clientWidth );
			}
		}
		else if ( scrollY ) {
			tmpTable.width( tableContainer.clientWidth );
		}
		else if ( tableWidthAttr ) {
			tmpTable.width( tableWidthAttr );
		}

		// Get the width of each column in the constructed table - we need to
		// know the inner width (so it can be assigned to the other table's
		// cells) and the outer width so we can calculate the full width of the
		// table. This is safe since DataTables requires a unique cell for each
		// column, but if ever a header can span multiple columns, this will
		// need to be modified.
		var total = 0;
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			var cell = $(headerCells[i]);
			var border = cell.outerWidth() - cell.width();

			// Use getBounding... where possible (not IE8-) because it can give
			// sub-pixel accuracy, which we then want to round up!
			var bounding = browser.bBounding ?
				Math.ceil( headerCells[i].getBoundingClientRect().width ) :
				cell.outerWidth();

			// Total is tracked to remove any sub-pixel errors as the outerWidth
			// of the table might not equal the total given here (IE!).
			total += bounding;

			// Width for each column to use
			columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
		}

		table.style.width = _fnStringToCss( total );

		// Finished with the table - ditch it
		holder.remove();
	}

	// If there is a width attr, we want to attach an event listener which
	// allows the table sizing to automatically adjust when the window is
	// resized. Use the width attr rather than CSS, since we can't know if the
	// CSS is a relative value or absolute - DOM read is always px.
	if ( tableWidthAttr ) {
		table.style.width = _fnStringToCss( tableWidthAttr );
	}

	if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
		var bindResize = function () {
			$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
				_fnAdjustColumnSizing( oSettings );
			} ) );
		};

		// IE6/7 will crash if we bind a resize event handler on page load.
		// To be removed in 1.11 which drops IE6/7 support
		if ( ie67 ) {
			setTimeout( bindResize, 1000 );
		}
		else {
			bindResize();
		}

		oSettings._reszEvt = true;
	}
}


/**
 * Throttle the calls to a function. Arguments and context are maintained for
 * the throttled function
 *  @param {function} fn Function to be called
 *  @param {int} [freq=200] call frequency in mS
 *  @returns {function} wrapped function
 *  @memberof DataTable#oApi
 */
var _fnThrottle = DataTable.util.throttle;


/**
 * Convert a CSS unit width to pixels (e.g. 2em)
 *  @param {string} width width to be converted
 *  @param {node} parent parent to get the with for (required for relative widths) - optional
 *  @returns {int} width in pixels
 *  @memberof DataTable#oApi
 */
function _fnConvertToWidth ( width, parent )
{
	if ( ! width ) {
		return 0;
	}

	var n = $('<div/>')
		.css( 'width', _fnStringToCss( width ) )
		.appendTo( parent || document.body );

	var val = n[0].offsetWidth;
	n.remove();

	return val;
}


/**
 * Get the widest node
 *  @param {object} settings dataTables settings object
 *  @param {int} colIdx column of interest
 *  @returns {node} widest table node
 *  @memberof DataTable#oApi
 */
function _fnGetWidestNode( settings, colIdx )
{
	var idx = _fnGetMaxLenString( settings, colIdx );
	if ( idx < 0 ) {
		return null;
	}

	var data = settings.aoData[ idx ];
	return ! data.nTr ? // Might not have been created when deferred rendering
		$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
		data.anCells[ colIdx ];
}


/**
 * Get the maximum strlen for each data column
 *  @param {object} settings dataTables settings object
 *  @param {int} colIdx column of interest
 *  @returns {string} max string length for each column
 *  @memberof DataTable#oApi
 */
function _fnGetMaxLenString( settings, colIdx )
{
	var s, max=-1, maxIdx = -1;

	for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
		s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
		s = s.replace( __re_html_remove, '' );
		s = s.replace( /&nbsp;/g, ' ' );

		if ( s.length > max ) {
			max = s.length;
			maxIdx = i;
		}
	}

	return maxIdx;
}


/**
 * Append a CSS unit (only if required) to a string
 *  @param {string} value to css-ify
 *  @returns {string} value with css unit
 *  @memberof DataTable#oApi
 */
function _fnStringToCss( s )
{
	if ( s === null ) {
		return '0px';
	}

	if ( typeof s == 'number' ) {
		return s < 0 ?
			'0px' :
			s+'px';
	}

	// Check it has a unit character already
	return s.match(/\d$/) ?
		s+'px' :
		s;
}

