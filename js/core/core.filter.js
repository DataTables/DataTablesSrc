
/**
 * Generate the node required for filtering text
 *  @returns {node} Filter control element
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlFilter ( settings )
{
	var classes = settings.oClasses;
	var tableId = settings.sTableId;
	var language = settings.oLanguage;
	var previousSearch = settings.oPreviousSearch;
	var features = settings.aanFeatures;
	var input = '<input type="search" class="'+classes.sFilterInput+'"/>';

	var str = language.sSearch;
	str = str.match(/_INPUT_/) ?
		str.replace('_INPUT_', input) :
		str+input;

	var filter = $('<div/>', {
			'id': ! features.f ? tableId+'_filter' : null,
			'class': classes.sFilter
		} )
		.append( $('<label/>' ).append( str ) );

	var searchFn = function() {
		/* Update all other filter input elements for the new display */
		var n = features.f;
		var val = !this.value ? "" : this.value; // mental IE8 fix :-(

		/* Now do the filter */
		if ( val != previousSearch.sSearch ) {
			_fnFilterComplete( settings, {
				"sSearch": val,
				"bRegex": previousSearch.bRegex,
				"bSmart": previousSearch.bSmart ,
				"bCaseInsensitive": previousSearch.bCaseInsensitive
			} );

			// Need to redraw, without resorting
			settings._iDisplayStart = 0;
			_fnDraw( settings );
		}
	};

	var searchDelay = settings.searchDelay !== null ?
		settings.searchDelay :
		_fnDataSource( settings ) === 'ssp' ?
			400 :
			0;

	var jqFilter = $('input', filter)
		.val( previousSearch.sSearch )
		.attr( 'placeholder', language.sSearchPlaceholder )
		.bind(
			'keyup.DT search.DT input.DT paste.DT cut.DT',
			searchDelay ?
				_fnThrottle( searchFn, searchDelay ) :
				searchFn
		)
		.bind( 'keypress.DT', function(e) {
			/* Prevent form submission */
			if ( e.keyCode == 13 ) {
				return false;
			}
		} )
		.attr('aria-controls', tableId);

	// Update the input elements whenever the table is filtered
	$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
		if ( settings === s ) {
			// IE9 throws an 'unknown error' if document.activeElement is used
			// inside an iframe or frame...
			try {
				if ( jqFilter[0] !== document.activeElement ) {
					jqFilter.val( previousSearch.sSearch );
				}
			}
			catch ( e ) {}
		}
	} );

	return filter[0];
}


/**
 * Filter the table using both the global filter and column based filtering
 *  @param {object} oSettings dataTables settings object
 *  @param {object} oSearch search information
 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
 *  @memberof DataTable#oApi
 */
function _fnFilterComplete ( oSettings, oInput, iForce )
{
	var oPrevSearch = oSettings.oPreviousSearch;
	var aoPrevSearch = oSettings.aoPreSearchCols;
	var fnSaveFilter = function ( oFilter ) {
		/* Save the filtering values */
		oPrevSearch.sSearch = oFilter.sSearch;
		oPrevSearch.bRegex = oFilter.bRegex;
		oPrevSearch.bSmart = oFilter.bSmart;
		oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
	};
	var fnRegex = function ( o ) {
		// Backwards compatibility with the bEscapeRegex option
		return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
	};

	// Resolve any column types that are unknown due to addition or invalidation
	// @todo As per sort - can this be moved into an event handler?
	_fnColumnTypes( oSettings );

	/* In server-side processing all filtering is done by the server, so no point hanging around here */
	if ( _fnDataSource( oSettings ) != 'ssp' )
	{
		/* Global filter */
		_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
		fnSaveFilter( oInput );

		/* Now do the individual column filter */
		for ( var i=0 ; i<aoPrevSearch.length ; i++ )
		{
			_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
				aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
		}

		/* Custom filtering */
		_fnFilterCustom( oSettings );
	}
	else
	{
		fnSaveFilter( oInput );
	}

	/* Tell the draw function we have been filtering */
	oSettings.bFiltered = true;
	_fnCallbackFire( oSettings, null, 'search', [oSettings] );
}


/**
 * Apply custom filtering functions
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
		displayRows.push.apply( displayRows, rows );
	}
}


/**
 * Filter the table on a per-column basis
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sInput string to filter on
 *  @param {int} iColumn column to filter
 *  @param {bool} bRegex treat search string as a regular expression or not
 *  @param {bool} bSmart use smart filtering or not
 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
 *  @memberof DataTable#oApi
 */
function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
{
	if ( searchStr === '' ) {
		return;
	}

	var data;
	var display = settings.aiDisplay;
	var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );

	for ( var i=display.length-1 ; i>=0 ; i-- ) {
		data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];

		if ( ! rpSearch.test( data ) ) {
			display.splice( i, 1 );
		}
	}
}


/**
 * Filter the data table based on user input and draw the table
 *  @param {object} settings dataTables settings object
 *  @param {string} input string to filter on
 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
 *  @param {bool} regex treat as a regular expression or not
 *  @param {bool} smart perform smart filtering or not
 *  @param {bool} caseInsensitive Do case insenstive matching or not
 *  @memberof DataTable#oApi
 */
function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
{
	var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
	var prevSearch = settings.oPreviousSearch.sSearch;
	var displayMaster = settings.aiDisplayMaster;
	var display, invalidated, i;

	// Need to take account of custom filtering functions - always filter
	if ( DataTable.ext.search.length !== 0 ) {
		force = true;
	}

	// Check if any of the rows were invalidated
	invalidated = _fnFilterData( settings );

	// If the input is blank - we just want the full data set
	if ( input.length <= 0 ) {
		settings.aiDisplay = displayMaster.slice();
	}
	else {
		// New search - start from the master array
		if ( invalidated ||
			 force ||
			 prevSearch.length > input.length ||
			 input.indexOf(prevSearch) !== 0 ||
			 settings.bSorted // On resort, the display master needs to be
			                  // re-filtered since indexes will have changed
		) {
			settings.aiDisplay = displayMaster.slice();
		}

		// Search the display array
		display = settings.aiDisplay;

		for ( i=display.length-1 ; i>=0 ; i-- ) {
			if ( ! rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
				display.splice( i, 1 );
			}
		}
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
		var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || '', function ( word ) {
			if ( word.charAt(0) === '"' ) {
				var m = word.match( /^"(.*)"$/ );
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
function _fnEscapeRegex ( sVal )
{
	return sVal.replace( _re_escape_regex, '\\$1' );
}



var __filter_div = $('<div>')[0];
var __filter_div_textContent = __filter_div.textContent !== undefined;

// Update the filtering data for each row if needed (by invalidation or first run)
function _fnFilterData ( settings )
{
	var columns = settings.aoColumns;
	var column;
	var i, j, ien, jen, filterData, cellData, row;
	var fomatters = DataTable.ext.type.search;
	var wasInvalidated = false;

	for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
		row = settings.aoData[i];

		if ( ! row._aFilterData ) {
			filterData = [];

			for ( j=0, jen=columns.length ; j<jen ; j++ ) {
				column = columns[j];

				if ( column.bSearchable ) {
					cellData = _fnGetCellData( settings, i, j, 'filter' );

					if ( fomatters[ column.sType ] ) {
						cellData = fomatters[ column.sType ]( cellData );
					}

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
					cellData = cellData.replace(/[\r\n]/g, '');
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

