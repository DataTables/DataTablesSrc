
import register from './register';
import { macros, callbackFire } from '../util/support';

register( 'info', function ( settings, opts ) {
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
	settings.aoDrawCallback.push(function (s) {
		_fnUpdateInfo(s, opts, n);
	});

	// For the first info display in the table, we add a callback and aria information.
	if (! settings._infoEl) {
		n.attr({
			'aria-live': 'polite',
			id: tid+'_info',
			role: 'status'
		});

		// Table is described by our info div
		$(settings.nTable).attr( 'aria-describedby', tid+'_info' );

		settings._infoEl = n;
	}

	return n;
}, 'i' );

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
	out = macros( settings, out );

	if ( opts.callback ) {
		out = opts.callback.call( settings.oInstance,
			settings, start, end, max, total, out
		);
	}

	node.html( out );

	callbackFire(settings, null, 'info', [settings, node[0], out]);
}
