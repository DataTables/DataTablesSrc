
/**
 * Calculate the width of columns for the table
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnCalculateColumnWidths ( settings )
{
	// Not interested in doing column width calculation if auto-width is disabled
	if (! settings.oFeatures.bAutoWidth) {
		return;
	}

	var
		table = settings.nTable,
		columns = settings.aoColumns,
		scroll = settings.oScroll,
		scrollY = scroll.sY,
		scrollX = scroll.sX,
		scrollXInner = scroll.sXInner,
		visibleColumns = _fnGetColumns( settings, 'bVisible' ),
		tableWidthAttr = table.getAttribute('width'), // from DOM element
		tableContainer = table.parentNode,
		i, column, columnIdx;

	var styleWidth = table.style.width;
	if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
		tableWidthAttr = styleWidth;
	}

	// Let plug-ins know that we are doing a recalc, in case they have changed any of the
	// visible columns their own way (e.g. Responsive uses display:none).
	_fnCallbackFire(
		settings,
		null,
		'column-calc',
		{visible: visibleColumns},
		false
	);

	// Construct a single row, worst case, table with the widest
	// node in the data, assign any user defined widths, then insert it into
	// the DOM and allow the browser to do all the hard work of calculating
	// table widths
	var tmpTable = $(table.cloneNode())
		.css( 'visibility', 'hidden' )
		.removeAttr( 'id' );

	// Clean up the table body
	tmpTable.append('<tbody>')
	var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );

	// Clone the table header and footer - we can't use the header / footer
	// from the cloned table, since if scrolling is active, the table's
	// real header and footer are contained in different table tags
	tmpTable
		.append( $(settings.nTHead).clone() )
		.append( $(settings.nTFoot).clone() );

	// Remove any assigned widths from the footer (from scrolling)
	tmpTable.find('tfoot th, tfoot td').css('width', '');

	// Apply custom sizing to the cloned header
	tmpTable.find('thead th, thead td').each( function () {
		// Get the `width` from the header layout
		var width = _fnColumnsSumWidth( settings, this, true, false );

		if ( width ) {
			this.style.width = width;

			// For scrollX we need to force the column width otherwise the
			// browser will collapse it. If this width is smaller than the
			// width the column requires, then it will have no effect
			if ( scrollX ) {
				$( this ).append( $('<div/>').css( {
					width: width,
					margin: 0,
					padding: 0,
					border: 0,
					height: 1
				} ) );
			}
		}
		else {
			this.style.width = '';
		}
	} );

	// Find the widest piece of data for each column and put it into the table
	for ( i=0 ; i<visibleColumns.length ; i++ ) {
		columnIdx = visibleColumns[i];
		column = columns[ columnIdx ];

		var longest = _fnGetMaxLenString(settings, columnIdx);
		var autoClass = _ext.type.className[column.sType];
		var text = longest + column.sContentPadding;
		var insert = longest.indexOf('<') === -1
			? document.createTextNode(text)
			: text
		
		$('<td/>')
			.addClass(autoClass)
			.addClass(column.sClass)
			.append(insert)
			.appendTo(tr);
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

	// Get the width of each column in the constructed table
	var total = 0;
	var bodyCells = tmpTable.find('tbody tr').eq(0).children();

	for ( i=0 ; i<visibleColumns.length ; i++ ) {
		// Use getBounding for sub-pixel accuracy, which we then want to round up!
		var bounding = Math.ceil( bodyCells[i].getBoundingClientRect().width );

		// Total is tracked to remove any sub-pixel errors as the outerWidth
		// of the table might not equal the total given here
		total += bounding;

		// Width for each column to use
		columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding );
	}

	table.style.width = _fnStringToCss( total );

	// Finished with the table - ditch it
	holder.remove();

	// If there is a width attr, we want to attach an event listener which
	// allows the table sizing to automatically adjust when the window is
	// resized. Use the width attr rather than CSS, since we can't know if the
	// CSS is a relative value or absolute - DOM read is always px.
	if ( tableWidthAttr ) {
		table.style.width = _fnStringToCss( tableWidthAttr );
	}

	if ( (tableWidthAttr || scrollX) && ! settings._reszEvt ) {
		var bindResize = function () {
			$(window).on('resize.DT-'+settings.sInstance, DataTable.util.throttle( function () {
				if (! settings.bDestroying) {
					_fnAdjustColumnSizing( settings );
				}
			} ) );
		};

		bindResize();

		settings._reszEvt = true;
	}
}


/**
 * Get the maximum strlen for each data column
 *  @param {object} settings dataTables settings object
 *  @param {int} colIdx column of interest
 *  @returns {string} string of the max length
 *  @memberof DataTable#oApi
 */
function _fnGetMaxLenString( settings, colIdx )
{
	var column = settings.aoColumns[colIdx];

	if (! column.maxLenString) {
		var s, max='', maxLen = -1;
	
		for ( var i=0, ien=settings.aiDisplayMaster.length ; i<ien ; i++ ) {
			var rowIdx = settings.aiDisplayMaster[i];
			var data = _fnGetRowDisplay(settings, rowIdx)[colIdx];

			var cellString = data && typeof data === 'object' && data.nodeType
				? data.innerHTML
				: data+'';

			// Remove id / name attributes from elements so they
			// don't interfere with existing elements
			cellString = cellString
				.replace(/id=".*?"/g, '')
				.replace(/name=".*?"/g, '');

			s = _stripHtml(cellString)
				.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > maxLen ) {
				// We want the HTML in the string, but the length that
				// is important is the stripped string
				max = cellString;
				maxLen = s.length;
			}
		}

		column.maxLenString = max;
	}

	return column.maxLenString;
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

