
function _fnSortInit( settings ) {
	var target = settings.nTHead;
	var headerRows = target.querySelectorAll('tr');
	var legacyTop = settings.bSortCellsTop;
	var notSelector = ':not([data-dt-order="disable"]):not([data-dt-order="icon-only"])';
	
	// Legacy support for `orderCellsTop`
	if (legacyTop === true) {
		target = headerRows[0];
	}
	else if (legacyTop === false) {
		target = headerRows[ headerRows.length - 1 ];
	}

	_fnSortAttachListener(
		settings,
		target,
		target === settings.nTHead
			? 'tr'+notSelector+' th'+notSelector+', tr'+notSelector+' td'+notSelector
			: 'th'+notSelector+', td'+notSelector
	);

	// Need to resolve the user input array into our internal structure
	var order = [];
	_fnSortResolve( settings, order, settings.aaSorting );

	settings.aaSorting = order;
}


function _fnSortAttachListener(settings, node, selector, column, callback) {
	_fnBindAction( node, selector, function (e) {
		var run = false;
		var columns = column === undefined
			? _fnColumnsFromHeader( e.target )
			: [column];

		if ( columns.length ) {
			for ( var i=0, iLen=columns.length ; i<iLen ; i++ ) {
				var ret = _fnSortAdd( settings, columns[i], i, e.shiftKey );

				if (ret !== false) {
					run = true;
				}					

				// If the first entry is no sort, then subsequent
				// sort columns are ignored
				if (settings.aaSorting.length === 1 && settings.aaSorting[0][1] === '') {
					break;
				}
			}

			if (run) {
				_fnProcessingRun(settings, true, function () {
					_fnSort( settings );
					_fnSortDisplay( settings, settings.aiDisplay );

					_fnReDraw( settings, false, false );

					if (callback) {
						callback();
					}
				});
			}
		}
	} );
}

/**
 * Sort the display array to match the master's order
 * @param {*} settings
 */
function _fnSortDisplay(settings, display) {
	if (display.length < 2) {
		return;
	}

	var master = settings.aiDisplayMaster;
	var masterMap = {};
	var map = {};
	var i;

	// Rather than needing an `indexOf` on master array, we can create a map
	for (i=0 ; i<master.length ; i++) {
		masterMap[master[i]] = i;
	}

	// And then cache what would be the indexOf from the display
	for (i=0 ; i<display.length ; i++) {
		map[display[i]] = masterMap[display[i]];
	}

	display.sort(function(a, b){
		// Short version of this function is simply `master.indexOf(a) - master.indexOf(b);`
		return map[a] - map[b];
	});
}


function _fnSortResolve (settings, nestedSort, sort) {
	var push = function ( a ) {
		if ($.isPlainObject(a)) {
			if (a.idx !== undefined) {
				// Index based ordering
				nestedSort.push([a.idx, a.dir]);
			}
			else if (a.name) {
				// Name based ordering
				var cols = _pluck( settings.aoColumns, 'sName');
				var idx = cols.indexOf(a.name);

				if (idx !== -1) {
					nestedSort.push([idx, a.dir]);
				}
			}
		}
		else {
			// Plain column index and direction pair
			nestedSort.push(a);
		}
	};

	if ( $.isPlainObject(sort) ) {
		// Object
		push(sort);
	}
	else if ( sort.length && typeof sort[0] === 'number' ) {
		// 1D array
		push(sort);
	}
	else if ( sort.length ) {
		// 2D array
		for (var z=0; z<sort.length; z++) {
			push(sort[z]); // Object or array
		}
	}
}


function _fnSortFlatten ( settings )
{
	var
		i, k, kLen,
		aSort = [],
		extSort = DataTable.ext.type.order,
		aoColumns = settings.aoColumns,
		aDataSort, iCol, sType, srcCol,
		fixed = settings.aaSortingFixed,
		fixedObj = $.isPlainObject( fixed ),
		nestedSort = [];
	
	if ( ! settings.oFeatures.bSort ) {
		return aSort;
	}

	// Build the sort array, with pre-fix and post-fix options if they have been
	// specified
	if ( Array.isArray( fixed ) ) {
		_fnSortResolve( settings, nestedSort, fixed );
	}

	if ( fixedObj && fixed.pre ) {
		_fnSortResolve( settings, nestedSort, fixed.pre );
	}

	_fnSortResolve( settings, nestedSort, settings.aaSorting );

	if (fixedObj && fixed.post ) {
		_fnSortResolve( settings, nestedSort, fixed.post );
	}

	for ( i=0 ; i<nestedSort.length ; i++ )
	{
		srcCol = nestedSort[i][0];

		if ( aoColumns[ srcCol ] ) {
			aDataSort = aoColumns[ srcCol ].aDataSort;

			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';

				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = aoColumns[iCol].asSorting.indexOf(nestedSort[i][1]);
				}

				if ( nestedSort[i][1] ) {
					aSort.push( {
						src:       srcCol,
						col:       iCol,
						dir:       nestedSort[i][1],
						index:     nestedSort[i]._idx,
						type:      sType,
						formatter: extSort[ sType+"-pre" ],
						sorter:    extSort[ sType+"-"+nestedSort[i][1] ]
					} );
				}
			}
		}
	}

	return aSort;
}

