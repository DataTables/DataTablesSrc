

/**
 * Create a mapping object that allows camel case parameters to be looked up
 * for their Hungarian counterparts. The mapping is stored in a private
 * parameter called `_hungarianMap` which can be accessed on the source object.
 *  @param {object} o
 *  @memberof DataTable#oApi
 */
function _fnHungarianMap ( o )
{
	var
		hungarian = 'a aa ai ao as b fn i m o s ',
		match,
		newKey,
		map = {};

	$.each( o, function (key, val) {
		match = key.match(/^([^A-Z]+?)([A-Z])/);

		if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
		{
			newKey = key.replace( match[0], match[2].toLowerCase() );
			map[ newKey ] = key;

			if ( match[1] === 'o' )
			{
				_fnHungarianMap( o[key] );
			}
		}
	} );

	o._hungarianMap = map;
}


/**
 * Convert from camel case parameters to Hungarian, based on a Hungarian map
 * created by _fnHungarianMap.
 *  @param {object} src The model object which holds all parameters that can be
 *    mapped.
 *  @param {object} user The object to convert from camel case to Hungarian.
 *  @param {boolean} force When set to `true`, properties which already have a
 *    Hungarian value in the `user` object will be overwritten. Otherwise they
 *    won't be.
 *  @memberof DataTable#oApi
 */
function _fnCamelToHungarian ( src, user, force )
{
	if ( ! src._hungarianMap ) {
		_fnHungarianMap( src );
	}

	var hungarianKey;

	$.each( user, function (key, val) {
		hungarianKey = src._hungarianMap[ key ];

		if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
		{
			// For objects, we need to buzz down into the object to copy parameters
			if ( hungarianKey.charAt(0) === 'o' )
			{
				// Copy the camelCase options over to the hungarian
				if ( ! user[ hungarianKey ] ) {
					user[ hungarianKey ] = {};
				}
				$.extend( true, user[hungarianKey], user[key] );

				_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
			}
			else {
				user[hungarianKey] = user[ key ];
			}
		}
	} );
}


/**
 * Language compatibility - when certain options are given, and others aren't, we
 * need to duplicate the values over, in order to provide backwards compatibility
 * with older language files.
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnLanguageCompat( lang )
{
	// Note the use of the Hungarian notation for the parameters in this method as
	// this is called after the mapping of camelCase to Hungarian
	var defaults = DataTable.defaults.oLanguage;

	// Default mapping
	var defaultDecimal = defaults.sDecimal;
	if ( defaultDecimal ) {
		_addNumericSort( defaultDecimal );
	}

	if ( lang ) {
		var zeroRecords = lang.sZeroRecords;

		// Backwards compatibility - if there is no sEmptyTable given, then use the same as
		// sZeroRecords - assuming that is given.
		if ( ! lang.sEmptyTable && zeroRecords &&
			defaults.sEmptyTable === "No data available in table" )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
		}

		// Likewise with loading records
		if ( ! lang.sLoadingRecords && zeroRecords &&
			defaults.sLoadingRecords === "Loading..." )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
		}

		// Old parameter name of the thousands separator mapped onto the new
		if ( lang.sInfoThousands ) {
			lang.sThousands = lang.sInfoThousands;
		}

		var decimal = lang.sDecimal;
		if ( decimal && defaultDecimal !== decimal ) {
			_addNumericSort( decimal );
		}
	}
}


/**
 * Map one parameter onto another
 *  @param {object} o Object to map
 *  @param {*} knew The new parameter name
 *  @param {*} old The old parameter name
 */
var _fnCompatMap = function ( o, knew, old ) {
	if ( o[ knew ] !== undefined ) {
		o[ old ] = o[ knew ];
	}
};


/**
 * Provide backwards compatibility for the main DT options. Note that the new
 * options are mapped onto the old parameters, so this is an external interface
 * change only.
 *  @param {object} init Object to map
 */
