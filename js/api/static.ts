import dom from '../dom';
import ext from '../ext/index';
import * as is from '../util/is';
import { arrayLike } from '../util/is';
import Api from './Api';

/**
 * CommonJS factory function pass through. This will check if the arguments
 * given are a window object or a jQuery object. If so they are set
 * accordingly.
 * @param root Window
 * @param jq jQuery
 * @returns Indicator
 */
export function factory(root, jq) {
	var is = false;

	// Test if the first parameter is a window object
	if (root && root.document) {
		window = root;
		document = root.document;
	}

	// Test if the second parameter is a jQuery object
	if (jq && jq.fn && jq.fn.jquery) {
		is = true;
	}

	return is;
}

/**
 * Check if a `<table>` node is a DataTable table already or not.
 *
 * @param table Table node or selector for the table to test. Note that if more
 *   than more than one table is passed on, only the first will be checked
 * @returns true the table given is a DataTable, or false otherwise
 */
export function isDataTable(table) {
	var t = dom.s(table).get(0);
	var is = false;

	if (table instanceof Api) {
		return true;
	}
	else if (arrayLike(table)) {
		// jQuery compatibility
		table = Array.from(table);
	}

	for (let i = 0; i < ext.settings.length; i++) {
		let ctx = ext.settings[i];

		var head = ctx.nScrollHead
			? dom.s(ctx.nScrollHead).find('table').get(0)
			: null;
		var foot = ctx.nScrollFoot
			? dom.s(ctx.nScrollFoot).find('table').get(0)
			: null;

		if (ctx.nTable === t || head === t || foot === t) {
			is = true;
		}
	}

	return is;
}

/**
 * Get all DataTable tables that have been initialised - optionally you can
 * select to get only currently visible tables.
 *
 * @param visible Flag to indicate if you want all (default) or visible tables
 *   only.
 * @returns Array of `table` nodes (not DataTable instances) which are
 *   DataTables
 */
export function tables(visible) {
	var api = false;

	if (is.plainObject(visible)) {
		api = visible.api;
		visible = visible.visible;
	}

	var a = ext.settings
		.filter(function (o) {
			return !visible || (visible && dom.s(o.nTable).isVisible())
				? true
				: false;
		})
		.map(function (o) {
			return o.nTable;
		});

	return api ? new Api(a) : a;
}
