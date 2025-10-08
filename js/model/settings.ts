
import {dataSource} from '../core/support';
import ColumnSettings from './columns/settings';
import Row from './row';
import Search from './search';

interface IScroll {
	/**
	 * When the table is shorter in height than sScrollY, collapse the
	 * table container down to the height of the table (when true).
	 * Note that this parameter will be set by the initialisation routine.
	 */
	bCollapse: boolean | null;

	/**
	 * Width of the scrollbar for the web-browser's platform. Calculated
	 * during table initialisation.
	 */
	iBarWidth: number;

	/**
	 * Viewport width for horizontal scrolling. Horizontal scrolling is
	 * disabled if an empty string.
	 * Note that this parameter will be set by the initialisation routine.
	 */
	sX: string;

	/**
	 * Width to expand the table to when using x-scrolling. Typically you
	 * should not need to use this.
	 * Note that this parameter will be set by the initialisation routine.
	 *  @deprecated
	 */
	sXInner: string;

	/**
	 * Viewport height for vertical scrolling. Vertical scrolling is disabled
	 * if an empty string.
	 * Note that this parameter will be set by the initialisation routine.
	 */
	sY: string;
}

/**
 * DataTables settings class. This holds all the information needed for a
 * given table, including configuration and data. Devs do not interact with
 * this class directly and it is considered to be private - its properties
 * are NOT a public API. The `DataTable` or `DataTable.Api` instances are to
 * be used instead.
 */
export default class Settings {
	public api: any; // TODO
	public renderer: any; // TODO

	public oFeatures = {
		/**
		 * Flag to say if DataTables should automatically try to calculate the
		 * optimum table and columns widths (true) or not (false).
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bAutoWidth: null,

		/**
		 * Delay the creation of TR and TD elements until they are actually
		 * needed by a driven page draw. This can give a significant speed
		 * increase for Ajax source and JavaScript source data, but makes no
		 * difference at all for DOM and server-side processing tables.
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bDeferRender: null,

		/**
		 * Enable filtering on the table or not. Note that if this is disabled
		 * then there is no filtering at all on the table, including fnFilter.
		 * To just remove the filtering input use sDom and remove the 'f' option.
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bFilter: null,

		/**
		 * Used only for compatibility with DT1
		 * @deprecated
		 */
		bInfo: true,

		/**
		 * Used only for compatibility with DT1
		 * @deprecated
		 */
		bLengthChange: true,

		/**
		 * Pagination enabled or not. Note that if this is disabled then length
		 * changing must also be disabled.
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bPaginate: null,

		/**
		 * Processing indicator enable flag whenever DataTables is enacting a
		 * user request - typically an Ajax request for server-side processing.
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bProcessing: null,

		/**
		 * Server-side processing enabled flag - when enabled DataTables will
		 * get all data from the server for every draw - there is no filtering,
		 * sorting or paging done on the client-side.
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bServerSide: null,

		/**
		 * Sorting enablement flag.
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bSort: null,

		/**
		 * Multi-column sorting
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bSortMulti: null,

		/**
		 * Apply a class to the columns which are being sorted to provide a
		 * visual highlight or not. This can slow things down when enabled since
		 * there is a lot of DOM interaction.
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bSortClasses: null,

		/**
		 * State saving enablement flag.
		 * Note that this parameter will be set by the initialisation routine.
		 */
		bStateSave: null
	};

	/**
	 * Scrolling settings for a table.
	 */
	public oScroll: IScroll = {
		bCollapse: null,
		iBarWidth: 0,
		sX: '',
		sXInner: '',
		sY: ''
	};

	/**
	 * Language information for the table.
	 */
	public oLanguage = {
		/**
		 * Information callback function. See
		 * {@link DataTable.defaults.fnInfoCallback}
		 */
		fnInfoCallback: null
	};

	/**
	 * Browser support parameters
	 */
	public oBrowser = {
		/**
		 * Determine if the vertical scrollbar is on the right or left of the
		 * scrolling container - needed for rtl language layout, although not
		 * all browsers move the scrollbar (Safari).
		 */
		bScrollbarLeft: false,

		/**
		 * Browser scrollbar width
		 */
		barWidth: 0
	};

