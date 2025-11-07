import dom from '../dom';
import ext from '../ext';
import defaults from '../model/defaults';
import searchModel from '../model/search';
import Context from '../model/settings';
import * as object from '../util/object';

interface HungarianMap {
	[key: string]: string;
}

export const browser = {
	barWidth: -1,
	bScrollbarLeft: false,
};

/**
 * Create a mapping object that allows camel case parameters to be looked up for
 * their Hungarian counterparts. The mapping is stored in a private parameter
 * called `_hungarianMap` which can be accessed on the source object.
 *
 * @param o Object to create a map for
 */
export function hungarianMap(o: Record<string, any>) {
	var hungarian = 'a aa ai ao as b fn i m o s ',
		match,
		newKey,
		map: HungarianMap = {};

	object.each(o, (key, val) => {
		match = key.match(/^([^A-Z]+?)([A-Z])/);

		if (match && hungarian.indexOf(match[1] + ' ') !== -1) {
			newKey = key.replace(match[0], match[2].toLowerCase());
			map[newKey] = key;

			if (match[1] === 'o') {
				hungarianMap(o[key]);
			}
		}
	});

	o._hungarianMap = map;
}

/**
 * Convert from camel case parameters to Hungarian, based on a Hungarian map
 * created by hungarianMap.
 *
 * @param src The model object which holds all parameters that can be mapped.
 * @param user The object to convert from camel case to Hungarian.
 * @param force When set to `true`, properties which already have a Hungarian
 *    value in the `user` object will be overwritten. Otherwise they won't be.
 */
export function camelToHungarian(src: any, user: any, force = false) {
	if (!src._hungarianMap) {
		hungarianMap(src);
	}

	var hungarianKey;

	object.each(user, key => {
		hungarianKey = src._hungarianMap[key];

		if (
			hungarianKey !== undefined &&
			(force || user[hungarianKey] === undefined)
		) {
			// For objects, we need to buzz down into the object to copy parameters
			if (hungarianKey.charAt(0) === 'o') {
				// Copy the camelCase options over to the hungarian
				if (!user[hungarianKey]) {
					user[hungarianKey] = {};
				}

				object.assignDeep(user[hungarianKey], user[key]);
				camelToHungarian(src[hungarianKey], user[hungarianKey], force);
			}
			else {
				user[hungarianKey] = user[key];
			}
		}
	});
}

/**
 * Map one parameter onto another
 *
 * @param o Object to map
 * @param newKey The new parameter name
 * @param oldKey The old parameter name
 */
export function compatMap(
	o: Record<string, any>,
	newKey: string,
	oldKey: string
) {
	if (o[newKey] !== undefined) {
		o[oldKey] = o[newKey];
	}
}

/**
 * Provide backwards compatibility for the main DT options. Note that the new
 * options are mapped onto the old parameters, so this is an external interface
 * change only.
 *
 * @param init Object to map
 */
export function compatOpts(init: any) {
	// typeof defaults
	compatMap(init, 'ordering', 'bSort');
	compatMap(init, 'orderMulti', 'bSortMulti');
	compatMap(init, 'orderClasses', 'bSortClasses');
	compatMap(init, 'orderCellsTop', 'bSortCellsTop');
	compatMap(init, 'order', 'aaSorting');
	compatMap(init, 'orderFixed', 'aaSortingFixed');
	compatMap(init, 'paging', 'bPaginate');
	compatMap(init, 'pagingType', 'sPaginationType');
	compatMap(init, 'pageLength', 'iDisplayLength');
	compatMap(init, 'searching', 'bFilter');

	// Boolean initialisation of x-scrolling
	if (typeof init.sScrollX === 'boolean') {
		init.sScrollX = init.sScrollX ? '100%' : '';
	}
	if (typeof init.scrollX === 'boolean') {
		init.scrollX = init.scrollX ? '100%' : '';
	}

	// Objects for ordering
	if (typeof init.bSort === 'object') {
		init.orderIndicators =
			init.bSort.indicators !== undefined ? init.bSort.indicators : true;
		init.orderHandler =
			init.bSort.handler !== undefined ? init.bSort.handler : true;
		init.bSort = true;
	}
	else if (init.bSort === false) {
		init.orderIndicators = false;
		init.orderHandler = false;
	}
	else if (init.bSort === true) {
		init.orderIndicators = true;
		init.orderHandler = true;
	}

	// Which cells are the title cells?
	if (typeof init.bSortCellsTop === 'boolean') {
		init.titleRow = init.bSortCellsTop;
	}

	// Column search objects are in an array, so it needs to be converted
	// element by element
	var searchCols = init.aoSearchCols;

	if (searchCols) {
		for (var i = 0, iLen = searchCols.length; i < iLen; i++) {
			if (searchCols[i]) {
				camelToHungarian(searchModel, searchCols[i]);
			}
		}
	}

	// Enable search delay if server-side processing is enabled
	if (init.serverSide && !init.searchDelay) {
		init.searchDelay = 400;
	}
}

