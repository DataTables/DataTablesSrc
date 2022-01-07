/**
 * Create an Ajax call based on the table's settings, taking into account that
 * parameters can have multiple forms, and backwards compatibility.
 *
 * @param {object} oSettings dataTables settings object
 * @param {array} data Data to send to the server, required by
 *     DataTables - may be augmented by developer callbacks
 * @param {function} fn Callback function to run when data is obtained
 */
function _fnBuildAjax( oSettings, data, fn )
{
	// Compatibility with 1.9-, allow fnServerData and event to manipulate
	_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );

	// Convert to object based for 1.10+ if using the old array scheme which can
	// come from server-side processing or serverParams
	if ( data && Array.isArray(data) ) {
		var tmp = {};
		var rbracket = /(.*?)\[\]$/;

		$.each( data, function (key, val) {
			var match = val.name.match(rbracket);

			if ( match ) {
				// Support for arrays
				var name = match[0];

				if ( ! tmp[ name ] ) {
					tmp[ name ] = [];
				}
				tmp[ name ].push( val.value );
			}
			else {
				tmp[val.name] = val.value;
			}
		} );
		data = tmp;
	}

	var ajaxData;
	var ajax = oSettings.ajax;
	var instance = oSettings.oInstance;
	var callback = function ( json ) {
		var status = oSettings.jqXHR
			? oSettings.jqXHR.status
			: null;

		if ( json === null || (typeof status === 'number' && status == 204 ) ) {
			json = {};
			_fnAjaxDataSrc( oSettings, json, [] );
		}

		var error = json.error || json.sError;
		if ( error ) {
			_fnLog( oSettings, 0, error );
		}

		oSettings.json = json;

		_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
		fn( json );
	};

	if ( $.isPlainObject( ajax ) && ajax.data )
	{
		ajaxData = ajax.data;

		var newData = typeof ajaxData === 'function' ?
			ajaxData( data, oSettings ) :  // fn can manipulate data or return
			ajaxData;                      // an object object or array to merge

		// If the function returned something, use that alone
		data = typeof ajaxData === 'function' && newData ?
			newData :
			$.extend( true, data, newData );

		// Remove the data property as we've resolved it already and don't want
		// jQuery to do it again (it is restored at the end of the function)
		delete ajax.data;
	}

	var baseAjax = {
		"data": data,
		"success": callback,
		"dataType": "json",
		"cache": false,
		"type": oSettings.sServerMethod,
		"error": function (xhr, error, thrown) {
			var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );

			if ( $.inArray( true, ret ) === -1 ) {
				if ( error == "parsererror" ) {
					_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
				}
				else if ( xhr.readyState === 4 ) {
					_fnLog( oSettings, 0, 'Ajax error', 7 );
				}
			}

			_fnProcessingDisplay( oSettings, false );
		}
	};

	// Store the data submitted for the API
	oSettings.oAjaxData = data;

	// Allow plug-ins and external processes to modify the data
	_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );

	if ( oSettings.fnServerData )
	{
		// DataTables 1.9- compatibility
		oSettings.fnServerData.call( instance,
			oSettings.sAjaxSource,
			$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
				return { name: key, value: val };
			} ),
			callback,
			oSettings
		);
	}
	else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
	{
		// DataTables 1.9- compatibility
		oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
			url: ajax || oSettings.sAjaxSource
		} ) );
	}
	else if ( typeof ajax === 'function' )
	{
		// Is a function - let the caller define what needs to be done
		oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
	}
	else
	{
		// Object to extend the base settings
		oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );

		// Restore for next time around
		ajax.data = ajaxData;
	}
}


/**
 * Update the table using an Ajax call
 *  @param {object} settings dataTables settings object
 *  @returns {boolean} Block the table drawing or not
 *  @memberof DataTable#oApi
 */
function _fnAjaxUpdate( settings )
{
	settings.iDraw++;
	_fnProcessingDisplay( settings, true );

	_fnBuildAjax(
		settings,
		_fnAjaxParameters( settings ),
		function(json) {
			_fnAjaxUpdateDraw( settings, json );
		}
	);
}


/**
 * Build up the parameters in an object needed for a server-side processing
 * request. Note that this is basically done twice, is different ways - a modern
 * method which is used by default in DataTables 1.10 which uses objects and
 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
 * the sAjaxSource option is used in the initialisation, or the legacyAjax
 * option is set.
 *  @param {object} oSettings dataTables settings object
 *  @returns {bool} block the table drawing or not
 *  @memberof DataTable#oApi
 */
