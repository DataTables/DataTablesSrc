/**
 * Add a data array to the table, creating DOM node etc. This is the parallel to
 * _fnGatherData, but for adding rows from a Javascript source, rather than a
 * DOM source.
 *  @param {object} oSettings dataTables settings object
 *  @param {array} aData data array to be added
 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
 *    DataTables will create a row automatically
 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
 *    if nTr is.
 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
 *  @memberof DataTable#oApi
 */
function _fnAddData ( oSettings, aDataIn, nTr, anTds )
{
	/* Create the object for storing information about this new row */
	var iRow = oSettings.aoData.length;
	var oData = $.extend( true, {}, DataTable.models.oRow, {
		src: nTr ? 'dom' : 'data'
	} );

	oData._aData = aDataIn;
	oSettings.aoData.push( oData );

	/* Create the cells */
	var nTd, sThisType;
	var columns = oSettings.aoColumns;
	for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
	{
		// When working with a row, the data source object must be populated. In
		// all other cases, the data source object is already populated, so we
		// don't overwrite it, which might break bindings etc
		if ( nTr ) {
			_fnSetCellData( oSettings, iRow, i, _fnGetCellData( oSettings, iRow, i ) );
		}
		columns[i].sType = null;
	}

	/* Add to the display array */
	oSettings.aiDisplayMaster.push( iRow );

	/* Create the DOM information, or register it if already present */
	if ( nTr || ! oSettings.oFeatures.bDeferRender )
	{
		_fnCreateTr( oSettings, iRow, nTr, anTds );
	}

	return iRow;
}


/**
 * Add one or more TR elements to the table. Generally we'd expect to
 * use this for reading data from a DOM sourced table, but it could be
 * used for an TR element. Note that if a TR is given, it is used (i.e.
 * it is not cloned).
 *  @param {object} settings dataTables settings object
 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
 *  @returns {array} Array of indexes for the added rows
 *  @memberof DataTable#oApi
 */
function _fnAddTr( settings, trs )
{
	var row;

	// Allow an individual node to be passed in
	if ( ! (trs instanceof $) ) {
		trs = $(trs);
	}

	return trs.map( function (i, el) {
		row = _fnGetRowElements( settings, el );
		return _fnAddData( settings, row.data, el, row.cells );
	} );
}


/**
 * Take a TR element and convert it to an index in aoData
 *  @param {object} oSettings dataTables settings object
 *  @param {node} n the TR element to find
 *  @returns {int} index if the node is found, null if not
 *  @memberof DataTable#oApi
 */
function _fnNodeToDataIndex( oSettings, n )
{
	return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
}


/**
 * Take a TD element and convert it into a column data index (not the visible index)
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow The row number the TD/TH can be found in
 *  @param {node} n The TD/TH element to find
 *  @returns {int} index if the node is found, -1 if not
 *  @memberof DataTable#oApi
 */
function _fnNodeToColumnIndex( oSettings, iRow, n )
{
	return $.inArray( n, oSettings.aoData[ iRow ].anCells );
}


/**
 * Get the data for a given cell from the internal cache, taking into account data mapping
 *  @param {object} settings dataTables settings object
 *  @param {int} rowIdx aoData row id
 *  @param {int} colIdx Column index
 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
 *  @returns {*} Cell data
 *  @memberof DataTable#oApi
 */
