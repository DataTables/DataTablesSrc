import { BrowserInfo } from '../core/compat';
import Dom from '../dom';
import ext from '../ext';
import {
	datetime,
	DateTimeRenderer,
	NumberRenderer,
	TextRenderer
} from '../ext/helpers';
import { DataTypeDetect, register as registerType } from '../ext/types';
import registerFeature from '../features';
import model from '../model';
import { Defaults, Options } from '../model/defaults';
import {
	CellMetaSettings,
	Order,
	OrderArray,
	OrderFixed
} from '../model/interface';
import { SearchInput, SearchOptions } from '../model/search';
import { Context } from '../model/settings';
import { State, StateLoad } from '../model/state';
import util from '../util';
import ajax from '../util/ajax';
import { check } from '../util/version';
import { factory } from './static';

export type DomSelector = string | Node | HTMLElement | JQuery;

export type InstSelector = DomSelector | Context | Api | InstSelector[];

export type RowIdx = number;
export type RowSelector<T> =
	| RowIdx
	| string
	| Node
	| JQuery
	| ((idx: RowIdx, data: T, node: Node | null) => boolean)
	| RowSelector<T>[]
	| null;

export type ColumnIdx = number;
export type ColumnSelector =
	| ColumnIdx
	| string
	| Node
	| JQuery
	| ((idx: ColumnIdx, data: any, node: Node) => boolean)
	| ColumnSelector[]
	| null;

export type CellIdx = {
	row: number;
	column: number;
};
export type CellSelector =
	| CellIdx
	| string
	| Node
	| JQuery
	| ((idx: CellIdx, data: any, node: Node | null) => boolean)
	| CellSelector[];

export type TableSelector =
	| undefined
	| number
	| string
	| JQuery
	| TableSelector[];

export type CellIdxWithVisible = {
	row: number;
	column: number;
	columnVisible: number;
};

