

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
		i, column, columnIdx, width, outerWidth;

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
	if ( ! userInputs && ! scrollX && ! scrollY &&
	    columnCount == _fnVisbleColumns( oSettings ) &&
		columnCount == headerCells.length
	) {
		for ( i=0 ; i<columnCount ; i++ ) {
			columns[i].sWidth = _fnStringToCss( headerCells.eq(i).width() );
		}
	}
	else
	{
		// Otherwise construct a single row table with the widest node in the
		// data, assign any user defined widths, then insert it into the DOM and
		// allow the browser to do all the hard work of calculating table widths
		var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
			.empty()
			.css( 'visibility', 'hidden' )
			.removeAttr( 'id' )
			.append( $(oSettings.nTHead).clone( false ) )
			.append( $(oSettings.nTFoot).clone( false ) )
			.append( $('<tbody><tr/></tbody>') );

		// Remove any assigned widths from the footer (from scrolling)
		tmpTable.find('tfoot th, tfoot td').css('width', '');

		var tr = tmpTable.find( 'tbody tr' );

		// Apply custom sizing to the cloned header
		headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );

		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];

			headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
				_fnStringToCss( column.sWidthOrig ) :
				'';
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

		// Table has been built, attach to the document so we can work with it
		tmpTable.appendTo( tableContainer );

		// When scrolling (X or Y) we want to set the width of the table as 
		// appropriate. However, when not scrolling leave the table width as it
		// is. This results in slightly different, but I think correct behaviour
		if ( scrollX && scrollXInner ) {
			tmpTable.width( scrollXInner );
		}
		else if ( scrollX ) {
			tmpTable.css( 'width', 'auto' );

			if ( tmpTable.width() < tableContainer.offsetWidth ) {
				tmpTable.width( tableContainer.offsetWidth );
			}
		}
		else if ( scrollY ) {
			tmpTable.width( tableContainer.offsetWidth );
		}
		else if ( tableWidthAttr ) {
			tmpTable.width( tableWidthAttr );
		}

		// Take into account the y scrollbar
		_fnScrollingWidthAdjust( oSettings, tmpTable[0] );

		// Browsers need a bit of a hand when a width is assigned to any columns
		// when x-scrolling as they tend to collapse the table to the min-width,
		// even if we sent the column widths. So we need to keep track of what
		// the table width should be by summing the user given values, and the
		// automatic values
		if ( scrollX )
		{
			var total = 0;

			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
				outerWidth = $(headerCells[i]).outerWidth();

				total += column.sWidthOrig === null ?
					outerWidth :
					parseInt( column.sWidth, 10 ) + outerWidth - $(headerCells[i]).width();
			}

			tmpTable.width( _fnStringToCss( total ) );
			table.style.width = _fnStringToCss( total );
		}

		// Get the width of each column in the constructed table
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
			width = $(headerCells[i]).width();

			if ( width ) {
				column.sWidth = _fnStringToCss( width );
			}
		}

		table.style.width = _fnStringToCss( tmpTable.css('width') );

		// Finished with the table - ditch it
		tmpTable.remove();
	}

	// If there is a width attr, we want to attach an event listener which
	// allows the table sizing to automatically adjust when the window is
	// resized. Use the width attr rather than CSS, since we can't know if the
	// CSS is a relative value or absolute - DOM read is always px.
	if ( tableWidthAttr ) {
		table.style.width = _fnStringToCss( tableWidthAttr );
	}

	if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
		$(window).bind('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
			_fnAdjustColumnSizing( oSettings );
		} ) );

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
function _fnThrottle( fn, freq ) {
	var
		frequency = freq !== undefined ? freq : 200,
		last,
		timer;

	return function () {
		var
			that = this,
			now  = +new Date(),
			args = arguments;

		if ( last && now < last + frequency ) {
			clearTimeout( timer );

			timer = setTimeout( function () {
				last = undefined;
				fn.apply( that, args );
			}, frequency );
		}
		else {
			last = now;
			fn.apply( that, args );
		}
	};
}


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
 * Adjust a table's width to take account of vertical scroll bar
 *  @param {object} oSettings dataTables settings object
 *  @param {node} n table node
 *  @memberof DataTable#oApi
 */

function _fnScrollingWidthAdjust ( settings, n )
{
	var scroll = settings.oScroll;

	if ( scroll.sX || scroll.sY ) {
		// When y-scrolling only, we want to remove the width of the scroll bar
		// so the table + scroll bar will fit into the area available, otherwise
		// we fix the table at its current size with no adjustment
		var correction = ! scroll.sX ? scroll.iBarWidth : 0;
		n.style.width = _fnStringToCss( $(n).outerWidth() - correction );
	}
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


/**
 * Get the width of a scroll bar in this browser being used
 *  @returns {int} width in pixels
 *  @memberof DataTable#oApi
 */
function _fnScrollBarWidth ()
{
	// On first run a static variable is set, since this is only needed once.
	// Subsequent runs will just use the previously calculated value
	var width = DataTable.__scrollbarWidth;

	if ( width === undefined ) {
		var sizer = $('<p/>').css( {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: 150,
				padding: 0,
				overflow: 'scroll',
				visibility: 'hidden'
			} )
			.appendTo('body');

		width = sizer[0].offsetWidth - sizer[0].clientWidth;
		DataTable.__scrollbarWidth = width;

		sizer.remove();
	}

	return width;
}

