

/**
 * Save the state of a table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnSaveState ( settings )
{
	if ( !settings.oFeatures.bStateSave || settings.bDestroying )
	{
		return;
	}

	/* Store the interesting variables */
	var state = {
		time:    +new Date(),
		start:   settings._iDisplayStart,
		length:  settings._iDisplayLength,
		order:   $.extend( true, [], settings.aaSorting ),
		search:  _fnSearchToCamel( settings.oPreviousSearch ),
		columns: $.map( settings.aoColumns, function ( col, i ) {
			return {
				visible: col.bVisible,
				search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
			};
		} )
	};

	_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );

	settings.oSavedState = state;
	settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
}


/**
 * Attempt to load a saved table state
 *  @param {object} oSettings dataTables settings object
 *  @param {object} oInit DataTables init object so we can override settings
 *  @param {function} callback Callback to execute when the state has been loaded
 *  @memberof DataTable#oApi
 */
function _fnLoadState ( settings, oInit, callback )
{
	var i, ien;
	var columns = settings.aoColumns;
	var loaded = function ( s ) {
		if ( ! s || ! s.time ) {
			callback();
			return;
		}

		// Allow custom and plug-in manipulation functions to alter the saved data set and
		// cancelling of loading by returning false
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			callback();
			return;
		}

		// Reject old data
		var duration = settings.iStateDuration;
		if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
			callback();
			return;
		}

		// Number of columns have changed - all bets are off, no restore of settings
		if ( s.columns && columns.length !== s.columns.length ) {
			callback();
			return;
		}

		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, s );

		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( s.start !== undefined ) {
			settings._iDisplayStart    = s.start;
			settings.iInitDisplayStart = s.start;
		}
		if ( s.length !== undefined ) {
			settings._iDisplayLength   = s.length;
		}

		// Order
		if ( s.order !== undefined ) {
			settings.aaSorting = [];
			$.each( s.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}

		// Search
		if ( s.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
		}

		// Columns
		//
		if ( s.columns ) {
			for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
				var col = s.columns[i];

				// Visibility
				if ( col.visible !== undefined ) {
					columns[i].bVisible = col.visible;
				}

				// Search
				if ( col.search !== undefined ) {
					$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
				}
			}
		}

		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
		callback();
	}

	if ( ! settings.oFeatures.bStateSave ) {
		callback();
		return;
	}

	var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );

	if ( state !== undefined ) {
		loaded( state );
	}
	// otherwise, wait for the loaded callback to be executed
}

