/**
 * Add a column to the list used for the table with default values
 *  @param {object} oSettings dataTables settings object
 *  @param {node} nTh The th element for this column
 *  @memberof DataTable#oApi
 */
function _fnAddColumn( oSettings, nTh )
{
	// Add column to aoColumns array
	var oDefaults = DataTable.defaults.column;
	var iCol = oSettings.aoColumns.length;
	var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
		"nTh": nTh ? nTh : document.createElement('th'),
		"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
		"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
		"mData": oDefaults.mData ? oDefaults.mData : iCol,
		idx: iCol
	} );
	oSettings.aoColumns.push( oCol );

	// Add search object for column specific search. Note that the `searchCols[ iCol ]`
	// passed into extend can be undefined. This allows the user to give a default
	// with only some of the parameters defined, and also not give a default
	var searchCols = oSettings.aoPreSearchCols;
	searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );

	// Use the default column options function to initialise classes etc
	_fnColumnOptions( oSettings, iCol, $(nTh).data() );
}


/**
 * Apply options for a column
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iCol column index to consider
 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
 *  @memberof DataTable#oApi
 */
function _fnColumnOptions( oSettings, iCol, oOptions )
{
	var oCol = oSettings.aoColumns[ iCol ];
	var oClasses = oSettings.oClasses;
	var th = $(oCol.nTh);

	// Try to get width information from the DOM. We can't get it from CSS
	// as we'd need to parse the CSS stylesheet. `width` option can override
	if ( ! oCol.sWidthOrig ) {
		// Width attribute
		oCol.sWidthOrig = th.attr('width') || null;

		// Style attribute
		var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
		if ( t ) {
			oCol.sWidthOrig = t[1];
		}
	}

	/* User specified column options */
	if ( oOptions !== undefined && oOptions !== null )
	{
		// Backwards compatibility
		_fnCompatCols( oOptions );

		// Map camel case parameters to their Hungarian counterparts
		_fnCamelToHungarian( DataTable.defaults.column, oOptions );

		/* Backwards compatibility for mDataProp */
		if ( oOptions.mDataProp !== undefined && !oOptions.mData )
		{
			oOptions.mData = oOptions.mDataProp;
		}

		if ( oOptions.sType )
		{
			oCol._sManualType = oOptions.sType;
		}

		// `class` is a reserved word in Javascript, so we need to provide
		// the ability to use a valid name for the camel case input
		if ( oOptions.className && ! oOptions.sClass )
		{
			oOptions.sClass = oOptions.className;
		}

		$.extend( oCol, oOptions );
		_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );

		/* iDataSort to be applied (backwards compatibility), but aDataSort will take
		 * priority if defined
		 */
		if ( oOptions.iDataSort !== undefined )
		{
			oCol.aDataSort = [ oOptions.iDataSort ];
		}
		_fnMap( oCol, oOptions, "aDataSort" );
	}

	/* Cache the data get and set functions for speed */
	var mDataSrc = oCol.mData;
	var mData = _fnGetObjectDataFn( mDataSrc );
	var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;

	var attrTest = function( src ) {
		return typeof src === 'string' && src.indexOf('@') !== -1;
	};
	oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
		attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
	);

	oCol.fnGetData = function (rowData, type, meta) {
		var innerData = mData( rowData, type, undefined, meta );

		return mRender && type ?
			mRender( innerData, type, rowData, meta ) :
			innerData;
	};
	oCol.fnSetData = function ( rowData, val, meta ) {
		return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
	};

	// Indicate if DataTables should read DOM data as an object or array
	// Used in _fnGetRowElements
	if ( typeof mDataSrc !== 'number' ) {
		oSettings._rowReadObject = true;
	}

	/* Feature sorting overrides column specific when off */
	if ( !oSettings.oFeatures.bSort )
	{
		oCol.bSortable = false;
		th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
	}

	/* Check that the class assignment is correct for sorting */
	var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
	var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
	if ( !oCol.bSortable || (!bAsc && !bDesc) )
	{
		oCol.sSortingClass = oClasses.sSortableNone;
		oCol.sSortingClassJUI = "";
	}
	else if ( bAsc && !bDesc )
	{
		oCol.sSortingClass = oClasses.sSortableAsc;
		oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
	}
	else if ( !bAsc && bDesc )
	{
		oCol.sSortingClass = oClasses.sSortableDesc;
		oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
	}
	else
	{
		oCol.sSortingClass = oClasses.sSortable;
		oCol.sSortingClassJUI = oClasses.sSortJUI;
	}
}


/**
 * Adjust the table column widths for new data. Note: you would probably want to
 * do a redraw after calling this function!
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnAdjustColumnSizing ( settings )
{
	/* Not interested in doing column width calculation if auto-width is disabled */
	if ( settings.oFeatures.bAutoWidth !== false )
	{
		var columns = settings.aoColumns;

		_fnCalculateColumnWidths( settings );
		for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].nTh.style.width = columns[i].sWidth;
		}
	}

	var scroll = settings.oScroll;
	if ( scroll.sY !== '' || scroll.sX !== '')
	{
		_fnScrollDraw( settings );
	}

	_fnCallbackFire( settings, null, 'column-sizing', [settings] );
}


