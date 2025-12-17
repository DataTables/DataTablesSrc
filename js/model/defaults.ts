import classes from '../ext/classes';
import columnDefaults, {
	Defaults as ColumnDefaults,
	ConfigColumnDefs
} from './columns/defaults';
import {
	ConfigRenderer,
	FunctionAjax,
	FunctionCreateRow,
	FunctionDrawCallback,
	FunctionFooterCallback,
	FunctionFormatNumber,
	FunctionHeaderCallback,
	FunctionInfoCallback,
	FunctionInitComplete,
	FunctionPreDrawCallback,
	FunctionRowCallback,
	FunctionStateLoadCallback,
	FunctionStateLoaded,
	FunctionStateLoadParams,
	FunctionStateSaveCallback,
	FunctionStateSaveParams,
	Layout,
	Order
} from './interface';
import { defaults as searchDefaults, SearchOptions } from './search';
import { Context, DtAjaxOptions } from './settings';

export interface Defaults {
	/**
	 * Load data for the table's content from an Ajax source.
	 */
	ajax: null | string | DtAjaxOptions | FunctionAjax;

	/**
	 * Feature control DataTables' smart column width handling.
	 */
	autoWidth: boolean;

	/**
	 * Set a `caption` for the table. This can be used to describe the contents
	 * of the table to the end user. A caption tag can also be read from HTML.
	 */
	caption: string;

	/**
	 * Defaults for column configuration options
	 */
	column: ColumnDefaults;

	/**
	 * Data to use as the display data for the table.
	 */
	columns: ColumnDefaults[] | null;

	/**
	 * Assign a column definition to one or more columns.
	 */
	columnDefs: ConfigColumnDefs[] | null;

	/**
	 * Data to use as the display data for the table.
	 */
	data: any[] | null;

	/**
	 * Delay the loading of server-side data until second draw
	 */
	deferLoading: number | number[] | null;

	/**
	 * Feature control deferred rendering for additional speed of
	 * initialisation.
	 */
	deferRender: boolean;

	/**
	 * Destroy any existing table matching the selector and replace with the new
	 * options.
	 */
	destroy: boolean;

	/**
	 * Initial paging start point.
	 */
	displayStart: number;

	/**
	 * Define the table control elements to appear on the page and in what order.
	 *
	 * @deprecated Use `layout` instead
	 */
	dom: string | null;

	/**
	 * Feature control table information display field.
	 *
	 * @deprecated Use the `paging` feature options
	 */
	info: boolean;

	/**
	 * Language configuration object
	 */
	language: ConfigLanguage;

	/**
	 * Table and control layout. This replaces the legacy `dom` option.
	 */
	layout: Layout;

	/**
	 * Feature control the end user's ability to change the paging display
	 * length of the table.
	 *
	 * @deprecated Use the `pageLength` feature options
	 */
	lengthChange: boolean;

	/**
	 * Change the options in the page length select list.
	 */
	lengthMenu:
		| Array<number | { label: string; value: number }>
		| [number[], string[]];

	/**
	 * Add event listeners during the DataTables startup
	 */
	on: {
		[name: string]: (this: HTMLElement, e: Event, ...args: any[]) => void;
	};

	/**
	 * Control which cell the order event handler will be applied to in a
	 * column.
	 *
	 * @deprecated Use titleRow
	 */
	orderCellsTop: boolean | null;

	/**
	 * Highlight the columns being ordered in the table's body.
	 */
	orderClasses: boolean;

	/**
	 * Reverse the initial data order when `desc` ordering
	 */
	orderDescReverse: boolean;

	/**
	 * Initial order (sort) to apply to the table.
	 */
	order: Order | Order[];

	/**
	 * Ordering to always be applied to the table.
	 */
	orderFixed:
		| Order
		| Order[]
		| {
				pre: Order | Order[];
				post: Order | Order[];
		  };

	/**
	 * Feature control ordering (sorting) abilities in DataTables.
	 */
	ordering:
		| boolean
		| {
				/**
				 * Control the showing of the ordering icons in the table
				 * header.
				 */
				indicators: boolean;

				/**
				 * Control the addition of a click event handler on the table
				 * headers to activate ordering.
				 */
				handler: boolean;
		  };

	/**
	 * Multiple column ordering ability control.
	 */
	orderMulti: boolean;

	/**
	 * Change the initial page length (number of rows per page).
	 */
	pageLength: number;

	/**
	 * Enable or disable table pagination.
	 */
	paging: boolean;

	/**
	 * Pagination button display options.
	 *
	 * @deprecated Use the `paging` feature options
	 */
	pagingType: string;

	/**
	 * Feature control the processing indicator.
	 */
	processing: boolean;

	/**
	 * Display component renderer types.
	 */
	renderer: null | string | ConfigRenderer;

	/**
	 * Retrieve an existing DataTables instance.
	 */
	retrieve: boolean;

	/**
	 * Data property name that DataTables will use to set <tr> element DOM IDs.
	 */
	rowId: string;

