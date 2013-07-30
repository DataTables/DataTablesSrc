

function _fnSortFlatten ( settings )
{
	var
		i, iLen, k, kLen,
		aSort = [],
		aiOrig = [],
		aoColumns = settings.aoColumns,
		aDataSort, iCol, sType,
		nestedSort = settings.aaSortingFixed.concat( settings.aaSorting );

	for ( i=0 ; i<nestedSort.length ; i++ )
	{
		aDataSort = aoColumns[ nestedSort[i][0] ].aDataSort;

		for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
		{
			iCol = aDataSort[k];
			sType = aoColumns[ iCol ].sType || 'string';

			aSort.push( {
				col:       iCol,
				dir:       nestedSort[i][1],
				index:     nestedSort[i][2],
				type:      sType,
				formatter: DataTable.ext.type.sort[ sType+"-pre" ]
			} );
		}
	}

	return aSort;
}

/**
 * Change the order of the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 *  @todo This really needs split up!
 */
function _fnSort ( oSettings )
{
	var
		i, ien, iLen, j, jLen, k, kLen,
		sDataType, nTh,
		aiOrig = [],
		oExtSort = DataTable.ext.type.sort,
		aoData = oSettings.aoData,
		aoColumns = oSettings.aoColumns,
		aDataSort, data, iCol, sType, oSort,
		formatters = 0,
		nestedSort = oSettings.aaSortingFixed.concat( oSettings.aaSorting ),
		sortCol,
		displayMaster = oSettings.aiDisplayMaster,
		aSort = _fnSortFlatten( oSettings );

	// Resolve any column types that are unknown due to addition or invalidation
	// @todo Can this be moved into a 'data-ready' handler which is called when
	//   data is going to be used in the table?
	_fnColumnTypes( oSettings );

	for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
		sortCol = aSort[i];

		// Track if we can use the fast sort algorithm
		if ( sortCol.formatter ) {
			formatters++;
		}

		// Load the data needed for the sort, for each cell
		_fnSortData( oSettings, sortCol.col );
	}

	/* No sorting required if server-side or no sorting array */
	if ( !oSettings.oFeatures.bServerSide && aSort.length !== 0 )
	{
		// Create a value - key array of the current row positions such that we can use their
		// current position during the sort, if values match, in order to perform stable sorting
		for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
			aiOrig[ displayMaster[i] ] = i;
		}

		/* Do the sort - here we want multi-column sorting based on a given data source (column)
		 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
		 * follow on it's own, but this is what we want (example two column sorting):
		 *  fnLocalSorting = function(a,b){
		 *    var iTest;
		 *    iTest = oSort['string-asc']('data11', 'data12');
		 *      if (iTest !== 0)
		 *        return iTest;
		 *    iTest = oSort['numeric-desc']('data21', 'data22');
		 *    if (iTest !== 0)
		 *      return iTest;
		 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
		 *  }
		 * Basically we have a test for each sorting column, if the data in that column is equal,
		 * test the next column. If all columns match, then we use a numeric sort on the row
		 * positions in the original data array to provide a stable sort.
		 *
		 * Note - I know it seems excessive to have two sorting methods, but the first is around
		 * 15% faster, so the second is only maintained for backwards compatibility with sorting
		 * methods which do not have a pre-sort formatting function.
		 */
		if ( formatters === aSort.length ) {
			// All sort types have formatting functions
			displayMaster.sort( function ( a, b ) {
				var
					x, y, k, test, sort,
					len=aSort.length,
					dataA = aoData[a]._aSortData,
					dataB = aoData[b]._aSortData;

				for ( k=0 ; k<len ; k++ ) {
					sort = aSort[k];

					x = dataA[ sort.col ];
					y = dataB[ sort.col ];

					test = x<y ? -1 : x>y ? 1 : 0;
					if ( test !== 0 ) {
						return sort.dir === 'asc' ? test : -test;
					}
				}

				x = aiOrig[a];
				y = aiOrig[b];
				return x<y ? -1 : x>y ? 1 : 0;
			} );
		}
		else {
			// Depreciated - remove in 1.11 (providing a plug-in option)
			// Not all sort types have formatting methods, so we have to call their sorting
			// methods.
			displayMaster.sort( function ( a, b ) {
				var
					x, y, k, l, test, sort, fn,
					len=aSort.length,
					dataA = aoData[a]._aSortData,
					dataB = aoData[b]._aSortData;

				for ( k=0 ; k<len ; k++ ) {
					sort = aSort[k];

					x = dataA[ sort.col ];
					y = dataB[ sort.col ];

					fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
					test = fn( x, y );
					if ( test !== 0 ) {
						return test;
					}
				}

				x = aiOrig[a];
				y = aiOrig[b];
				return x<y ? -1 : x>y ? 1 : 0;
			} );
		}
	}

	/* Tell the draw function that we have sorted the data */
	oSettings.bSorted = true;
}