	public ajax;

	/**
	 * Array referencing the nodes which are used for the features. The
	 * parameters of this object match what is allowed by sDom - i.e.
	 *   <ul>
	 *     <li>'l' - Length changing</li>
	 *     <li>'f' - Filtering input</li>
	 *     <li>'t' - The table!</li>
	 *     <li>'i' - Information</li>
	 *     <li>'p' - Pagination</li>
	 *     <li>'r' - pRocessing</li>
	 *   </ul>
	 */
	public aanFeatures = [];

	/**
	 * Store data information - see {@link DataTable.models.oRow} for detailed
	 * information.
	 */
	public aoData: Row[] = [];

	/**
	 * Array of indexes which are in the current display (after filtering etc)
	 */
	public aiDisplay: number[] = [];

	/**
	 * Array of indexes for display - no filtering
	 */
	public aiDisplayMaster: number[] = [];

	/**
	 * Map of row ids to data indexes
	 */
	public aIds = {};

	/**
	 * Store information about each column that is in use
	 */
	public aoColumns: ColumnSettings[] = [];

	/**
	 * Store information about the table's header
	 */
	public aoHeader = [];

	/**
	 * Store information about the table's footer
	 */
	public aoFooter = [];

	/**
	 * Store the applied global search information in case we want to force a
	 * research or compare the old search to a new one.
	 * Note that this parameter will be set by the initialisation routine.
	 */
	public oPreviousSearch = {};

	/**
	 * Store for named searches
	 */
	public searchFixed = {};

	/**
	 * Store the applied search for each column - see
	 * {@link DataTable.models.oSearch} for the format that is used for the
	 * filtering information for each column.
	 */
	public aoPreSearchCols: typeof Search[] = [];

	/**
	 * Sorting that is applied to the table. Note that the inner arrays are
	 * used in the following manner:
	 * <ul>
	 *   <li>Index 0 - column number</li>
	 *   <li>Index 1 - current sorting direction</li>
	 * </ul>
	 * Note that this parameter will be set by the initialisation routine.
	 */
	public aaSorting;

	/**
	 * Sorting that is always applied to the table (i.e. prefixed in front of
	 * aaSorting).
	 * Note that this parameter will be set by the initialisation routine.
	 */
	public aaSortingFixed = [];

	/**
	 * If restoring a table - we should restore its width
	 */
	public sDestroyWidth = 0;

	/**
	 * Callback functions array for every time a row is inserted (i.e. on a draw).
	 */
	public aoRowCallback: Function[] = [];

	/**
	 * Callback functions for the header on each draw.
	 */
	public aoHeaderCallback: Function[] = [];

	/**
	 * Callback function for the footer on each draw.
	 */
	public aoFooterCallback: Function[] = [];

	/**
	 * Array of callback functions for draw callback functions
	 */
	public aoDrawCallback: Function[] = [];

	/**
	 * Array of callback functions for row created function
	 */
	public aoRowCreatedCallback: Function[] = [];

	/**
	 * Callback functions for just before the table is redrawn. A return of
	 * false will be used to cancel the draw.
	 */
	public aoPreDrawCallback: Function[] = [];

	/**
	 * Callback functions for when the table has been initialised.
	 */
	public aoInitComplete = [];

	/**
	 * Callbacks for modifying the settings to be stored for state saving, prior to
	 * saving state.
	 */
	public aoStateSaveParams = [];

	/**
	 * Callbacks for modifying the settings that have been stored for state saving
	 * prior to using the stored values to restore the state.
	 */
	public aoStateLoadParams = [];

	/**
	 * Callbacks for operating on the settings object once the saved state has been
	 * loaded
	 */
	public aoStateLoaded = [];

	/**
	 * Cache the table ID for quick access
	 */
	public sTableId = '';

	/**
	 * The TABLE node for the main table
	 */
	public nTable;

	/**
	 * Permanent ref to the thead element
	 */
	public nTHead;

	/**
	 * Permanent ref to the tfoot element - if it exists
	 */
	public nTFoot;

	/**
	 * Permanent ref to the tbody element
	 */
	public nTBody;

