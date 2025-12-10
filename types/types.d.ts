// Type definitions for DataTables
//
// Project: https://datatables.net
// Definitions by:
//   SpryMedia
//   Kiarash Ghiaseddin <https://github.com/Silver-Connection>
//   Omid Rad <https://github.com/omidkrad>
//   Armin Sander <https://github.com/pragmatrix>
//   Craig Boland <https://github.com/CNBoland>

/// <reference types="jquery" />

import {
	Api,
	DataTablesStatic,
	InstSelector
} from '../js/api/interface';
import { ConfigColumns } from '../js/model/columns/defaults';
import { Defaults as Config } from '../js/model/defaults';
import {
	Order,
	OrderArray,
	OrderCombined,
	OrderIdx,
	OrderName
} from '../js/model/interface';
import { State, StateLoad } from '../js/model/state';

export * from '../js/api/interface';
export {
	Order,
	OrderArray,
	OrderCombined,
	OrderIdx,
	OrderName,
	State,
	StateLoad
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Main interfaces
 */

/**
 * DataTables class
 */
declare interface DataTables<T> extends DataTablesStatic {
	/**
	 * Create a new DataTable
	 * @param selector Selector to pick one or more `<table>` elements
	 * @param opts Configuration settings
	 */
	new <T = any>(selector: InstSelector, opts?: Config): Api<T>;

	/**
	 * CommonJS factory. This only applies to CommonJS environments,
	 * in all others it would throw an error.
	 */
	(win?: Window, jQuery?: JQuery): DataTables<T>;
}

declare const DataTables: DataTables<any>;
export default DataTables;

// The `$().dataTable()` method adds a `.api()` method to the object
// to allow access to the DataTables API
interface JQueryDataTables extends JQuery {
	/**
	 * Returns DataTables API instance
	 * Usage:
	 * $( selector ).dataTable().api();
	 */
	api(): Api<any>;
}

// Extend the jQuery object with DataTables' construction methods
declare global {
	interface JQueryDataTableApi extends DataTablesStatic {
		<T = any>(opts?: Config): Api<T>;
	}

	interface JQueryDataTableJq extends DataTablesStatic {
		(opts?: Config): JQueryDataTables;
	}

	interface JQuery {
		/**
		 * Create a new DataTable, returning a DataTables API instance.
		 * @param opts Configuration settings
		 */
		DataTable: JQueryDataTableApi;

		/**
		 * Create a new DataTable, returning a jQuery object, extended
		 * with an `api()` method which can be used to access the
		 * DataTables API.
		 * @param opts Configuration settings
		 */
		dataTable: JQueryDataTableJq;
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Options
 */



export type ConfigColumnDefs =
	| ConfigColumnDefsMultiple
	| ConfigColumnDefsSingle;

export interface ConfigColumnDefsMultiple extends ConfigColumns {
	/**
	 * Target column(s). Either this or `target` must be specified.
	 */
	targets: string | number | Array<number | string>;
}

export interface ConfigColumnDefsSingle extends ConfigColumns {
	/**
	 * Single column target. Either this or `targets` must be specified.
	 */
	target: string | number;
}
