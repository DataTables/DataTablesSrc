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
		i, iLen;

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
		_fnRowAttributes( row );

		/* Process each column */
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			oCol = oSettings.aoColumns[i];

			nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
			cells.push( nTd );

			// Need to create the HTML if new, or if a rendering function is defined
			if ( !nTrIn || oCol.mRender || oCol.mData !== i )
			{
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

		_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
	}

	// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
	// and deployed
	row.nTr.setAttribute( 'role', 'row' );
}


/**
 * Add attributes to a row based on the special `DT_*` parameters in a data
 * source object.
 *  @param {object} DataTables row object for the row to be modified
 *  @memberof DataTable#oApi
 */
function _fnRowAttributes( row )
{
	var tr = row.nTr;
	var data = row._aData;

	if ( tr ) {
		if ( data.DT_RowId ) {
			tr.id = data.DT_RowId;
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
	var tfoot = oSettings.nTFoot;
	var createHeader = $('th, td', thead).length === 0;
	var classes = oSettings.oClasses;
	var columns = oSettings.aoColumns;

	if ( createHeader ) {
		row = $('<tr/>').appendTo( thead );
	}

	for ( i=0, ien=columns.length ; i<ien ; i++ ) {
		column = columns[i];
		cell = $( column.nTh ).addClass( column.sClass );

		if ( createHeader ) {
			cell.appendTo( row );
		}

		// 1.11 move into sorting
		if ( oSettings.oFeatures.bSort ) {
			cell.addClass( column.sSortingClass );

			if ( column.bSortable !== false ) {
				cell
					.attr( 'tabindex', oSettings.iTabIndex )
					.attr( 'aria-controls', oSettings.sTableId );

				_fnSortAttachListener( oSettings, column.nTh, i );
			}
		}

		if ( column.sTitle != cell.html() ) {
			cell.html( column.sTitle );
		}

		_fnRenderer( oSettings, 'header' )(
			oSettings, cell, column, classes
		);
	}

	if ( createHeader ) {
		_fnDetectHeader( oSettings.aoHeader, thead );
	}
	
	/* ARIA role for the rows */
 	$(thead).find('>tr').attr('role', 'row');

	/* Deal with the footer - add classes if required */
	$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
	$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );

	// Cache the footer cells. Note that we only take the cells from the first
	// row in the footer. If there is more than one row the user wants to
	// interact with, they need to use the table().foot() method. Note also this
	// allows cells to be used for multiple columns using colspan
	if ( tfoot !== null ) {
		var cells = oSettings.aoFooter[0];

		for ( i=0, ien=cells.length ; i<ien ; i++ ) {
			column = columns[i];
			column.nTf = cells[i].cell;

			if ( column.sClass ) {
				$(column.nTf).addClass( column.sClass );
			}
		}
	}
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
		aoLocal[i].nTr = aoSource[i].nTr;

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
		nLocalTr = aoLocal[i].nTr;

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
				[nRow, aoData._aData, iRowCount, j] );

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
 * Add the options to the page HTML for the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnAddOptionsHtml ( oSettings )
{
	var classes = oSettings.oClasses;
	var table = $(oSettings.nTable);
	var holding = $('<div/>').insertBefore( table ); // Holding element for speed
	var features = oSettings.oFeatures;

	// All DataTables are wrapped in a div
	var insert = $('<div/>', {
		id:      oSettings.sTableId+'_wrapper',
		'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
	} );

	oSettings.nHolding = holding[0];
	oSettings.nTableWrapper = insert[0];
	oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;

	/* Loop over the user set positioning and place the elements as needed */
	var aDom = oSettings.sDom.split('');
	var featureNode, cOption, nNewNode, cNext, sAttr, j;
	for ( var i=0 ; i<aDom.length ; i++ )
	{
		featureNode = null;
		cOption = aDom[i];

		if ( cOption == '<' )
		{
			/* New container div */
			nNewNode = $('<div/>')[0];

			/* Check to see if we should append an id and/or a class name to the container */
			cNext = aDom[i+1];
			if ( cNext == "'" || cNext == '"' )
			{
				sAttr = "";
				j = 2;
				while ( aDom[i+j] != cNext )
				{
					sAttr += aDom[i+j];
					j++;
				}

				/* Replace jQuery UI constants @todo depreciated */
				if ( sAttr == "H" )
				{
					sAttr = classes.sJUIHeader;
				}
				else if ( sAttr == "F" )
				{
					sAttr = classes.sJUIFooter;
				}

				/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
				 * breaks the string into parts and applies them as needed
				 */
				if ( sAttr.indexOf('.') != -1 )
				{
					var aSplit = sAttr.split('.');
					nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
					nNewNode.className = aSplit[1];
				}
				else if ( sAttr.charAt(0) == "#" )
				{
					nNewNode.id = sAttr.substr(1, sAttr.length-1);
				}
				else
				{
					nNewNode.className = sAttr;
				}

				i += j; /* Move along the position array */
			}

			insert.append( nNewNode );
			insert = $(nNewNode);
		}
		else if ( cOption == '>' )
		{
			/* End container div */
			insert = insert.parent();
		}
		// @todo Move options into their own plugins?
		else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
		{
			/* Length */
			featureNode = _fnFeatureHtmlLength( oSettings );
		}
		else if ( cOption == 'f' && features.bFilter )
		{
			/* Filter */
			featureNode = _fnFeatureHtmlFilter( oSettings );
		}
		else if ( cOption == 'r' && features.bProcessing )
		{
			/* pRocessing */
			featureNode = _fnFeatureHtmlProcessing( oSettings );
		}
		else if ( cOption == 't' )
		{
			/* Table */
			featureNode = _fnFeatureHtmlTable( oSettings );
		}
		else if ( cOption ==  'i' && features.bInfo )
		{
			/* Info */
			featureNode = _fnFeatureHtmlInfo( oSettings );
		}
		else if ( cOption == 'p' && features.bPaginate )
		{
			/* Pagination */
			featureNode = _fnFeatureHtmlPaginate( oSettings );
		}
		else if ( DataTable.ext.feature.length !== 0 )
		{
			/* Plug-in features */
			var aoFeatures = DataTable.ext.feature;
			for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
			{
				if ( cOption == aoFeatures[k].cFeature )
				{
					featureNode = aoFeatures[k].fnInit( oSettings );
					break;
				}
			}
		}

		/* Add to the 2D features array */
		if ( featureNode )
		{
			var aanFeatures = oSettings.aanFeatures;

			if ( ! aanFeatures[cOption] )
			{
				aanFeatures[cOption] = [];
			}

			aanFeatures[cOption].push( featureNode );
			insert.append( featureNode );
		}
	}

	/* Built our DOM structure - replace the holding div with what we want */
	holding.replaceWith( insert );
}


/**
 * Use the DOM source to create up an array of header cells. The idea here is to
 * create a layout grid (array) of rows x columns, which contains a reference
 * to the cell that that point in the grid (regardless of col/rowspan), such that
 * any column / row could be removed and the new grid constructed
 *  @param array {object} aLayout Array to store the calculated layout in
 *  @param {node} nThead The header/footer element for the table
 *  @memberof DataTable#oApi
 */
function _fnDetectHeader ( aLayout, nThead )
{
	var nTrs = $(nThead).children('tr');
	var nTr, nCell;
	var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
	var bUnique;
	var fnShiftCol = function ( a, i, j ) {
		var k = a[i];
                while ( k[j] ) {
			j++;
		}
		return j;
	};

	aLayout.splice( 0, aLayout.length );

	/* We know how many rows there are in the layout - so prep it */
	for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
	{
		aLayout.push( [] );
	}

	/* Calculate a layout array */
	for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
	{
		nTr = nTrs[i];
		iColumn = 0;

		/* For every cell in the row... */
		nCell = nTr.firstChild;
		while ( nCell ) {
			if ( nCell.nodeName.toUpperCase() == "TD" ||
			     nCell.nodeName.toUpperCase() == "TH" )
			{
				/* Get the col and rowspan attributes from the DOM and sanitise them */
				iColspan = nCell.getAttribute('colspan') * 1;
				iRowspan = nCell.getAttribute('rowspan') * 1;
				iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
				iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;

				/* There might be colspan cells already in this row, so shift our target
				 * accordingly
				 */
				iColShifted = fnShiftCol( aLayout, i, iColumn );

				/* Cache calculation for unique columns */
				bUnique = iColspan === 1 ? true : false;

				/* If there is col / rowspan, copy the information into the layout grid */
				for ( l=0 ; l<iColspan ; l++ )
				{
					for ( k=0 ; k<iRowspan ; k++ )
					{
						aLayout[i+k][iColShifted+l] = {
							"cell": nCell,
							"unique": bUnique
						};
						aLayout[i+k].nTr = nTr;
					}
				}
			}
			nCell = nCell.nextSibling;
		}
	}
}


/**
 * Get an array of unique th elements, one for each column
 *  @param {object} oSettings dataTables settings object
 *  @param {node} nHeader automatically detect the layout from this node - optional
 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
 *  @returns array {node} aReturn list of unique th's
 *  @memberof DataTable#oApi
 */
function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
{
	var aReturn = [];
	if ( !aLayout )
	{
		aLayout = oSettings.aoHeader;
		if ( nHeader )
		{
			aLayout = [];
			_fnDetectHeader( aLayout, nHeader );
		}
	}

	for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
	{
		for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
		{
			if ( aLayout[i][j].unique &&
				 (!aReturn[j] || !oSettings.bSortCellsTop) )
			{
				aReturn[j] = aLayout[i][j].cell;
			}
		}
	}

	return aReturn;
}