function _fnCompatOpts ( init )
{
	_fnCompatMap( init, 'ordering',      'bSort' );
	_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
	_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
	_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
	_fnCompatMap( init, 'order',         'aaSorting' );
	_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
	_fnCompatMap( init, 'paging',        'bPaginate' );
	_fnCompatMap( init, 'pagingType',    'sPaginationType' );
	_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
	_fnCompatMap( init, 'searching',     'bFilter' );

	// Boolean initialisation of x-scrolling
	if ( typeof init.sScrollX === 'boolean' ) {
		init.sScrollX = init.sScrollX ? '100%' : '';
	}
	if ( typeof init.scrollX === 'boolean' ) {
		init.scrollX = init.scrollX ? '100%' : '';
	}

	// Column search objects are in an array, so it needs to be converted
	// element by element
	var searchCols = init.aoSearchCols;

	if ( searchCols ) {
		for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
			if ( searchCols[i] ) {
				_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
			}
		}
	}
}


/**
 * Provide backwards compatibility for column options. Note that the new options
 * are mapped onto the old parameters, so this is an external interface change
 * only.
 *  @param {object} init Object to map
 */
function _fnCompatCols ( init )
{
	_fnCompatMap( init, 'orderable',     'bSortable' );
	_fnCompatMap( init, 'orderData',     'aDataSort' );
	_fnCompatMap( init, 'orderSequence', 'asSorting' );
	_fnCompatMap( init, 'orderDataType', 'sortDataType' );

	// orderData can be given as an integer
	var dataSort = init.aDataSort;
	if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
		init.aDataSort = [ dataSort ];
	}
}


/**
 * Browser feature detection for capabilities, quirks
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnBrowserDetect( settings )
{
	// We don't need to do this every time DataTables is constructed, the values
	// calculated are specific to the browser and OS configuration which we
	// don't expect to change between initialisations
	if ( ! DataTable.__browser ) {
		var browser = {};
		DataTable.__browser = browser;

		// Scrolling feature / quirks detection
		var n = $('<div/>')
			.css( {
				position: 'fixed',
				top: 0,
				left: $(window).scrollLeft()*-1, // allow for scrolling
				height: 1,
				width: 1,
				overflow: 'hidden'
			} )
			.append(
				$('<div/>')
					.css( {
						position: 'absolute',
						top: 1,
						left: 1,
						width: 100,
						overflow: 'scroll'
					} )
					.append(
						$('<div/>')
							.css( {
								width: '100%',
								height: 10
							} )
					)
			)
			.appendTo( 'body' );

		var outer = n.children();
		var inner = outer.children();

		// Numbers below, in order, are:
		// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
		//
		// IE6 XP:                           100 100 100  83
		// IE7 Vista:                        100 100 100  83
		// IE 8+ Windows:                     83  83 100  83
		// Evergreen Windows:                 83  83 100  83
		// Evergreen Mac with scrollbars:     85  85 100  85
		// Evergreen Mac without scrollbars: 100 100 100 100

		// Get scrollbar width
		browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;

		// IE6/7 will oversize a width 100% element inside a scrolling element, to
		// include the width of the scrollbar, while other browsers ensure the inner
		// element is contained without forcing scrolling
		browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;

		// In rtl text layout, some browsers (most, but not all) will place the
		// scrollbar on the left, rather than the right.
		browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;

		// IE8- don't provide height and width for getBoundingClientRect
		browser.bBounding = n[0].getBoundingClientRect().width ? true : false;

		n.remove();
	}

	$.extend( settings.oBrowser, DataTable.__browser );
	settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
}


/**
 * Array.prototype reduce[Right] method, used for browsers which don't support
 * JS 1.6. Done this way to reduce code size, since we iterate either way
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnReduce ( that, fn, init, start, end, inc )
{
	var
		i = start,
		value,
		isSet = false;

	if ( init !== undefined ) {
		value = init;
		isSet = true;
	}

	while ( i !== end ) {
		if ( ! that.hasOwnProperty(i) ) {
			continue;
		}

		value = isSet ?
			fn( value, that[i], i, that ) :
			that[i];

		isSet = true;
		i += inc;
	}

	return value;
}