/**
 * Change the order of the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnSort ( oSettings, col, dir )
{
	var
		i, iLen, iLen,
		aiOrig = [],
		extSort = DataTable.ext.type.order,
		aoData = oSettings.aoData,
		sortCol,
		displayMaster = oSettings.aiDisplayMaster,
		aSort;

	// Make sure the columns all have types defined
	_fnColumnTypes(oSettings);

	// Allow a specific column to be sorted, which will _not_ alter the display
	// master
	if (col !== undefined) {
		var srcCol = oSettings.aoColumns[col];

		aSort = [{
			src:       col,
			col:       col,
			dir:       dir,
			index:     0,
			type:      srcCol.sType,
			formatter: extSort[ srcCol.sType+"-pre" ],
			sorter:    extSort[ srcCol.sType+"-"+dir ]
		}];
		displayMaster = displayMaster.slice();
	}
	else {
		aSort = _fnSortFlatten( oSettings );
	}

	for ( i=0, iLen=aSort.length ; i<iLen ; i++ ) {
		sortCol = aSort[i];

		// Load the data needed for the sort, for each cell
		_fnSortData( oSettings, sortCol.col );
	}

	/* No sorting required if server-side or no sorting array */
	if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
	{
		// Reset the initial positions on each pass so we get a stable sort
		for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
			aiOrig[ i ] = i;
		}

		// If the first sort is desc, then reverse the array to preserve original
		// order, just in reverse
		if (aSort.length && aSort[0].dir === 'desc' && oSettings.orderDescReverse) {
			aiOrig.reverse();
		}

		/* Do the sort - here we want multi-column sorting based on a given data source (column)
		 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
		 * follow on its own, but this is what we want (example two column sorting):
		 *  fnLocalSorting = function(a,b){
		 *    var test;
		 *    test = oSort['string-asc']('data11', 'data12');
		 *      if (test !== 0)
		 *        return test;
		 *    test = oSort['numeric-desc']('data21', 'data22');
		 *    if (test !== 0)
		 *      return test;
		 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
		 *  }
		 * Basically we have a test for each sorting column, if the data in that column is equal,
		 * test the next column. If all columns match, then we use a numeric sort on the row
		 * positions in the original data array to provide a stable sort.
		 */
		displayMaster.sort( function ( a, b ) {
			var
				x, y, k, test, sort,
				len=aSort.length,
				dataA = aoData[a]._aSortData,
				dataB = aoData[b]._aSortData;

			for ( k=0 ; k<len ; k++ ) {
				sort = aSort[k];

				// Data, which may have already been through a `-pre` function
				x = dataA[ sort.col ];
				y = dataB[ sort.col ];

				if (sort.sorter) {
					// If there is a custom sorter (`-asc` or `-desc`) for this
					// data type, use it
					test = sort.sorter(x, y);

					if ( test !== 0 ) {
						return test;
					}
				}
				else {
					// Otherwise, use generic sorting
					test = x<y ? -1 : x>y ? 1 : 0;

					if ( test !== 0 ) {
						return sort.dir === 'asc' ? test : -test;
					}
				}
			}

			x = aiOrig[a];
			y = aiOrig[b];

			return x<y ? -1 : x>y ? 1 : 0;
		} );
	}
	else if ( aSort.length === 0 ) {
		// Apply index order
		displayMaster.sort(function (x, y) {
			return x<y ? -1 : x>y ? 1 : 0;
		});
	}

	if (col === undefined) {
		// Tell the draw function that we have sorted the data
		oSettings.bSorted = true;
		oSettings.sortDetails = aSort;

		_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort] );
	}

	return displayMaster;
}


/**
 * Function to run on user sort request
 *  @param {object} settings dataTables settings object
 *  @param {node} attachTo node to attach the handler to
 *  @param {int} colIdx column sorting index
 *  @param {int} addIndex Counter
 *  @param {boolean} [shift=false] Shift click add
 *  @param {function} [callback] callback function
 *  @memberof DataTable#oApi
 */
