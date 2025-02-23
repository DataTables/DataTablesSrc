
/**
 * Add a column to the list used for the table with default values
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnAddColumn( oSettings )
{
	// Add column to aoColumns array
	var oDefaults = DataTable.defaults.column;
	var iCol = oSettings.aoColumns.length;
	var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
		"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
		"mData": oDefaults.mData ? oDefaults.mData : iCol,
		idx: iCol,
		searchFixed: {},
		colEl: $('<col>').attr('data-dt-column', iCol)
	} );
	oSettings.aoColumns.push( oCol );

	// Add search object for column specific search. Note that the `searchCols[ iCol ]`
	// passed into extend can be undefined. This allows the user to give a default
	// with only some of the parameters defined, and also not give a default
	var searchCols = oSettings.aoPreSearchCols;
	searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
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

	/* User specified column options */
	if ( oOptions !== undefined && oOptions !== null )
	{
		// Backwards compatibility
		_fnCompatCols( oOptions );

		// Map camel case parameters to their Hungarian counterparts
		_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );

		/* Backwards compatibility for mDataProp */
		if ( oOptions.mDataProp !== undefined && !oOptions.mData )
		{
			oOptions.mData = oOptions.mDataProp;
		}

		if ( oOptions.sType )
		{
			oCol._sManualType = oOptions.sType;
		}
	
		// `class` is a reserved word in JavaScript, so we need to provide
		// the ability to use a valid name for the camel case input
		if ( oOptions.className && ! oOptions.sClass )
		{
			oOptions.sClass = oOptions.className;
		}

		var origClass = oCol.sClass;

		$.extend( oCol, oOptions );
		_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );

		// Merge class from previously defined classes with this one, rather than just
		// overwriting it in the extend above
		if (origClass !== oCol.sClass) {
			oCol.sClass = origClass + ' ' + oCol.sClass;
		}

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

	// The `render` option can be given as an array to access the helper rendering methods.
	// The first element is the rendering method to use, the rest are the parameters to pass
	if ( oCol.mRender && Array.isArray( oCol.mRender ) ) {
		var copy = oCol.mRender.slice();
		var name = copy.shift();

		oCol.mRender = DataTable.render[name].apply(window, copy);
	}

	oCol._render = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;

	var attrTest = function( src ) {
		return typeof src === 'string' && src.indexOf('@') !== -1;
	};
	oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
		attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
	);
	oCol._setter = null;

	oCol.fnGetData = function (rowData, type, meta) {
		var innerData = mData( rowData, type, undefined, meta );

		return oCol._render && type ?
			oCol._render( innerData, type, rowData, meta ) :
			innerData;
	};
	oCol.fnSetData = function ( rowData, val, meta ) {
		return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
	};

	// Indicate if DataTables should read DOM data as an object or array
	// Used in _fnGetRowElements
	if ( typeof mDataSrc !== 'number' && ! oCol._isArrayHost ) {
		oSettings._rowReadObject = true;
	}

	/* Feature sorting overrides column specific when off */
	if ( !oSettings.oFeatures.bSort )
	{
		oCol.bSortable = false;
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
	_fnCalculateColumnWidths( settings );
	_fnColumnSizes( settings );

	var scroll = settings.oScroll;
	if ( scroll.sY !== '' || scroll.sX !== '') {
		_fnScrollDraw( settings );
	}

	_fnCallbackFire( settings, null, 'column-sizing', [settings] );
}

/**
 * Apply column sizes
 *
 * @param {*} settings DataTables settings object
 */
function _fnColumnSizes ( settings )
{
	var cols = settings.aoColumns;

	for (var i=0 ; i<cols.length ; i++) {
		var width = _fnColumnsSumWidth(settings, [i], false, false);

		cols[i].colEl.css('width', width);

		if (settings.oScroll.sX) {
			cols[i].colEl.css('min-width', width);
		}
	}
}


/**
 * Convert the index of a visible column to the index in the data array (take account
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
 * Convert the index of an index in the data array and convert it to the visible
 *   column index (take account of hidden columns)
 *  @param {int} iMatch Column index to lookup
 *  @param {object} oSettings dataTables settings object
 *  @returns {int} i the data index
 *  @memberof DataTable#oApi
 */
function _fnColumnIndexToVisible( oSettings, iMatch )
{
	var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	var iPos = aiVis.indexOf(iMatch);

	return iPos !== -1 ? iPos : null;
}


/**
 * Get the number of visible columns
 *  @param {object} oSettings dataTables settings object
 *  @returns {int} i the number of visible columns
 *  @memberof DataTable#oApi
 */
