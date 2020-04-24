/**
 * Create a new TR element (and it's TD children) for a row
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow Row to consider
 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
 *    DataTables will create a row automatically
 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
 *    if nTr is.
 *  @memberof DataTable#oApi
 */
function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
{
	var
		row = oSettings.aoData[iRow],
		rowData = row._aData,
		cells = [],
		nTr, nTd, oCol,
		i, iLen, create;

	if ( row.nTr === null )
	{
		nTr = nTrIn || document.createElement('tr');

		row.nTr = nTr;
		row.anCells = cells;

		/* Use a private property on the node to allow reserve mapping from the node
		 * to the aoData array for fast look up
		 */
		nTr._DT_RowIndex = iRow;

		/* Special parameters can be given by the data source to be used on the row */
		_fnRowAttributes( oSettings, row );

		/* Process each column */
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			oCol = oSettings.aoColumns[i];
			create = nTrIn ? false : true;

			nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
			nTd._DT_CellIndex = {
				row: iRow,
				column: i
			};
			
			cells.push( nTd );

			// Need to create the HTML if new, or if a rendering function is defined
			if ( create || ((!nTrIn || oCol.mRender || oCol.mData !== i) &&
				 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
			)) {
				nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
			}

			/* Add user defined class */
			if ( oCol.sClass )
			{
				nTd.className += ' '+oCol.sClass;
			}

			// Visibility - add or remove as required
			if ( oCol.bVisible && ! nTrIn )
			{
				nTr.appendChild( nTd );
			}
			else if ( ! oCol.bVisible && nTrIn )
			{
				nTd.parentNode.removeChild( nTd );
			}

			if ( oCol.fnCreatedCell )
			{
				oCol.fnCreatedCell.call( oSettings.oInstance,
					nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
				);
			}
		}

		_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
	}

	// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
	// and deployed
	row.nTr.setAttribute( 'role', 'row' );
}


/**
 * Add attributes to a row based on the special `DT_*` parameters in a data
 * source object.
 *  @param {object} settings DataTables settings object
 *  @param {object} DataTables row object for the row to be modified
 *  @memberof DataTable#oApi
 */
function _fnRowAttributes( settings, row )
{
	var tr = row.nTr;
	var data = row._aData;

	if ( tr ) {
		var id = settings.rowIdFn( data );

		if ( id ) {
			tr.id = id;
		}

		if ( data.DT_RowClass ) {
			// Remove any classes added by DT_RowClass before
			var a = data.DT_RowClass.split(' ');
			row.__rowc = row.__rowc ?
				_unique( row.__rowc.concat( a ) ) :
				a;

			$(tr)
				.removeClass( row.__rowc.join(' ') )
				.addClass( data.DT_RowClass );
		}

		if ( data.DT_RowAttr ) {
			$(tr).attr( data.DT_RowAttr );
		}

		if ( data.DT_RowData ) {
			$(tr).data( data.DT_RowData );
		}
	}
}


/**
 * Create the HTML header for the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnBuildHead( oSettings )
{
	var i, ien, cell, row, column;
	var thead = oSettings.nTHead;
	var createHeader = $('th, td', thead).length === 0;
	var classes = oSettings.oClasses;
	var columns = oSettings.aoColumns;

	if ( createHeader ) {
		row = $('<tr/>')
			.appendTo( thead );

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			$('<th/>')
				.html( columns[i].sTitle )
				.appendTo( row );
		}
	}

	oSettings.aoHeader = _fnDetectHeader( oSettings, thead, true );

	// ARIA role for the rows
	$(thead).children('tr').attr('role', 'row');

	// Every cell in the header needs to be passed through the renderer
	$(thead).children('tr').children('th, td')
		.each( function () {
			_fnRenderer( oSettings, 'header' )(
				oSettings, $(this), classes
			);
		} );
}


/**
 * Draw the header (or footer) element based on the column visibility states. The
 * methodology here is to use the layout array from _fnDetectHeader, modified for
 * the instantaneous column visibility, to construct the new layout. The grid is
 * traversed over cell at a time in a rows x columns grid fashion, although each
 * cell insert can cover multiple elements in the grid - which is tracks using the
 * aApplied array. Cell inserts in the grid will only occur where there isn't
 * already a cell in that position.
 *  @param {object} oSettings dataTables settings object
 *  @param array {objects} aoSource Layout array from _fnDetectHeader
 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
 *  @memberof DataTable#oApi
 */
