

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
 *  @memberof DataTable#oApi
 */
function _fnLoadState ( settings, oInit )
{
	var i, ien;
	var columns = settings.aoColumns;

	if ( ! settings.oFeatures.bStateSave ) {
		return;
	}

	var state = settings.fnStateLoadCallback.call( settings.oInstance, settings );
	if ( ! state || ! state.time ) {
		return;
	}

	/* Allow custom and plug-in manipulation functions to alter the saved data set and
	 * cancelling of loading by returning false
	 */
	var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, state] );
	if ( $.inArray( false, abStateLoad ) !== -1 ) {
		return;
	}

	/* Reject old data */
	var duration = settings.iStateDuration;
	if ( duration > 0 && state.time < +new Date() - (duration*1000) ) {
		return;
	}

	// Number of columns have changed - all bets are off, no restore of settings
	if ( columns.length !== state.columns.length ) {
		return;
	}

	// Store the saved state so it might be accessed at any time
	settings.oLoadedState = $.extend( true, {}, state );

	// Restore key features - todo - for 1.11 this needs to be done by
	// subscribed events
	if ( state.start !== undefined ) {
		settings._iDisplayStart    = state.start;
		settings.iInitDisplayStart = state.start;
	}
	if ( state.length !== undefined ) {
		settings._iDisplayLength   = state.length;
	}

	// Order
	if ( state.order !== undefined ) {
		settings.aaSorting = [];
		$.each( state.order, function ( i, col ) {
			settings.aaSorting.push( col[0] >= columns.length ?
				[ 0, col[1] ] :
				col
			);
		} );
	}

	// Search
	if ( state.search !== undefined ) {
		$.extend( settings.oPreviousSearch, _fnSearchToHung( state.search ) );
	}

	// Columns
	for ( i=0, ien=state.columns.length ; i<ien ; i++ ) {
		var col = state.columns[i];

		// Visibility
		if ( col.visible !== undefined ) {
			columns[i].bVisible = col.visible;
		}

		// Search
		if ( col.search !== undefined ) {
			$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
		}
	}

	_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, state] );
}

