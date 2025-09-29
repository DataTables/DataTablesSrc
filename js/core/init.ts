import Context from '../model/settings';
import { callbackFire } from './support';
import { processingDisplay } from './processing';
import { dataSource } from './support';
import { loadState } from './state';
import { sortInit } from './sort';
import { buildAjax, ajaxDataSrc } from './ajax';

/**
 * Draw the table for the first time, adding all required features
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
export function initialise ( settings: Context )
{
	var i;
	var init = settings.oInit;
	var deferLoading = settings.deferLoading;
	var dataSrc = dataSource( settings );

	// Ensure that the table data is fully initialised
	if ( ! settings.bInitialised ) {
		setTimeout( function(){ initialise( settings ); }, 200 );
		return;
	}

	// Build the header / footer for the table
	_fnBuildHead( settings, 'header' );
	_fnBuildHead( settings, 'footer' );

	// Load the table's state (if needed) and then render around it and draw
	loadState( settings, init, function () {
		// Then draw the header / footer
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );

		// Cache the paging start point, as the first redraw will reset it
		var iAjaxStart = settings.iInitDisplayStart

		// Local data load
		// Check if there is data passing into the constructor
		if ( init.aaData ) {
			for ( i=0 ; i<init.aaData.length ; i++ ) {
				_fnAddData( settings, init.aaData[ i ] );
			}
		}
		else if ( deferLoading || dataSrc == 'dom' ) {
			// Grab the data from the page
			_fnAddTr( settings, $(settings.nTBody).children('tr') );
		}

		// Filter not yet applied - copy the display master
		settings.aiDisplay = settings.aiDisplayMaster.slice();

		// Enable features
		_fnAddOptionsHtml( settings );
		sortInit( settings );

		_colGroup( settings );

		/* Okay to show that something is going on now */
		processingDisplay( settings, true );

		callbackFire( settings, null, 'preInit', [settings], true );

		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );

		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				buildAjax( settings, {}, function(json) {
					var aData = ajaxDataSrc( settings, json );

					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}

					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;

					_fnReDraw( settings );
					processingDisplay( settings, false );
					fnInitComplete( settings );
				} );
			}
			else {
				fnInitComplete( settings );
				processingDisplay( settings, false );
			}
		}
	} );
}


/**
 * Draw the table for the first time, adding all required features
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
function fnInitComplete ( settings )
{
	if (settings._bInitComplete) {
		return;
	}

	var args = [settings, settings.json];

	settings._bInitComplete = true;

	// Table is fully set up and we have data, so calculate the
	// column widths
	_fnAdjustColumnSizing( settings );

	callbackFire( settings, null, 'plugin-init', args, true );
	callbackFire( settings, 'aoInitComplete', 'init', args, true );
}