function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
{
	var i, iLen, j, jLen, k, kLen, n, nLocalTr;
	var aoLocal = [];
	var aApplied = [];
	var iColumns = oSettings.aoColumns.length;
	var iRowspan, iColspan;

	if ( ! aoSource )
	{
		return;
	}

	if (  bIncludeHidden === undefined )
	{
		bIncludeHidden = false;
	}

	/* Make a copy of the master layout array, but without the visible columns in it */
	for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
	{
		aoLocal[i] = aoSource[i].slice();
		aoLocal[i].row = aoSource[i].row;

		/* Remove any columns which are currently hidden */
		for ( j=iColumns-1 ; j>=0 ; j-- )
		{
			if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
			{
				aoLocal[i].splice( j, 1 );
			}
		}

		/* Prep the applied array - it needs an element for each row */
		aApplied.push( [] );
	}

	for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
	{
		nLocalTr = aoLocal[i].row;

		/* All cells are going to be replaced, so empty out the row */
		if ( nLocalTr )
		{
			while( (n = nLocalTr.firstChild) )
			{
				nLocalTr.removeChild( n );
			}
		}

		for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
		{
			iRowspan = 1;
			iColspan = 1;

			/* Check to see if there is already a cell (row/colspan) covering our target
			 * insert point. If there is, then there is nothing to do.
			 */
			if ( aApplied[i][j] === undefined )
			{
				nLocalTr.appendChild( aoLocal[i][j].cell );
				aApplied[i][j] = 1;

				/* Expand the cell to cover as many rows as needed */
				while ( aoLocal[i+iRowspan] !== undefined &&
				        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
				{
					aApplied[i+iRowspan][j] = 1;
					iRowspan++;
				}

				/* Expand the cell to cover as many columns as needed */
				while ( aoLocal[i][j+iColspan] !== undefined &&
				        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
				{
					/* Must update the applied array over the rows for the columns */
					for ( k=0 ; k<iRowspan ; k++ )
					{
						aApplied[i+k][j+iColspan] = 1;
					}
					iColspan++;
				}

				/* Do the actual expansion in the DOM */
				$(aoLocal[i][j].cell)
					.attr('rowspan', iRowspan)
					.attr('colspan', iColspan);
			}
		}
	}
}


/**
 * Insert the required TR nodes into the table for display
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnDraw( oSettings )
{
	/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
	var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
	if ( $.inArray( false, aPreDraw ) !== -1 )
	{
		_fnProcessingDisplay( oSettings, false );
		return;
	}

	var i, iLen, n;
	var anRows = [];
	var iRowCount = 0;
	var asStripeClasses = oSettings.asStripeClasses;
	var iStripes = asStripeClasses.length;
	var iOpenRows = oSettings.aoOpenRows.length;
	var oLang = oSettings.oLanguage;
	var iInitDisplayStart = oSettings.iInitDisplayStart;
	var bServerSide = _fnDataSource( oSettings ) == 'ssp';
	var aiDisplay = oSettings.aiDisplay;

	oSettings.bDrawing = true;

	/* Check and see if we have an initial draw position from state saving */
	if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
	{
		oSettings._iDisplayStart = bServerSide ?
			iInitDisplayStart :
			iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
				0 :
				iInitDisplayStart;

		oSettings.iInitDisplayStart = -1;
	}

	var iDisplayStart = oSettings._iDisplayStart;
	var iDisplayEnd = oSettings.fnDisplayEnd();

	/* Server-side processing draw intercept */
	if ( oSettings.bDeferLoading )
	{
		oSettings.bDeferLoading = false;
		oSettings.iDraw++;
		_fnProcessingDisplay( oSettings, false );
	}
	else if ( !bServerSide )
	{
		oSettings.iDraw++;
	}
	else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
	{
		return;
	}

	if ( aiDisplay.length !== 0 )
	{
		var iStart = bServerSide ? 0 : iDisplayStart;
		var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;

		for ( var j=iStart ; j<iEnd ; j++ )
		{
			var iDataIndex = aiDisplay[j];
			var aoData = oSettings.aoData[ iDataIndex ];
			if ( aoData.nTr === null )
			{
				_fnCreateTr( oSettings, iDataIndex );
			}

			var nRow = aoData.nTr;

			/* Remove the old striping classes and then add the new one */
			if ( iStripes !== 0 )
			{
				var sStripe = asStripeClasses[ iRowCount % iStripes ];
				if ( aoData._sRowStripe != sStripe )
				{
					$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
					aoData._sRowStripe = sStripe;
				}
			}

			// Row callback functions - might want to manipulate the row
			// iRowCount and j are not currently documented. Are they at all
			// useful?
			_fnCallbackFire( oSettings, 'aoRowCallback', null,
				[nRow, aoData._aData, iRowCount, j, iDataIndex] );

			anRows.push( nRow );
			iRowCount++;
		}
	}
	else
	{
		/* Table is empty - create a row with an empty message in it */
		var sZero = oLang.sZeroRecords;
		if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
		{
			sZero = oLang.sLoadingRecords;
		}
		else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
		{
			sZero = oLang.sEmptyTable;
		}

		anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
			.append( $('<td />', {
				'valign':  'top',
				'colSpan': _fnVisbleColumns( oSettings ),
				'class':   oSettings.oClasses.sRowEmpty
			} ).html( sZero ) )[0];
	}

	/* Header and footer callbacks */
	_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
		_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );

	_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
		_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );

	var body = $(oSettings.nTBody);

	body.children().detach();
	body.append( $(anRows) );

	/* Call all required callback functions for the end of a draw */
	_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );

	/* Draw is complete, sorting and filtering must be as well */
	oSettings.bSorted = false;
	oSettings.bFiltered = false;
	oSettings.bDrawing = false;
}