	/**
	 * Allow the table to reduce in height when a limited number of rows are
	 * shown.
	 */
	scrollCollapse: boolean;

	/**
	 * Horizontal scrolling.
	 */
	scrollX: boolean;

	/**
	 * Vertical scrolling.
	 */
	scrollY: string | false;

	/**
	 * Set an initial filter in DataTables and / or filtering options.
	 */
	search: Partial<SearchOptions> | boolean;

	/**
	 * Define an initial search for individual columns.
	 */
	searchCols: Partial<SearchOptions>[];

	/**
	 * Set a throttle frequency for searching.
	 */
	searchDelay: number;

	/**
	 * Feature control search (filtering) abilities
	 */
	searching: boolean;

	/**
	 * Set the HTTP method that is used to make the Ajax call for server-side
	 * processing or Ajax sourced data.
	 *
	 * @deprecated The functionality provided by this parameter has now been
	 * superseded by that provided through `ajax`, which should be used instead.
	 */
	serverMethod: string;

	/**
	 * Feature control DataTables' server-side processing mode.
	 */
	serverSide: boolean;

	/**
	 * Saved state validity duration.
	 */
	stateDuration: number;

	/**
	 * State saving - restore table state on page reload.
	 */
	stateSave: boolean;

	/**
	 * Tab index control for keyboard navigation.
	 */
	tabIndex: number;

	/**
	 * Callback for whenever a TR element is created for the table's body.
	 */
	createdRow: FunctionCreateRow | null;

	/**
	 * Function that is called every time DataTables performs a draw.
	 *
	 * @deprecated Use `on.draw` or `draw` event
	 */
	drawCallback: FunctionDrawCallback | null;

	/**
	 * Footer display callback function.
	 */
	footerCallback: FunctionFooterCallback | null;

	/**
	 * Number formatting callback function.
	 */
	formatNumber: FunctionFormatNumber | null;

	/**
	 * Header display callback function.
	 */
	headerCallback: FunctionHeaderCallback | null;

	/**
	 * Table summary information display callback.
	 *
	 * @deprecated Use the `callback` option for the `info` feature
	 */
	infoCallback: FunctionInfoCallback | null;

	/**
	 * Initialisation complete callback.
	 *
	 * @deprecated Use `init` event
	 */
	initComplete: FunctionInitComplete | null;

	/**
	 * Pre-draw callback.
	 */
	preDrawCallback: FunctionPreDrawCallback | null;

	/**
	 * Row draw callback.
	 */
	rowCallback: FunctionRowCallback | null;

	/**
	 * Callback that defines where and how a saved state should be loaded.
	 */
	stateLoadCallback: FunctionStateLoadCallback | null;

	/**
	 * State loaded callback.
	 *
	 * @deprecated Use `stateLoaded` event
	 */
	stateLoaded: FunctionStateLoaded | null;

	/**
	 * State loaded - data manipulation callback.
	 *
	 * @deprecated Use `stateLoadParams` event
	 */
	stateLoadParams: FunctionStateLoadParams | null;

	/**
	 * Callback that defines how the table state is stored and where.
	 */
	stateSaveCallback: FunctionStateSaveCallback | null;

	/**
	 * State save - data manipulation callback.
	 *
	 * @deprecated Use `stateSaveParams` event
	 */
	stateSaveParams: FunctionStateSaveParams | null;

	/**
	 * Classes that DataTables assigns to the various components and features
	 * that it adds to the HTML table. See also `DataTable.ext.classes`.
	 */
	classes: Partial<typeof classes>;

	/** Specify which row is the title row in the header. */
	titleRow: null | number | boolean;
}

type LanguageOption =
	| string
	| {
			[key: string | number]: LanguageOption;
	  };

export interface ConfigLanguage {
	// External options can be added and used through `i18n()`
	[key: string]: LanguageOption;

	/**
	 * Table has no records string.
	 */
	emptyTable: string;

	/**
	 * Replacement pluralisation for table data type.
	 */
	entries: LanguageOption;

	/**
	 * Table summary information display string.
	 */
	info: string;

	/**
	 * Table summary information string used when the table is empty of records.
	 */
	infoEmpty: string;

	/**
	 * Appended string to the summary information when the table is filtered.
	 */
	infoFiltered: string;

	/**
	 * String to append to all other summary information strings.
	 */
	infoPostFix: string;

	/**
	 * Decimal place character.
	 */
	decimal: string;

	/**
	 * Thousands separator.
	 */
	thousands: string;

	/**
	 * Page length options
	 */
	lengthLabels: { [key: string | number]: string };

	/**
	 * Page length options string.
	 */
	lengthMenu: string;

	/**
	 * Loading information display string - shown when Ajax loading data.
	 */
	loadingRecords: string;

	/**
	 * Processing indicator string.
	 */
	processing: string;

	/**
	 * Search input label
	 */
	search: string;

	/**
	 * Assign a `placeholder` attribute to the search `input` element
	 */
	searchPlaceholder: string;

