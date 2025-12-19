import { Dom } from '../dom';
import util from '../util';
import { AjaxOptions, HttpMethod } from '../util/ajax';
import { GetFunction, JSON } from '../util/types';
import ColumnSettings from './columns/settings';
import defaultsA from './defaults';
import {
	AjaxData,
	DataTableDom,
	FunctionFormatNumber,
	FunctionInfoCallback,
	Layout,
	OrderState
} from './interface';
import { Row } from './row';
import createSearch, { SearchInput, SearchOptions } from './search';
import { State, StateLoad } from './state';

type FunctionDrawCallback = (this: DataTableDom, settings: Context) => void;

interface IScroll {
	/**
	 * When the table is shorter in height than sScrollY, collapse the
	 * table container down to the height of the table (when true).
	 */
	collapse: boolean | null;

	/**
	 * Width of the scrollbar for the web-browser's platform. Calculated
	 * during table initialisation.
	 */
	barWidth: number;

	/**
	 * Viewport width for horizontal scrolling. Horizontal scrolling is
	 * disabled if an empty string.
	 */
	x: string;

	/**
	 * Width to expand the table to when using x-scrolling. Typically you
	 * should not need to use this.
	 *  @deprecated
	 */
	xInner: string;

	/**
	 * Viewport height for vertical scrolling. Vertical scrolling is disabled
	 * if an empty string.
	 */
	y: string | number;
}

export interface ISortItem {
	src: number | string;
	col: number;
	dir: string;
	index: number;
	type: string;
	formatter?: Function;
	sorter?: Function;
}

export interface HeaderStructureCell {
	cell: HTMLElement;
	unique: boolean;
}

export interface HeaderStructure extends Array<HeaderStructureCell> {
	row: HTMLElement;
}

export type AjaxDataSrc = string | ((data: any) => any[]);

type FunctionAjaxData = (data: AjaxData, settings: Context) => string | object;

export type AjaxFunction = (
	d: JSON,
	cb: (json: JSON) => void,
	ctx: Context
) => void;

export interface DtAjaxOptions extends AjaxOptions {
	/**
	 * Add or modify data submitted to the server upon an Ajax request.
	 */
	data?: object | FunctionAjaxData;

	/**
	 * Data property or manipulation method for table data.
	 */
	dataSrc?:
		| AjaxDataSrc
		| {
				/** Mapping for `data` property */
				data: AjaxDataSrc;

				/** Mapping for `draw` property */
				draw: AjaxDataSrc;

				/** Mapping for `recordsTotal` property */
				recordsTotal: AjaxDataSrc;

				/** Mapping for `recordsFiltered` property */
				recordsFiltered: AjaxDataSrc;
		  };

	/** Format to submit the data parameters as in the Ajax request */
	submitAs?: 'http' | 'json';
}

export interface Features {
	/**
	 * Flag to say if DataTables should automatically try to calculate the
	 * optimum table and columns widths (true) or not (false).
	 */
	autoWidth: boolean;

	/**
	 * Delay the creation of TR and TD elements until they are actually needed
	 * by a driven page draw. This can give a significant speed increase for
	 * Ajax source and JavaScript source data, but makes no difference at all
	 * for DOM and server-side processing tables.
	 */
	deferRender: boolean;

	/**
	 * Used only for compatibility with DT1
	 * @deprecated
	 */
	info: boolean;

	/**
	 * Used only for compatibility with DT1
	 * @deprecated
	 */
	lengthChange: boolean;

	/**
	 * Apply a class to the columns which are being sorted to provide a
	 * visual highlight or not. This can slow things down when enabled since
	 * there is a lot of DOM interaction.
	 */
	orderClasses: boolean;

	/**
	 * Multi-column sorting
	 */
	orderMulti: boolean;

	/**
	 * Sorting enablement flag.
	 */
	ordering: boolean;

	/**
	 * Pagination enabled or not. Note that if this is disabled then length
	 * changing must also be disabled.
	 */
	paging: boolean;

	/**
	 * Processing indicator enable flag whenever DataTables is enacting a user
	 * request - typically an Ajax request for server-side processing.
	 */
	processing: boolean;

