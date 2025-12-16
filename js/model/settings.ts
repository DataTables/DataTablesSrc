import { Dom } from '../dom';
import util from '../util';
import { AjaxOptions, HttpMethod } from '../util/ajax';
import { GetFunction, JSON } from '../util/types';
import ColumnSettings from './columns/settings';
import { AjaxData, FunctionFormatNumber, FunctionInfoCallback, Layout, OrderState } from './interface';
import { Row } from './row';
import createSearch, { SearchInput, SearchOptions } from './search';
import { State, StateLoad } from './state';

// Todo - need to add `this` scope
type FunctionDrawCallback = (settings: Context) => void;

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
	 * Enable filtering on the table or not. Note that if this is disabled then
	 * there is no filtering at all on the table.
	 */
	searching: boolean;

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
	 * Server-side processing enabled flag - when enabled DataTables will
	 * get all data from the server for every draw - there is no filtering,
	 * sorting or paging done on the client-side.
	 */
	serverSide: boolean;

	/**
	 * Sorting enablement flag.
	 */
	ordering: boolean;

	/**
	 * Multi-column sorting
	 */
	orderMulti: boolean;

	/**
	 * Apply a class to the columns which are being sorted to provide a
	 * visual highlight or not. This can slow things down when enabled since
	 * there is a lot of DOM interaction.
	 */
	orderClasses: boolean;

	/**
	 * State saving enablement flag.
	 */
	stateSave: boolean;
};

/**
 * DataTables settings class. This holds all the information needed for a
 * given table, including configuration and data. Devs do not interact with
 * this class directly and it is considered to be private - its properties
 * are NOT a public API. The `DataTable` or `DataTable.Api` instances are to
 * be used instead.
 */
export interface Context {
	api: any; // TODO
	renderer: any; // TODO

	/** Feature enablement. */
	features: Features;

	/** Scrolling settings for a table. */
	scroll: IScroll;

	/** Language information for the table. */
	oLanguage: {
		infoCallback: null | FunctionInfoCallback,
		sInfoEmpty: string,
		sInfoPostFix: string,
		sInfoFiltered: string,
		sInfo: string,
		sLengthMenu: string,
		sSearch: string,
		sSearchPlaceholder: string,
		sProcessing: string,
		sZeroRecords: string,
		sLoadingRecords: string,
		sEmptyTable: string,
		sDecimal: string,
		sThousands: string,
		oAria: {
			orderable: string,
			orderableReverse: string,
			orderableRemove: string,
			paginate: {
				first: string,
				last: string,
				next: string,
				previous: string,
				number: string
			}
		},
		oPaginate: {
			sFirst: string,
			sLast: string,
			sNext: string,
			sPrevious: string
		},
		sUrl: string;
	};

	/**
	 * Browser support parameters
	 */
	oBrowser: {
		/**
		 * Determine if the vertical scrollbar is on the right or left of the
		 * scrolling container - needed for rtl language layout, although not
		 * all browsers move the scrollbar (Safari).
		 */
		bScrollbarLeft: boolean,

		/**
		 * Browser scrollbar width
		 */
		barWidth: number
	};

	ajax: null | string | DtAjaxOptions | AjaxFunction;

	/**
	 * Array referencing the nodes which are used for the features. The
	 * parameters of this object match what is allowed by `dom`. Legacy only.
	 */
	aanFeatures: any[]; // TODO

	/**
	 * Row data information
	 */
	aoData: (Row | null)[];

	/**
	 * Array of indexes which are in the current display (after filtering etc)
	 */
	aiDisplay: number[];

	/**
	 * Array of indexes for display - no filtering
	 */
	aiDisplayMaster: number[];

	/**
	 * Map of row ids to data indexes
	 */
	aIds: Record<string, Row>;

	/**
	 * Store information about each column that is in use
	 */
	columns: ColumnSettings[];

	/**
	 * Store information about the table's header
	 */
	aoHeader: HeaderStructure[];