function _fnGetCellData( settings, rowIdx, colIdx, type )
{
	var draw           = settings.iDraw;
	var col            = settings.aoColumns[colIdx];
	var rowData        = settings.aoData[rowIdx]._aData;
	var defaultContent = col.sDefaultContent;
	var cellData       = col.fnGetData( rowData, type, {
		settings: settings,
		row:      rowIdx,
		col:      colIdx
	} );

	if ( cellData === undefined ) {
		if ( settings.iDrawError != draw && defaultContent === null ) {
			_fnLog( settings, 0, "Requested unknown parameter "+
				(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
				" for row "+rowIdx, 4 );
			settings.iDrawError = draw;
		}
		return defaultContent;
	}

	/* When the data source is null, we can use default column data */
	if ( (cellData === rowData || cellData === null) && defaultContent !== null ) {
		cellData = defaultContent;
	}
	else if ( typeof cellData === 'function' ) {
		// If the data source is a function, then we run it and use the return,
		// executing in the scope of the data object (for instances)
		return cellData.call( rowData );
	}

	if ( cellData === null && type == 'display' ) {
		return '';
	}
	return cellData;
}


/**
 * Set the value for a specific cell, into the internal data cache
 *  @param {object} settings dataTables settings object
 *  @param {int} rowIdx aoData row id
 *  @param {int} colIdx Column index
 *  @param {*} val Value to set
 *  @memberof DataTable#oApi
 */
function _fnSetCellData( settings, rowIdx, colIdx, val )
{
	var col     = settings.aoColumns[colIdx];
	var rowData = settings.aoData[rowIdx]._aData;

	col.fnSetData( rowData, val, {
		settings: settings,
		row:      rowIdx,
		col:      colIdx
	}  );
}


// Private variable that is used to match action syntax in the data property object
var __reArray = /\[.*?\]$/;
var __reFn = /\(\)$/;

/**
 * Split string on periods, taking into account escaped periods
 * @param  {string} str String to split
 * @return {array} Split string
 */
function _fnSplitObjNotation( str )
{
	return $.map( str.match(/(\\.|[^\.])+/g), function ( s ) {
		return s.replace(/\\./g, '.');
	} );
}


/**
 * Return a function that can be used to get data from a source object, taking
 * into account the ability to use nested objects as a source
 *  @param {string|int|function} mSource The data source for the object
 *  @returns {function} Data get function
 *  @memberof DataTable#oApi
 */
function _fnGetObjectDataFn( mSource )
{
	if ( $.isPlainObject( mSource ) )
	{
		/* Build an object of get functions, and wrap them in a single call */
		var o = {};
		$.each( mSource, function (key, val) {
			if ( val ) {
				o[key] = _fnGetObjectDataFn( val );
			}
		} );

		return function (data, type, row, meta) {
			var t = o[type] || o._;
			return t !== undefined ?
				t(data, type, row, meta) :
				data;
		};
	}
	else if ( mSource === null )
	{
		/* Give an empty string for rendering / sorting etc */
		return function (data) { // type, row and meta also passed, but not used
			return data;
		};
	}
	else if ( typeof mSource === 'function' )
	{
		return function (data, type, row, meta) {
			return mSource( data, type, row, meta );
		};
	}
	else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
		      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
	{
		/* If there is a . in the source string then the data source is in a
		 * nested object so we loop over the data for each level to get the next
		 * level down. On each loop we test for undefined, and if found immediately
		 * return. This allows entire objects to be missing and sDefaultContent to
		 * be used if defined, rather than throwing an error
		 */
		var fetchData = function (data, type, src) {
			var arrayNotation, funcNotation, out, innerSrc;

			if ( src !== "" )
			{
				var a = _fnSplitObjNotation( src );

				for ( var i=0, iLen=a.length ; i<iLen ; i++ )
				{
					// Check if we are dealing with special notation
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);

					if ( arrayNotation )
					{
						// Array notation
						a[i] = a[i].replace(__reArray, '');

						// Condition allows simply [] to be passed in
						if ( a[i] !== "" ) {
							data = data[ a[i] ];
						}
						out = [];

						// Get the remainder of the nested object to get
						a.splice( 0, i+1 );
						innerSrc = a.join('.');

						// Traverse each entry in the array getting the properties requested
						for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
							out.push( fetchData( data[j], type, innerSrc ) );
						}

						// If a string is given in between the array notation indicators, that
						// is used to join the strings together, otherwise an array is returned
						var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
						data = (join==="") ? out : out.join(join);

						// The inner call to fetchData has already traversed through the remainder
						// of the source requested, so we exit from the loop
						break;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]();
						continue;
					}

					if ( data === null || data[ a[i] ] === undefined )
					{
						return undefined;
					}
					data = data[ a[i] ];
				}
			}

			return data;
		};

		return function (data, type) { // row and meta also passed, but not used
			return fetchData( data, type, mSource );
		};
	}
	else
	{
		/* Array or flat object mapping */
		return function (data, type) { // row and meta also passed, but not used
			return data[mSource];
		};
	}
}


/**
 * Return a function that can be used to set data from a source object, taking
 * into account the ability to use nested objects as a source
 *  @param {string|int|function} mSource The data source for the object
 *  @returns {function} Data set function
 *  @memberof DataTable#oApi
 */