	/**
	 * Enable filtering on the table or not. Note that if this is disabled then
	 * there is no filtering at all on the table.
	 */
	searching: boolean;

	/**
	 * Server-side processing enabled flag - when enabled DataTables will
	 * get all data from the server for every draw - there is no filtering,
	 * sorting or paging done on the client-side.
	 */
	serverSide: boolean;

	/**
	 * State saving enablement flag.
	 */
	stateSave: boolean;
}

/**
 * DataTables settings class. This holds all the information needed for a
 * given table, including configuration and data. Devs do not interact with
 * this class directly and it is considered to be private - its properties
 * are NOT a public API. The `DataTable` or `DataTable.Api` instances are to
 * be used instead.
 */
export interface Context {
	ajax: null | string | DtAjaxOptions | AjaxFunction;

	/** Data submitted as part of the last Ajax request */
	ajaxData: AjaxData | string;

	/** Note if draw should be blocked while getting data */
	ajaxDataGet: boolean;

	api: any; // TODO

	/** Browser support parameters */
	browser: {
		/** Browser scrollbar width */
		barWidth: number;

		/**
		 * Determine if the vertical scrollbar is on the right or left of the
		 * scrolling container - needed for rtl language layout, although not
		 * all browsers move the scrollbar (Safari).
		 */
		scrollbarLeft: boolean;
	};

	callbacks: {
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 */
		destroy: Function[];

		/** Array of callback functions for draw callback functions */
		draw: FunctionDrawCallback[];

		/** Callback function for the footer on each draw. */
		footer: Function[];

		/** Callback functions for the header on each draw. */
		header: Function[];

		/** Callback functions for when the table has been initialised. */
		init: Function[];

		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 */
		preDraw: Function[];

		/** Callback functions array for every time a row is inserted (i.e. on a
		 * draw). */
		row: Function[];

		/** Array of callback functions for row created function */
		rowCreated: Function[];

		/**
		 * Callbacks for modifying the settings that have been stored for state
		 * saving prior to using the stored values to restore the state.
		 */
		stateLoadParams: Function[];

		/**
		 * Callbacks for operating on the settings object once the saved state
		 * has been loaded
		 */
		stateLoaded: Function[];

		/**
		 * Callbacks for modifying the settings to be stored for state saving,
		 * prior to saving state.
		 */
		stateSaveParams: Function[];
	};

	caption: string;

	captionNode: HTMLTableCaptionElement | null;

	/** The classes to use for the table */
	classes: any; // TODO

	colgroup: Dom;

	/** Store information about each column that is in use */
	columns: ColumnSettings[];

	/** Keep a record of the last size of the container, so we can skip
	 * duplicates */
	containerWidth: number;

	/** Row data information */
	data: (Row | null)[];

	/** Delay loading of data */
	deferLoading: boolean;

	/** Whether the table is currently being destroyed */
	destroying: boolean;

	/** If restoring a table - we should restore its width */
	destroyWidth: number;

	/** Array of indexes which are in the current display (after filtering etc)
	 * */
	display: number[];

	/** Array of indexes for display - no filtering */
	displayMaster: number[];

	/** Paging start point - display index */
	displayStart: number;

	displayStartInit: number;

	/** Indicate if a redraw is being done - useful for Ajax */
	doingDraw: boolean;

	/** Dictate the positioning of DataTables' control elements */
	dom: null | string;

	/** Counter for the draws that the table does. Also used as a tracker for
	 * server-side processing */
	drawCount: number;

	/** Draw index (iDraw) of the last error when parsing the returned data */
	drawError: number;

	drawHold: boolean | undefined;

	fastData: (row: number, column: number, type: string) => any;

	/** Feature enablement. */
	features: Features;

	/** Store information about the table's footer */
	footer: HeaderStructure[];

	/** Format numbers for display. */
	formatNumber: FunctionFormatNumber;

	/** Store information about the table's header */
	header: HeaderStructure[];

	/** Map of row ids to data indexes */
	ids: Record<string, Row>;

	infoEl: Dom;

	/** Initialisation object that is used for the table */
	init: Partial<typeof defaultsA>;

	initDone: boolean;

