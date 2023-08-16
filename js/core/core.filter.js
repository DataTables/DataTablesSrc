

/**
 * Filter the table using both the global filter and column based filtering
 *  @param {object} settings dataTables settings object
 *  @param {object} input search information
 *  @memberof DataTable#oApi
 */
function _fnFilterComplete ( settings, input )
{
	var search = settings.oPreviousSearch;
	var columnsSearch = settings.aoPreSearchCols;

	// Resolve any column types that are unknown due to addition or invalidation
	// @todo As per sort - can this be moved into an event handler?
	_fnColumnTypes( settings );

	// In server-side processing all filtering is done by the server, so no point hanging around here
	if ( _fnDataSource( settings ) != 'ssp' )
	{
		// Check if any of the rows were invalidated
		_fnFilterData( settings );

		// Start from the full data set
		settings.aiDisplay = settings.aiDisplayMaster.slice();

		// Global filter first
		_fnFilter( settings.aiDisplay, settings, input.sSearch, input.bRegex, input.bSmart, input.bCaseInsensitive );

		$.each(settings.searchFixed, function (name, term) {
			_fnFilter(settings.aiDisplay, settings, term, false, true, true);
		});

		// Then individual column filters
		for ( var i=0 ; i<columnsSearch.length ; i++ )
		{
			var col = columnsSearch[i];

			_fnFilter(
				settings.aiDisplay,
				settings,
				col.sSearch,
				col.bRegex,
				col.bSmart,
				col.bCaseInsensitive,
				i
			);

			$.each(settings.aoColumns[i].searchFixed, function (name, term) {
				_fnFilter(settings.aiDisplay, settings, term, false, true, true, i);
			});
		}

		// And finally global filtering
		_fnFilterCustom( settings );
	}

	// Save the filtering values
	search.sSearch = input.sSearch;
	search.bRegex = input.bRegex;
	search.bSmart = input.bSmart;
	search.bCaseInsensitive = input.bCaseInsensitive;
	search.return = input.return;

	// Tell the draw function we have been filtering
	settings.bFiltered = true;

	_fnCallbackFire( settings, null, 'search', [settings] );
}


/**
 * Apply custom filtering functions
 * 
 * This is legacy now that we have named functions, but it is widely used
 * from 1.x, so it is not yet deprecated.
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnFilterCustom( settings )
{
	var filters = DataTable.ext.search;
	var displayRows = settings.aiDisplay;
	var row, rowIdx;

	for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
		var rows = [];

		// Loop over each row and see if it should be included
		for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
			rowIdx = displayRows[ j ];
			row = settings.aoData[ rowIdx ];

			if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
				rows.push( rowIdx );
			}
		}

		// So the array reference doesn't break set the results into the
		// existing array
		displayRows.length = 0;
		$.merge( displayRows, rows );
	}
}


/**
 * Filter the data table based on user input and draw the table
 */
function _fnFilter( searchRows, settings, input, regex, smart, caseInsensitive, column )
{
	if ( input === '' ) {
		return;
	}

	var i = 0;

	// Search term can be a function, regex or string - if a string we apply our
	// smart filtering regex (assuming the options require that)
	var searchFunc = typeof input === 'function' ? input : null;
	var rpSearch = input instanceof RegExp
		? input
		: searchFunc
			? null
			: _fnFilterCreateSearch( input, regex, smart, caseInsensitive );

	// Then for each row, does the test pass. If not, lop the row from the array
	while (i < searchRows.length) {
		var row = settings.aoData[ searchRows[i] ];
		var data = column === undefined
			? row._sFilterRow
			: row._aFilterData[ column ];

		if ( (searchFunc && ! searchFunc(data, row._aData)) || (rpSearch && ! rpSearch.test(data)) ) {
			searchRows.splice(i, 1);
			i--;
		}

		i++;
	}
}


/**
 * Build a regular expression object suitable for searching a table
 *  @param {string} sSearch string to search for
 *  @param {bool} bRegex treat as a regular expression or not
 *  @param {bool} bSmart perform smart filtering or not
 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
 *  @returns {RegExp} constructed object
 *  @memberof DataTable#oApi
 */
