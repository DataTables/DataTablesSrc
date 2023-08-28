
_ext.features.register( 'info', function ( settings, opts ) {
	// For compatibility with the legacy `info` top level option
	if (! settings.oFeatures.bInfo) {
		return null;
	}

	var
		lang  = settings.oLanguage,
		tid = settings.sTableId,
		n = $('<div/>', {
			'class': settings.oClasses.sInfo,
		} );

	opts = $.extend({
		callback: lang.fnInfoCallback,
		empty: lang.sInfoEmpty,
		postfix: lang.sInfoPostFix,
		search: lang.sInfoFiltered,
		text: lang.sInfo,
	}, opts);


	// Update display on each draw
	settings.aoDrawCallback.push( {
		fn: function (s) {
			_fnUpdateInfo(s, opts, n);
		}
	} );

	// For the first info display in the table, we add a callback and aria information.
	if (! $('#' + tid+'_info', settings.nWrapper).length) {
		n.attr({
			'aria-live': 'polite',
			id: tid+'_info',
			role: 'status'
		});

		// Table is described by our info div
		$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
	}

	return n;
} );

/**
 * Update the information elements in the display
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnUpdateInfo ( settings, opts, node )
{
	var
		start = settings._iDisplayStart+1,
		end   = settings.fnDisplayEnd(),
		max   = settings.fnRecordsTotal(),
		total = settings.fnRecordsDisplay(),
		out   = total
			? opts.text
			: opts.empty;

	if ( total !== max ) {
		// Record set after filtering
		out += ' ' + opts.search;
	}

	// Convert the macros
	out += opts.postfix;
	out = _fnInfoMacros( settings, out );

	if ( opts.callback ) {
		out = opts.callback.call( settings.oInstance,
			settings, start, end, max, total, out
		);
	}

	node.html( out );

	_fnCallbackFire(settings, null, 'info', [settings, node[0], out]);
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