	/** Indicate if all required information has been read in */
	initialised: boolean;

	/** The DataTables object for this table */
	instance: DataTableDom;

	/** The last jQuery XHR object that was used for server-side data gathering.
	 * */
	jqXHR: XMLHttpRequest;

	/** JSON returned from the server in the last Ajax request */
	json: JSON;

	/** Language information for the table. */
	language: {
		aria: {
			orderable: string;
			orderableRemove: string;
			orderableReverse: string;
			paginate: {
				first: string;
				last: string;
				next: string;
				number: string;
				previous: string;
			};
		};
		decimal: string;
		emptyTable: string;
		info: string;
		infoCallback: null | FunctionInfoCallback;
		infoEmpty: string;
		infoFiltered: string;
		infoPostFix: string;
		lengthMenu: string;
		loadingRecords: string;
		paginate: {
			first: string;
			last: string;
			next: string;
			previous: string;
		};
		processing: string;
		search: string;
		searchPlaceholder: string;
		thousands: string;
		url: string;
		zeroRecords: string;
	};

	/** Last applied sort */
	lastOrder: any[];

	layout: Layout;

	/**
	 * List of options that can be used for the user selectable length menu.
	 * @deprecated
	 */
	lengthMenu: any[];

	loadingState: boolean;

	/** Sorting that is applied to the table. */
	order: OrderState[];

	/**
	 * Indicate that if multiple rows are in the header and there is more than
	 * one unique cell per column.
	 * @deprecated Replaced by titleRow
	 */
	orderCellsTop: null | boolean;

	/** Reverse the initial order of the data set on desc ordering */
	orderDescReverse: boolean;

	/** Sorting that is always applied to the table. */
	orderFixed: any; // TODO

	/** Default ordering listener */
	orderHandler: boolean;

	/** Show / hide ordering indicators in headers */
	orderIndicators: boolean;

	/** Paging display length */
	pageLength: number;

	/**
	 * Number of paging controls on the page.
	 * @deprecated
	 */
	pagingControls: number;

	/**
	 * Which type of pagination should be used.
	 * @deprecated
	 */
	pagingType: string;

	/** Store the applied search for each column */
	preSearchCols: SearchOptions[];

	/** Store the applied global search information. */
	previousSearch: SearchOptions;

	/**
	 * Server-side processing - records in the current display set (after
	 * filtering).
	 */
	recordsDisplay: number;

	/**
	 * Server-side processing - records in the result set (before filtering).
	 */
	recordsTotal: number;

	renderer: any; // TODO

	/** ResizeObserver for the container div */
	resizeObserver: ResizeObserver | null;

	reszEvt: boolean;

	/** Data location where to store a row's id */
	rowId: string;

	/** Function used to get a row's id from the row's data */
	rowIdFn: GetFunction;

	rowReadObject: boolean;

	/** Scrolling settings for a table. */
	scroll: IScroll;

	scrollBarVis: boolean;

	/** DIV container for the body scrolling table if scrolling */
	scrollBody: Dom;

	/** Search delay (in mS) */
	searchDelay: number;

	/** Store for named searches */
	searchFixed: { [name: string]: SearchInput };

	/** DIV container for the footer scrolling table if scrolling */
	scrollFoot: Dom;

	/** DIV container for the footer scrolling table if scrolling */
	scrollHead: Dom;

	/**
	 * Send the XHR HTTP method.
	 * @deprecated
	 */
	serverMethod: HttpMethod | null;

	sortDetails: ISortItem[];

	/** The state duration (for `stateSave`) in seconds. */
	stateDuration: number;

	stateLoadCallback: (ctx: Context) => Partial<State>;

	/** State that was loaded. Useful for back reference */
	stateLoaded: StateLoad | null;

	stateSaveCallback: (ctx: Context, data: any) => void;

	/** State that was saved. Useful for back reference */
	stateSaved: State | null;

	/** The TABLE node for the main table */
	table: HTMLElement;

	/** tabindex attribute value for keyboard navigation. */
	tabIndex: number;

	/** Cache the table ID for quick access */
	tableId: string;

	/** Cache the wrapper node (contains all DataTables controlled elements) */
	tableWrapper: Element;