function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
{
	if (typeof search !== 'string') {
		search = search.toString();
	}

	search = regex ?
		search :
		_fnEscapeRegex( search );
	
	if ( smart ) {
		/* For smart filtering we want to allow the search to work regardless of
		 * word order. We also want double quoted text to be preserved, so word
		 * order is important - a la google. So this is what we want to
		 * generate:
		 * 
		 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
		 */
		var a = $.map( search.match( /["\u201C][^"\u201D]+["\u201D]|[^ ]+/g ) || [''], function ( word ) {
			if ( word.charAt(0) === '"' ) {
				var m = word.match( /^"(.*)"$/ );
				word = m ? m[1] : word;
			}
			else if ( word.charAt(0) === '\u201C' ) {
				var m = word.match( /^\u201C(.*)\u201D$/ );
				word = m ? m[1] : word;
			}

			return word.replace('"', '');
		} );

		search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
	}

	return new RegExp( search, caseInsensitive ? 'i' : '' );
}


/**
 * Escape a string such that it can be used in a regular expression
 *  @param {string} sVal string to escape
 *  @returns {string} escaped string
 *  @memberof DataTable#oApi
 */
var _fnEscapeRegex = DataTable.util.escapeRegex;

var __filter_div = $('<div>')[0];
var __filter_div_textContent = __filter_div.textContent !== undefined;

// Update the filtering data for each row if needed (by invalidation or first run)
function _fnFilterData ( settings )
{
	var columns = settings.aoColumns;
	var column;
	var i, j, ien, jen, filterData, cellData, row;
	var wasInvalidated = false;

	for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
		row = settings.aoData[i];

		if ( ! row._aFilterData ) {
			filterData = [];

			for ( j=0, jen=columns.length ; j<jen ; j++ ) {
				column = columns[j];

				if ( column.bSearchable ) {
					cellData = _fnGetCellData( settings, i, j, 'filter' );

					// Search in DataTables 1.10 is string based. In 1.11 this
					// should be altered to also allow strict type checking.
					if ( cellData === null ) {
						cellData = '';
					}

					if ( typeof cellData !== 'string' && cellData.toString ) {
						cellData = cellData.toString();
					}
				}
				else {
					cellData = '';
				}

				// If it looks like there is an HTML entity in the string,
				// attempt to decode it so sorting works as expected. Note that
				// we could use a single line of jQuery to do this, but the DOM
				// method used here is much faster http://jsperf.com/html-decode
				if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
					__filter_div.innerHTML = cellData;
					cellData = __filter_div_textContent ?
						__filter_div.textContent :
						__filter_div.innerText;
				}

				if ( cellData.replace ) {
					cellData = cellData.replace(/[\r\n\u2028]/g, '');
				}

				filterData.push( cellData );
			}

			row._aFilterData = filterData;
			row._sFilterRow = filterData.join('  ');
			wasInvalidated = true;
		}
	}

	return wasInvalidated;
}


/**
 * Convert from the internal Hungarian notation to camelCase for external
 * interaction
 *  @param {object} obj Object to convert
 *  @returns {object} Inverted object
 *  @memberof DataTable#oApi
 */
function _fnSearchToCamel ( obj )
{
	return {
		search:          obj.sSearch,
		smart:           obj.bSmart,
		regex:           obj.bRegex,
		caseInsensitive: obj.bCaseInsensitive
	};
}



/**
 * Convert from camelCase notation to the internal Hungarian. We could use the
 * Hungarian convert function here, but this is cleaner
 *  @param {object} obj Object to convert
 *  @returns {object} Inverted object
 *  @memberof DataTable#oApi
 */
function _fnSearchToHung ( obj )
{
	return {
		sSearch:          obj.search,
		bSmart:           obj.smart,
		bRegex:           obj.regex,
		bCaseInsensitive: obj.caseInsensitive
	};
}