/**
 * Redraw the table - taking account of the various features which are enabled
 *  @param {object} oSettings dataTables settings object
 *  @param {boolean} [holdPosition] Keep the current paging position. By default
 *    the paging is reset to the first page
 *  @memberof DataTable#oApi
 */
function _fnReDraw( settings, holdPosition )
{
	var
		features = settings.oFeatures,
		sort     = features.bSort,
		filter   = features.bFilter;

	if ( sort ) {
		_fnSort( settings );
	}

	if ( filter ) {
		_fnFilterComplete( settings, settings.oPreviousSearch );
	}
	else {
		// No filtering, so we want to just use the display master
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	}

	if ( holdPosition !== true ) {
		settings._iDisplayStart = 0;
	}

	// Let any modules know about the draw hold position state (used by
	// scrolling internally)
	settings._drawHold = holdPosition;

	_fnDraw( settings );

	settings._drawHold = false;
}


/**
 * Convert a `layout` object given by a user to the object structure needed
 * for the renderer. This is done twice, once for above and once for below
 * the table. Ordering must also be considered.
 *
 * @param {*} settings DataTables settings object
 * @param {*} layout Layout object to convert
 * @param {string} side `top` or `bottom`
 * @returns Converted array structure - one item for each row.
 */
function _layoutArray ( settings, layout, side )
{
	var groups = {};

	// Combine into like groups (e.g. `top`, `top2`, etc)
	$.each( layout, function ( pos, val ) {
		if (val === null) {
			return;
		}

		var splitPos = pos.replace(/([A-Z])/g, ' $1').split(' ');

		if ( ! groups[ splitPos[0] ] ) {
			groups[ splitPos[0] ] = {};
		}

		var align = splitPos.length === 1 ?
			'full' :
			splitPos[1].toLowerCase();
		var group = groups[ splitPos[0] ];

		// Transform to an object with a contents property
		if ( $.isPlainObject( val ) && val.contents ) {
			group[ align ] = val;
		}
		else {
			group[ align ] = {
				contents: val
			};
		}

		// And make contents an array
		if ( ! $.isArray( group[ align ].contents ) ) {
			group[ align ].contents = [ group[ align ].contents ];
		}
	} );

	var filtered = $.map( groups, function ( group, pos ) {
		// Filter to only the side we need
		if ( pos.indexOf(side) !== 0 ) {
			return null;
		}

		return {
			name: pos,
			val: group
		};
	} );

	// Order by item identifier
	filtered.sort( function ( a, b ) {
		var order1 = a.name.replace(/[^0-9]/g, '') * 1;
		var order2 = b.name.replace(/[^0-9]/g, '') * 1;

		return order2 - order1;
	} );
	
	if ( side === 'bottom' ) {
		filtered.reverse();
	}

	// Split into rows
	var rows = [];
	for ( var i=0, ien=filtered.length ; i<ien ; i++ ) {
		if (  filtered[i].val.full ) {
			rows.push( { full: filtered[i].val.full } );
			_layoutResolve( settings, rows[ rows.length - 1 ] );

			delete filtered[i].val.full;
		}

		if ( ! $.isEmptyObject( filtered[i].val ) ) {
			rows.push( filtered[i].val );
			_layoutResolve( settings, rows[ rows.length - 1 ] );
		}
	}

	return rows;
}