function _fnAjaxParameters( settings )
{
	var
		columns = settings.aoColumns,
		columnCount = columns.length,
		features = settings.oFeatures,
		preSearch = settings.oPreviousSearch,
		preColSearch = settings.aoPreSearchCols,
		i, data = [], dataProp, column, columnSearch,
		sort = _fnSortFlatten( settings ),
		displayStart = settings._iDisplayStart,
		displayLength = features.bPaginate !== false ?
			settings._iDisplayLength :
			-1;

	var param = function ( name, value ) {
		data.push( { 'name': name, 'value': value } );
	};

	// DataTables 1.9- compatible method
	param( 'sEcho',          settings.iDraw );
	param( 'iColumns',       columnCount );
	param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
	param( 'iDisplayStart',  displayStart );
	param( 'iDisplayLength', displayLength );

	// DataTables 1.10+ method
	var d = {
		draw:    settings.iDraw,
		columns: [],
		order:   [],
		start:   displayStart,
		length:  displayLength,
		search:  {
			value: preSearch.sSearch,
			regex: preSearch.bRegex
		}
	};

	for ( i=0 ; i<columnCount ; i++ ) {
		column = columns[i];
		columnSearch = preColSearch[i];
		dataProp = typeof column.mData=="function" ? 'function' : column.mData ;

		d.columns.push( {
			data:       dataProp,
			name:       column.sName,
			searchable: column.bSearchable,
			orderable:  column.bSortable,
			search:     {
				value: columnSearch.sSearch,
				regex: columnSearch.bRegex
			}
		} );

		param( "mDataProp_"+i, dataProp );

		if ( features.bFilter ) {
			param( 'sSearch_'+i,     columnSearch.sSearch );
			param( 'bRegex_'+i,      columnSearch.bRegex );
			param( 'bSearchable_'+i, column.bSearchable );
		}

		if ( features.bSort ) {
			param( 'bSortable_'+i, column.bSortable );
		}
	}

	if ( features.bFilter ) {
		param( 'sSearch', preSearch.sSearch );
		param( 'bRegex', preSearch.bRegex );
	}

	if ( features.bSort ) {
		$.each( sort, function ( i, val ) {
			d.order.push( { column: val.col, dir: val.dir } );

			param( 'iSortCol_'+i, val.col );
			param( 'sSortDir_'+i, val.dir );
		} );

		param( 'iSortingCols', sort.length );
	}

	// If the legacy.ajax parameter is null, then we automatically decide which
	// form to use, based on sAjaxSource
	var legacy = DataTable.ext.legacy.ajax;
	if ( legacy === null ) {
		return settings.sAjaxSource ? data : d;
	}

	// Otherwise, if legacy has been specified then we use that to decide on the
	// form
	return legacy ? data : d;
}


/**
 * Data the data from the server (nuking the old) and redraw the table
 *  @param {object} oSettings dataTables settings object
 *  @param {object} json json data return from the server.
 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
 *  @param {array} json.aaData The data to display on this page
 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
 *  @memberof DataTable#oApi
 */
function _fnAjaxUpdateDraw ( settings, json )
{
	// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
	// Support both
	var compat = function ( old, modern ) {
		return json[old] !== undefined ? json[old] : json[modern];
	};

	var data = _fnAjaxDataSrc( settings, json );
	var draw            = compat( 'sEcho',                'draw' );
	var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
	var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );

	if ( draw !== undefined ) {
		// Protect against out of sequence returns
		if ( draw*1 < settings.iDraw ) {
			return;
		}
		settings.iDraw = draw * 1;
	}

	// No data in returned object, so rather than an array, we show an empty table
	if ( ! data ) {
		data = [];
	}

	_fnClearTable( settings );
	settings._iRecordsTotal   = parseInt(recordsTotal, 10);
	settings._iRecordsDisplay = parseInt(recordsFiltered, 10);

	for ( var i=0, ien=data.length ; i<ien ; i++ ) {
		_fnAddData( settings, data[i] );
	}
	settings.aiDisplay = settings.aiDisplayMaster.slice();

	_fnDraw( settings, true );

	if ( ! settings._bInitComplete ) {
		_fnInitComplete( settings, json );
	}

	_fnProcessingDisplay( settings, false );
}


/**
 * Get the data from the JSON data source to use for drawing a table. Using
 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
 * source object, or from a processing function.
 *  @param {object} oSettings dataTables settings object
 *  @param  {object} json Data source object / array from the server
 *  @return {array} Array of data to use
 */
 function _fnAjaxDataSrc ( oSettings, json, write )
 {
	var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
		oSettings.ajax.dataSrc :
		oSettings.sAjaxDataProp; // Compatibility with 1.9-.

	if ( ! write ) {
		if ( dataSrc === 'data' ) {
			// If the default, then we still want to support the old style, and safely ignore
			// it if possible
			return json.aaData || json[dataSrc];
		}

		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}

	// set
	_fnSetObjectDataFn( dataSrc )( json, write );
}
