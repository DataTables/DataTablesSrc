import Context from '../model/settings';
import searchModel from '../model/search';

export const browser = {
	barWidth: -1,
	bScrollbarLeft: false
};

/**
 * Create a mapping object that allows camel case parameters to be looked up for
 * their Hungarian counterparts. The mapping is stored in a private parameter
 * called `_hungarianMap` which can be accessed on the source object.
 *
 * @param o Object to create a map for
 */
export function hungarianMap(o) {
	var hungarian = 'a aa ai ao as b fn i m o s ',
		match,
		newKey,
		map = {};

	$.each(o, function (key: string) {
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
export function camelToHungarian(src, user, force = false) {
	if (!src._hungarianMap) {
		hungarianMap(src);
	}

	var hungarianKey;

	$.each(user, function (key) {
		hungarianKey = src._hungarianMap[key];

		if (hungarianKey !== undefined && (force || user[hungarianKey] === undefined)) {
			// For objects, we need to buzz down into the object to copy parameters
			if (hungarianKey.charAt(0) === 'o') {
				// Copy the camelCase options over to the hungarian
				if (!user[hungarianKey]) {
					user[hungarianKey] = {};
				}
				$.extend(true, user[hungarianKey], user[key]);

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
 * @param knew The new parameter name
 * @param old The old parameter name
 */
export function compatMap(o, knew, old) {
	if (o[knew] !== undefined) {
		o[old] = o[knew];
	}
}

/**
 * Provide backwards compatibility for the main DT options. Note that the new
 * options are mapped onto the old parameters, so this is an external interface
 * change only.
 *
 * @param init Object to map
 */
export function compatOpts(init) {
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
		init.orderIndicators = init.bSort.indicators !== undefined ? init.bSort.indicators : true;
		init.orderHandler = init.bSort.handler !== undefined ? init.bSort.handler : true;
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
export function compatCols(init) {
	compatMap(init, 'orderable', 'bSortable');
	compatMap(init, 'orderData', 'aDataSort');
	compatMap(init, 'orderSequence', 'asSorting');
	compatMap(init, 'orderDataType', 'sortDataType');

	// orderData can be given as an integer
	var dataSort = init.aDataSort;

	if (typeof dataSort === 'number' && !Array.isArray(dataSort)) {
		init.aDataSort = [dataSort];
	}
}

/**
 * Browser feature detection for capabilities, quirks
 *
 * @param ctx dataTables settings object
 */
export function browserDetect(ctx: Context) {
	// We don't need to do this every time DataTables is constructed, the values
	// calculated are specific to the browser and OS configuration which we
	// don't expect to change between initialisations
	if (browser.barWidth === -1) {
		// Scrolling feature / quirks detection
		var n = $('<div/>')
			.css({
				position: 'fixed',
				top: 0,
				left: -1 * window.pageXOffset, // allow for scrolling
				height: 1,
				width: 1,
				overflow: 'hidden'
			})
			.append(
				$('<div/>')
					.css({
						position: 'absolute',
						top: 1,
						left: 1,
						width: 100,
						overflow: 'scroll'
					})
					.append(
						$('<div/>').css({
							width: '100%',
							height: 10
						})
					)
			)
			.appendTo('body');

		var outer = n.children();
		var inner = outer.children();

		browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
		browser.bScrollbarLeft = Math.round(inner.offset()!.left) !== 1;

		n.remove();
	}

	$.extend(ctx.oBrowser, browser);
	ctx.oScroll.iBarWidth = browser.barWidth;
}
