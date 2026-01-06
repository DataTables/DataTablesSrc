/*
 * Type definitions for DataTables
 */

import { Api, DataTablesStatic } from '../dist/api/interface';
import DataTable from '../dist/dataTable';
import { Options as ConfigColumns } from '../dist/model/columns/defaults';
import { Options } from '../dist/model/defaults';

export * from '../dist/api/interface';
export { Dom } from '../dist/dom/index';
export * from '../dist/ext/types';
export { Context } from '../dist/model/settings';
export * from '../dist/model/state';
export { ConfigColumns, Options }; // Backwards compat

export default DataTable;

/**
 * jQuery integration for legacy support
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