/**
 * Convert the contents of a row's layout object to nodes that can be inserted
 * into the document by a renderer. Execute functions, look up plug-ins, etc.
 *
 * @param {*} settings DataTables settings object
 * @param {*} row Layout object for this row
 */
function _layoutResolve( settings, row ) {
	var getFeature = function (feature, args) {
		if ( ! _ext.features[ feature ] ) {
			_fnLog( settings, 0, 'Unknown feature: '+ feature );
		}

		args = args
			? args.slice()
			: [];

		args.unshift(settings);
		return _ext.features[ feature ].apply( this, args );
	};

	var resolve = function ( item ) {
		var line = row[ item ].contents;

		for ( var i=0, ien=line.length ; i<ien ; i++ ) {
			if ( ! line[i] ) {
				continue;
			}
			else if ( typeof line[i] === 'string' ) {
				line[i] = getFeature( line[i], [] );
			}
			else if ( $.isPlainObject(line[i]) ) {
				line[i] = getFeature( line[i].feature, line[i].args || [] );
			}
			else if ( typeof line[i].node === 'function' ) {
				line[i] = line[i].node( settings );
			}
			else if ( typeof line[i] === 'function' ) {
				var inst = line[i]( settings );

				line[i] = typeof inst.node === 'function' ?
					inst.node() :
					inst;
			}
		}
	};

	$.each( row, function ( key ) {
		resolve( key );
	} );
}