	/**
	 * Store information about the table's footer
	 */
	aoFooter: HeaderStructure[];

	/**
	 * Store the applied global search information in case we want to force a
	 * research or compare the old search to a new one.
	 */
	previousSearch: SearchOptions;

	/**
	 * Store for named searches
	 */
	searchFixed: { [name: string]: SearchInput };

	/**
	 * Store the applied search for each column
	 */
	preSearchCols: SearchOptions[];

	/**
	 * Sorting that is applied to the table.
	 */
	order: OrderState[];

	/**
	 * Sorting that is always applied to the table (i.e. prefixed in front of
	 * aaSorting).
	 */
	orderFixed: any; // TODO

	/**
	 * If restoring a table - we should restore its width
	 */
	sDestroyWidth: number;

	/**
	 * Cache the table ID for quick access
	 */
	sTableId: string;

	/**
	 * The TABLE node for the main table
	 */
	nTable: HTMLElement;

	/**
	 * Permanent ref to the thead element
	 */
	nTHead: HTMLElement;

	/**
	 * Permanent ref to the tfoot element - if it exists
	 */
	nTFoot: HTMLElement;

	/**
	 * Permanent ref to the tbody element
	 */
	nTBody: HTMLElement;

	/**
	 * Cache the wrapper node (contains all DataTables controlled elements)
	 */
	nTableWrapper: Element;

	/**
	 * Indicate if all required information has been read in
	 */
	bInitialised: boolean;

	/**
	 * Dictate the positioning of DataTables' control elements
	 */
	dom: null | string;

	/**
	 * Search delay (in mS)
	 */
	searchDelay: number;

	/**
	 * Which type of pagination should be used.
	 *
	 * @deprecated
	 */
	pagingType: string;

	/**
	 * Number of paging controls on the page. Only used for backwards compatibility
	 *
	 * @deprecated
	 */
	pagingControls: number;

	/**
	 * The state duration (for `stateSave`) in seconds.
	 */
	stateDuration: number;

	/**
	 * Array of callback functions for state saving.
	 */
	aoStateSave: Function[];

	/**
	 * Array of callback functions for state loading.
	 */
	aoStateLoad: Function[];

	/**
	 * State that was saved. Useful for back reference
	 */
	oSavedState: State | null;

	/**
	 * State that was loaded. Useful for back reference
	 */
	oLoadedState: StateLoad | null;

	/**
	 * Note if draw should be blocked while getting data
	 */
	bAjaxDataGet: boolean;

	/**
	 * The last jQuery XHR object that was used for server-side data gathering.
	 * This can be used for working with the XHR information in one of the
	 * callbacks
	 */
	jqXHR: XMLHttpRequest;

	/**
	 * JSON returned from the server in the last Ajax request
	 */
	json: JSON;

	/**
	 * Data submitted as part of the last Ajax request
	 */
	oAjaxData: AjaxData | string;

	/**
	 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
	 * required).
	 * 
	 * @deprecated
	 */
	serverMethod: HttpMethod | null;

	/**
	 * Format numbers for display.
	 */
	formatNumber: FunctionFormatNumber;

	/**
	 * List of options that can be used for the user selectable length menu.
	 * 
	 * @deprecated
	 */
	lengthMenu: any[]; // TODO

	/**
	 * Counter for the draws that the table does. Also used as a tracker for
	 * server-side processing
	 */
	iDraw: number;

	/**
	 * Indicate if a redraw is being done - useful for Ajax
	 */
	bDrawing: boolean;

	/**
	 * Draw index (iDraw) of the last error when parsing the returned data
	 */
	iDrawError: number;

	/**
	 * Paging display length
	 */
	pageLength: number;

	/**
	 * Paging start point - aiDisplay index
	 */
	displayStart: number;

	/**
	 * Server-side processing - number of records in the result set
	 * (i.e. before filtering), Use recordsTotal to get the number independent
	 * of processing mode.
	 */
	recordsTotal: number;

