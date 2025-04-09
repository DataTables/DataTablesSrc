
/**
 * State information for a table
 *
 * @param {*} settings
 * @returns State object
 */
function _fnSaveState ( settings )
{
	if (settings._bLoadingState) {
		return;
	}

	// Sort state saving uses [[idx, order]] structure.
	var sorting = [];
	_fnSortResolve(settings, sorting, settings.aaSorting );

	/* Store the interesting variables */
	var columns = settings.aoColumns;
	var state = {
		time:    +new Date(),
		start:   settings._iDisplayStart,
		length:  settings._iDisplayLength,
		order:   sorting.map(function (sort) {
			// If a column name is available, use it
			return columns[sort[0]] && columns[sort[0]].sName
				? [ columns[sort[0]].sName, sort[1] ]
				: sort.slice();
		} ),
		search:  $.extend({}, settings.oPreviousSearch),
		columns: settings.aoColumns.map( function ( col, i ) {
			return {
				name: col.sName,
				visible: col.bVisible,
				search: $.extend({}, settings.aoPreSearchCols[i])
			};
		} )
	};

	settings.oSavedState = state;
	_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
	if ( settings.oFeatures.bStateSave && !settings.bDestroying )
	{
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}	
}


/**
 * Attempt to load a saved table state
 *  @param {object} oSettings dataTables settings object
 *  @param {object} oInit DataTables init object so we can override settings
 *  @param {function} callback Callback to execute when the state has been loaded
 *  @memberof DataTable#oApi
 */
function _fnLoadState ( settings, init, callback )
{
	if ( ! settings.oFeatures.bStateSave ) {
		callback();
		return;
	}

	var loaded = function(state) {
		_fnImplementState(settings, state, callback);
	}

	var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );

	if ( state !== undefined ) {
		_fnImplementState( settings, state, callback );
	}
	// otherwise, wait for the loaded callback to be executed

	return true;
}

function _fnImplementState ( settings, s, callback) {
	var i, iLen;
	var columns = settings.aoColumns;
	var currentNames = _pluck(settings.aoColumns, 'sName');

	settings._bLoadingState = true;

	// When StateRestore was introduced the state could now be implemented at any time
	// Not just initialisation. To do this an api instance is required in some places
	var api = settings._bInitComplete ? new DataTable.Api(settings) : null;

	if ( ! s || ! s.time ) {
		settings._bLoadingState = false;
		callback();
		return;
	}

	// Reject old data
	var duration = settings.iStateDuration;
	if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
		settings._bLoadingState = false;
		callback();
		return;
	}

	// Allow custom and plug-in manipulation functions to alter the saved data set and
	// cancelling of loading by returning false
	var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
	if ( abStateLoad.indexOf(false) !== -1 ) {
		settings._bLoadingState = false;
		callback();
		return;
	}

	// Store the saved state so it might be accessed at any time
	settings.oLoadedState = $.extend( true, {}, s );

	// This is needed for ColReorder, which has to happen first to allow all
	// the stored indexes to be usable. It is not publicly documented.
	_fnCallbackFire( settings, null, 'stateLoadInit', [settings, s], true );

	// Page Length
	if ( s.length !== undefined ) {
		// If already initialised just set the value directly so that the select element is also updated
		if (api) {
			api.page.len(s.length)
		}
		else {
			settings._iDisplayLength   = s.length;
		}
	}

	// Restore key features
	if ( s.start !== undefined ) {
		if(api === null) {
			settings._iDisplayStart    = s.start;
			settings.iInitDisplayStart = s.start;
		}
		else {
			_fnPageChange(settings, s.start/settings._iDisplayLength);
		}
	}

	// Order
	if ( s.order !== undefined ) {
		settings.aaSorting = [];
		$.each( s.order, function ( i, col ) {
			var set = [ col[0], col[1] ];

			// A column name was stored and should be used for restore
			if (typeof col[0] === 'string') {
				var idx = currentNames.indexOf(col[0]);

				// Find the name from the current list of column names, or fallback to index 0
				set[0] = idx >= 0
					? idx
					: 0;
			}
			else if (set[0] >= columns.length) {
				// If a column name, but it is out of bounds, set to 0
				set[0] = 0;
			}

			settings.aaSorting.push(set);
		} );
	}

	// Search
	if ( s.search !== undefined ) {
		$.extend( settings.oPreviousSearch, s.search );
	}

	// Columns
	if ( s.columns ) {
		var set = s.columns;
		var incoming = _pluck(s.columns, 'name');

		// Check if it is a 2.2 style state object with a `name` property for the columns, and if
		// the name was defined. If so, then create a new array that will map the state object
		// given, to the current columns (don't bother if they are already matching tho).
		if (incoming.join('').length && incoming.join('') !== currentNames.join('')) {
			set = [];

			// For each column, try to find the name in the incoming array
			for (i=0 ; i<currentNames.length ; i++) {
				if (currentNames[i] != '') {
					var idx = incoming.indexOf(currentNames[i]);

					if (idx >= 0) {
						set.push(s.columns[idx]);
					}
					else {
						// No matching column name in the state's columns, so this might be a new
						// column and thus can't have a state already.
						set.push({});
					}
				}
				else {
					// If no name, but other columns did have a name, then there is no knowing
					// where this one came from originally so it can't be restored.
					set.push({});
				}
			}
		}

		// If the number of columns to restore is different from current, then all bets are off.
		if (set.length === columns.length) {
			for ( i=0, iLen=set.length ; i<iLen ; i++ ) {
				var col = set[i];

				// Visibility
				if ( col.visible !== undefined ) {
					// If the api is defined, the table has been initialised so we need to use it rather than internal settings
					if (api) {
						// Don't redraw the columns on every iteration of this loop, we will do this at the end instead
						api.column(i).visible(col.visible, false);
					}
					else {
						columns[i].bVisible = col.visible;
					}
				}

				// Search
				if ( col.search !== undefined ) {
					$.extend( settings.aoPreSearchCols[i], col.search );
				}
			}

			// If the api is defined then we need to adjust the columns once the visibility has been changed
			if (api) {
				api.columns.adjust();
			}
		}
	}

	settings._bLoadingState = false;
	_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
	callback();
}
