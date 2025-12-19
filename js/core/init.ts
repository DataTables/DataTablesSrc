import { callbackFire, dataSource } from '../api/support';
import dom from '../dom';
import { Context } from '../model/settings';
import { ajaxDataSrc, buildAjax } from './ajax';
import { adjustColumnSizing } from './columns';
import { addData, addTr } from './data';
import { buildHead, drawHead, reDraw } from './draw';
import { createLayout } from './layout';
import { sortInit } from './order';
import { processingDisplay } from './processing';
import { colGroup } from './sizing';
import { loadState } from './state';

/**
 * Draw the table for the first time, adding all required features
 *
 * @param settings DataTables settings object
 */
export function initialise(settings: Context) {
	var i;
	var init = settings.init;
	var deferLoading = settings.deferLoading;
	var dataSrc = dataSource(settings);

	// Ensure that the table data is fully initialised
	if (!settings.initialised) {
		setTimeout(function () {
			initialise(settings);
		}, 200);
		return;
	}

	// Build the header / footer for the table
	buildHead(settings, 'header');
	buildHead(settings, 'footer');

	// Load the table's state (if needed) and then render around it and draw
	loadState(settings, function () {
		// Then draw the header / footer
		drawHead(settings, settings.header);
		drawHead(settings, settings.footer);

		// Cache the paging start point, as the first redraw will reset it
		var iAjaxStart = settings.displayStartInit;

		// Local data load
		// Check if there is data passing into the constructor
		if (init && init.data) {
			for (i = 0; i < init.data.length; i++) {
				addData(settings, init.data[i]);
			}
		}
		else if (deferLoading || dataSrc == 'dom') {
			// Grab the data from the page
			addTr(settings, dom.s(settings.tbody).children('tr'));
		}

		// Filter not yet applied - copy the display master
		settings.display = settings.displayMaster.slice();

		// Enable features
		createLayout(settings);
		sortInit(settings);

		colGroup(settings);

		/* Okay to show that something is going on now */
		processingDisplay(settings, true);

		callbackFire(settings, null, 'preInit', [settings], true);

		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of
		// the Ajax source - this allows the table to look initialised for Ajax
		// sourcing data (show 'loading' message possibly)
		reDraw(settings);

		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		if (dataSrc != 'ssp' || deferLoading) {
			// if there is an ajax source load the data
			if (dataSrc == 'ajax') {
				buildAjax(settings, {}, function (json) {
					var aData = ajaxDataSrc(settings, json, false);

					// Got the data - add it to the table
					for (i = 0; i < aData.length; i++) {
						addData(settings, aData[i]);
					}

					// Reset the init display for cookie saving. We've already
					// done a filter, and therefore cleared it before. So we
					// need to make it appear 'fresh'
					settings.displayStartInit = iAjaxStart;

					reDraw(settings);
					processingDisplay(settings, false);
					initComplete(settings);
				});
			}
			else {
				initComplete(settings);
				processingDisplay(settings, false);
			}
		}
	});
}

/**
 * Draw the table for the first time, adding all required features
 *
 * @param settings DataTables settings object
 */
export function initComplete(settings: Context) {
	if (settings.initDone) {
		return;
	}

	var args = [settings, settings.json];

	settings.initDone = true;

	// Table is fully set up and we have data, so calculate the
	// column widths
	adjustColumnSizing(settings);

	callbackFire(settings, null, 'plugin-init', args, true);
	callbackFire(settings, 'init', 'init', args, true);
}
