

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
		hungarian = 'a aa ao as b fn i m o s ',
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
	if ( ! src._hungarianMap )
	{
		_fnHungarianMap( src );
	}

	var hungarianKey;

	$.each( user, function (key, val) {
		hungarianKey = src._hungarianMap[ key ];

		if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
		{
			user[hungarianKey] = user[ key ];

			if ( hungarianKey.charAt(0) === 'o' )
			{
				_fnCamelToHungarian( src[hungarianKey], user[key] );
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
function _fnLanguageCompat( oLanguage )
{
	var oDefaults = DataTable.defaults.oLanguage;
	var zeroRecords = oLanguage.sZeroRecords;

	/* Backwards compatibility - if there is no sEmptyTable given, then use the same as
	 * sZeroRecords - assuming that is given.
	 */
	if ( !oLanguage.sEmptyTable && zeroRecords &&
		oDefaults.sEmptyTable === "No data available in table" )
	{
		_fnMap( oLanguage, oLanguage, 'sZeroRecords', 'sEmptyTable' );
	}

	/* Likewise with loading records */
	if ( !oLanguage.sLoadingRecords && zeroRecords &&
		oDefaults.sLoadingRecords === "Loading..." )
	{
		_fnMap( oLanguage, oLanguage, 'sZeroRecords', 'sLoadingRecords' );
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
}


/**
 * Browser feature detection for capabilities, quirks
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnBrowserDetect( settings )
{
	var browser = settings.oBrowser;

	// Scrolling feature / quirks detection
	var n = $('<div/>')
		.css( {
			position: 'absolute',
			top: 0,
			left: 0,
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
					$('<div class="test"/>')
						.css( {
							width: '100%',
							height: 10
						} )
				)
		)
		.appendTo( 'body' );

	var test = n.find('.test');

	// IE6/7 will oversize a width 100% element inside a scrolling element, to
	// include the width of the scrollbar, while other browsers ensure the inner
	// element is contained without forcing scrolling
	browser.bScrollOversize = test[0].offsetWidth === 100;

	// In rtl text layout, some browsers (most, but not all) will place the
	// scrollbar on the left, rather than the right.
	browser.bScrollbarLeft = test.offset().left !== 1;

	n.remove();
}