/**
 * Add the options to the page HTML for the table
 *  @param {object} settings DataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnAddOptionsHtml ( settings )
{
	var classes = settings.oClasses;
	var table = $(settings.nTable);
	var top = _layoutArray( settings, settings.layout, 'top' );
	var bottom = _layoutArray( settings, settings.layout, 'bottom' );
	var renderer = _fnRenderer( settings, 'layout' );

	// Wrapper div around everything DataTables controls
	var insert = $('<div/>', {
			id:      settings.sTableId+'_wrapper',
			'class': classes.sWrapper + (settings.nTFoot ? '' : ' '+classes.sNoFooter)
		} )
		.insertBefore( table );

	settings.nTableWrapper = insert[0];
	settings.nTableReinsertBefore = settings.nTable.nextSibling;

	// Everything above - the renderer will actually insert the contents into the document
	for ( var i=0, ien=top.length ; i<ien ; i++ ) {
		renderer( settings, insert, top[i] );
	}

	// The table - always the center of attention
	renderer( settings, insert, {
		full: {
			table: true,
			contents: [ _fnFeatureHtmlTable(settings) ]
		}
	} );

	// Processing floats on top, so it isn't an inserted feature
	_processingHtml( settings );

	// Everything below
	for ( var i=0, ien=bottom.length ; i<ien ; i++ ) {
		renderer( settings, insert, bottom[i] );
	}
}


/**
 * Use the DOM source to create up an array of header cells. The idea here is to
 * create a layout grid (array) of rows x columns, which contains a reference
 * to the cell that that point in the grid (regardless of col/rowspan), such that
 * any column / row could be removed and the new grid constructed
 *  @param {node} thead The header/footer element for the table
 *  @returns {array} Calculated layout array
 *  @memberof DataTable#oApi
 */
function _fnDetectHeader ( settings, thead, write )
{
	var columns = settings.aoColumns;
	var rows = $(thead).children('tr');
	var row, cell;
	var i, k, l, iLen, shifted, column, colspan, rowspan;
	var layout = [];
	var unique;
	var shift = function ( a, i, j ) {
		var k = a[i];
		while ( k[j] ) {
			j++;
		}
		return j;
	};

	// We know how many rows there are in the layout - so prep it
	for ( i=0, iLen=rows.length ; i<iLen ; i++ ) {
		layout.push( [] );
	}

	for ( i=0, iLen=rows.length ; i<iLen ; i++ ) {
		row = rows[i];
		column = 0;

		// For every cell in the row..
		cell = row.firstChild;
		while ( cell ) {
			if ( cell.nodeName.toUpperCase() == 'TD' ||
			     cell.nodeName.toUpperCase() == 'TH' )
			{
				var cols = [];

				// Get the col and rowspan attributes from the DOM and sanitise them
				colspan = cell.getAttribute('colspan') * 1;
				rowspan = cell.getAttribute('rowspan') * 1;
				colspan = (!colspan || colspan===0 || colspan===1) ? 1 : colspan;
				rowspan = (!rowspan || rowspan===0 || rowspan===1) ? 1 : rowspan;

				// There might be colspan cells already in this row, so shift our target
				// accordingly
				shifted = shift( layout, i, column );

				// Cache calculation for unique columns
				unique = colspan === 1 ?
					true :
					false;
				
				// Perform header setup
				if ( write && unique ) {
					// Allow column options to be set from HTML attributes
					_fnColumnOptions( settings, shifted, $(cell).data() );
					
					// Get the width for the column. This can be defined from the
					// width attribute, style attribute or `columns.width` option
					var columnDef = columns[shifted];
					var width = cell.getAttribute('width') || null;
					var t = cell.style.width.match(/width:\s*(\d+[pxem%]+)/);
					if ( t ) {
						width = t[1];
					}

					columnDef.sWidthOrig = columnDef.sWidth || width;

					// This happens _before_ the renderer, so the original HTML
					// is still in place.
					if ( columnDef.sTitle !== null && cell.innerHTML !== columnDef.sTitle ) {
						cell.innerHTML = columnDef.sTitle;
					}

					// Column specific class names
					if ( columnDef.className ) {
						$(cell).addClass( columnDef.className );
					}
				}

				// If there is col / rowspan, copy the information into the layout grid
				for ( l=0 ; l<colspan ; l++ ) {
					for ( k=0 ; k<rowspan ; k++ ) {
						layout[i+k][shifted+l] = {
							cell: cell,
							unique: unique
						};

						layout[i+k].row = row;
					}

					cols.push( shifted+l );
				}

				// Assign an attribute so spanning cells can still be identified
				// as belonging to a column
				cell.setAttribute('data-dt-column', _unique(cols).join(','));
			}

			cell = cell.nextSibling;
		}
	}

	return layout;
}