	/**
	 * Cache the wrapper node (contains all DataTables controlled elements)
	 */
	public nTableWrapper;

	/**
	 * Indicate if all required information has been read in
	 */
	public bInitialised = false;

	/**
	 * Information about open rows. Each object in the array has the parameters
	 * 'nTr' and 'nParent'
	 */
	public aoOpenRows = [];

	/**
	 * Dictate the positioning of DataTables' control elements - see
	 * {@link DataTable.model.oInit.sDom}.
	 * Note that this parameter will be set by the initialisation routine.
	 */
	public sDom = null;

	/**
	 * Search delay (in mS)
	 */
	public searchDelay = null;

	/**
	 * Which type of pagination should be used.
	 * Note that this parameter will be set by the initialisation routine.
	 *
	 * @deprecated
	 */
	public sPaginationType = 'two_button';

	/**
	 * Number of paging controls on the page. Only used for backwards compatibility
	 *
	 * @deprecated
	 */
	public pagingControls = 0;

	/**
	 * The state duration (for `stateSave`) in seconds.
	 * Note that this parameter will be set by the initialisation routine.
	 */
	public iStateDuration = 0;

	/**
	 * Array of callback functions for state saving. Each array element is an
	 * object with the following parameters:
	 *   <ul>
	 *     <li>function:fn - function to call. Takes two parameters, oSettings
	 *       and the JSON string to save that has been thus far created. Returns
	 *       a JSON string to be inserted into a json object
	 *       (i.e. '"param": [ 0, 1, 2]')</li>
	 *     <li>string:sName - name of callback</li>
	 *   </ul>
	 */
	public aoStateSave = [];

	/**
	 * Array of callback functions for state loading. Each array element is an
	 * object with the following parameters:
	 *   <ul>
	 *     <li>function:fn - function to call. Takes two parameters, oSettings
	 *       and the object stored. May return false to cancel state loading</li>
	 *     <li>string:sName - name of callback</li>
	 *   </ul>
	 */
	public aoStateLoad = [];

	/**
	 * State that was saved. Useful for back reference
	 */
	public oSavedState;

	/**
	 * State that was loaded. Useful for back reference
	 */
	public oLoadedState = null;

	/**
	 * Note if draw should be blocked while getting data
	 */
	public bAjaxDataGet = true;

	/**
	 * The last jQuery XHR object that was used for server-side data gathering.
	 * This can be used for working with the XHR information in one of the
	 * callbacks
	 */
	public jqXHR: JQueryXHR;

	/**
	 * JSON returned from the server in the last Ajax request
	 */
	public json = undefined;

	/**
	 * Data submitted as part of the last Ajax request
	 */
	public oAjaxData = undefined;

	/**
	 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
	 * required).
	 * Note that this parameter will be set by the initialisation routine.
	 */
	public sServerMethod = null;

	/**
	 * Format numbers for display.
	 * Note that this parameter will be set by the initialisation routine.
	 */
	public fnFormatNumber;

	/**
	 * List of options that can be used for the user selectable length menu.
	 * Note that this parameter will be set by the initialisation routine.
	 */
	public aLengthMenu = null;

	/**
	 * Counter for the draws that the table does. Also used as a tracker for
	 * server-side processing
	 */
	public iDraw = 0;

	/**
	 * Indicate if a redraw is being done - useful for Ajax
	 */
	public bDrawing = false;

	/**
	 * Draw index (iDraw) of the last error when parsing the returned data
	 */
	public iDrawError = -1;

	/**
	 * Paging display length
	 */
	public _iDisplayLength = 10;

	/**
	 * Paging start point - aiDisplay index
	 */
	public _iDisplayStart = 0;

	/**
	 * Server-side processing - number of records in the result set
	 * (i.e. before filtering), Use fnRecordsTotal rather than
	 * this property to get the value of the number of records, regardless of
	 * the server-side processing setting.
	 */
	public _iRecordsTotal = 0;

	/**
	 * Server-side processing - number of records in the current display set
	 * (i.e. after filtering). Use fnRecordsDisplay rather than
	 * this property to get the value of the number of records, regardless of
	 * the server-side processing setting.
	 */
	public _iRecordsDisplay = 0;