	/** Permanent ref to the tbody element */
	tbody: HTMLElement;

	/** Permanent ref to the tfoot element - if it exists */
	tfoot: HTMLElement;

	/** Permanent ref to the thead element */
	thead: HTMLElement;

	/** Title row indicator */
	titleRow: any; // TODO

	/** Allow auto type detection */
	typeDetect: boolean;

	/** Unique identifier for each instance of the DataTables object. */
	unique: string;

	/**
	 * Flag for draw callback to check if filtering was done.
	 * @deprecated
	 */
	wasFiltered: boolean;

	/**
	 * Flag for draw callback to check if sorting was done.
	 * @deprecated
	 */
	wasOrdered: boolean;

	/** Window resize handler for older browsers */
	windowResizeCb: () => void;
}

const defaults: Partial<Context> = {
	ajax: null,
	ajaxDataGet: false,
	api: null,
	browser: {
		barWidth: 0,
		scrollbarLeft: false
	},
	callbacks: {
		destroy: [],
		draw: [],
		footer: [],
		header: [],
		init: [],
		preDraw: [],
		row: [],
		rowCreated: [],
		stateLoadParams: [],
		stateLoaded: [],
		stateSaveParams: []
	},
	caption: '',
	captionNode: null,
	classes: {},
	columns: [],
	containerWidth: -1,
	data: [],
	deferLoading: false,
	destroyWidth: 0,
	destroying: false,
	display: [],
	displayMaster: [],
	displayStart: 0,
	displayStartInit: -1,
	doingDraw: false,
	dom: null,
	drawCount: 0,
	drawError: -1,
	drawHold: false,
	features: {
		autoWidth: false,
		deferRender: false,
		info: false,
		lengthChange: false,
		orderClasses: false,
		orderMulti: false,
		ordering: false,
		paging: false,
		processing: false,
		searching: false,
		serverSide: false,
		stateSave: false
	},
	footer: [],
	header: [],
	ids: {},
	init: {},
	initDone: false,
	initialised: false,
	language: {
		aria: {
			orderable: '',
			orderableRemove: '',
			orderableReverse: '',
			paginate: {
				first: '',
				last: '',
				next: '',
				number: '',
				previous: ''
			}
		},
		decimal: '',
		emptyTable: '',
		info: '',
		infoCallback: null,
		infoEmpty: '',
		infoFiltered: '',
		infoPostFix: '',
		lengthMenu: '',
		loadingRecords: '',
		paginate: {
			first: '',
			last: '',
			next: '',
			previous: ''
		},
		processing: '',
		search: '',
		searchPlaceholder: '',
		thousands: '',
		url: '',
		zeroRecords: ''
	},
	lastOrder: [],
	layout: {},
	loadingState: false,
	order: [],
	orderCellsTop: null,
	orderDescReverse: false,
	orderFixed: [],
	orderHandler: true,
	orderIndicators: true,
	pageLength: 10,
	pagingControls: 0,
	pagingType: 'two_button',
	preSearchCols: [],
	previousSearch: createSearch(),
	recordsDisplay: 0,
	recordsTotal: 0,
	renderer: null,
	resizeObserver: null,
	reszEvt: false,
	rowId: '',
	rowReadObject: false,
	scroll: {
		barWidth: 0,
		collapse: null,
		x: '',
		xInner: '',
		y: ''
	},
	scrollBarVis: false,
	searchDelay: 0,
	searchFixed: {},
	serverMethod: null,
	sortDetails: [],
	stateDuration: 0,
	stateLoadCallback: () => {
		return {};
	},
	stateLoaded: null,
	stateSaveCallback: () => {},
	stateSaved: null,
	tabIndex: 0,
	tableId: '',
	titleRow: null,
	typeDetect: true,
	unique: '',
	wasFiltered: false,
	wasOrdered: false,
	windowResizeCb: () => {}
};

/**
 * Create a new context object
 *
 * @param parts Values to assign, otherwise the defaults will be used
 * @returns New object
 */
export default function create(parts: Partial<Context> = {}): Context {
	return util.object.assignDeep({}, defaults, parts);
}
