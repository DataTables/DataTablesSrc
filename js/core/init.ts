import Context from '../model/settings';
import { callbackFire } from './support';
import { processingDisplay } from './processing';
import { dataSource } from './support';
import { loadState } from './state';
import { sortInit } from './sort';
import { buildAjax, ajaxDataSrc } from './ajax';
import { buildHead, drawHead, addOptionsHtml, reDraw } from './draw';
import { addData, addTr } from './data';
import { adjustColumnSizing } from './columns';
import { colGroup } from './sizing';

/**
 * Draw the table for the first time, adding all required features
 *  @param {object} settings dataTables settings object
 *  @memberof DataTable#oApi
 */
export function initialise ( settings: Context )
{
	var i;
	var init: any = settings.oInit; // TODO typing
	var deferLoading = settings.deferLoading;
	var dataSrc = dataSource( settings );

	// Ensure that the table data is fully initialised
	if ( ! settings.bInitialised ) {
		setTimeout( function(){ initialise( settings ); }, 200 );
		return;
	}

	// Build the header / footer for the table
	buildHead( settings, 'header' );
	buildHead( settings, 'footer' );

	// Load the table's state (if needed) and then render around it and draw
	loadState( settings, init, function () {
		// Then draw the header / footer
		drawHead( settings, settings.aoHeader );
		drawHead( settings, settings.aoFooter );

		// Cache the paging start point, as the first redraw will reset it
		var iAjaxStart = settings.iInitDisplayStart

		// Local data load
		// Check if there is data passing into the constructor
		if ( init && init.aaData ) {
			for ( i=0 ; i<init.aaData.length ; i++ ) {
				addData( settings, init.aaData[ i ] );
			}
		}
		else if ( deferLoading || dataSrc == 'dom' ) {
			// Grab the data from the page
			addTr( settings, $(settings.nTBody).children('tr') );
		}

		// Filter not yet applied - copy the display master
		settings.aiDisplay = settings.aiDisplayMaster.slice();

		// Enable features
		addOptionsHtml( settings );
		sortInit( settings );

		colGroup( settings );

		/* Okay to show that something is going on now */
		processingDisplay( settings, true );

		callbackFire( settings, null, 'preInit', [settings], true );

		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		reDraw( settings );

		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				buildAjax( settings, {}, function(json) {
					var aData = ajaxDataSrc( settings, json, false );

					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						addData( settings, aData[i] );
					}

					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;

					reDraw( settings );
					processingDisplay( settings, false );
					initComplete( settings );
				} );
			}
			else {
				initComplete( settings );
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
export function initComplete ( settings )
{
	if (settings._bInitComplete) {
		return;
	}

	var args = [settings, settings.json];

	settings._bInitComplete = true;

	// Table is fully set up and we have data, so calculate the
	// column widths
	adjustColumnSizing( settings );

	callbackFire( settings, null, 'plugin-init', args, true );
	callbackFire( settings, 'aoInitComplete', 'init', args, true );
}