export type HeaderStructure = {
	cell: HTMLElement;
	colspan: number;
	rowspan: number;
	title: string;
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * API
 */

export interface Api<T = any> extends ApiScopeable<T, Api> {}

export interface ApiScopeable<T, S> {
	/**
	 * @internal
	 */
	_newClass: string;

	/**
	 * API should be array-like
	 */
	[key: number]: T;

	/**
	 * Get jquery object
	 *
	 * @param selector jQuery selector to perform on the nodes inside the
	 * table's tbody tag.
	 * @param modifier Option used to specify how the content's of the selected
	 * columns should be ordered, and if paging or filtering in the table should
	 * be taken into account.
	 * @returns JQuery object with the matched elements in it's results set
	 */
	$(
		selector: string | Node | Node[] | JQuery,
		modifier?: ApiSelectorModifier
	): JQuery;

	/**
	 * Ajax Methods
	 */
	ajax: ApiAjax;

	/**
	 * Get a boolean value to indicate if there are any entries in the API
	 * instance's result set (i.e. any data, selected rows, etc).
	 *
	 * @returns true if there are one or more items in the result set, false
	 * otherwise.
	 */
	any(): boolean;

	/**
	 * Table caption control methods
	 */
	caption: ApiCaption;

	/**
	 * Cell (single) selector and methods
	 */
	cell: ApiCell<T>;

	/**
	 * Cells (multiple) selector and methods
	 */
	cells: ApiCells<T>;

	/**
	 * Clear the table of all data.
	 *
	 * @returns DataTables Api instance.
	 */
	clear(this: S): Api<T>;

	/**
	 * Column Methods / object
	 */
	column: ApiColumn<T>;

	/**
	 * Columns Methods / object
	 */
	columns: ApiColumns<T>;

	/**
	 * Concatenate two or more API instances together
	 *
	 * @param a API instance to concatenate to the initial instance.
	 * @param b Additional API instance(s) to concatenate to the initial
	 * instance.
	 * @returns New API instance with the values from all passed in instances
	 * concatenated into its result set.
	 */
	concat(a: object, ...b: object[]): Api<any>;

	/**
	 * The table setting objects that are manipulated by this API instance
	 *
	 * @private
	 */
	context: Context[];

	/**
	 * Get the number of entries in an API instance's result set, regardless of
	 * multi-table grouping (e.g. any data, selected rows, etc). Since: 1.10.8
	 *
	 * @returns The number of items in the API instance's result set
	 */
	count(): number;

	/**
	 * Get the data for the whole table.
	 *
	 * @returns DataTables Api instance with the data for each row in the result
	 * set
	 */
	data(this: S): Api<T>;

	/**
	 * Destroy the DataTables in the current context.
	 *
	 * @param remove Completely remove the table from the DOM (true) or leave it
	 * in the DOM in its original plain un-enhanced HTML state (default, false).
	 * @returns DataTables Api instance
	 */
	destroy(this: S, remove?: boolean): Api<T>;

	/**
	 * Redraw the DataTables in the current context, optionally updating
	 * ordering, searching and paging as required.
	 *
	 * @param paging This parameter is used to determine what kind of draw
	 * DataTables will perform.
	 * @returns DataTables Api instance
	 */
	draw(this: S, paging?: boolean | string): Api<T>;

	/**
	 * Iterate over the contents of the API result set.
	 *
	 * @param fn Callback function which is called for each item in the API
	 * instance result set. The callback is called with three parameters
	 * @returns Original API instance that was used. For chaining.
	 */
	each(fn: (value: any, index: number, dt: Api<any>) => void): Api<any>;

	/**
	 * Reduce an Api instance to a single context and result set.
	 *
	 * @param idx Index to select
	 * @returns New DataTables API instance with the context and result set
	 * containing the table and data for the index specified, or null if no
	 * matching index was available.
	 */
	eq(this: S, idx: number): Api<any>;

	/**
	 * Show an error message to the end user / developer through the DataTables
	 * logging settings.
	 *
	 * @param msg Error message to show
	 */
	error(this: S, msg: string): Api<T>;

	/**
	 * Iterate over the result set of an API instance and test each item,
	 * creating a new instance from those items which pass.
	 *
	 * @param fn Callback function which is called for each item in the API
	 * instance result set. The callback is called with three parameters.
	 * @returns New API instance with the values from the result set which
	 * passed the test in the callback.
	 */
	filter(
		fn: (value: any, index: number, dt: Api<any>) => boolean
	): Api<Array<any>>;

	/**
	 * Flatten a 2D array structured API instance to a 1D array structure.
	 *
	 * @returns New API instance with the 2D array values reduced to a 1D array.
	 */
	flatten(): Api<Array<any>>;

	/**
	 * Get the underlying data from a DataTable instance.
	 *
	 * @param idx Data index to get
	 */
	get(idx: number): T;

	/**
	 * Look up a language token that was defined in the DataTables' language
	 * initialisation object.
	 *
	 * @param token The language token to lookup from the language object.
	 * @param def The default value to use if the DataTables initialisation has
	 * not specified a value. This can be a string for simple cases, or an
	 * object for plurals.
	 * @param numeric If handling numeric output, the number to be presented
	 * should be given in this parameter.
	 *
	 * @returns Resulting internationalised string.
	 */
	i18n(
		this: S,
		token: string,
		def: object | string,
		numeric?: number | string
	): string;

	/**
	 * Determine if an API result set contains a given value.
	 *
	 * @param find Value to look for
	 */
	includes(find: any): boolean;

	/**
	 * Find the first instance of a value in the API instance's result set.
	 *
	 * @param value Value to find in the instance's result set.
	 * @returns The index of the item in the result set, or -1 if not found.
	 */
	indexOf(value: any): number;

	/**
	 * Get the initialisation options used for the table. Since: DataTables
	 * 1.10.6
	 *
	 * @returns Configuration object
	 */
	init(): any; // TODO

	/**
	 * Create a new instance of the DataTables API at the correct level of
	 * nesting for the current context.
	 *
	 * @param context DataTables that are referred to
	 * @param data Data for the instance to hold
	 * @param newClass Override class target - internal.
	 */
	inst<R = Api>(context: InstSelector, data?: T | null, newClass?: string): R;

	/**
	 * Iterate over a result set of table, row, column or cell indexes
	 *
	 * @param type Iterator type
	 * @param callback Callback function that is executed on each iteration. For
	 * the parameters passed to the function, please refer to the documentation
	 * above. As of this is executed in the scope of an API instance which has
	 * its context set to only the table in question.
	 * @param returns Indicate if the callback function will return values or
	 * not. If set to true a new API instance will be returns with the return
	 * values from the callback function in its result set. If not set, or false
	 * the original instance will be returned for chaining, if no values are
	 * returned by the callback method.
	 * @returns Original API instance if the callback returns no result (i.e.
	 * undefined) or a new API instance with the result set being the results
	 * from the callback, in order of execution.
	 */
	iterator<R extends Api = Api<any>>(
		type: 'table',
		callback: IteratorTable,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		type: 'cell',
		callback: IteratorCell,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		type: 'column-rows',
		callback: IteratorColumnRows,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		type: 'column',
		callback: IteratorColumn,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		type: 'columns',
		callback: IteratorColumns,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		type: 'row',
		callback: IteratorRow,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		type: 'rows',
		callback: IteratorRows,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		type: 'every',
		callback: IteratorEvery,
		returns?: boolean
	): R;

	/**
	 * Iterate over a result set of table, row, column or cell indexes
	 *
	 * @param flatten If true the result set of the returned API instance will
	 * be a 1D array (i.e. flattened into a single array). If false (or not
	 * specified) each result will be concatenated to the instance's result set.
	 * Note that this is only relevant if you are returning arrays from the
	 * callback.
	 * @param type Iterator type
	 * @param callback Callback function that is executed on each iteration. For
	 * the parameters passed to the function, please refer to the documentation
	 * above. As of this is executed in the scope of an API instance which has
	 * its context set to only the table in question.
	 * @param returns Indicate if the callback function will return values or
	 * not. If set to true a new API instance will be returns with the return
	 * values from the callback function in its result set. If not set, or false
	 * the original instance will be returned for chaining, if no values are
	 * returned by the callback method.
	 * @returns Original API instance if the callback returns no result (i.e.
	 * undefined) or a new API instance with the result set being the results
	 * from the callback, in order of execution.
	 */
	iterator<R extends Api = Api<any>>(
		flatten: boolean,
		type: 'table',
		callback: IteratorTable,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		flatten: boolean,
		type: 'cell',
		callback: IteratorCell,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		flatten: boolean,
		type: 'column-rows',
		callback: IteratorColumnRows,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		flatten: boolean,
		type: 'column',
		callback: IteratorColumn,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		flatten: boolean,
		type: 'columns',
		callback: IteratorColumns,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		flatten: boolean,
		type: 'row',
		callback: IteratorRow,
		returns?: boolean
	): R;
	iterator<R extends Api = Api<any>>(
		flatten: boolean,
		type: 'rows',
		callback: IteratorRows,
		returns?: boolean
	): R;

	/**
	 * Join the elements in the result set into a string.
	 *
	 * @param separator The string that will be used to separate each element of
	 * the result set.
	 * @returns Contents of the instance's result set joined together as a
	 * single string.
	 */
	join(separator: string): string;

	/**
	 * Find the last instance of a value in the API instance's result set.
	 *
	 * @param value Value to find in the instance's result set.
	 * @returns The index of the item in the result set, or -1 if not found.
	 */
	lastIndexOf(value: any): number;

	/**
	 * Number of elements in an API instance's result set.
	 */
	length: number;

	/**
	 * Iterate over the result set of an API instance, creating a new API
	 * instance from the values returned by the callback.
	 *
	 * @param fn Callback function which is called for each item in the API
	 * instance result set. The callback is called with three parameters.
	 * @returns New API instance with the values in the result set as those
	 * returned by the callback.
	 */
	map(fn: (value: any, index: number, dt: Api<any>) => any): Api<any>;

	/**
	 * Remove event listeners that have previously been added with on().
	 *
	 * @param event Event name to remove.
	 * @param callback Specific callback function to remove if you want to
	 * unbind a single event listener.
	 * @returns DataTables Api instance
	 */
	off(
		event: string,
		callback?: (this: HTMLElement, e: Event, ...args: any[]) => void
	): Api<T>;

	/**
	 * Remove event handlers from selected elements
	 *
	 * @param event Event name to remove.
	 * @param selector Element selector
	 * @param callback Specific callback function to remove if you want to
	 * unbind a single event listener.
	 * @returns DataTables Api instance
	 */
	off(
		event: string,
		selector: string,
		callback?: (this: HTMLElement, e: Event, ...args: any[]) => void
	): Api<T>;

	/**
	 * Table events listener.
	 *
	 * @param event Event to listen for.
	 * @param callback Event handler.
	 * @returns DataTables Api instance
	 */
	on(
		event: string,
		callback: (this: HTMLElement, e: Event, ...args: any[]) => void
	): Api<T>;

	/**
	 * Listen for events from selected elements
	 *
	 * @param event Event to listen for.
	 * @param selector Element selector
	 * @param callback Event handler.
	 * @returns DataTables Api instance
	 */
	on(
		event: string,
		selector: string,
		callback: (this: HTMLElement, e: Event, ...args: any[]) => void
	): Api<T>;

	/**
	 * Listen for a table event once and then remove the listener.
	 *
	 * @param event Event to listen for.
	 * @param callback Event handler.
	 * Listen for events from tables and fire a callback when they occur
	 * @returns DataTables Api instance
	 */
	one(
		event: string,
		callback: (this: HTMLElement, e: Event, ...args: any[]) => void
	): Api<T>;

	/**
	 * Listen for events from a selected element and trigger only once then
	 * remove the listener.
	 *
	 * @param event Event to listen for.
	 * @param selector Element selector
	 * @param callback Event handler.
	 * @returns DataTables Api instance
	 */
	one(
		event: string,
		selector: string,
		callback: (this: HTMLElement, e: Event, ...args: any[]) => void
	): Api<T>;

	/**
	 * Order Methods / object
	 */
	order: ApiOrder;

	/**
	 * Page Methods / object
	 */
	page: ApiPage;

	/**
	 * Iterate over the result set of an API instance, creating a new API
	 * instance from the values retrieved from the original elements.
	 *
	 * @param property object property name to use from the element in the
	 * original result set for the new result set.
	 * @returns New API instance with the values in the result retrieved from
	 * the source object properties defined by the property being plucked.
	 */
	pluck(property: number | string): Api<any>;

	/**
	 * Remove the last item from an API instance's result set.
	 *
	 * @returns Item removed form the result set (was previously the last item
	 * in the result set).
	 */
	pop(): any;

	/**
	 * Show / hide the processing indicator for the table
	 *
	 * @param show Flag to indicate if it should show or not
	 */
	processing(this: S, show: boolean): Api<any>;

	/**
	 * Add one or more items to the end of an API instance's result set.
	 *
	 * @param value_1 Item to add to the API instance's result set.
	 * @returns The length of the modified API instance
	 */
	push(value_1: any, ...value_2: any[]): number;

	/**
	 * Determine if the DataTable is ready or not
	 */
	ready(this: S): boolean;

	/**
	 * Execute a function when the DataTable becomes ready (or immediately if it
	 * already is)
	 *
	 * @param fn Function to execute
	 */
	ready(this: S, fn: (this: Api<T>) => void): Api<T>;

	/**
	 * Apply a callback function against and accumulator and each element in the
	 * Api's result set (left-to-right).
	 *
	 * @param fn Callback function which is called for each item in the API
	 * instance result set. The callback is called with four parameters.
	 * @param initialValue Value to use as the first argument of the first call
	 * to the fn callback.
	 * @returns Result from the final call to the fn callback function.
	 */
	reduce(fn: (current: T, value: T, index: number, dt: Api<any>) => T): T;
	reduce(
		fn: (current: T, value: T, index: number, dt: Api<any>) => T,
		initialValue: T
	): T;
	reduce<U>(
		fn: (current: U, value: T, index: number, dt: Api<any>) => U,
		initialValue: U
	): U;

	/**
	 * Apply a callback function against and accumulator and each element in the
	 * Api's result set (right-to-left).
	 *
	 * @param fn Callback function which is called for each item in the API
	 * instance result set. The callback is called with four parameters.
	 * @param initialValue Value to use as the first argument of the first call
	 * to the fn callback.
	 * @returns Result from the final call to the fn callback function.
	 */
	reduceRight(
		fn: (current: T, value: T, index: number, dt: Api<any>) => T
	): T;
	reduceRight(
		fn: (current: T, value: T, index: number, dt: Api<any>) => T,
		initialValue: T
	): T;
	reduceRight<U>(
		fn: (current: U, value: T, index: number, dt: Api<any>) => U,
		initialValue: U
	): U;

	/**
	 * Reverse the result set of the API instance and return the original array.
	 *
	 * @returns The original API instance with the result set in reversed order.
	 */
	reverse(): Api<any>;

	/**
	 * Row Methods / object
	 */
	row: ApiRow<T>;

	/**
	 * Rows Methods / object
	 */
	rows: ApiRows<T>;

	/**
	 * Search Methods / object
	 */
	search: ApiSearch<T>;

	/**
	 * Obtain the table's settings object
	 *
	 * @returns DataTables API instance with the settings objects for the tables
	 * in the context in the result set
	 */
	settings(): Api<Context>;

	/**
	 * @ignore Internal
	 */
	selector: {
		/** Row selector used in this instance (if any) */
		rows: RowSelector<T> | undefined;

		/** Column selector used in this instance (if any) */
		cols: ColumnSelector | undefined;

		/** Options modifier used in this instance (if any) */
		opts: ApiSelectorModifier | undefined;
	};

	/**
	 * Remove the first item from an API instance's result set.
	 *
	 * @returns Item removed form the result set (was previously the first item
	 * in the result set).
	 */
	shift(): any;

	/**
	 * Create an independent copy of the API instance.
	 *
	 * @returns DataTables API instance
	 */
	slice(): Api<any>;

	/**
	 * Sort the elements of the API instance's result set.
	 *
	 * @param fn This is a standard JavaScript sort comparison function. It
	 * accepts two parameters.
	 * @returns The original API instance with the result set sorted as defined
	 * by the sorting conditions used.
	 */
	sort(fn?: (value1: any, value2: any) => number): Api<Array<any>>;

	/**
	 * Modify the contents of an Api instance's result set, adding or removing
	 * items from it as required.
	 *
	 * @param index Index at which to start modifying the Api instance's result
	 * set.
	 * @param howMany Number of elements to remove from the result set.
	 * @param value_1 Item to add to the result set at the index specified by
	 * the first parameter.
	 * @returns An array of the items which were removed. If no elements were
	 * removed, an empty array is returned.
	 */
	splice(
		index: number,
		howMany: number,
		value_1?: any,
		...value_2: any[]
	): any[];

	/**
	 * State methods / object
	 */
	state: ApiState<T>;

	/**
	 * Select a table based on a selector from the API's context
	 *
	 * @param tableSelector Table selector.
	 * @returns DataTables API instance with selected table in its context.
	 */
	table(this: S, tableSelector?: TableSelector): ApiTableMethods<T>;

	/**
	 * Select tables based on the given selector
	 *
	 * @param tableSelector Table selector.
	 * @returns DataTables API instance with all tables in the current context.
	 */
	tables(this: S, tableSelector?: TableSelector): ApiTablesMethods<T>;

	/**
	 * Convert the API instance to a jQuery object, with the objects from the
	 * instance's result set in the jQuery result set.
	 *
	 * @returns jQuery object which contains the values from the API instance's
	 * result set.
	 */
	to$(): JQuery;

	/**
	 * Create a native JavaScript array object from an API instance.
	 *
	 * @returns JavaScript array which contains the values from the API
	 * instance's result set.
	 */
	toArray(): any[];

	/**
	 * Convert the API instance to a jQuery object, with the objects from the
	 * instance's result set in the jQuery result set.
	 *
	 * @returns jQuery object which contains the values from the API instance's
	 * result set.
	 */
	toJQuery(): JQuery;

	/**
	 * Trigger a DataTables related event.
	 *
	 * @param name The event name.
	 * @param args An array of the arguments to send to the event.
	 * @param bubbles Indicate if the event should bubble up the document in the
	 *   same way that DOM events usually do, or not. There is a performance
	 *   impact for bubbling events.
	 * @returns Api instance with `defaultPrevented` for each item in the result
	 * set
	 */
	trigger(this: S, name: string, args?: any[], bubbles?: boolean): Api;

	/**
	 * Create a new API instance containing only the unique items from the
	 * elements in an instance's result set.
	 *
	 * @returns New Api instance which contains the unique items from the
	 * original instance's result set, in its own result set.
	 */
	unique(): Api<any>;

	/**
	 * Add one or more items to the start of an API instance's result set.
	 *
	 * @param value_1 Item to add to the API instance's result set.
	 * @returns The length of the modified API instance
	 */
	unshift(value_1: any, ...value_2: any[]): number;
}

export interface ApiCaption {
	/**
	 * Get the contents of the `caption` element for the table.
	 */
	(this: Api): string;

	/**
	 * Set the contents of the `-tag caption` element. If the table doesn't have
	 * a `-tag caption` element, one will be created automatically.
	 *
	 * @param string The value to show in the table's `caption` tag.
	 * @param side `top` or `bottom` to set where the table will be shown on the
	 *   table. If not given the previous value will be used (can also be set in
	 *   CSS).
	 * @returns DataTables API instance for chaining.
	 */
	(this: Api, set: string, side?: 'top' | 'bottom'): Api;

	/**
	 * Get the HTML caption node for the table
	 */
	node(this: Api): HTMLElement | null;
}

export interface ApiSelectorModifier {
	/**
	 * The order in which the resolved columns should be returned in.
	 *
	 * * `implied` - the order given in the selector (default)
	 * * `index` - column index order
	 */
	columnOrder?: 'index' | 'implied';

	/**
	 * The order modifier provides the ability to control which order the rows
	 * are processed in. Can be one of 'current', 'applied', 'index',
	 * 'original', or the column index that you want the order to be applied
	 * from.
	 */
	order?: 'current' | 'applied' | 'index' | 'original' | number;

	/**
	 * The search modifier provides the ability to govern which rows are used by
	 * the selector using the search options that are applied to the table.
	 * Values: 'none', 'applied', 'removed'
	 */
	search?: 'none' | 'applied' | 'removed';

	/**
	 * The searchPlaceholder modifier provides the ability to provide
	 * informational text for an input control when it has no value.
	 */
	searchPlaceholder?: string;

	/**
	 * The page modifier allows you to control if the selector should consider
	 * all data in the table, regardless of paging, or if only the rows in the
	 * currently disabled page should be used. Values: 'all', 'current'
	 */
	page?: 'all' | 'current';

	/**
	 * @deprecated Use `search` instead
	 * @ignore
	 */
	filter?: 'none' | 'applied' | 'removed';

	/**
	 * Used by the Select extension to indicate if only selected items should be
	 * included.
	 */
	selected?: boolean;
}

export interface ApiSearch<T> extends Api<T> {
	/**
	 * Get current search
	 *
	 * @returns The currently applied global search. This may be an empty string
	 * if no search is applied.
	 */
	(this: Api): SearchInput<T>;

	/**
	 * Set the global search to use on the table. Note this doesn't actually
	 * perform the search.
	 *
	 * @param input Search string to apply to the table.
	 * @param regex Treat as a regular expression (true) or not (default,
	 * false).
	 * @param smart Perform smart search.
	 * @param caseInsen Do case-insensitive matching (default, true) or not
	 * (false).
	 * @returns DataTables API instance
	 */
	(
		this: Api,
		input: SearchInput<T>,
		regex?: boolean,
		smart?: boolean,
		caseInsen?: boolean
	): Api<any>;

	/**
	 * Set the global search to use on the table. Note this doesn't actually
	 * perform the search.
	 *
	 * @param input Search string to apply to the table.
	 * @param options Configuration options for how the search should be
	 * performed
	 * @returns DataTables API instance
	 */
	(
		this: Api,
		input: SearchInput<T>,
		options: Partial<SearchOptions>
	): Api<any>;

	/**
	 * Get a list of the names of searches applied to the table.
	 *
	 * @returns API instance containing the fixed search terms
	 */
	fixed(this: Api): Api<string>;

	/**
	 * Get the search term used for the given name.
	 *
	 * @param name Fixed search term to get.
	 * @returns The search term for the name given or undefined if not set.
	 */
	fixed(this: Api, name: string): SearchInput<T> | undefined;

	/**
	 * Set a search term to apply to the table, using a name to uniquely
	 * identify it.
	 *
	 * @param name Name to give the fixed search term
	 * @param search The search term to apply to the table or `null` to delete
	 *   an existing search term by the given name.
	 * @returns API for chaining
	 */
	fixed(this: Api, name: string, search: SearchInput<T> | null): Api<T>;
}

export interface ApiPageInfo {
	page: number;
	pages: number;
	start: number;
	end: number;
	length: number;
	recordsTotal: number;
	recordsDisplay: number;
	serverSide: boolean;
}

/**
 * "table" - loop over the context's (i.e. the tables) for the instance
 *
 * @param settings Table settings object
 * @param counter Loop counter
 */
type IteratorTable = (settings: Context, counter: number) => any;

/**
 * "cell" - loop over each table and cell in the result set
 *
 * @param settings Table settings object
 * @param rowIndex Row index
 * @param columnIndex Column index
 * @param tableCounter Table counter (outer)
 * @param cellCounter Cell counter (inner)
 */
type IteratorCell = (
	settings: Context,
	rowIndex: number,
	columnIndex: number,
	tableCounter: number,
	cellCounter: number
) => any;

/**
 * "columns" - loop over each item in the result set
 *
 * @param settings Table settings object
 * @param resultItem Result set item
 * @param counter Loop counter
 */
type IteratorColumns = (
	settings: Context,
	resultItem: any,
	counter: number
) => any;

/**
 * "column" - loop over each table and column in the result set
 *
 * @param settings Table settings object
 * @param columnIndex Column index
 * @param tableCounter Table counter (outer)
 * @param columnCounter Column counter (inner)
 */
type IteratorColumn = (
	settings: Context,
	columnIndex: number,
	tableCounter: number,
	columnCounter: number
) => any;

/**
 * "column-rows" - loop over each table, column and row in the result set
 * applying selector-modifier.
 *
 * @param settings Table settings object
 * @param columnIndex Column index
 * @param tableCounter Table counter (outer)
 * @param columnCounter Column counter (inner)
 * @param rowIndexes Row indexes
 */
type IteratorColumnRows = (
	settings: Context,
	columnIndex: number,
	tableCounter: number,
	columnCounter: number,
	rowIndexes: number[]
) => any;

/**
 * "row" - loop over each table and row in the result set
 *
 * @param settings Table settings object
 * @param rowIndex Row index
 * @param tableCounter Table counter (outer)
 * @param rowCounter Row counter (inner)
 */
type IteratorRow = (
	settings: Context,
	rowIndex: number,
	tableCounter: number,
	rowCounter: number
) => any;

/**
 * "rows" - loop over each item in the result set
 *
 * @param settings Table settings object
 * @param resultItem Result set item
 * @param counter Loop counter
 */
type IteratorRows = (
	settings: Context,
	resultItem: any,
	counter: number
) => any;

/**
 * "every" - loop over selected items
 *
 * @param settings Table settings object
 * @param index Data value (number or cell index)
 * @param tableCounter Table counter (outer)
 * @param counter Counter (inner)
 */
type IteratorEvery = (
	settings: Context,
	index: any,
	tableCounter: number,
	counter: number
) => any;

export interface ApiAjax extends Api<any> {
	/**
	 * Get the latest JSON data obtained from the last Ajax request DataTables
	 * made
	 *
	 * @returns JSON object that was last loaded/
	 */
	json(this: Api): object;

	/**
	 * Get the data submitted by DataTables to the server in the last Ajax
	 * request
	 *
	 * @returns object containing the data submitted by DataTables
	 */
	params(this: Api): object;

	/**
	 * Reload the table data from the Ajax data source.
	 *
	 * @param callback Function which is executed when the data as been reloaded
	 * and the table fully redrawn.
	 * @param resetPaging Reset (default action or true) or hold the current
	 * paging position (false).
	 * @returns DataTables Api
	 */
	reload(
		this: Api,
		callback?: (json: any) => void,
		resetPaging?: boolean
	): Api<any>;

	/**
	 * Reload the table data from the Ajax data source
	 *
	 * @returns URL set as the Ajax data source for the table.
	 */
	url(this: Api): string | undefined;

	/**
	 * Reload the table data from the Ajax data source
	 *
	 * @param url URL to set to be the Ajax data source for the table.
	 * @returns DataTables Api instance for chaining or further ajax.url()
	 * methods
	 */
	url(this: Api, url: string): AjaxMethods;
}

export interface AjaxMethods extends Api<any> {
	/**
	 * Reload the table data from the Ajax data source.
	 *
	 * @param callback Function which is executed when the data as been reloaded
	 * and the table fully redrawn.
	 * @param resetPaging Reset (default action or true) or hold the current
	 * paging position (false).
	 * @returns DataTables Api instance
	 */
	load(
		this: AjaxMethods,
		callback?: (json: any) => void,
		resetPaging?: boolean
	): Api<any>;
}

export interface ApiPage extends Api<any> {
	/**
	 * Get the current page of the table.
	 *
	 * @returns Currently displayed page number
	 */
	(this: Api): number;

	/**
	 * Set the current page of the table.
	 *
	 * @param page Index or 'first', 'next', 'previous', 'last'
	 * @returns DataTables API instance
	 */
	(this: Api, page: number | string): Api<any>;

	/**
	 * Get paging information about the table
	 *
	 * @returns Object with information about the table's paging state.
	 */
	info(this: Api): ApiPageInfo;

	/**
	 * Get the table's page length.
	 *
	 * @returns Current page length.
	 */
	len(this: Api): number;

	/**
	 * Set the table's page length.
	 *
	 * @param length Page length to set. use -1 to show all records.
	 * @returns DataTables API instance.
	 */
	len(this: Api, length: number): Api<any>;
}

export interface ApiOrder {
	/**
	 * Get the ordering applied to the table.
	 *
	 * @returns Array of arrays containing information about the currently
	 * applied sort. This 2D array is the same format as the array used for
	 * setting the order to apply to the table
	 */
	(): OrderArray[];

	/**
	 * Set the ordering applied to the table.
	 *
	 * @param order Order Model
	 * @returns DataTables Api instance
	 */
	(order?: Order | Order[]): Api<any>;
	(order: Order, ...args: Order[]): Api<any>;

	/**
	 * Get the fixed ordering that is applied to the table. If there is more
	 * than one table in the API's context, the ordering of the first table will
	 * be returned only (use table() if you require the ordering of a different
	 * table in the API's context).
	 * @returns object describing the ordering that is applied to the table
	 */
	fixed(): OrderFixed;

	/**
	 * Set the table's fixed ordering. Note this doesn't actually perform the
	 * order, but rather queues it up - use draw() to perform the ordering.
	 *
	 * @param order Used to indicate whether the ordering should be performed
	 * before or after the users own ordering.
	 * @returns DataTables Api instance
	 */
	fixed(order: OrderFixed): Api<any>;

	/**
	 * Add an ordering listener to an element, for a given column.
	 *
	 * @param node HTML element to attach to
	 * @param column Column index(es)
	 * @param callback Callback function
	 * @returns DataTables API instance with the current order in the result set
	 */
	listener(
		this: Api,
		node: HTMLElement,
		column: number | number[] | (() => number[]),
		callback: () => void
	): Api<any>;
}

export interface ApiState<T> extends Api<T> {
	/**
	 * Get the last saved state of the table
	 *
	 * @returns State saved object
	 */
	(this: Api): State;

	/**
	 * Set the table state from a state object
	 *
	 * @returns API instance, for chaining
	 */
	(this: Api, set: State, ignoreTime?: boolean): Api;

	/**
	 * Clear the saved state of the table.
	 *
	 * @returns API instance, for chaining
	 */
	clear(this: Api): Api<any>;

	/**
	 * Get the table state that was loaded during initialisation.
	 *
	 * @returns State saved object. See state() for the object format.
	 */
	loaded(this: Api): StateLoad | null;

	/**
	 * Trigger a state save.
	 *
	 * @returns API instance, for chaining
	 */
	save(this: Api): Api<T>;
}

``;

export interface ApiCell<T> {
	/**
	 * Select the cell found by a cell selector
	 *
	 * @param cellSelector Cell selector.
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering
	 * @returns DataTables API instance with selected cell
	 */
	(
		cellSelector: CellSelector,
		modifier?: ApiSelectorModifier | null
	): ApiCellMethods<T>;

	/**
	 * Select the cell found by a cell selector
	 *
	 * @param rowSelector Row selector.
	 * @param columnSelector Column selector.
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering
	 * @returns DataTables API instance with selected cell
	 */
	(
		rowSelector: RowSelector<T>,
		columnSelector: ColumnSelector,
		modifier?: ApiSelectorModifier | null
	): ApiCellMethods<T>;
}

export interface ApiCellMethods<T>
	extends Omit<ApiScopeable<T, ApiCellMethods<T>>, 'render' | 'select'> {
	/**
	 * Get the DataTables cached data for the selected cell
	 *
	 * @param type Specify which cache the data should be read from. Can take
	 * one of two values: search or order
	 * @returns DataTables API instance with the cached data for each selected
	 * cell in the result set
	 */
	cache(type: string): Api<T>;

	/**
	 * Get data for the selected cell
	 *
	 * @returns the data from the cell
	 */
	data(): any;

	/**
	 * Get data for the selected cell
	 *
	 * @param data Value to assign to the data for the cell
	 * @returns DataTables Api instance
	 */
	data(data: any): Api<T>;

	/**
	 * Get index information about the selected cell
	 *
	 * @returns Object with index information for the selected cell.
	 */
	index(): CellIdxWithVisible;

	/**
	 * Invalidate the data held in DataTables for the selected cell
	 *
	 * @param source Data source to read the new data from.
	 * @returns DataTables API instance with selected cell references in the
	 * result set
	 */
	invalidate(source?: string): Api<T>;

	/**
	 * Get the DOM element for the selected cell
	 *
	 * @returns The TD / TH cell the selector resolved to
	 */
	node(): HTMLTableCellElement;

	/**
	 * Get data for the selected cell
	 *
	 * @param type Data type to get. This can be one of: 'display', 'filter',
	 * 'sort', 'type'
	 * @returns Rendered data for the requested type
	 */
	render(type: string): any;
}

export interface ApiCells<T> {
	/**
	 * Select all cells
	 *
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering
	 * @returns DataTables API instance with selected cells
	 */
	(this: Api<T>, modifier?: ApiSelectorModifier): ApiCellsMethods<T>;

	/**
	 * Select cells found by a cell selector
	 *
	 * @param cellSelector Cell selector.
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering
	 * @returns DataTables API instance with selected cells
	 */
	(
		this: Api<T>,
		cellSelector: CellSelector,
		modifier?: ApiSelectorModifier
	): ApiCellsMethods<T>;

	/**
	 * Select cells found by both row and column selectors
	 *
	 * @param rowSelector Row selector.
	 * @param columnSelector Column selector.
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering
	 * @returns DataTables API instance with selected cells
	 */
	(
		this: Api<T>,
		rowSelector: RowSelector<T>,
		columnSelector: ColumnSelector,
		modifier?: ApiSelectorModifier
	): ApiCellsMethods<T>;
}

export interface ApiCellsMethods<T>
	extends Omit<
		ApiScopeable<T, ApiCellsMethods<T>>,
		'data' | 'render' | 'select'
	> {
	/**
	 * Get the DataTables cached data for the selected cells
	 *
	 * @param type Specify which cache the data should be read from. Can take
	 * one of two values: search or order
	 * @returns DataTables API instance with the cached data for each selected
	 * cell in the result set
	 */
	cache(this: ApiCellsMethods<T>, type: string): Api<T>;

	/**
	 * Get data for the selected cells
	 *
	 * @returns DataTables API instance with data for each cell in the selected
	 * columns in the result set. This is a 1D array with each entry being the
	 * data for the cells from the selected column.
	 */
	data(this: ApiCellsMethods<T>): Api<Array<T>>;

	/**
	 * Iterate over each selected cell, with the function context set to be the
	 * cell in question. Since: DataTables 1.10.6
	 *
	 * @param fn Function to execute for every cell selected.
	 */
	every(
		this: ApiCellsMethods<T>,
		fn: (
			this: ApiCellsMethods<T>,
			cellRowIdx: number,
			cellColIdx: number,
			tableLoop: number,
			cellLoop: number
		) => void
	): Api<any>;

	/**
	 * Get index information about the selected cells
	 */
	indexes(this: ApiCellsMethods<T>): Api<CellIdxWithVisible>;

	/**
	 * Invalidate the data held in DataTables for the selected cells
	 *
	 * @param source Data source to read the new data from.
	 * @returns DataTables API instance with selected cell references in the
	 * result set
	 */
	invalidate(this: ApiCellsMethods<T>, source?: string): Api<T>;

	/**
	 * Get the DOM elements for the selected cells
	 */
	nodes(this: ApiCellsMethods<T>): Api<HTMLTableCellElement>;

	/**
	 * Get data for the selected cell
	 *
	 * @param type Data type to get. This can be one of: 'display', 'filter',
	 * 'sort', 'type'
	 * @returns Rendered data for the requested type
	 */
	render(this: ApiCellsMethods<T>, type: string): any;

	/**
	 * Get the title text for a column
	 *
	 * @param row Indicate which row in the header the title should be read from
	 *  when working with multi-row headers.
	 * @return Column title
	 */
	title(this: ApiCellsMethods<T>, row?: number): string;

	/**
	 * Set the title text for a column
	 *
	 * @param title Title to set
	 * @param row Indicate which row in the header the title should be read from
	 *  when working with multi-row headers.
	 * @return DataTables API instance for chaining
	 */
	title(this: ApiCellsMethods<T>, title: string, row?: number): Api<T>;

	/**
	 * Get the column's data type (auto detected or configured).
	 *
	 * @return The column's data type.
	 */
	type(this: ApiCellsMethods<T>): string;

	/**
	 * Compute the width of a column as it is shown.
	 *
	 * @return The width of the column in pixels or `null` if there is no data
	 *   in the table.
	 */
	width(this: ApiCellsMethods<T>): number | null;
}

export interface ApiColumn<T> {
	/**
	 * Select the column found by a column selector
	 *
	 * @param columnSelector Column selector.
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering in the table should be taken into account.
	 */
	(
		columnSelector: ColumnSelector,
		modifier?: ApiSelectorModifier | null
	): ApiColumnMethods<T>;

	/**
	 * Convert from the input column index type to that required.
	 *
	 * @param type The type on conversion that should take place: 'fromVisible',
	 * 'toData', 'fromData', 'toVisible'
	 * @param index The index to be converted
	 * @returns Calculated column index
	 */
	index(type: string, index: number): number | null;
}

export interface ApiColumnMethods<T>
	extends Omit<
		ApiScopeable<T, ApiColumnMethods<T>>,
		'init' | 'data' | 'order' | 'render' | 'search'
	> {
	/**
	 * Get the DataTables cached data for the selected column(s)
	 *
	 * @param type Specify which cache the data should be read from. Can take
	 * one of two values: search or order
	 * @return DataTables Api instance with an caches data for the selected
	 * column(s)
	 */
	cache(this: ApiColumnMethods<T>, type: string): Api<any>;

	/**
	 * Get the data for the cells in the selected column.
	 *
	 * @returns DataTables API instance with data for each cell in the selected
	 * columns in the result set. This is a 1D array with each entry being the
	 * data for the cells from the selected column.
	 */
	data(this: ApiColumnMethods<T>): Api<Array<any>>;

	/**
	 * Get the data source property for the selected column.
	 *
	 * @returns the data source property
	 */
	dataSrc(this: ApiColumnMethods<T>): number | string | (() => string);

	/**
	 * Get the footer th / td cell for the selected column.
	 *
	 * @param row Indicate which row in the footer the cell should be read from
	 *  when working with multi-row footers.
	 * @returns HTML element for the footer of the column
	 */
	footer(this: ApiColumnMethods<T>, row?: number): HTMLElement;

	/**
	 * Get the header th / td cell for a column.
	 *
	 * @param row Indicate which row in the header the cell should be read from
	 *  when working with multi-row headers.
	 * @returns HTML element for the header of the column
	 */
	header(this: ApiColumnMethods<T>, row?: number): HTMLElement;

	/**
	 * Get the column index of the selected column.
	 *
	 * @param type Specify if you want to get the column data index (default) or
	 * the visible index (visible).
	 * @returns The column index for the selected column.
	 */
	index(this: ApiColumnMethods<T>, type?: string): number;

	/**
	 * Get the initialisation object used for the selected column.
	 *
	 * @returns Column configuration object
	 */
	init(this: ApiColumnMethods<T>): any; // TODO ConfigColumns;

	/**
	 * Get the name for the selected column (set by `columns.name`).
	 *
	 * @returns Column name or null if not set.
	 */
	name(this: ApiColumnMethods<T>): string | null;

	/**
	 * Obtain the th / td nodes for the selected column
	 *
	 * @returns DataTables API instance with each cell's node from the selected
	 * columns in the result set. This is a 1D array with each entry being the
	 * node for the cells from the selected column.
	 */
	nodes(this: ApiColumnMethods<T>): Api<Array<HTMLTableCellElement>>;

	/**
	 * Order the table, in the direction specified, by the column selected by
	 * the column() selector.
	 *
	 * @param direction Direction of sort to apply to the selected column - desc
	 * (descending) or asc (ascending).
	 * @returns DataTables API instance
	 */
	order(this: ApiColumnMethods<T>, direction: string): Api<any>;

	/**
	 * Get the orderable state for the column (from `columns.orderable`).
	 */
	orderable(this: ApiColumnMethods<T>): boolean;

	/**
	 * Get a list of the column ordering directions (from
	 * `columns.orderSequence`).
	 */
	orderable(this: ApiColumnMethods<T>, directions: true): Api<string>;

	/**
	 * Get rendered data for the selected column.
	 *
	 * @param type Data type to get. Typically `display`, `filter`, `sort` or
	 *   `type` although can be anything that the rendering functions expect.
	 */
	render(this: ApiColumnMethods<T>, type?: string): Api<T>;

	/**
	 * Search methods and properties
	 */
	search: ApiColumnSearch<T>;

	/**
	 * Get the title text for the selected column
	 *
	 * @param row Indicate which row in the header the title should be read from
	 *  when working with multi-row headers.
	 * @return Column titles in API instance's data set
	 */
	title(this: ApiColumnMethods<T>, row?: number): string;

	/**
	 * Set the title text for the selected column
	 *
	 * @param title Title to set
	 * @param row Indicate which row in the header the title should be read from
	 *  when working with multi-row headers.
	 * @return DataTables API instance for chaining
	 */
	title(this: ApiColumnMethods<T>, title: string, row?: number): Api<T>;

	/**
	 * Get the data type for the selected column (auto detected or configured).
	 *
	 * @return DataTables API instance with column types in its data set
	 */
	type(this: ApiColumnMethods<T>): string;

	/**
	 * Get the visibility of the selected column.
	 *
	 * @returns true if the column is visible, false if it is not.
	 */
	visible(this: ApiColumnMethods<T>): boolean;

	/**
	 * Set the visibility of the selected column.
	 *
	 * @param show Specify if the column should be visible (true) or not
	 * (false).
	 * @param redrawCalculations Indicate if DataTables should recalculate the
	 * column layout (true - default) or not (false).
	 * @returns DataTables API instance with selected column in the result set.
	 */
	visible(
		this: ApiColumnMethods<T>,
		show: boolean,
		redrawCalculations?: boolean
	): Api<any>;

	/**
	 * Compute the width of the selected column as they are shown.
	 *
	 * @return Api instance with the width of each column in pixels or `null` if
	 *   there is no data in the table.
	 */
	width(this: ApiColumnMethods<T>): number | null;
}

export interface ApiColumnSearch<T> {
	/**
	 * Get the currently applied column search.
	 *
	 * @returns the currently applied column search.
	 */
	(): string;

	/**
	 * Set the search term for the matched column.
	 *
	 * @param input Search apply.
	 * @param regex Treat as a regular expression (true) or not (default,
	 * false).
	 * @param smart Perform smart search.
	 * @param caseInsen Do case-insensitive matching (default, true) or not
	 * (false).
	 * @returns DataTables API instance
	 */
	(
		input: SearchInput<T>,
		regex?: boolean,
		smart?: boolean,
		caseInsen?: boolean
	): Api<any>;

	/**
	 * Set the search term for the matched column.
	 *
	 * @param input Search to apply.
	 * @param Search Search configuration options
	 * @returns DataTables API instance
	 */
	(input: SearchInput<T>, options: Partial<SearchOptions>): Api<any>;

	/**
	 * Get a list of the names of searches applied to the column
	 *
	 * @returns API instance containing the column's fixed search terms
	 */
	fixed(): Api<string>;

	/**
	 * Get the search term for the column used for the given name.
	 *
	 * @param name Fixed search term to get.
	 * @returns The search term for the name given or undefined if not set.
	 */
	fixed(name: string): SearchInput<T> | undefined;

	/**
	 * Set a search term to apply to the column, using a name to uniquely
	 * identify it.
	 *
	 * @param name Name to give the fixed search term
	 * @param search The search term to apply to the column or `null` to delete
	 *   an existing search term by the given name.
	 * @returns API for chaining
	 */
	fixed(name: string, search: SearchInput<T> | null): Api<T>;
}

export interface ApiColumns<T> extends Api<T> {
	/**
	 * Select all columns
	 *
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering in the table should be taken into account.
	 * @returns DataTables API instance with selected columns in the result set.
	 */
	(modifier?: ApiSelectorModifier): ApiColumnsMethods<T>;

	/**
	 * Select columns found by a cell selector
	 *
	 * @param columnSelector Column selector.
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering in the table should be taken into account.
	 * @returns DataTables API instance with selected columns
	 */
	(
		columnSelector?: ColumnSelector,
		modifier?: ApiSelectorModifier
	): ApiColumnsMethods<T>;

	/**
	 * Recalculate the column widths for layout.
	 *
	 * @returns DataTables API instance.
	 */
	adjust(this: Api): Api<T>;
}

export interface ApiColumnsMethods<T>
	extends Omit<
		ApiScopeable<T, ApiColumnsMethods<T>>,
		'init' | 'data' | 'order' | 'render' | 'search'
	> {
	/**
	 * Get the DataTables cached data for the selected columns
	 *
	 * @param type Specify which cache the data should be read from. Can take
	 * one of two values: search or order
	 * @return DataTables Api instance with an caches data for the selected
	 * columns
	 */
	cache(this: ApiColumnsMethods<T>, type: string): Api<any>;

	/**
	 * Obtain the data for the columns from the selector
	 *
	 * @returns DataTables API instance with data for each cell in the selected
	 * columns in the result set. This is a 2D array with the top level array
	 * entries for each column matched by the columns() selector.
	 */
	data(this: ApiColumnsMethods<T>): Api<Array<Array<any>>>;

	/**
	 * Get the data source property for the selected columns.
	 *
	 * @returns API instance with the result set containing the data source
	 * parameters for the selected columns as configured by
	 */
	dataSrc(this: ApiColumnsMethods<T>): Api<any>;

	/**
	 * Iterate over each selected column, with the function context set to be
	 * the column in question. Since: DataTables 1.10.6
	 *
	 * @param fn Function to execute for every column selected.
	 * @returns DataTables API instance of the selected columns.
	 */
	every(
		this: ApiColumnsMethods<T>,
		fn: (
			this: ApiColumnMethods<T>,
			colIdx: number,
			tableLoop: number,
			colLoop: number
		) => void
	): Api<any>;

	/**
	 * Get the footer th / td cell for the selected columns.
	 *
	 * @param row Indicate which row in the footer the cell should be read from
	 *  when working with multi-row footers.
	 * @returns HTML element for the footer of the columns
	 */
	footer(this: ApiColumnsMethods<T>, row?: number): Api<HTMLElement>;

	/**
	 * Get the header th / td cell for a columns.
	 *
	 * @param row Indicate which row in the header the cell should be read from
	 *  when working with multi-row headers.
	 * @returns HTML element for the header of the columns
	 */
	header(this: ApiColumnsMethods<T>, row?: number): Api<HTMLElement>;

	/**
	 * Get the column indexes of the selected columns.
	 *
	 * @param type Specify if you want to get the column data index (default) or
	 * the visible index (visible).
	 * @returns DataTables API instance with selected columns' indexes in the
	 * result set.
	 */
	indexes(this: ApiColumnsMethods<T>, type?: string): Api<Array<number>>;

	/**
	 * Get the initialisation objects used for the selected columns.
	 *
	 * @returns Api instance of column configuration objects
	 */
	init(this: ApiColumnsMethods<T>): Api<any>; // TODO ConfigColumns

	/**
	 * Get the names for the selected columns (set by `columns.name`).
	 *
	 * @returns Column names (each entry can be null if not set).
	 */
	names(this: ApiColumnsMethods<T>): Api<string | null>;

	/**
	 * Obtain the th / td nodes for the selected columns
	 *
	 * @returns DataTables API instance with each cell's node from the selected
	 * columns in the result set. This is a 2D array with the top level array
	 * entries for each column matched by the columns() selector.
	 */
	nodes(this: ApiColumnsMethods<T>): Api<Array<Array<HTMLTableCellElement>>>;

	/**
	 * Order the table, in the direction specified, by the columns selected by
	 * the column() selector.
	 *
	 * @param direction Direction of sort to apply to the selected columns -
	 * desc (descending) or asc (ascending).
	 * @returns DataTables API instance
	 */
	order(this: ApiColumnsMethods<T>, direction: string): Api<any>;

	/**
	 * Get the orderable state for the selected columns (from
	 * `columns.orderable`).
	 */
	orderable(this: ApiColumnsMethods<T>): Api<boolean>;

	/**
	 * Get a list of the column ordering directions (from
	 * `columns.orderSequence`).
	 */
	orderable(this: ApiColumnsMethods<T>, directions: true): Api<Array<string>>;

	/**
	 * Get rendered data for the selected columns.
	 * @param type Data type to get. Typically `display`, `filter`, `sort` or
	 *   `type` although can be anything that the rendering functions expect.
	 */
	render(this: ApiColumnsMethods<T>, type?: string): Api<Array<T>>;

	/**
	 * Search methods and properties
	 */
	search: ApiColumnsSearch<T>;

	/**
	 * Get the title text for the selected columns
	 *
	 * @param row Indicate which row in the header the title should be read from
	 *  when working with multi-row headers.
	 * @return Column titles in API instance's data set
	 */
	titles(this: ApiColumnsMethods<T>, row?: number): Api<string>;

	/**
	 * Set the title text for the selected columns
	 *
	 * @param title Title to set
	 * @param row Indicate which row in the header the title should be read from
	 *  when working with multi-row headers.
	 * @return DataTables API instance for chaining
	 */
	titles(this: ApiColumnsMethods<T>, title: string, row?: number): Api<T>;

	/**
	 * Get the data type for the selected columns (auto detected or configured).
	 *
	 * @return DataTables API instance with column types in its data set
	 */
	types(this: ApiColumnsMethods<T>): Api<string>;

	/**
	 * Get the visibility of the selected columns.
	 *
	 * @returns true if the columns is visible, false if it is not.
	 */
	visible(this: ApiColumnsMethods<T>): boolean;

	/**
	 * Set the visibility of the selected columns.
	 *
	 * @param show Specify if the columns should be visible (true) or not
	 * (false).
	 * @param redrawCalculations Indicate if DataTables should recalculate the
	 * columns layout (true - default) or not (false).
	 * @returns DataTables API instance with selected columns in the result set.
	 */
	visible(
		this: ApiColumnsMethods<T>,
		show: boolean,
		redrawCalculations?: boolean
	): Api<any>;

	/**
	 * Compute the width of the selected columns as they are shown.
	 *
	 * @return Api instance with the width of each column in pixels or `null` if
	 *   there is no data in the table.
	 */
	widths(this: ApiColumnsMethods<T>): Api<number | null>;
}

export interface ApiColumnsSearch<T> {
	/**
	 * Get the currently applied columns search.
	 *
	 * @returns the currently applied columns search.
	 */
	(): Api<SearchInput<T>[]>;

	/**
	 * Set the search term for the columns from the selector. Note this doesn't
	 * actually perform the search.
	 *
	 * @param input Search to apply to the selected columns.
	 * @param regex Treat as a regular expression (true) or not (default,
	 * false).
	 * @param smart Perform smart search (default, true) or not (false).
	 * @param caseInsen Do case-insensitive matching (default, true) or not
	 * (false).
	 * @returns DataTables Api instance.
	 */
	(
		input: SearchInput<T>,
		regex?: boolean,
		smart?: boolean,
		caseInsen?: boolean
	): Api<any>;

	/**
	 * Set the search term for the matched columns.
	 *
	 * @param input Search to apply.
	 * @param Search Search configuration options
	 * @returns DataTables API instance
	 */
	(input: SearchInput<T>, options: Partial<SearchOptions>): Api<any>;

	/**
	 * Get a list of the names of searches applied to the matched columns
	 *
	 * @returns API instance containing the column's fixed search terms
	 */
	fixed(): Api<string[]>;

	/**
	 * Get the search term for the matched columns used for the given name.
	 *
	 * @param name Fixed search term to get.
	 * @returns The search term for the name given or undefined if not set.
	 */
	fixed(name: string): Api<SearchInput<T> | undefined>;

	/**
	 * Set a search term to apply to the matched columns, using a name to
	 * uniquely identify it.
	 *
	 * @param name Name to give the fixed search term
	 * @param search The search term to apply to the column or `null` to delete
	 *   an existing search term by the given name.
	 * @returns API for chaining
	 */
	fixed(name: string, search: SearchInput<T> | null): Api<T>;
}

export interface ApiRowChildMethods<T> {
	/**
	 * Get the child row(s) that have been set for a parent row
	 *
	 * @returns Query object with the child rows for the parent row in its
	 * result set, or undefined if there are no child rows set for the parent
	 * yet.
	 */
	(): JQuery;

	/**
	 * Get the child row(s) that have been set for a parent row
	 *
	 * @param showRemove This parameter can be given as true or false
	 * @returns DataTables Api instance.
	 */
	(showRemove: boolean): RowChildMethods<T>;

	/**
	 * Set the data to show in the child row(s). Note that calling this method
	 * will replace any child rows which are already attached to the parent row.
	 *
	 * @param data The data to be shown in the child row can be given in
	 * multiple different ways.
	 * @param className Class name that is added to the td cell node(s) of the
	 * child row(s). As of 1.10.1 it is also added to the tr row node of the
	 * child row(s).
	 * @returns DataTables Api instance
	 */
	(
		data: (string | Node | JQuery) | Array<string | number | JQuery>,
		className?: string
	): RowChildMethods<T>;

	/**
	 * Hide the child row(s) of a parent row
	 *
	 * @returns DataTables API instance.
	 */
	hide(): Api<any>;

	/**
	 * Check if the child rows of a parent row are visible
	 *
	 * @returns boolean indicating whether the child rows are visible.
	 */
	isShown(): boolean;

	/**
	 * Remove child row(s) from display and release any allocated memory
	 *
	 * @returns DataTables API instance.
	 */
	remove(): Api<any>;

	/**
	 * Show the child row(s) of a parent row
	 *
	 * @returns DataTables API instance.
	 */
	show(): Api<any>;
}

export interface RowChildMethods<T> extends Api<T> {
	/**
	 * Hide the child row(s) of a parent row
	 *
	 * @returns DataTables API instance.
	 */
	hide(): Api<any>;

	/**
	 * Remove child row(s) from display and release any allocated memory
	 *
	 * @returns DataTables API instance.
	 */
	remove(): Api<any>;

	/**
	 * Make newly defined child rows visible
	 *
	 * @returns DataTables API instance.
	 */
	show(): Api<any>;
}

export interface ApiRow<T> {
	/**
	 * Select a row found by a row selector
	 *
	 * @param rowSelector Row selector.
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering in the table should be taken into account.
	 * @returns DataTables API instance with selected row in the result set
	 */
	(
		this: Api,
		rowSelector: RowSelector<T>,
		modifier?: ApiSelectorModifier
	): ApiRowMethods<T>;

	/**
	 * Add a new row to the table using the given data
	 *
	 * @param data Data to use for the new row. This may be an array, object or
	 * JavaScript object instance, but must be in the same format as the other
	 * data in the table+
	 * @returns DataTables API instance with the newly added row in its result
	 * set.
	 */
	add(
		data: any[] | Record<string, any> | JQuery | HTMLElement
	): ApiRowMethods<T>;
}

export interface ApiRowMethods<T>
	extends Omit<ApiScopeable<T, ApiRowMethods<T>>, 'data' | 'select'> {
	/**
	 * Get the DataTables cached data for the selected row(s)
	 *
	 * @param type Specify which cache the data should be read from. Can take
	 * one of two values: search or order
	 * @returns DataTables API instance with data for each cell in the selected
	 * row in the result set. This is a 1D array with each entry being the data
	 * for the cells from the selected row.
	 */
	cache(
		this: ApiRowMethods<T>,
		type: string
	): Api<Array<any>> | Api<Array<Array<any>>>;

	/**
	 * Order Methods / object
	 */
	child: ApiRowChildMethods<T>;

	/**
	 * Get the data for the selected row
	 *
	 * @returns Data source object for the data source of the row.
	 */
	data(this: ApiRowMethods<T>): T;

	/**
	 * Set the data for the selected row
	 *
	 * @param d Data to use for the row.
	 * @returns DataTables API instance with the row retrieved by the selector
	 * in the result set.
	 */
	data(this: ApiRowMethods<T>, d: any[] | object): Api<T>;

	/**
	 * Get the id of the selected row. Since: 1.10.8
	 *
	 * @param hash true - Append a hash (#) to the start of the row id. This can
	 * be useful for then using the id as a selector false - Do not modify the
	 * id value.
	 * @returns Row id. If the row does not have an id available 'undefined'
	 * will be returned.
	 */
	id(this: ApiRowMethods<T>, hash?: boolean): string;

	/**
	 * Get the row index of the row column.
	 *
	 * @returns Row index
	 */
	index(this: ApiRowMethods<T>): number;

	/**
	 * Obtain the th / td nodes for the selected row(s)
	 *
	 * @param source Data source to read the new data from. Values: 'auto',
	 * 'data', 'dom'
	 */
	invalidate(this: ApiRowMethods<T>, source?: string): Api<Array<any>>;

	/**
	 * Obtain the tr node for the selected row
	 *
	 * @returns tr element of the selected row or null if the element is not yet
	 * available
	 */
	node(this: ApiRowMethods<T>): HTMLTableRowElement | null;

	/**
	 * Delete the selected row from the DataTable.
	 *
	 * @returns DataTables API instance with removed row reference in the result
	 * set
	 */
	remove(this: ApiRowMethods<T>): Api<T>;
}

export interface ApiRows<T> {
	/**
	 * Select all rows
	 *
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering in the table should be taken into account.
	 * @returns DataTables API instance with selected rows
	 */
	(this: Api, modifier?: ApiSelectorModifier): ApiRowsMethods<T>;

	/**
	 * Select rows found by a row selector
	 *
	 * @param rowSelector Row selector.
	 * @param modifier Option used to specify how the cells should be ordered,
	 * and if paging or filtering in the table should be taken into account.
	 * @returns DataTables API instance with selected rows in the result set
	 */
	(
		this: Api,
		rowSelector?: RowSelector<T>,
		modifier?: ApiSelectorModifier
	): ApiRowsMethods<T>;

	/**
	 * Add new rows to the table using the data given
	 *
	 * @param data Array of data elements, with each one describing a new row to
	 * be added to the table
	 * @returns DataTables API instance with the newly added rows in its result
	 * set.
	 */
	add(data: T[]): ApiRowsMethods<T>;
}

export interface ApiRowsMethods<T>
	extends Omit<ApiScopeable<T, ApiRowsMethods<T>>, 'select'> {
	/**
	 * Get the DataTables cached data for the selected row(s)
	 *
	 * @param type Specify which cache the data should be read from. Can take
	 * one of two values: search or order
	 * @returns DataTables API instance with data for each cell in the selected
	 * row in the result set. This is a 1D array with each entry being the data
	 * for the cells from the selected row.
	 */
	cache(
		this: ApiRowsMethods<T>,
		type: string
	): Api<Array<any>> | Api<Array<Array<any>>>;

	/**
	 * Get the data for the selected rows
	 *
	 * @returns DataTables API instance with data for each row from the selector
	 * in the result set.
	 */
	data(this: ApiRowsMethods<T>): Api<T>;

	/**
	 * Iterate over each selected row, with the function context set to be the
	 * row in question. Since: DataTables 1.10.6
	 *
	 * @param fn Function to execute for every row selected.
	 * @returns DataTables API instance of the selected rows.
	 */
	every(
		this: ApiRowsMethods<T>,
		fn: (
			this: ApiRowMethods<T>,
			rowIdx: number,
			tableLoop: number,
			rowLoop: number
		) => void
	): Api<any>;

	/**
	 * Get the ids of the selected rows. Since: 1.10.8
	 *
	 * @param hash true - Append a hash (#) to the start of each row id. This
	 * can be useful for then using the ids as selectors false - Do not modify
	 * the id value.
	 * @returns Api instance with the selected rows in its result set. If a row
	 * does not have an id available 'undefined' will be returned as the value.
	 */
	ids(this: ApiRowsMethods<T>, hash?: boolean): Api<Array<any>>;

	/**
	 * Get the row indexes of the selected rows.
	 *
	 * @returns DataTables API instance with selected row indexes in the result
	 * set.
	 */
	indexes(this: ApiRowsMethods<T>): Api<Array<number>>;

	/**
	 * Obtain the th / td nodes for the selected row(s)
	 *
	 * @param source Data source to read the new data from. Values: 'auto',
	 * 'data', 'dom'
	 */
	invalidate(this: ApiRowsMethods<T>, source?: string): Api<Array<any>>;

	/**
	 * Obtain the tr nodes for the selected rows
	 *
	 * @returns DataTables API instance with each row's node from the selected
	 * rows in the result set.
	 */
	nodes(this: ApiRowsMethods<T>): Api<Array<HTMLTableRowElement>>;

	/**
	 * Delete the selected rows from the DataTable.
	 *
	 * @returns DataTables API instance with references for the removed rows in
	 * the result set
	 */
	remove(this: ApiRowsMethods<T>): Api<Array<any>>;
}

export interface ApiTableFooterMethods<T> extends Api<T> {
	/**
	 * Get the tfoot node for the table in the API's context
	 *
	 * @returns HTML tbody node.
	 */
	(this: ApiTableMethods<T>): HTMLTableSectionElement;

	/**
	 * Get an array that represents the structure of the footer
	 *
	 * @param selector Column selector
	 */
	structure(this: Api<T>, selector?: ColumnSelector): HeaderStructure[][];
}

export interface ApiTableHeaderMethods<T> extends Api<T> {
	/**
	 * Get the thead node for the table in the API's context
	 *
	 * @returns HTML thead node.
	 */
	(this: ApiTableMethods<T>): HTMLTableSectionElement;

	/**
	 * Get an array that represents the structure of the header
	 *
	 * @param selector Column selector
	 */
	structure(this: Api<T>, selector?: ColumnSelector): HeaderStructure[][];
}

export interface ApiTableMethods<T>
	extends ApiScopeable<T, ApiTableMethods<T>> {
	/**
	 * Table footer information
	 */
	footer: ApiTableFooterMethods<T>;

	/**
	 * Table header information
	 */
	header: ApiTableHeaderMethods<T>;

	/**
	 * Get the tbody node for the table in the API's context
	 *
	 * @returns HTML tfoot node.
	 */
	body(this: ApiTableMethods<T>): HTMLTableSectionElement;

	/**
	 * Get the div container node for the table in the API's context
	 *
	 * @returns HTML div node.
	 */
	container(this: ApiTableMethods<T>): HTMLDivElement;

	/**
	 * Get the table node for the table in the API's context
	 *
	 * @returns HTML table node for the selected table.
	 */
	node(this: ApiTableMethods<T>): HTMLTableElement;
}

export interface ApiTablesMethods<T>
	extends ApiScopeable<T, ApiTablesMethods<T>> {
	/**
	 * Get the tfoot nodes for the tables in the API's context
	 *
	 * @returns Array of HTML tfoot nodes for all table in the API's context
	 */
	footer(this: ApiTablesMethods<T>): Api<Array<HTMLTableSectionElement>>;

	/**
	 * Get the thead nodes for the tables in the API's context
	 *
	 * @returns Array of HTML thead nodes for all table in the API's context
	 */
	header(this: ApiTablesMethods<T>): Api<Array<HTMLTableSectionElement>>;

	/**
	 * Get the tbody nodes for the tables in the API's context
	 *
	 * @returns Array of HTML tbody nodes for all table in the API's context
	 */
	body(this: ApiTablesMethods<T>): Api<Array<HTMLTableSectionElement>>;

	/**
	 * Get the div container nodes for the tables in the API's context
	 *
	 * @returns Array of HTML div nodes for all table in the API's context
	 */
	containers(this: ApiTablesMethods<T>): Api<Array<HTMLDivElement>>;

	/**
	 * Iterate over each selected table, with the function context set to be the
	 * table in question. Since: DataTables 1.10.6
	 *
	 * @param fn Function to execute for every table selected.
	 */
	every(
		this: ApiTablesMethods<T>,
		fn: (this: ApiTableMethods<T>, tableIndex: number) => void
	): Api<any>;

	/**
	 * Get the table nodes for the tables in the API's context
	 *
	 * @returns Array of HTML table nodes for all table in the API's context
	 */
	nodes(this: ApiTablesMethods<T>): Api<Array<HTMLTableElement>>;
}

export interface DataTablesStatic {
	/**
	 * Create a new DataTable
	 *
	 * @param selector The table to make a DataTable (can be a string that
	 *   selects multiple tables).
	 * @param options Configuration options for the DataTable
	 */
	new <T = any>(selector: string | HTMLElement, options?: Options): Api<T>;

	/**
	 * Get DataTable API instance
	 *
	 * @param table Selector string for table
	 */
	Api: ApiStatic;

	/**
	 * DataTable's Ajax library
	 */
	ajax: typeof ajax;

	/**
	 * Register a date / time format for DataTables to use.
	 *
	 * @param format The date / time format to detect data in. Please refer to
	 *   the Moment.js or Luxon document for the full list of tokens, depending
	 *   on which of the two libraries you are using.
	 * @param locale The locale to pass to Moment.js / Luxon.
	 */
	datetime: typeof datetime;

	/**
	 * Default Settings
	 */
	defaults: Defaults;

	/**
	 * DataTable's DOM library.
	 */
	dom: typeof Dom;

	/**
	 * Default Settings
	 */
	ext: typeof ext;

	/**
	 * CommonJS factory function pass through. This will check if the arguments
	 * given are a window object or a jQuery object. If so they are set
	 * accordingly.
	 *
	 * @ignore
	 */
	factory: typeof factory;

	/** Feature control namespace */
	feature: {
		/**
		 * Create a new feature that can be used for layout
		 *
		 * @param name The name of the new feature.
		 * @param cb A function that will create the elements and event
		 * listeners for the feature being added.
		 */
		register: typeof registerFeature;
	};

	/**
	 * Check if a table node is a DataTable already or not.
	 *
	 * @param table The table to check.
	 * @returns true the given table is a DataTable, false otherwise
	 */
	isDataTable(table: string | Node | JQuery | Api<any>): boolean;

	/**
	 * The models that DataTables uses for data storage.
	 *
	 * @ignore
	 */
	models: typeof model;

	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render`
	 * initialisation option to provide a display renderer.
	 */
	render: DataTablesStaticRender;

	/**
	 * Context store - one for each DataTable.
	 *
	 * @ignore
	 */
	settings: Context[];

	/**
	 * Get all DataTable tables that have been initialised as API instances
	 *
	 * @param options
	 * @returns Array or DataTables API instance containing all matching
	 * DataTables
	 */
	tables(options: {
		/**
		 * Get only visible tables (true) or all tables regardless
		 * of visibility (false).
		 */
		visible?: boolean;

		/**
		 * Make the return an API instance
		 */
		api: true;
	}): Api<any>;

	/**
	 * Get all DataTable tables that have been initialised - as HTML elements
	 *
	 * @param options As a boolean value this options is used to indicate if you
	 * want all tables on the page should be returned (false), or visible tables
	 * only (true).
	 * @returns Array of HTML table Elements
	 */
	tables(options?: {
		/**
		 * Get only visible tables (true) or all tables regardless
		 * of visibility (false).
		 */
		visible?: boolean;

		/**
		 * Make the return an array of elements
		 */
		api?: false;
	}): HTMLElement[];

	/**
	 * Get all DataTable tables that have been initialised - as HTML elements
	 *
	 * @param options Indicate if you want all tables on the page should be
	 * returned (false), or visible tables only (true).
	 * @returns Array of HTML table Elements
	 */
	tables(visible: boolean): HTMLElement[];

	/**
	 * Get the data type definition object for a specific registered data type.
	 *
	 * @param name Data type name to get the definition of
	 */
	type: typeof registerType;

	/**
	 * Get the names of the registered data types DataTables can work with.
	 */
	types(): string[];

	/**
	 * Get the libraries that DataTables uses, or the global objects.
	 *
	 * @param type The library needed
	 */
	use(type: 'jq' | 'lib' | 'win' | 'datetime' | 'luxon' | 'moment'): any;

	/**
	 * Set the libraries that DataTables uses, or the global objects, with
	 * automatic detection of what the library is. Used for module loading
	 * environments.
	 */
	use(library: any): void;

	/**
	 * Set the libraries that DataTables uses, or the global objects, explicity
	 * stating what library is to be considered. Used for module loading
	 * environments.
	 *
	 * @param type Indicate the library that is being loaded.
	 * @param library The library (e.g. Moment or Luxon)
	 */
	use(
		type: 'jq' | 'lib' | 'win' | 'datetime' | 'luxon' | 'moment',
		library: any
	): void;

	/**
	 * Utility functions that DataTables makes use of internally and are exposed
	 * for use by extensions.
	 */
	util: typeof util;

	/**
	 * Version number compatibility check function
	 *
	 * @param version Version string
	 * @returns true if this version of DataTables is greater or equal to the
	 *   required version, or false if this version of DataTables is not
	 *   suitable
	 */
	versionCheck: typeof check;

	/**
	 * DataTables version
	 */
	version: string;

	/**
	 * Browser capabilities or options
	 *
	 * @ignore
	 */
	__browser: BrowserInfo;
}

export type ApiStaticRegisterFn<T> = (this: Api<T>, ...args: any[]) => any;

export interface IColumnControlContent {
	[name: string]: any;
}

export interface ApiStatic {
	/**
	 * Create a new API instance to an existing DataTable. Note that this
	 * does not create a new DataTable.
	 */
	new (selector: string | Node | Node[] | JQuery | Context | Api): Api<any>;

	register<T = any>(name: string, fn: ApiStaticRegisterFn<T>): void;
	registerPlural<T = any>(
		pluralName: string,
		singleName: string,
		fn: ApiStaticRegisterFn<T>
	): void;
}

export interface DataTablesStaticExtButtons {
	// Intentionally empty, completed in Buttons extension
}

export interface DataTablesStaticRender {
	/**
	 * Format an ISO8061 date in auto locale detected format
	 */
	date(): DateTimeRenderer;

	/**
	 * Format an ISO8061 date value using the specified format
	 * @param to Display format
	 * @param locale Locale
	 * @param def Default value if empty
	 */
	date(to: string, locale?: string): DateTimeRenderer;

	/**
	 * Format a date value
	 * @param from Data format
	 * @param to Display format
	 * @param locale Locale
	 * @param def Default value if empty
	 */
	date(
		from?: string,
		to?: string,
		locale?: string,
		def?: string
	): DateTimeRenderer;

	/**
	 * Format an ISO8061 datetime in auto locale detected format
	 */
	datetime(): DateTimeRenderer;

	/**
	 * Format an ISO8061 datetime value using the specified format
	 * @param to Display format
	 * @param locale Locale
	 * @param def Default value if empty
	 */
	datetime(to: string, locale?: string): DateTimeRenderer;

	/**
	 * Format a datetime value
	 * @param from Data format
	 * @param to Display format
	 * @param locale Locale
	 * @param def Default value if empty
	 */
	datetime(
		from?: string,
		to?: string,
		locale?: string,
		def?: string
	): DateTimeRenderer;

	/**
	 * Render a number with auto-detected locale thousands and decimal
	 */
	number(): any;

	/**
	 * Will format numeric data (defined by `columns.data`) for display,
	 * retaining the original unformatted data for sorting and filtering.
	 *
	 * @param thousands Thousands grouping separator. `null` for auto locale
	 * @param decimal Decimal point indicator. `null` for auto locale
	 * @param precision Integer number of decimal points to show.
	 * @param prefix Prefix (optional).
	 * @param postfix Postfix (/suffix) (optional).
	 */
	number(
		thousands: string | null,
		decimal: string | null,
		precision: number,
		prefix?: string,
		postfix?: string
	): NumberRenderer;

	/**
	 * Escape HTML to help prevent XSS attacks. It has no optional parameters.
	 */
	text(): TextRenderer;

	/**
	 * Format an ISO8061 date in auto locale detected format
	 */
	time(): DateTimeRenderer;

	/**
	 * Format an ISO8061 time value using the specified format
	 * @param to Display format
	 * @param locale Locale
	 * @param def Default value if empty
	 */
	time(to: string, locale?: string): DateTimeRenderer;

	/**
	 * Format a time value
	 * @param from Data format
	 * @param to Display format
	 * @param locale Locale
	 * @param def Default value if empty
	 */
	time(
		from?: string,
		to?: string,
		locale?: string,
		def?: string
	): DateTimeRenderer;
}

export interface ExtTypeSettings {
	/**
	 * Type detection functions for plug-in development.
	 *
	 * @deprecated Use `DataTable.type()`
	 */
	detect: DataTypeDetect[];

	/**
	 * Type based ordering functions for plug-in development.
	 *
	 * @deprecated Use `DataTable.type()`
	 */
	order: any;

	/**
	 * Type based search formatting for plug-in development.
	 *
	 * @deprecated Use `DataTable.type()`
	 */
	search: any;
}

type FunctionColumnRender = (
	data: any,
	type: any,
	row: any,
	meta: CellMetaSettings
) => any;