function _fnSortAria ( settings )
{
	var label;
	var nextSort;
	var columns = settings.aoColumns;
	var aSort = _fnSortFlatten( settings );
	var oAria = settings.oLanguage.oAria;

	// ARIA attributes - need to loop all columns, to update all (removing old
	// attributes as needed)
	for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
	{
		var col = columns[i];
		var asSorting = col.asSorting;
		var sTitle = col.sTitle.replace( /<.*?>/g, "" );
		var jqTh = $(col.nTh).removeAttr('aria-sort');

		/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
		if ( col.bSortable ) {
			if ( aSort.length > 0 && aSort[0].col == i ) {
				jqTh.attr('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
				nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
			}
			else {
				nextSort = asSorting[0];
			}

			label = sTitle + ( nextSort === "asc" ?
				oAria.sSortAscending :
				oAria.sSortDescending
			);
		}
		else {
			label = sTitle;
		}

		jqTh.attr('aria-label', label);
	}
}


/**
 * Function to run on user sort request
 *  @param {object} settings dataTables settings object
 *  @param {node} attachTo node to attach the handler to
 *  @param {int} colIdx column sorting index
 *  @param {boolean} [append=false] Append the requested sort to the existing
 *    sort if true (i.e. multi-column sort)
 *  @param {function} [callback] callback function
 *  @memberof DataTable#oApi
 */
function _fnSortListener ( settings, colIdx, append, callback )
{
	var col = settings.aoColumns[ colIdx ];
	var sorting = settings.aaSorting;
	var asSorting = col.asSorting;
	var nextSortIdx;
	var next = function ( a ) {
		var idx = a._idx;
		if ( idx === undefined ) {
			idx = $.inArray( a[1], asSorting );
		}

		return idx+1 >= asSorting.length ? 0 : idx+1;
	};

	// If appending the sort then we are multi-column sorting
	if ( append && settings.oFeatures.bSortMulti ) {
		// Are we already doing some kind of sort on this column?
		var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );

		if ( sortIdx !== -1 ) {
			// Yes, modify the sort
			nextSortIdx = next( sorting[sortIdx] );

			sorting[sortIdx][1] = asSorting[ nextSortIdx ];
			sorting[sortIdx]._idx = nextSortIdx;
		}
		else {
			// No sort on this column yet
			sorting.push( [ colIdx, asSorting[0], 0 ] );
			sorting[sorting.length-1]._idx = 0;
		}
	}
	else if ( sorting[0][0] == colIdx ) {
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

	// Run the sort by calling a full redraw
	_fnReDraw( settings );

	// callback used for async user interaction
	if ( typeof callback == 'function' ) {
		callback( settings );
	}
}


/**
 * Attach a sort handler (click) to a node
 *  @param {object} settings dataTables settings object
 *  @param {node} attachTo node to attach the handler to
 *  @param {int} colIdx column sorting index
 *  @param {function} [callback] callback function
 *  @memberof DataTable#oApi
 */
function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
{
	var col = settings.aoColumns[ colIdx ];

	_fnBindAction( attachTo, {}, function (e) {
		/* If the column is not sortable - don't to anything */
		if ( col.bSortable === false ) {
			return;
		}

		_fnProcessingDisplay( settings, true );

		// Use a timeout to allow the processing display to be shown.
		setTimeout( function() {
			_fnSortListener( settings, colIdx, e.shiftKey, callback );
			_fnProcessingDisplay( settings, false );
		}, 0 );
	} );
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
	var sortClass = settings.oClasses.sSortColumn;
	var sort = _fnSortFlatten( settings );
	var features = settings.oFeatures;
	var i, ien, colIdx;

	if ( features.bSort && features.bSortClasses ) {
		// Remove old sorting classes
		for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
			colIdx = oldSort[i].col;

			// Remove column sorting
			$( _pluck( settings.aoData, 'anCells', colIdx ) )
				.removeClass( sortClass + (i<2 ? i+1 : 3) );
		}

		// Add new column sorting
		for ( i=0, ien=sort.length ; i<ien ; i++ ) {
			colIdx = sort[i].col;

			$( _pluck( settings.aoData, 'anCells', colIdx ) )
				.addClass( sortClass + (i<2 ? i+1 : 3) );
		}
	}

	settings.aLastSort = sort;
}


// Get the data to sort a column, be it from cache, fresh (populating the
// cache), or from a sort formatter
function _fnSortData( settings, idx )
{
	// Custom sorting function - provided by the sort data type
	var column = settings.aoColumns[ idx ];
	var customSort = DataTable.ext.sort[ column.sSortDataType ];
	var customData;

	if ( customSort ) {
		customData = customSort.call( settings.oInstance, settings, idx,
			_fnColumnIndexToVisible( settings, idx )
		);
	}

	// Use / populate cache
	var row, cellData;
	var formatter = DataTable.ext.type.sort[ column.sType+"-pre" ];

	for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
		row = settings.aoData[i];

		if ( ! row._aSortData ) {
			row._aSortData = [];
		}

		if ( ! row._aSortData[idx] || customSort ) {
			cellData = customSort ?
				customData[i] : // If there was a custom sort function, use data from there
				_fnGetCellData( settings, i, idx, 'sort' );

			row._aSortData[ idx ] = formatter ?
				formatter( cellData ) :
				cellData;
		}
	}
}