	/**
	 * The classes to use for the table
	 */
	public oClasses: any = {};

	/**
	 * Flag attached to the settings object so you can check in the draw
	 * callback if filtering has been done in the draw. Deprecated in favour of
	 * events.
	 *  @deprecated
	 */
	public bFiltered = false;

	/**
	 * Flag attached to the settings object so you can check in the draw
	 * callback if sorting has been done in the draw. Deprecated in favour of
	 * events.
	 *  @deprecated
	 */
	public bSorted = false;

	/**
	 * Indicate that if multiple rows are in the header and there is more than
	 * one unique cell per column. Replaced by titleRow
	 */
	public bSortCellsTop = null;

	/**
	 * Initialisation object that is used for the table
	 */
	public oInit = null;

	/**
	 * Destroy callback functions - for plug-ins to attach themselves to the
	 * destroy so they can clean up markup and events.
	 */
	public aoDestroyCallback: Function[] = [];

	/**
	 * Get the number of records in the current record set, before filtering
	 */
	public fnRecordsTotal() {
		return dataSource( this ) == 'ssp' ?
			this._iRecordsTotal * 1 :
			this.aiDisplayMaster.length;
	}

	/**
	 * Get the number of records in the current record set, after filtering
	 */
	public fnRecordsDisplay() {
		return dataSource( this ) == 'ssp' ?
			this._iRecordsDisplay * 1 :
			this.aiDisplay.length;
	}

	/**
	 * Get the display end point - aiDisplay index
	 */
	public fnDisplayEnd() {
		var len = this._iDisplayLength,
			start = this._iDisplayStart,
			calc = start + len,
			records = this.aiDisplay.length,
			features = this.oFeatures,
			paginate = features.bPaginate;

		if (features.bServerSide) {
			return paginate === false || len === -1
				? start + records
				: Math.min(start + len, this._iRecordsDisplay);
		}
		else {
			return !paginate || calc > records || len === -1 ? records : calc;
		}
	}

	/**
	 * The DataTables object for this table
	 */
	public oInstance = null;

	/**
	 * Unique identifier for each instance of the DataTables object. If there
	 * is an ID on the table node, then it takes that value, otherwise an
	 * incrementing internal counter is used.
	 */
	public sInstance = '';

	/**
	 * tabindex attribute value that is added to DataTables control elements, allowing
	 * keyboard navigation of the table and its controls.
	 */
	public iTabIndex = 0;

	/**
	 * DIV container for the footer scrolling table if scrolling
	 */
	public nScrollHead;

	/**
	 * DIV container for the body scrolling table if scrolling
	 */
	public nScrollBody;

	/**
	 * DIV container for the footer scrolling table if scrolling
	 */
	public nScrollFoot;

	/**
	 * Last applied sort
	 */
	public aLastSort: any[] = [];

	/**
	 * Stored plug-in instances
	 */
	public oPlugins = {};

	/**
	 * Function used to get a row's id from the row's data
	 */
	public rowIdFn;

	/**
	 * Data location where to store a row's id
	 */
	public rowId = null;

	public caption = '';

	public captionNode;

	public colgroup: JQuery<HTMLElement>;

	/** Delay loading of data */
	public deferLoading = null;

	/** Allow auto type detection */
	public typeDetect = true;

	/** ResizeObserver for the container div */
	public resizeObserver: ResizeObserver;

	/** Keep a record of the last size of the container, so we can skip duplicates */
	public containerWidth = -1;

	/** Reverse the initial order of the data set on desc ordering */
	public orderDescReverse = null;

	/** Show / hide ordering indicators in headers */
	public orderIndicators = true;

	/** Default ordering listener */
	public orderHandler = true;

	/** Title row indicator */
	public titleRow = null;

	public _bLoadingState;

	public bDestroying = false;

	public fnStateSaveCallback;
	public fnStateLoadCallback;
	public _reszEvt: boolean;
	public iInitDisplayStart: number;
	public sortDetails;
	public scrollBarVis: boolean;
	public _drawHold: boolean;
	public _rowReadObject: boolean = false;
}
