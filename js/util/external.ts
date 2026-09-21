
import defaults from '../model/defaults';
import * as object from './object';

// Can be assigned in DateTable.use()
var __win: any;
var __doc: any;
var __bootstrap: any;
var __foundation: any;
var __luxon: any;
var __moment: any;
var __dateTime: any;
var __dataTable: any;
var __jquery: any;

function getWin() {
	if (__win) {
		return __win;
	}

	if (typeof globalThis !== 'undefined' && globalThis.window) {
		return globalThis.window;
	}

	if (typeof window !== 'undefined') {
		return window;
	}

	return {};
}

/**
 * Set the libraries that DataTables uses, or the global objects.
 * Note that the arguments can be either way around (legacy support)
 * and the second is optional. See docs.
 */
export default function (arg1: any, arg2?: any) {
	// Reverse arguments for legacy support
	var module = typeof arg1 === 'string' ? arg2 : arg1;
	var type = typeof arg2 === 'string' ? arg2 : arg1;

	// Getter
	if (module === undefined && typeof type === 'string') {
		switch (type) {
			case 'lib':
			case 'jq':
				if (__jquery) {
					return __jquery;
				}

				let local = getWin().jQuery;

				if (local && local.fn) {
					return local;
				}

				return null;

			case 'win':
				return getWin();

			case 'doc':
				return getWin().document;

			case 'datatable':
				return __dataTable;

			case 'datetime':
				return __dateTime;

			case 'luxon':
				return __luxon || getWin().luxon || null;

			case 'moment':
				return __moment || getWin().moment || null;

			case 'bootstrap':
				// Use local if set, otherwise try window, which could be undefined
				return __bootstrap || getWin().bootstrap || null;

			case 'foundation':
				// Ditto
				return __foundation || getWin().Foundation || null;

			default:
				return null;
		}
	}

	// Setter
	if (
		type === 'lib' ||
		type === 'jq' ||
		(module && module.fn && module.fn.jquery)
	) {
		__jquery = module;
		jQuerySetup();
	}
	else if (type === 'datatable' || (module && module.isDataTable)) {
		__dataTable = module;
	}
	else if (type === 'win' || (module && module.document)) {
		__win = module;
	}
	else if (type === 'datetime' || (module && module.type === 'DateTime')) {
		__dateTime = module;
	}
	else if (type === 'luxon' || (module && module.FixedOffsetZone)) {
		__luxon = module;
	}
	else if (type === 'moment' || (module && module.isMoment)) {
		__moment = module;
	}
	else if (
		type === 'bootstrap' ||
		(module && module.Modal && module.Modal.NAME === 'modal')
	) {
		// This is currently for BS5 only. BS3/4 attach to jQuery, so no need to use `.use()`
		__bootstrap = module;
	}
	else if (type === 'foundation' || (module && module.Reveal)) {
		__foundation = module;
	}
}

/**
 * Attach jQuery to DataTables
 */
export function jQuerySetup() {
	if (!__dataTable || !__jquery) {
		return;
	}

	// Provide access to the host jQuery object (circular reference)
	__dataTable.$ = __jquery;

	// jQuery integration - expose the core function.
	__jquery.fn.dataTable = __dataTable;

	// jQuery wrapper - returning a DataTable instance
	__jquery.fn.DataTable = function (options: Partial<typeof defaults>) {
		let table = new __dataTable(this.toArray(), options);

		return table;
	};

	// Legacy aliases
	__jquery.fn.dataTableSettings = __dataTable.ext.settings;
	__jquery.fn.dataTableExt = __dataTable.ext;

	// All properties that are available to $.fn.dataTable should also be available
	// on $.fn.DataTable
	object.each(__dataTable, function (prop, val) {
		__jquery.fn.DataTable[prop] = val;
	});
}