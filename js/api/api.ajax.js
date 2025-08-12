

var __reload = function ( settings, holdPosition, callback ) {
	// Use the draw event to trigger a callback
	if ( callback ) {
		var api = new _Api( settings );

		api.one( 'draw', function () {
			callback( api.ajax.json() );
		} );
	}

	if ( _fnDataSource( settings ) == 'ssp' ) {
		_fnReDraw( settings, holdPosition );
	}
	else {
		_fnProcessingDisplay( settings, true );

		// Cancel an existing request
		var xhr = settings.jqXHR;
		if ( xhr && xhr.readyState !== 4 ) {
			xhr.abort();
		}

		// Trigger xhr
		_fnBuildAjax( settings, {}, function( json ) {
			_fnClearTable( settings );

			var data = _fnAjaxDataSrc( settings, json );
			for ( var i=0, iLen=data.length ; i<iLen ; i++ ) {
				_fnAddData( settings, data[i] );
			}

			_fnReDraw( settings, holdPosition );
			_fnInitComplete( settings );
			_fnProcessingDisplay( settings, false );
		} );
	}
};


/**
 * Get the JSON response from the last Ajax request that DataTables made to the
 * server. Note that this returns the JSON from the first table in the current
 * context.
 *
 * @return {object} JSON received from the server.
 */
_api_register( 'ajax.json()', function () {
	var ctx = this.context;

	if ( ctx.length > 0 ) {
		return ctx[0].json;
	}

	// else return undefined;
} );


/**
 * Get the data submitted in the last Ajax request
 */
_api_register( 'ajax.params()', function () {
	var ctx = this.context;

	if ( ctx.length > 0 ) {
		return ctx[0].oAjaxData;
	}

	// else return undefined;
} );


/**
 * Reload tables from the Ajax data source. Note that this function will
 * automatically re-draw the table when the remote data has been loaded.
 *
 * @param {boolean} [reset=true] Reset (default) or hold the current paging
 *   position. A full re-sort and re-filter is performed when this method is
 *   called, which is why the pagination reset is the default action.
 * @returns {DataTables.Api} this
 */
_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
	return this.iterator( 'table', function (settings) {
		__reload( settings, resetPaging===false, callback );
	} );
} );


/**
 * Get the current Ajax URL. Note that this returns the URL from the first
 * table in the current context.
 *
 * @return {string} Current Ajax source URL
 *//**
 * Set the Ajax URL. Note that this will set the URL for all tables in the
 * current context.
 *
 * @param {string} url URL to set.
 * @returns {DataTables.Api} this
 */
_api_register( 'ajax.url()', function ( url ) {
	var ctx = this.context;

	if ( url === undefined ) {
		// get
		if ( ctx.length === 0 ) {
			return undefined;
		}
		ctx = ctx[0];

		return $.isPlainObject( ctx.ajax ) ?
			ctx.ajax.url :
			ctx.ajax;
	}

	// set
	return this.iterator( 'table', function ( settings ) {
		if ( $.isPlainObject( settings.ajax ) ) {
			settings.ajax.url = url;
		}
		else {
			settings.ajax = url;
		}
	} );
} );


/**
 * Load data from the newly set Ajax URL. Note that this method is only
 * available when `ajax.url()` is used to set a URL. Additionally, this method
 * has the same effect as calling `ajax.reload()` but is provided for
 * convenience when setting a new URL. Like `ajax.reload()` it will
 * automatically redraw the table once the remote data has been loaded.
 *
 * @returns {DataTables.Api} this
 */
_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
	// Same as a reload, but makes sense to present it for easy access after a
	// url change
	return this.iterator( 'table', function ( ctx ) {
		__reload( ctx, resetPaging===false, callback );
	} );
} );

