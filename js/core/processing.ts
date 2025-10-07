
import {callbackFire} from './support';
import Context from '../model/settings';

/**
 * Generate the node required for the processing node
 *  @param {object} settings DataTables settings object
 */
export function processingHtml ( settings: Context )
{
	var table = settings.nTable;
	var scrolling = settings.oScroll.sX !== '' || settings.oScroll.sY !== '';

	if ( settings.oFeatures.bProcessing ) {
		var n = $('<div/>', {
				'id': settings.sTableId + '_processing',
				'class': settings.oClasses.processing.container,
				'role': 'status'
			} )
			.html( (settings.oLanguage as any).sProcessing )
			.append('<div><div></div><div></div><div></div><div></div></div>');

		// Different positioning depending on if scrolling is enabled or not
		if (scrolling) {
			n.prependTo( $('div.dt-scroll', settings.nTableWrapper) );
		}
		else {
			n.insertBefore( table );
		}

		$(table).on( 'processing.dt.DT', function (e, s, show) {
			n.css( 'display', show ? 'block' : 'none' );
		} );
	}
}


/**
 * Display or hide the processing indicator
 *  @param {object} settings DataTables settings object
 *  @param {bool} show Show the processing indicator (true) or not (false)
 */
export function processingDisplay ( settings: Context, show )
{
	// Ignore cases when we are still redrawing
	if (settings.bDrawing && show === false) {
		return;
	}

	callbackFire( settings, null, 'processing', [settings, show] );
}

/**
 * Show the processing element if an action takes longer than a given time
 *
 * @param {*} settings DataTables settings object
 * @param {*} enable Do (true) or not (false) async processing (local feature enablement)
 * @param {*} run Function to run
 */
export function processingRun( settings: Context, enable, run ) {
	if (! enable) {
		// Immediate execution, synchronous
		run();
	}
	else {
		processingDisplay(settings, true);
		
		// Allow the processing display to show if needed
		setTimeout(function () {
			run();

			processingDisplay(settings, false);
		}, 0);
	}
}
