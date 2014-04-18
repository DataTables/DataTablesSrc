/**
 * Generate the node required for the info display
 *  @param {object} oSettings dataTables settings object
 *  @returns {node} Information element
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlInfo ( settings )
{
	var
		tid = settings.sTableId,
		nodes = settings.aanFeatures.i,
		n = $('<div/>', {
			'class': settings.oClasses.sInfo,
			'id': ! nodes ? tid+'_info' : null
		} );

	if ( ! nodes ) {
		// Update display on each draw
		settings.aoDrawCallback.push( {
			"fn": _fnUpdateInfo,
			"sName": "information"
		} );

		n
			.attr( 'role', 'status' )
			.attr( 'aria-live', 'polite' );

		// Table is described by our info div
		$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
	}

	return n[0];
}


/**
 * Update the information elements in the display
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnUpdateInfo ( settings )
{
	/* Show information about the table */
	var nodes = settings.aanFeatures.i;
	if ( nodes.length === 0 ) {
		return;
	}

	var
		lang  = settings.oLanguage,
		start = settings._iDisplayStart+1,
		end   = settings.fnDisplayEnd(),
		max   = settings.fnRecordsTotal(),
		total = settings.fnRecordsDisplay(),
		out   = total ?
			lang.sInfo :
			lang.sInfoEmpty;

	if ( total !== max ) {
		/* Record set after filtering */
		out += ' ' + lang.sInfoFiltered;
	}

	// Convert the macros
	out += lang.sInfoPostFix;
	out = _fnInfoMacros( settings, out );

	var callback = lang.fnInfoCallback;
	if ( callback !== null ) {
		out = callback.call( settings.oInstance,
			settings, start, end, max, total, out
		);
	}

	$(nodes).html( out );
}


function _fnInfoMacros ( settings, str )
{
	// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
	// internally
	var
		formatter  = settings.fnFormatNumber,
		start      = settings._iDisplayStart+1,
		len        = settings._iDisplayLength,
		vis        = settings.fnRecordsDisplay(),
		all        = len === -1;

	return str.
		replace(/_START_/g, formatter.call( settings, start ) ).
		replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
		replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
		replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
		replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
		replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
}