function _fnSortAdd ( settings, colIdx, addIndex, shift )
{
	var col = settings.aoColumns[ colIdx ];
	var sorting = settings.aaSorting;
	var asSorting = col.asSorting;
	var nextSortIdx;
	var next = function ( a, overflow ) {
		var idx = a._idx;
		if ( idx === undefined ) {
			idx = asSorting.indexOf(a[1]);
		}

		return idx+1 < asSorting.length ?
			idx+1 :
			overflow ?
				null :
				0;
	};

	if ( ! col.bSortable ) {
		return false;
	}

	// Convert to 2D array if needed
	if ( typeof sorting[0] === 'number' ) {
		sorting = settings.aaSorting = [ sorting ];
	}

	// If appending the sort then we are multi-column sorting
	if ( (shift || addIndex) && settings.oFeatures.bSortMulti ) {
		// Are we already doing some kind of sort on this column?
		var sortIdx = _pluck(sorting, '0').indexOf(colIdx);

		if ( sortIdx !== -1 ) {
			// Yes, modify the sort
			nextSortIdx = next( sorting[sortIdx], true );

			if ( nextSortIdx === null && sorting.length === 1 ) {
				nextSortIdx = 0; // can't remove sorting completely
			}

			if ( nextSortIdx === null ) {
				sorting.splice( sortIdx, 1 );
			}
			else {
				sorting[sortIdx][1] = asSorting[ nextSortIdx ];
				sorting[sortIdx]._idx = nextSortIdx;
			}
		}
		else if (shift) {
			// No sort on this column yet, being added by shift click
			// add it as itself
			sorting.push( [ colIdx, asSorting[0], 0 ] );
			sorting[sorting.length-1]._idx = 0;
		}
		else {
			// No sort on this column yet, being added from a colspan
			// so add with same direction as first column
			sorting.push( [ colIdx, sorting[0][1], 0 ] );
			sorting[sorting.length-1]._idx = 0;
		}
	}
	else if ( sorting.length && sorting[0][0] == colIdx ) {
		// Single column - already sorting on this column, modify the sort
		nextSortIdx = next( sorting[0] );

		sorting.length = 1;
		sorting[0][1] = asSorting[ nextSortIdx ];
		sorting[0]._idx = nextSortIdx;
	}
	else {
		// Single column - sort only on this column
		sorting.length = 0;
		sorting.push( [ colIdx, asSorting[0] ] );
		sorting[0]._idx = 0;
	}
}


/**
 * Set the sorting classes on table's body, Note: it is safe to call this function
 * when bSort and bSortClasses are false
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnSortingClasses( settings )
{
	var oldSort = settings.aLastSort;
	var sortClass = settings.oClasses.order.position;
	var sort = _fnSortFlatten( settings );
	var features = settings.oFeatures;
	var i, iLen, colIdx;

	if ( features.bSort && features.bSortClasses ) {
		// Remove old sorting classes
		for ( i=0, iLen=oldSort.length ; i<iLen ; i++ ) {
			colIdx = oldSort[i].src;

			// Remove column sorting
			$( _pluck( settings.aoData, 'anCells', colIdx ) )
				.removeClass( sortClass + (i<2 ? i+1 : 3) );
		}

		// Add new column sorting
		for ( i=0, iLen=sort.length ; i<iLen ; i++ ) {
			colIdx = sort[i].src;

			$( _pluck( settings.aoData, 'anCells', colIdx ) )
				.addClass( sortClass + (i<2 ? i+1 : 3) );
		}
	}

	settings.aLastSort = sort;
}


// Get the data to sort a column, be it from cache, fresh (populating the
// cache), or from a sort formatter
function _fnSortData( settings, colIdx )
{
	// Custom sorting function - provided by the sort data type
	var column = settings.aoColumns[ colIdx ];
	var customSort = DataTable.ext.order[ column.sSortDataType ];
	var customData;

	if ( customSort ) {
		customData = customSort.call( settings.oInstance, settings, colIdx,
			_fnColumnIndexToVisible( settings, colIdx )
		);
	}

	// Use / populate cache
	var row, cellData;
	var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	var data = settings.aoData;

	for ( var rowIdx=0 ; rowIdx<data.length ; rowIdx++ ) {
		// Sparse array
		if (! data[rowIdx]) {
			continue;
		}

		row = data[rowIdx];

		if ( ! row._aSortData ) {
			row._aSortData = [];
		}

		if ( ! row._aSortData[colIdx] || customSort ) {
			cellData = customSort ?
				customData[rowIdx] : // If there was a custom sort function, use data from there
				_fnGetCellData( settings, rowIdx, colIdx, 'sort' );

			row._aSortData[ colIdx ] = formatter ?
				formatter( cellData, settings ) :
				cellData;
		}
	}
}