function _fnSetObjectDataFn( mSource )
{
	if ( $.isPlainObject( mSource ) )
	{
		/* Unlike get, only the underscore (global) option is used for for
		 * setting data since we don't know the type here. This is why an object
		 * option is not documented for `mData` (which is read/write), but it is
		 * for `mRender` which is read only.
		 */
		return _fnSetObjectDataFn( mSource._ );
	}
	else if ( mSource === null )
	{
		/* Nothing to do when the data source is null */
		return function () {};
	}
	else if ( typeof mSource === 'function' )
	{
		return function (data, val, meta) {
			mSource( data, 'set', val, meta );
		};
	}
	else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
		      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
	{
		/* Like the get, we need to get data from a nested object */
		var setData = function (data, val, src) {
			var a = _fnSplitObjNotation( src ), b;
			var aLast = a[a.length-1];
			var arrayNotation, funcNotation, o, innerSrc;

			for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
			{
				// Check if we are dealing with an array notation request
				arrayNotation = a[i].match(__reArray);
				funcNotation = a[i].match(__reFn);

				if ( arrayNotation )
				{
					a[i] = a[i].replace(__reArray, '');
					data[ a[i] ] = [];

					// Get the remainder of the nested object to set so we can recurse
					b = a.slice();
					b.splice( 0, i+1 );
					innerSrc = b.join('.');

					// Traverse each entry in the array setting the properties requested
					for ( var j=0, jLen=val.length ; j<jLen ; j++ )
					{
						o = {};
						setData( o, val[j], innerSrc );
						data[ a[i] ].push( o );
					}

					// The inner call to setData has already traversed through the remainder
					// of the source and has set the data, thus we can exit here
					return;
				}
				else if ( funcNotation )
				{
					// Function call
					a[i] = a[i].replace(__reFn, '');
					data = data[ a[i] ]( val );
				}

				// If the nested object doesn't currently exist - since we are
				// trying to set the value - create it
				if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
				{
					data[ a[i] ] = {};
				}
				data = data[ a[i] ];
			}

			// Last item in the input - i.e, the actual set
			if ( aLast.match(__reFn ) )
			{
				// Function call
				data = data[ aLast.replace(__reFn, '') ]( val );
			}
			else
			{
				// If array notation is used, we just want to strip it and use the property name
				// and assign the value. If it isn't used, then we get the result we want anyway
				data[ aLast.replace(__reArray, '') ] = val;
			}
		};

		return function (data, val) { // meta is also passed in, but not used
			return setData( data, val, mSource );
		};
	}
	else
	{
		/* Array or flat object mapping */
		return function (data, val) { // meta is also passed in, but not used
			data[mSource] = val;
		};
	}
}


/**
 * Return an array with the full table data
 *  @param {object} oSettings dataTables settings object
 *  @returns array {array} aData Master data array
 *  @memberof DataTable#oApi
 */
function _fnGetDataMaster ( settings )
{
	return _pluck( settings.aoData, '_aData' );
}


/**
 * Nuke the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnClearTable( settings )
{
	settings.aoData.length = 0;
	settings.aiDisplayMaster.length = 0;
	settings.aiDisplay.length = 0;
}


 /**
 * Take an array of integers (index array) and remove a target integer (value - not
 * the key!)
 *  @param {array} a Index array to target
 *  @param {int} iTarget value to find
 *  @memberof DataTable#oApi
 */
function _fnDeleteIndex( a, iTarget, splice )
{
	var iTargetIndex = -1;

	for ( var i=0, iLen=a.length ; i<iLen ; i++ )
	{
		if ( a[i] == iTarget )
		{
			iTargetIndex = i;
		}
		else if ( a[i] > iTarget )
		{
			a[i]--;
		}
	}

	if ( iTargetIndex != -1 && splice === undefined )
	{
		a.splice( iTargetIndex, 1 );
	}
}


/**
 * Mark cached data as invalid such that a re-read of the data will occur when
 * the cached data is next requested. Also update from the data source object.
 *
 * @param {object} settings DataTables settings object
 * @param {int}    rowIdx   Row index to invalidate
 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
 *     or 'data'
 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
 *     row will be invalidated
 * @memberof DataTable#oApi
 *
 * @todo For the modularisation of v1.11 this will need to become a callback, so
 *   the sort and filter methods can subscribe to it. That will required
 *   initialisation options for sorting, which is why it is not already baked in
 */
