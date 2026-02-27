import Dom from '../dom';
import ext from '../ext/index';
import { arrayLike } from '../util/is';
import Api from './Api';
import { DataTablesStatic } from './interface';

/**
 * CommonJS factory function pass through. This will check if the arguments
 * given are a window object or a jQuery object. If so they are set accordingly.
 *
 * @param root Window
 * @param jq jQuery
 * @returns Indicator
 */
export function factory(root: Window & typeof globalThis, jq: JQueryStatic) {
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
export const isDataTable: DataTablesStatic['isDataTable'] = function (table) {
	if (table instanceof Api) {
		return true;
	}
	else if (arrayLike(table)) {
		// jQuery compatibility
		table = Array.from(table as any) as any;
	}

	var t = Dom.s(table as any).get(0);
	var is = false;

	for (let i = 0; i < ext.settings.length; i++) {
		let ctx = ext.settings[i];

		var head = ctx.scrollHead ? ctx.scrollHead.find('table').get(0) : null;
		var foot = ctx.scrollFoot ? ctx.scrollFoot.find('table').get(0) : null;

		if (ctx.table === t || head === t || foot === t) {
			is = true;
		}
	}

	return is;
};

/**
 * Get all DataTable tables that have been initialised - optionally you can
 * select to get only currently visible tables.
 *
 * @param visible Flag to indicate if you want all (default) or visible tables
 *   only.
 * @returns Array of `table` nodes (not DataTable instances) which are
 *   DataTables
 */
export const tables: DataTablesStatic['tables'] = function (visible) {
	var api = false;

	if (visible && typeof visible !== 'boolean') {
		api = visible.api || false;
		visible = visible.visible || false;
	}

	var a = ext.settings
		.filter(function (o) {
			return !visible || (visible && Dom.s(o.table).isVisible())
				? true
				: false;
		})
		.map(function (o) {
			return o.table;
		});

	return api ? new Api(a) : (a as any);
};
