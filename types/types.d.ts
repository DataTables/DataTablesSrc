/*
 * Type definitions for DataTables
 */

import { Api, DataTablesStatic } from '../js/api/interface';
import { Options as ConfigColumns } from '../js/model/columns/defaults';
import { Options } from '../js/model/defaults';

export * from '../js/api/interface';
export { Dom } from '../js/dom/index';
export * from '../js/ext/types';
export { Context } from '../js/model/settings';
export * from '../js/model/state';
export { ConfigColumns }; // Backwards compat


export default DataTablesStatic;

/**
 * jQuery integration
 */

interface JQueryDataTables extends JQuery {
	/**
	 * Returns DataTables API instance
	 * Usage:
	 * $( selector ).dataTable().api();
	 */
	api(): Api<any>;
}

declare global {
	interface JQueryDataTableApi extends DataTablesStatic {
		<T = any>(opts?: Options): Api<T>;
	}

	interface JQueryDataTableJq extends DataTablesStatic {
		(opts?: Options): JQueryDataTables;
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
