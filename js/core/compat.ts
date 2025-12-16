import dom from '../dom';
import { defaults as searchDefaults } from '../model/search';
import { Context } from '../model/settings';
import util from '../util';
import * as object from '../util/object';

interface HungarianMap {
	[key: string]: string;
}

export const browser = {
	barWidth: -1,
	bScrollbarLeft: false
};

const hungarianToCamelRe = /^(a|aa|ai|ao|as|b|fn|i|m|o|s)([A-Z])([a-z].*$)/;

/**
 * Take an object which has hungarian notation parameters and convert them to
 * camelCase style. This is to allow compatibility with DataTables 1.9 and
 * earlier which only used hungarian notation, and also with DataTables 1.10 - 2
 * which allowed it to be used.
 */
export function hungarianToCamel<T>(user: T) {
	if (!user) {
		return user;
	}

	let userKeys = Object.keys(user);
	let userAny = user as any;

	for (let i = 0; i < userKeys.length; i++) {
		let userKey = userKeys[i];
		let match = userKey.match(hungarianToCamelRe);

		// Is the key in hungarian notation?
		if (match) {
			// If so map it down
			(user as any)[match[2].toLowerCase() + match[3]] = userAny[userKey];
		}

		// Recurse down through the object
		if (util.is.plainObject(userAny[userKey])) {
			hungarianToCamel(userAny[userKey]);
		}
	}

	return user;
}

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
	if (o[oldKey] !== undefined) {
		o[newKey] = o[oldKey];
	}
}

/**
 * Provide backwards compatibility for the main DT options. Note that the new
 * options are mapped onto the old parameters, so this is an external interface
 * change only.
 *
 * @param init Object to map
 */
export function compatOpts(init: Record<string, any>) {
	// Convert any old style parameters to camelCase
	hungarianToCamel(init);

	// Map old parameter names to new
	compatMap(init, 'ordering', 'sort');
	compatMap(init, 'orderMulti', 'sortMulti');
	compatMap(init, 'orderClasses', 'sortClasses');
	compatMap(init, 'orderCellsTop', 'sortCellsTop');
	compatMap(init, 'order', 'sorting');
	compatMap(init, 'orderFixed', 'sortingFixed');
	compatMap(init, 'paging', 'paginate');
	compatMap(init, 'pagingType', 'paginationType');
	compatMap(init, 'pageLength', 'displayLength');
	compatMap(init, 'searching', 'filter');
	compatMap(init, 'stateDuration', 'cookieDuration');

	// Boolean initialisation of x-scrolling
	if (typeof init.scrollX === 'boolean') {
		init.scrollX = init.scrollX ? '100%' : '';
	}

	// Objects for ordering
	if (typeof init.sort === 'object') {
		init.orderIndicators =
			init.sort.indicators !== undefined ? init.sort.indicators : true;
		init.orderHandler =
			init.sort.handler !== undefined ? init.sort.handler : true;
		init.sort = true;
	}
	else if (init.sort === false) {
		init.orderIndicators = false;
		init.orderHandler = false;
	}
	else if (init.sort === true) {
		init.orderIndicators = true;
		init.orderHandler = true;
	}

	// Which cells are the title cells?
	if (typeof init.sortCellsTop === 'boolean') {
		init.titleRow = init.sortCellsTop;
	}

	// Column search objects are in an array, so it needs to be converted
	// element by element
	var searchCols = init.searchCols;

	if (searchCols) {
		for (var i = 0, iLen = searchCols.length; i < iLen; i++) {
			if (searchCols[i]) {
				camelToHungarian(searchDefaults, searchCols[i]);
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
	// Convert any old style parameters to camelCase
	hungarianToCamel(init);

	// typeof columnDefaults
	compatMap(init, 'orderable', 'sortable');
	compatMap(init, 'orderData', 'dataSort');
	compatMap(init, 'orderSequence', 'sorting');
	compatMap(init, 'orderDataType', 'sortDataType');
	compatMap(init, 'className', 'class');

	// orderData can be given as an integer
	var dataSort = init.aDataSort;
	var orderData = init.orderData;

	if (typeof dataSort === 'number') {
		init.orderData = [dataSort];
	}
	if (typeof orderData === 'number' ) {
		init.orderData = [orderData];
	}

	// Backwards compatibility for mDataProp from 1.9-
	if (init.dataProp !== undefined && !init.data) {
		init.data = init.dataProp;
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
				overflow: 'hidden'
			})
			.append(
				dom
					.c('div')
					.css({
						position: 'absolute',
						top: '1px',
						left: '1px',
						width: '100px',
						overflow: 'scroll'
					})
					.append(
						dom.c('div').css({
							width: '100%',
							height: '10px'
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
	ctx.scroll.barWidth = browser.barWidth;
}
