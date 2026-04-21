/*!
 * Type definitions for DataTables
 *
 * DataTables exports a range of types, its static API as the default and also
 * the following type / value combinations which can be used with ESM imports:
 *
 * * Api - The DataTables Api
 * * DataTable - Same as the default
 * * Dom - DataTable's Dom library
 * * util - DataTable's utility library
 */

// Core DataTables
import { DataTablesStatic } from '../dist/api/interface';
import _DataTable from '../dist/dataTable';

// Merge the Static interface with the Constructor value
export interface DataTable extends DataTablesStatic {}
export declare const DataTable: typeof _DataTable;

// Main API & Common Interfaces. `Api` (value and type) come from here
export * from '../dist/api/interface';

// Aliased import / exports
import Dom from '../dist/dom/index';
import { Ext, ExtButtons } from '../dist/ext';
import { Options as ColumnsConfig } from '../dist/model/columns/defaults';
import ColumnContext from '../dist/model/columns/settings';
import {
	Defaults,
	ConfigLanguage as Language,
	Options
} from '../dist/model/defaults';
import { Row as RowContext } from '../dist/model/row';
import { Context } from '../dist/model/settings';
import { State, StateLoad } from '../dist/model/state';
import { AjaxOptions } from '../dist/util/ajax';
import util from '../dist/util/index';

// Value and type combo exports
export {
	// Api - Exported above in the * from the API
	// DataTable - Exported above
	Dom,
	util
};

// Types
	export {
		AjaxOptions,
		ColumnContext,
		ColumnsConfig,
		Context, // Legacy support
		Defaults,
		Ext,
		ExtButtons,
		Language,
		Options,
		RowContext,
		Context as Settings,
		State,
		StateLoad
	};

// Default Export (merged DataTablesStatic and value)
export default DataTable;
