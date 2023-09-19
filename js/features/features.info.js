
_ext.features.register( 'info', function ( settings, opts ) {
	// For compatibility with the legacy `info` top level option
	if (! settings.oFeatures.bInfo) {
		return null;
	}

	var
		lang  = settings.oLanguage,
		tid = settings.sTableId,
		n = $('<div/>', {
			'class': settings.oClasses.info.container,
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
	out = _fnMacros( settings, out );

	if ( opts.callback ) {
		out = opts.callback.call( settings.oInstance,
			settings, start, end, max, total, out
		);
	}

	node.html( out );

	_fnCallbackFire(settings, null, 'info', [settings, node[0], out]);
}