/**
 * Covert the index of a visible column to the index in the data array (take account
 * of hidden columns)
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iMatch Visible column index to lookup
 *  @returns {int} i the data index
 *  @memberof DataTable#oApi
 */
function _fnVisibleToColumnIndex( oSettings, iMatch )
{
	var aiVis = _fnGetColumns( oSettings, 'bVisible' );

	return typeof aiVis[iMatch] === 'number' ?
		aiVis[iMatch] :
		null;
}


/**
 * Covert the index of an index in the data array and convert it to the visible
 *   column index (take account of hidden columns)
 *  @param {int} iMatch Column index to lookup
 *  @param {object} oSettings dataTables settings object
 *  @returns {int} i the data index
 *  @memberof DataTable#oApi
 */
function _fnColumnIndexToVisible( oSettings, iMatch )
{
	var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	var iPos = $.inArray( iMatch, aiVis );

	return iPos !== -1 ? iPos : null;
}


/**
 * Get the number of visible columns
 *  @param {object} oSettings dataTables settings object
 *  @returns {int} i the number of visible columns
 *  @memberof DataTable#oApi
 */
function _fnVisbleColumns( oSettings )
{
	return _fnGetColumns( oSettings, 'bVisible' ).length;
}


/**
 * Get an array of column indexes that match a given property
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sParam Parameter in aoColumns to look for - typically
 *    bVisible or bSearchable
 *  @returns {array} Array of indexes with matched properties
 *  @memberof DataTable#oApi
 */
function _fnGetColumns( oSettings, sParam )
{
	var a = [];

	$.map( oSettings.aoColumns, function(val, i) {
		if ( val[sParam] ) {
			a.push( i );
		}
	} );

	return a;
}


/**
 * Calculate the 'type' of a column
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnColumnTypes ( settings )
{
	var columns = settings.aoColumns;
	var data = settings.aoData;
	var types = DataTable.ext.type.detect;
	var i, ien, j, jen, k, ken;
	var col, cell, detectedType, cache;

	// For each column, spin over the 
	for ( i=0, ien=columns.length ; i<ien ; i++ ) {
		col = columns[i];
		cache = [];

		if ( ! col.sType && col._sManualType ) {
			col.sType = col._sManualType;
		}
		else if ( ! col.sType ) {
			for ( j=0, jen=types.length ; j<jen ; j++ ) {
				for ( k=0, ken=data.length ; k<ken ; k++ ) {
					// Use a cache array so we only need to get the type data
					// from the formatter once (when using multiple detectors)
					if ( cache[k] === undefined ) {
						cache[k] = _fnGetCellData( settings, k, i, 'type' );
					}

					detectedType = types[j]( cache[k], settings );

					// If null, then this type can't apply to this column, so
					// rather than testing all cells, break out. There is an
					// exception for the last type which is `html`. We need to
					// scan all rows since it is possible to mix string and HTML
					// types
					if ( ! detectedType && j !== types.length-1 ) {
						break;
					}

					// Only a single match is needed for html type since it is
					// bottom of the pile and very similar to string
					if ( detectedType === 'html' ) {
						break;
					}
				}

				// Type is valid for all data points in the column - use this
				// type
				if ( detectedType ) {
					col.sType = detectedType;
					break;
				}
			}

			// Fall back - if no type was detected, always use string
			if ( ! col.sType ) {
				col.sType = 'string';
			}
		}
	}
}


/**
 * Take the column definitions and static columns arrays and calculate how
 * they relate to column indexes. The callback function will then apply the
 * definition found for a column to a suitable configuration object.
 *  @param {object} oSettings dataTables settings object
 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
 *  @param {array} aoCols The aoColumns array that defines columns individually
 *  @param {function} fn Callback function - takes two parameters, the calculated
 *    column index and the definition for that column.
 *  @memberof DataTable#oApi
 */
function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
{
	var i, iLen, j, jLen, k, kLen, def;
	var columns = oSettings.aoColumns;

	// Column definitions with aTargets
	if ( aoColDefs )
	{
		/* Loop over the definitions array - loop in reverse so first instance has priority */
		for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
		{
			def = aoColDefs[i];

			/* Each definition can target multiple columns, as it is an array */
			var aTargets = def.targets !== undefined ?
				def.targets :
				def.aTargets;

			if ( ! $.isArray( aTargets ) )
			{
				aTargets = [ aTargets ];
			}

			for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
			{
				if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
				{
					/* Add columns that we don't yet know about */
					while( columns.length <= aTargets[j] )
					{
						_fnAddColumn( oSettings );
					}

					/* Integer, basic index */
					fn( aTargets[j], def );
				}
				else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
				{
					/* Negative integer, right to left column counting */
					fn( columns.length+aTargets[j], def );
				}
				else if ( typeof aTargets[j] === 'string' )
				{
					/* Class name matching on TH element */
					for ( k=0, kLen=columns.length ; k<kLen ; k++ )
					{
						if ( aTargets[j] == "_all" ||
						     $(columns[k].nTh).hasClass( aTargets[j] ) )
						{
							fn( k, def );
						}
					}
				}
			}
		}
	}

	// Statically defined columns array
	if ( aoCols )
	{
		for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
		{
			fn( i, aoCols[i] );
		}
	}
}