function _fnInvalidate( settings, rowIdx, src, colIdx )
{
	var row = settings.aoData[ rowIdx ];
	var i, ien;
	var cellWrite = function ( cell, col ) {
		// This is very frustrating, but in IE if you just write directly
		// to innerHTML, and elements that are overwritten are GC'ed,
		// even if there is a reference to them elsewhere
		while ( cell.childNodes.length ) {
			cell.removeChild( cell.firstChild );
		}

		cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
	};

	// Are we reading last data from DOM or the data object?
	if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
		// Read the data from the DOM
		row._aData = _fnGetRowElements(
				settings, row, colIdx, colIdx === undefined ? undefined : row._aData
			)
			.data;
	}
	else {
		// Reading from data object, update the DOM
		var cells = row.anCells;

		if ( cells ) {
			if ( colIdx !== undefined ) {
				cellWrite( cells[colIdx], colIdx );
			}
			else {
				for ( i=0, ien=cells.length ; i<ien ; i++ ) {
					cellWrite( cells[i], i );
				}
			}
		}
	}

	// For both row and cell invalidation, the cached data for sorting and
	// filtering is nulled out
	row._aSortData = null;
	row._aFilterData = null;

	// Invalidate the type for a specific column (if given) or all columns since
	// the data might have changed
	var cols = settings.aoColumns;
	if ( colIdx !== undefined ) {
		cols[ colIdx ].sType = null;
	}
	else {
		for ( i=0, ien=cols.length ; i<ien ; i++ ) {
			cols[i].sType = null;
		}

		// Update DataTables special `DT_*` attributes for the row
		_fnRowAttributes( row );
	}
}


/**
 * Build a data source object from an HTML row, reading the contents of the
 * cells that are in the row.
 *
 * @param {object} settings DataTables settings object
 * @param {node|object} TR element from which to read data or existing row
 *   object from which to re-read the data from the cells
 * @param {int} [colIdx] Optional column index
 * @param {array|object} [d] Data source object. If `colIdx` is given then this
 *   parameter should also be given and will be used to write the data into.
 *   Only the column in question will be written
 * @returns {object} Object with two parameters: `data` the data read, in
 *   document order, and `cells` and array of nodes (they can be useful to the
 *   caller, so rather than needing a second traversal to get them, just return
 *   them from here).
 * @memberof DataTable#oApi
 */
function _fnGetRowElements( settings, row, colIdx, d )
{
	var
		tds = [],
		td = row.firstChild,
		name, col, o, i=0, contents,
		columns = settings.aoColumns,
		objectRead = settings._rowReadObject;

	// Allow the data object to be passed in, or construct
	d = d || objectRead ? {} : [];

	var attr = function ( str, td  ) {
		if ( typeof str === 'string' ) {
			var idx = str.indexOf('@');

			if ( idx !== -1 ) {
				var attr = str.substring( idx+1 );
				var setter = _fnSetObjectDataFn( str );
				setter( d, td.getAttribute( attr ) );
			}
		}
	};

	// Read data from a cell and store into the data object
	var cellProcess = function ( cell ) {
		if ( colIdx === undefined || colIdx === i ) {
			col = columns[i];
			contents = $.trim(cell.innerHTML);

			if ( col && col._bAttrSrc ) {
				var setter = _fnSetObjectDataFn( col.mData._ );
				setter( d, contents );

				attr( col.mData.sort, cell );
				attr( col.mData.type, cell );
				attr( col.mData.filter, cell );
			}
			else {
				// Depending on the `data` option for the columns the data can
				// be read to either an object or an array.
				if ( objectRead ) {
					if ( ! col._setter ) {
						// Cache the setter function
						col._setter = _fnSetObjectDataFn( col.mData );
					}
					col._setter( d, contents );
				}
				else {
					d[i] = contents;
				}
			}
		}

		i++;
	};

	if ( td ) {
		// `tr` element was passed in
		while ( td ) {
			name = td.nodeName.toUpperCase();

			if ( name == "TD" || name == "TH" ) {
				cellProcess( td );
				tds.push( td );
			}

			td = td.nextSibling;
		}
	}
	else {
		// Existing row object passed in
		tds = row.anCells;
		
		for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
			cellProcess( tds[j] );
		}
	}

	return {
		data: d,
		cells: tds
	};
}