	/**
	 * Server-side processing - number of records in the current display set
	 * (i.e. after filtering). Use recordsDisplay to get the number independent
	 * of processing mode.
	 */
	recordsDisplay: number;

	/**
	 * The classes to use for the table
	 */
	classes: any; // TODO

	/**
	 * Flag attached to the settings object so you can check in the draw
	 * callback if filtering has been done in the draw. Deprecated in favour of
	 * events.
	 *
	 * @deprecated
	 */
	bFiltered: boolean;

	/**
	 * Flag attached to the settings object so you can check in the draw
	 * callback if sorting has been done in the draw. Deprecated in favour of
	 * events.
	 *
	 * @deprecated
	 */
	bSorted: boolean;

	/**
	 * Indicate that if multiple rows are in the header and there is more than
	 * one unique cell per column.
	 * 
	 * @deprecated Replaced by titleRow
	 */
	sortCellsTop: null | boolean;

	/**
	 * Initialisation object that is used for the table
	 */
	oInit: any; // TODO defaults

	/**
	 * The DataTables object for this table
	 */
	oInstance: any; // TODO

	/**
	 * Unique identifier for each instance of the DataTables object. If there
	 * is an ID on the table node, then it takes that value, otherwise an
	 * incrementing internal counter is used.
	 */
	sInstance: string;

	/**
	 * tabindex attribute value that is added to DataTables control elements,
	 * allowing keyboard navigation of the table and its controls.
	 */
	tabIndex: number;

	/**
	 * DIV container for the footer scrolling table if scrolling
	 */
	nScrollHead: Dom;

	/**
	 * DIV container for the body scrolling table if scrolling
	 */
	nScrollBody: Dom;

	/**
	 * DIV container for the footer scrolling table if scrolling
	 */
	nScrollFoot: Dom;

	/**
	 * Last applied sort
	 */
	aLastSort: any[];

	/**
	 * Function used to get a row's id from the row's data
	 */
	rowIdFn: GetFunction;

	/**
	 * Data location where to store a row's id
	 */
	rowId: string;

	caption: string;

	captionNode: HTMLTableCaptionElement | null;

	colgroup: Dom;

	/** Delay loading of data */
	deferLoading: boolean;

	/** Allow auto type detection */
	typeDetect: boolean;

	/** ResizeObserver for the container div */
	resizeObserver: ResizeObserver | null;

	/** Keep a record of the last size of the container, so we can skip duplicates */
	containerWidth: number;

	/** Reverse the initial order of the data set on desc ordering */
	orderDescReverse: boolean;

	/** Show / hide ordering indicators in headers */
	orderIndicators: boolean;

	/** Default ordering listener */
	orderHandler: boolean;

	/** Title row indicator */
	titleRow: any; // TODO

	_bLoadingState: boolean;

	bDestroying: boolean;

	stateSaveCallback: (ctx: Context, data: any) => void;
	stateLoadCallback: (ctx: Context) => Partial<State>;
	_reszEvt: boolean;
	displayStartInit: number;
	sortDetails: ISortItem[];
	scrollBarVis: boolean;
	_drawHold: boolean | undefined;
	_rowReadObject: boolean;
	_infoEl: Dom;
	_bInitComplete: boolean;
	layout: Layout;

	/** Window resize handler for older browsers */
	windowResizeCb: () => void;

	fastData: (row: number, column: number, type: string) => any;

	callbacks: {
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 */
		row: Function[];

		/**
		 * Callback functions for the header on each draw.
		 */
		header: Function[];

		/**
		 * Callback function for the footer on each draw.
		 */
		footer: Function[];

		/**
		 * Array of callback functions for draw callback functions
		 */
		draw: FunctionDrawCallback[];

		/**
		 * Array of callback functions for row created function
		 */
		rowCreated: Function[];

		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 */
		preDraw: Function[];

		/**
		 * Callback functions for when the table has been initialised.
		 */
		init: Function[];

		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 */
		stateSaveParams: Function[];

		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 */
		stateLoadParams: Function[];

		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 */
		stateLoaded: Function[];

		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 */
		destroy: Function[];
	}
}