	/**
	 * Table empty as a result of filtering string.
	 */
	zeroRecords: string;

	/** Pagination parameters */
	paginate: {
		/**
		 * Label and character for first page button («)
		 */
		first: string;

		/**
		 * Last page button (»)
		 */
		last: string;

		/**
		 * Next page button (›)
		 */
		next: string;

		/**
		 * Previous page button (‹)
		 */
		previous: string;
	};

	/**
	 * Strings that are used for WAI-ARIA labels and controls only.
	 */
	aria: {
		/**
		 * Language string used for WAI-ARIA column orderable label.
		 */
		orderable: string;

		/**
		 * Language string used for WAI-ARIA column label to alter column's
		 * ordering.
		 */
		orderableReverse: string;

		/**
		 * Language string used for WAI-ARIA column label to alter column's
		 * ordering.
		 */
		orderableRemove: string;

		paginate: {
			/** WAI-ARIA label for the first pagination button. */
			first: string;

			/** WAI-ARIA label for the last pagination button. */
			last: string;

			/** WAI-ARIA label for the next pagination button. */
			next: string;

			/** WAI-ARIA label for the previous pagination button. */
			previous: string;

			/** WAI-ARIA label for the number pagination buttons. */
			number: string;
		};
	};

	/**
	 * URL from which to get a JSON language file
	 */
	url: string;
}

/**
 * Initialisation options that can be given to DataTables at initialisation
 * time.
 */
const defaults: Defaults = {
	data: null as any[] | null,
	order: [[0, 'asc']],
	orderFixed: [],
	ajax: null,
	lengthMenu: [10, 25, 50, 100],
	columns: null,
	columnDefs: null,
	searchCols: [],
	autoWidth: true,
	deferRender: true,
	destroy: false,
	searching: true,
	info: true,
	lengthChange: true,
	paging: true,
	processing: false,
	retrieve: false,
	scrollCollapse: false,
	serverSide: false,
	ordering: true,
	orderMulti: true,
	orderCellsTop: null,
	column: columnDefaults,
	titleRow: null,
	orderClasses: true,
	stateSave: false,
	createdRow: null,
	drawCallback: null,
	footerCallback: null,
	formatNumber: function (toFormat: number, ctx: Context) {
		return toFormat
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ctx.language.thousands);
	},
	headerCallback: null,
	infoCallback: null,
	initComplete: null,
	preDrawCallback: null,
	rowCallback: null,
	stateLoadCallback: function (settings: Context) {
		try {
			const state = (
				settings.stateDuration === -1 ? sessionStorage : localStorage
			).getItem('DataTables_' + settings.sInstance + '_' + location.pathname);

			return state ? JSON.parse(state) : {};
		} catch (e) {
			return {};
		}
	},
	stateLoadParams: null,
	stateLoaded: null,
	stateSaveCallback: function (settings: Context, data: any) {
		try {
			(settings.stateDuration === -1 ? sessionStorage : localStorage).setItem(
				'DataTables_' + settings.sInstance + '_' + location.pathname,
				JSON.stringify(data)
			);
		} catch (e) {
			// noop
		}
	},
	stateSaveParams: null,
	stateDuration: 7200,
	pageLength: 10,
	displayStart: 0,
	tabIndex: 0,
	classes: {},
	language: {
		aria: {
			orderable: ': Activate to sort',

			orderableReverse: ': Activate to invert sorting',

			orderableRemove: ': Activate to remove sorting',

			paginate: {
				first: 'First',
				last: 'Last',
				next: 'Next',
				previous: 'Previous',
				number: ''
			}
		},
		paginate: {
			first: '\u00AB',
			last: '\u00BB',
			next: '\u203A',

			previous: '\u2039'
		},

		entries: {
			_: 'entries',
			1: 'entry'
		},

		lengthLabels: {
			'-1': 'All'
		},
		emptyTable: 'No data available in table',
		info: 'Showing _START_ to _END_ of _TOTAL_ _ENTRIES-TOTAL_',
		infoEmpty: 'Showing 0 to 0 of 0 _ENTRIES-TOTAL_',
		infoFiltered: '(filtered from _MAX_ total _ENTRIES-MAX_)',
		infoPostFix: '',
		decimal: '',
		thousands: ',',
		lengthMenu: '_MENU_ _ENTRIES_ per page',
		loadingRecords: 'Loading...',
		processing: '',
		search: 'Search:',
		searchPlaceholder: '',
		url: '',
		zeroRecords: 'No matching records found'
	},
	orderDescReverse: true,
	search: searchDefaults,
	layout: {
		topStart: 'pageLength',
		topEnd: 'search',
		bottomStart: 'info',
		bottomEnd: 'paging'
	},
	dom: null,
	searchDelay: 0,
	pagingType: '',
	scrollX: false,
	scrollY: false,
	serverMethod: 'GET',
	renderer: null,
	rowId: 'DT_RowId',
	caption: '',
	deferLoading: null,
	on: {}
};

export default defaults;

export type Options = Partial<Defaults>;
