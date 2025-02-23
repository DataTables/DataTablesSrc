

/**
 * Filter the table using both the global filter and column based filtering
 *  @param {object} settings dataTables settings object
 *  @param {object} input search information
 *  @memberof DataTable#oApi
 */
function _fnFilterComplete ( settings, input )
{
	var columnsSearch = settings.aoPreSearchCols;

	// In server-side processing all filtering is done by the server, so no point hanging around here
	if ( _fnDataSource( settings ) != 'ssp' )
	{
		// Check if any of the rows were invalidated
		_fnFilterData( settings );

		// Start from the full data set
		settings.aiDisplay = settings.aiDisplayMaster.slice();

		// Global filter first
		_fnFilter( settings.aiDisplay, settings, input.search, input );

		$.each(settings.searchFixed, function (name, term) {
			_fnFilter(settings.aiDisplay, settings, term, {});
		});

		// Then individual column filters
		for ( var i=0 ; i<columnsSearch.length ; i++ )
		{
			var col = columnsSearch[i];

			_fnFilter(
				settings.aiDisplay,
				settings,
				col.search,
				col,
				i
			);

			$.each(settings.aoColumns[i].searchFixed, function (name, term) {
				_fnFilter(settings.aiDisplay, settings, term, {}, i);
			});
		}

		// And finally global filtering
		_fnFilterCustom( settings );
	}

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
		_fnArrayApply(displayRows, rows);
	}
}


/**
 * Filter the data table based on user input and draw the table
 */
function _fnFilter( searchRows, settings, input, options, column )
{
	if ( input === '' ) {
		return;
	}

	var i = 0;
	var matched = [];

	// Search term can be a function, regex or string - if a string we apply our
	// smart filtering regex (assuming the options require that)
	var searchFunc = typeof input === 'function' ? input : null;
	var rpSearch = input instanceof RegExp
		? input
		: searchFunc
			? null
			: _fnFilterCreateSearch( input, options );

	// Then for each row, does the test pass. If not, lop the row from the array
	for (i=0 ; i<searchRows.length ; i++) {
		var row = settings.aoData[ searchRows[i] ];
		var data = column === undefined
			? row._sFilterRow
			: row._aFilterData[ column ];

		if ( (searchFunc && searchFunc(data, row._aData, searchRows[i], column)) || (rpSearch && rpSearch.test(data)) ) {
			matched.push(searchRows[i]);
		}
	}

	// Mutate the searchRows array
	searchRows.length = matched.length;

	for (i=0 ; i<matched.length ; i++) {
		searchRows[i] = matched[i];
	}
}


/**
 * Build a regular expression object suitable for searching a table
 *  @param {string} sSearch string to search for
 *  @param {bool} bRegex treat as a regular expression or not
 *  @param {bool} bSmart perform smart filtering or not
 *  @param {bool} bCaseInsensitive Do case-insensitive matching or not
 *  @returns {RegExp} constructed object
 *  @memberof DataTable#oApi
 */
function _fnFilterCreateSearch( search, inOpts )
{
	var not = [];
	var options = $.extend({}, {
		boundary: false,
		caseInsensitive: true,
		exact: false,
		regex: false,
		smart: true
	}, inOpts);

	if (typeof search !== 'string') {
		search = search.toString();
	}

	// Remove diacritics if normalize is set up to do so
	search = _normalize(search);

	if (options.exact) {
		return new RegExp(
			'^'+_fnEscapeRegex(search)+'$',
			options.caseInsensitive ? 'i' : ''
		);
	}

	search = options.regex ?
		search :
		_fnEscapeRegex( search );
	
	if ( options.smart ) {
		/* For smart filtering we want to allow the search to work regardless of
		 * word order. We also want double quoted text to be preserved, so word
		 * order is important - a la google. And a negative look around for
		 * finding rows which don't contain a given string.
		 * 
		 * So this is the sort of thing we want to generate:
		 * 
		 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
		 */
		var parts = search.match( /!?["\u201C][^"\u201D]+["\u201D]|[^ ]+/g ) || [''];
		var a = parts.map( function ( word ) {
			var negative = false;
			var m;

			// Determine if it is a "does not include"
			if ( word.charAt(0) === '!' ) {
				negative = true;
				word = word.substring(1);
			}

			// Strip the quotes from around matched phrases
			if ( word.charAt(0) === '"' ) {
				m = word.match( /^"(.*)"$/ );
				word = m ? m[1] : word;
			}
			else if ( word.charAt(0) === '\u201C' ) {
				// Smart quote match (iPhone users)
				m = word.match( /^\u201C(.*)\u201D$/ );
				word = m ? m[1] : word;
			}

			// For our "not" case, we need to modify the string that is
			// allowed to match at the end of the expression.
			if (negative) {
				if (word.length > 1) {
					not.push('(?!'+word+')');
				}

				word = '';
			}

			return word.replace(/"/g, '');
		} );

		var match = not.length
			? not.join('')
			: '';

		var boundary = options.boundary
			? '\\b'
			: '';

		search = '^(?=.*?'+boundary+a.join( ')(?=.*?'+boundary )+')('+match+'.)*$';
	}

	return new RegExp( search, options.caseInsensitive ? 'i' : '' );
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
	var data = settings.aoData;
	var column;
	var j, jen, filterData, cellData, row;
	var wasInvalidated = false;

	for ( var rowIdx=0 ; rowIdx<data.length ; rowIdx++ ) {
		if (! data[rowIdx]) {
			continue;
		}

		row = data[rowIdx];

		if ( ! row._aFilterData ) {
			filterData = [];

			for ( j=0, jen=columns.length ; j<jen ; j++ ) {
				column = columns[j];

				if ( column.bSearchable ) {
					cellData = _fnGetCellData( settings, rowIdx, j, 'filter' );

					// Search in DataTables is string based
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
				// method used here is much faster https://jsperf.com/html-decode
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