function _fnVisbleColumns( settings )
{
	var layout = settings.aoHeader;
	var columns = settings.aoColumns;
	var vis = 0;

	if ( layout.length ) {
		for ( var i=0, iLen=layout[0].length ; i<iLen ; i++ ) {
			if ( columns[i].bVisible && $(layout[0][i].cell).css('display') !== 'none' ) {
				vis++;
			}
		}
	}

	return vis;
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

	oSettings.aoColumns.map( function(val, i) {
		if ( val[sParam] ) {
			a.push( i );
		}
	} );

	return a;
}

/**
 * Allow the result from a type detection function to be `true` while
 * translating that into a string. Old type detection functions will
 * return the type name if it passes. An obect store would be better,
 * but not backwards compatible.
 *
 * @param {*} typeDetect Object or function for type detection
 * @param {*} res Result from the type detection function
 * @returns Type name or false
 */
function _typeResult (typeDetect, res) {
	return res === true
		? typeDetect._name
		: res;
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
	var i, iLen, j, jen, k, ken;
	var col, detectedType, cache;

	// For each column, spin over the data type detection functions, seeing if one matches
	for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
		col = columns[i];
		cache = [];

		if ( ! col.sType && col._sManualType ) {
			col.sType = col._sManualType;
		}
		else if ( ! col.sType ) {
			// With SSP type detection can be unreliable and error prone, so we provide a way
			// to turn it off.
			if (! settings.typeDetect) {
				return;
			}

			for ( j=0, jen=types.length ; j<jen ; j++ ) {
				var typeDetect = types[j];

				// There can be either one, or three type detection functions
				var oneOf = typeDetect.oneOf;
				var allOf = typeDetect.allOf || typeDetect;
				var init = typeDetect.init;
				var one = false;

				detectedType = null;

				// Fast detect based on column assignment
				if (init) {
					detectedType = _typeResult(typeDetect, init(settings, col, i));

					if (detectedType) {
						col.sType = detectedType;
						break;
					}
				}

				for ( k=0, ken=data.length ; k<ken ; k++ ) {
					if (! data[k]) {
						continue;
					}

					// Use a cache array so we only need to get the type data
					// from the formatter once (when using multiple detectors)
					if ( cache[k] === undefined ) {
						cache[k] = _fnGetCellData( settings, k, i, 'type' );
					}

					// Only one data point in the column needs to match this function
					if (oneOf && ! one) {
						one = _typeResult(typeDetect, oneOf( cache[k], settings ));
					}

					// All data points need to match this function
					detectedType = _typeResult(typeDetect, allOf( cache[k], settings ));

					// If null, then this type can't apply to this column, so
					// rather than testing all cells, break out. There is an
					// exception for the last type which is `html`. We need to
					// scan all rows since it is possible to mix string and HTML
					// types
					if ( ! detectedType && j !== types.length-3 ) {
						break;
					}

					// Only a single match is needed for html type since it is
					// bottom of the pile and very similar to string - but it
					// must not be empty
					if ( detectedType === 'html' && ! _empty(cache[k]) ) {
						break;
					}
				}

				// Type is valid for all data points in the column - use this
				// type
				if ( (oneOf && one && detectedType) || (!oneOf && detectedType) ) {
					col.sType = detectedType;
					break;
				}
			}

			// Fall back - if no type was detected, always use string
			if ( ! col.sType ) {
				col.sType = 'string';
			}
		}

		// Set class names for header / footer for auto type classes
		var autoClass = _ext.type.className[col.sType];

		if (autoClass) {
			_columnAutoClass(settings.aoHeader, i, autoClass);
			_columnAutoClass(settings.aoFooter, i, autoClass);
		}

		var renderer = _ext.type.render[col.sType];

		// This can only happen once! There is no way to remove
		// a renderer. After the first time the renderer has
		// already been set so createTr will run the renderer itself.
		if (renderer && ! col._render) {
			col._render = DataTable.util.get(renderer);

			_columnAutoRender(settings, i);
		}
	}
}

/**
 * Apply an auto detected renderer to data which doesn't yet have
 * a renderer
 */
function _columnAutoRender(settings, colIdx) {
	var data = settings.aoData;

	for (var i=0 ; i<data.length ; i++) {
		if (data[i].nTr) {
			// We have to update the display here since there is no
			// invalidation check for the data
			var display = _fnGetCellData( settings, i, colIdx, 'display' );

			data[i].displayData[colIdx] = display;
			_fnWriteCell(data[i].anCells[colIdx], display);

			// No need to update sort / filter data since it has
			// been invalidated and will be re-read with the
			// renderer now applied
		}
	}
}

/**
 * Apply a class name to a column's header cells
 */