/**
 * Provide backwards compatibility for column options. Note that the new options
 * are mapped onto the old parameters, so this is an external interface change
 * only.
 *
 * @param init Object to map
 */
export function compatCols(init: any) {
	// typeof columnDefaults
	compatMap(init, 'orderable', 'bSortable');
	compatMap(init, 'orderData', 'aDataSort');
	compatMap(init, 'orderSequence', 'asSorting');
	compatMap(init, 'orderDataType', 'sortDataType');

	// orderData can be given as an integer
	var dataSort = init.aDataSort;

	if (typeof dataSort === 'number' && !Array.isArray(dataSort)) {
		init.aDataSort = [dataSort];
	}

	// Backwards compatibility for mDataProp from 1.9-
	if (init.mDataProp !== undefined && !init.mData) {
		init.mData = init.mDataProp;
	}
}

/**
 * Browser feature detection for capabilities, quirks
 *
 * @param ctx DataTables settings object
 */
export function browserDetect(ctx: Context) {
	// We don't need to do this every time DataTables is constructed, the values
	// calculated are specific to the browser and OS configuration which we
	// don't expect to change between initialisations
	if (browser.barWidth === -1) {
		// Scrolling feature / quirks detection
		var n = dom
			.c('div')
			.css({
				position: 'fixed',
				top: '0',
				left: -1 * window.pageXOffset + 'px', // allow for scrolling
				height: '1px',
				width: '1px',
				overflow: 'hidden',
			})
			.append(
				dom
					.c('div')
					.css({
						position: 'absolute',
						top: '1px',
						left: '1px',
						width: '100px',
						overflow: 'scroll',
					})
					.append(
						dom.c('div').css({
							width: '100%',
							height: '10px',
						})
					)
			)
			.appendTo('body');

		var outer = n.children();
		var inner = outer.children();

		browser.barWidth = outer.get(0).offsetWidth - outer.get(0).clientWidth;
		browser.bScrollbarLeft = Math.round(inner.offset()!.left) !== 1;

		n.remove();
	}

	Object.assign(ctx.oBrowser, browser);
	ctx.oScroll.iBarWidth = browser.barWidth;
}

/**
 * Attach jQuery to DataTables
 *
 * @param jQuery jQuery object
 * @param DT DataTables object
 */
export function jQuerySetup(jQuery: any, DT: any) {
	// Provide access to the host jQuery object (circular reference)
	DT.$ = jQuery;

	// jQuery integration - expose the core function.
	jQuery.fn.dataTable = DT;

	// jQuery wrapper - returning a DataTable instance
	jQuery.fn.DataTable = function (options: Partial<typeof defaults>) {
		let table = new DT(this.toArray(), options);

		return table;
	};

	// Legacy aliases
	jQuery.fn.dataTableSettings = ext.settings;
	jQuery.fn.dataTableExt = DT.ext;

	// All properties that are available to $.fn.dataTable should also be available
	// on $.fn.DataTable
	object.each(DT, function (prop, val) {
		jQuery.fn.DataTable[prop] = val;
	});
}