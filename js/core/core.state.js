

/**
 * Save the state of a table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnSaveState ( oSettings )
{
	if ( !oSettings.oFeatures.bStateSave || oSettings.bDestroying )
	{
		return;
	}

	/* Store the interesting variables */
	var i, iLen;
	var oState = {
		"iCreate":      +new Date(),
		"iStart":       oSettings._iDisplayStart,
		"iLength":      oSettings._iDisplayLength,
		"aaSorting":    $.extend( true, [], oSettings.aaSorting ),
		"oSearch":      $.extend( true, {}, oSettings.oPreviousSearch ),
		"aoSearchCols": $.extend( true, [], oSettings.aoPreSearchCols ),
		"abVisCols":    _pluck( oSettings.aoColumns, 'bVisible' )
	};

	_fnCallbackFire( oSettings, "aoStateSaveParams", 'stateSaveParams', [oSettings, oState] );

	oSettings.fnStateSaveCallback.call( oSettings.oInstance, oSettings, oState );
}


/**
 * Attempt to load a saved table state
 *  @param {object} oSettings dataTables settings object
 *  @param {object} oInit DataTables init object so we can override settings
 *  @memberof DataTable#oApi
 */
function _fnLoadState ( oSettings, oInit )
{
	var i, ien;
	var columns = oSettings.aoColumns;

	if ( ! oSettings.oFeatures.bStateSave ) {
		return;
	}

	var oData = oSettings.fnStateLoadCallback.call( oSettings.oInstance, oSettings );
	if ( !oData ) {
		return;
	}

	/* Allow custom and plug-in manipulation functions to alter the saved data set and
	 * cancelling of loading by returning false
	 */
	var abStateLoad = _fnCallbackFire( oSettings, 'aoStateLoadParams', 'stateLoadParams', [oSettings, oData] );
	if ( $.inArray( false, abStateLoad ) !== -1 ) {
		return;
	}

	/* Reject old data */
	var duration = oSettings.iStateDuration;
	if ( duration > 0 && oData.iCreate < +new Date() - (duration*1000) ) {
		return;
	}

	// Number of columns have changed - all bets are off, no restore of settings
	if ( columns.length !== oData.aoSearchCols.length ) {
		return;
	}

	/* Store the saved state so it might be accessed at any time */
	oSettings.oLoadedState = $.extend( true, {}, oData );

	/* Restore key features */
	oSettings._iDisplayStart    = oData.iStart;
	oSettings.iInitDisplayStart = oData.iStart;
	oSettings._iDisplayLength   = oData.iLength;
	oSettings.aaSorting = [];

	$.each( oData.aaSorting, function ( i, col ) {
		oSettings.aaSorting.push( col[0] >= columns.length ?
			[ 0, col[1] ] :
			col
		);
	} );

	/* Search filtering  */
	$.extend( oSettings.oPreviousSearch, oData.oSearch );
	$.extend( true, oSettings.aoPreSearchCols, oData.aoSearchCols );

	/* Column visibility state */
	var visColumns = oData.abVisCols;
	for ( i=0, ien=visColumns.length ; i<ien ; i++ ) {
		columns[i].bVisible = visColumns[i];
	}

	_fnCallbackFire( oSettings, 'aoStateLoaded', 'stateLoaded', [oSettings, oData] );
}