function _columnAutoClass(container, colIdx, className) {
	container.forEach(function (row) {
		if (row[colIdx] && row[colIdx].unique) {
			_addClass(row[colIdx].cell, className);
		}
	});
}

/**
 * Take the column definitions and static columns arrays and calculate how
 * they relate to column indexes. The callback function will then apply the
 * definition found for a column to a suitable configuration object.
 *  @param {object} oSettings dataTables settings object
 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
 *  @param {array} aoCols The aoColumns array that defines columns individually
 *  @param {array} headerLayout Layout for header as it was loaded
 *  @param {function} fn Callback function - takes two parameters, the calculated
 *    column index and the definition for that column.
 *  @memberof DataTable#oApi
 */
function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, headerLayout, fn )
{
	var i, iLen, j, jLen, k, kLen, def;
	var columns = oSettings.aoColumns;

	if ( aoCols ) {
		for ( i=0, iLen=aoCols.length ; i<iLen ; i++ ) {
			if (aoCols[i] && aoCols[i].name) {
				columns[i].sName = aoCols[i].name;
			}
		}
	}

	// Column definitions with aTargets
	if ( aoColDefs )
	{
		/* Loop over the definitions array - loop in reverse so first instance has priority */
		for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
		{
			def = aoColDefs[i];

			/* Each definition can target multiple columns, as it is an array */
			var aTargets = def.target !== undefined
				? def.target
				: def.targets !== undefined
					? def.targets
					: def.aTargets;

			if ( ! Array.isArray( aTargets ) )
			{
				aTargets = [ aTargets ];
			}

			for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
			{
				var target = aTargets[j];

				if ( typeof target === 'number' && target >= 0 )
				{
					/* Add columns that we don't yet know about */
					while( columns.length <= target )
					{
						_fnAddColumn( oSettings );
					}

					/* Integer, basic index */
					fn( target, def );
				}
				else if ( typeof target === 'number' && target < 0 )
				{
					/* Negative integer, right to left column counting */
					fn( columns.length+target, def );
				}
				else if ( typeof target === 'string' )
				{
					for ( k=0, kLen=columns.length ; k<kLen ; k++ ) {
						if (target === '_all') {
							// Apply to all columns
							fn( k, def );
						}
						else if (target.indexOf(':name') !== -1) {
							// Column selector
							if (columns[k].sName === target.replace(':name', '')) {
								fn( k, def );
							}
						}
						else {
							// Cell selector
							headerLayout.forEach(function (row) {
								if (row[k]) {
									var cell = $(row[k].cell);

									// Legacy support. Note that it means that we don't support
									// an element name selector only, since they are treated as
									// class names for 1.x compat.
									if (target.match(/^[a-z][\w-]*$/i)) {
										target = '.' + target;
									}

									if (cell.is( target )) {
										fn( k, def );
									}
								}
							});
						}
					}
				}
			}
		}
	}

	// Statically defined columns array
	if ( aoCols ) {
		for ( i=0, iLen=aoCols.length ; i<iLen ; i++ ) {
			fn( i, aoCols[i] );
		}
	}
}


/**
 * Get the width for a given set of columns
 *
 * @param {*} settings DataTables settings object
 * @param {*} targets Columns - comma separated string or array of numbers
 * @param {*} original Use the original width (true) or calculated (false)
 * @param {*} incVisible Include visible columns (true) or not (false)
 * @returns Combined CSS value
 */
function _fnColumnsSumWidth( settings, targets, original, incVisible ) {
	if ( ! Array.isArray( targets ) ) {
		targets = _fnColumnsFromHeader( targets );
	}

	var sum = 0;
	var unit;
	var columns = settings.aoColumns;
	
	for ( var i=0, iLen=targets.length ; i<iLen ; i++ ) {
		var column = columns[ targets[i] ];
		var definedWidth = original ?
			column.sWidthOrig :
			column.sWidth;

		if ( ! incVisible && column.bVisible === false ) {
			continue;
		}

		if ( definedWidth === null || definedWidth === undefined ) {
			return null; // can't determine a defined width - browser defined
		}
		else if ( typeof definedWidth === 'number' ) {
			unit = 'px';
			sum += definedWidth;
		}
		else {
			var matched = definedWidth.match(/([\d\.]+)([^\d]*)/);

			if ( matched ) {
				sum += matched[1] * 1;
				unit = matched.length === 3 ?
					matched[2] :
					'px';
			}
		}
	}

	return sum + unit;
}

function _fnColumnsFromHeader( cell )
{
	var attr = $(cell).closest('[data-dt-column]').attr('data-dt-column');

	if ( ! attr ) {
		return [];
	}

	return attr.split(',').map( function (val) {
		return val * 1;
	} );
}