const defaults: Partial<Context> = {
	api: null,
	renderer: null,
	features: {
		autoWidth: false,
		deferRender: false,
		searching: false,
		info: false,
		lengthChange: false,
		paging: false,
		processing: false,
		serverSide: false,
		ordering: false,
		orderMulti: false,
		orderClasses: false,
		stateSave: false
	},
	scroll: {
		collapse: null,
		barWidth: 0,
		x: '',
		xInner: '',
		y: ''
	},
	oLanguage: {
		infoCallback: null,
		sInfoEmpty: '',
		sInfoPostFix: '',
		sInfoFiltered: '',
		sInfo: '',
		sLengthMenu: '',
		sSearch: '',
		sSearchPlaceholder: '',
		sProcessing: '',
		sZeroRecords: '',
		sLoadingRecords: '',
		sEmptyTable: '',
		sDecimal: '',
		sThousands: '',
		oAria: {
			orderable: '',
			orderableReverse: '',
			orderableRemove: '',
			paginate: {
				first: '',
				last: '',
				next: '',
				previous: '',
				number: ''
			}
		},
		oPaginate: {
			sFirst: '',
			sLast: '',
			sNext: '',
			sPrevious: ''
		},
		sUrl: ''
	},
	oBrowser: {
		bScrollbarLeft: false,
		barWidth: 0
	},
	ajax: null,
	aanFeatures: [],
	aoData: [],
	aiDisplay: [],
	aiDisplayMaster: [],
	aIds: {},
	columns: [],
	aoHeader: [],
	aoFooter: [],
	previousSearch: createSearch(),
	searchFixed: {},
	preSearchCols: [],
	order: [],
	orderFixed: [],
	sDestroyWidth: 0,
	sTableId: '',
	bInitialised: false,
	dom: null,
	searchDelay: 0,
	pagingType: 'two_button',
	pagingControls: 0,
	stateDuration: 0,
	aoStateSave: [],
	aoStateLoad: [],
	oSavedState: null,
	oLoadedState: null,
	bAjaxDataGet: false,
	serverMethod: null,
	iDraw: 0,
	bDrawing: false,
	iDrawError: -1,
	pageLength: 10,
	displayStart: 0,
	recordsTotal: 0,
	recordsDisplay: 0,
	classes: {},
	bFiltered: false,
	bSorted: false,
	sortCellsTop: null,
	oInit: {},
	oInstance: null,
	sInstance: '',
	tabIndex: 0,
	aLastSort: [],
	rowId: '',
	caption: '',
	captionNode: null,
	deferLoading: false,
	typeDetect: true,
	resizeObserver: null,
	containerWidth: -1,
	orderDescReverse: false,
	orderIndicators: true,
	orderHandler: true,
	titleRow: null,
	_bLoadingState: false,
	bDestroying: false,
	stateSaveCallback: () => {},
	stateLoadCallback: () => {return {};},
	_reszEvt: false,
	displayStartInit: -1,
	sortDetails: [],
	scrollBarVis: false,
	_drawHold: false,
	_rowReadObject: false,
	_bInitComplete: false,
	layout: {},
	windowResizeCb: () => {},
	callbacks: {
		row: [],
		header: [],
		footer: [],
		draw: [],
		rowCreated: [],
		preDraw: [],
		init: [],
		stateSaveParams: [],
		stateLoadParams: [],
		stateLoaded: [],
		destroy: []
	}
}


/**
 * Create a new context object
 *
 * @param parts Values to assign, otherwise the defaults will be used
 * @returns New object
 */
export default function create(parts: Partial<Context>={}): Context {
	return util.object.assignDeep({}, defaults, parts);
}

