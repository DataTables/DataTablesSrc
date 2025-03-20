

/**
 * DataTables settings object - this holds all the information needed for a
 * given table, including configuration, data and current application of the
 * table options. DataTables does not have a single instance for each DataTable
 * with the settings attached to that instance, but rather instances of the
 * DataTable "class" are created on-the-fly as needed (typically by a
 * $().dataTable() call) and the settings object is then applied to that
 * instance.
 *
 * Note that this object is related to {@link DataTable.defaults} but this
 * one is the internal data store for DataTables's cache of columns. It should
 * NOT be manipulated outside of DataTables. Any configuration should be done
 * through the initialisation options.
 */
DataTable.models.oSettings = {
	/**
	 * Primary features of DataTables and their enablement state.
	 */
	"oFeatures": {

		/**
		 * Flag to say if DataTables should automatically try to calculate the
		 * optimum table and columns widths (true) or not (false).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bAutoWidth": null,

		/**
		 * Delay the creation of TR and TD elements until they are actually
		 * needed by a driven page draw. This can give a significant speed
		 * increase for Ajax source and JavaScript source data, but makes no
		 * difference at all for DOM and server-side processing tables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bDeferRender": null,

		/**
		 * Enable filtering on the table or not. Note that if this is disabled
		 * then there is no filtering at all on the table, including fnFilter.
		 * To just remove the filtering input use sDom and remove the 'f' option.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bFilter": null,

		/**
		 * Used only for compatibility with DT1
		 * @deprecated
		 */
		"bInfo": true,

		/**
		 * Used only for compatibility with DT1
		 * @deprecated
		 */
		"bLengthChange": true,

		/**
		 * Pagination enabled or not. Note that if this is disabled then length
		 * changing must also be disabled.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bPaginate": null,

		/**
		 * Processing indicator enable flag whenever DataTables is enacting a
		 * user request - typically an Ajax request for server-side processing.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bProcessing": null,

		/**
		 * Server-side processing enabled flag - when enabled DataTables will
		 * get all data from the server for every draw - there is no filtering,
		 * sorting or paging done on the client-side.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bServerSide": null,

		/**
		 * Sorting enablement flag.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bSort": null,

		/**
		 * Multi-column sorting
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bSortMulti": null,

		/**
		 * Apply a class to the columns which are being sorted to provide a
		 * visual highlight or not. This can slow things down when enabled since
		 * there is a lot of DOM interaction.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bSortClasses": null,

		/**
		 * State saving enablement flag.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bStateSave": null
	},


	/**
	 * Scrolling settings for a table.
	 */
	"oScroll": {
		/**
		 * When the table is shorter in height than sScrollY, collapse the
		 * table container down to the height of the table (when true).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"bCollapse": null,

		/**
		 * Width of the scrollbar for the web-browser's platform. Calculated
		 * during table initialisation.
		 */
		"iBarWidth": 0,

		/**
		 * Viewport width for horizontal scrolling. Horizontal scrolling is
		 * disabled if an empty string.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"sX": null,

		/**
		 * Width to expand the table to when using x-scrolling. Typically you
		 * should not need to use this.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @deprecated
		 */
		"sXInner": null,

		/**
		 * Viewport height for vertical scrolling. Vertical scrolling is disabled
		 * if an empty string.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 */
		"sY": null
	},

	/**
	 * Language information for the table.
	 */
	"oLanguage": {
		/**
		 * Information callback function. See
		 * {@link DataTable.defaults.fnInfoCallback}
		 */
		"fnInfoCallback": null
	},

	/**
	 * Browser support parameters
	 */
	"oBrowser": {
		/**
		 * Determine if the vertical scrollbar is on the right or left of the
		 * scrolling container - needed for rtl language layout, although not
		 * all browsers move the scrollbar (Safari).
		 */
		"bScrollbarLeft": false,

		/**
		 * Browser scrollbar width
		 */
		"barWidth": 0
	},


	"ajax": null,


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
	"aanFeatures": [],

	/**
	 * Store data information - see {@link DataTable.models.oRow} for detailed
	 * information.
	 */
	"aoData": [],

	/**
	 * Array of indexes which are in the current display (after filtering etc)
	 */
	"aiDisplay": [],

	/**
	 * Array of indexes for display - no filtering
	 */
	"aiDisplayMaster": [],

	/**
	 * Map of row ids to data indexes
	 */
	"aIds": {},

	/**
	 * Store information about each column that is in use
	 */
	"aoColumns": [],

	/**
	 * Store information about the table's header
	 */
	"aoHeader": [],

	/**
	 * Store information about the table's footer
	 */
	"aoFooter": [],

	/**
	 * Store the applied global search information in case we want to force a
	 * research or compare the old search to a new one.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"oPreviousSearch": {},

	/**
	 * Store for named searches
	 */
	searchFixed: {},

	/**
	 * Store the applied search for each column - see
	 * {@link DataTable.models.oSearch} for the format that is used for the
	 * filtering information for each column.
	 */
	"aoPreSearchCols": [],

	/**
	 * Sorting that is applied to the table. Note that the inner arrays are
	 * used in the following manner:
	 * <ul>
	 *   <li>Index 0 - column number</li>
	 *   <li>Index 1 - current sorting direction</li>
	 * </ul>
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"aaSorting": null,

	/**
	 * Sorting that is always applied to the table (i.e. prefixed in front of
	 * aaSorting).
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"aaSortingFixed": [],

	/**
	 * If restoring a table - we should restore its width
	 */
	"sDestroyWidth": 0,

	/**
	 * Callback functions array for every time a row is inserted (i.e. on a draw).
	 */
	"aoRowCallback": [],

	/**
	 * Callback functions for the header on each draw.
	 */
	"aoHeaderCallback": [],

	/**
	 * Callback function for the footer on each draw.
	 */
	"aoFooterCallback": [],

	/**
	 * Array of callback functions for draw callback functions
	 */
	"aoDrawCallback": [],

	/**
	 * Array of callback functions for row created function
	 */
	"aoRowCreatedCallback": [],

	/**
	 * Callback functions for just before the table is redrawn. A return of
	 * false will be used to cancel the draw.
	 */
	"aoPreDrawCallback": [],

	/**
	 * Callback functions for when the table has been initialised.
	 */
	"aoInitComplete": [],


	/**
	 * Callbacks for modifying the settings to be stored for state saving, prior to
	 * saving state.
	 */
	"aoStateSaveParams": [],

	/**
	 * Callbacks for modifying the settings that have been stored for state saving
	 * prior to using the stored values to restore the state.
	 */
	"aoStateLoadParams": [],

	/**
	 * Callbacks for operating on the settings object once the saved state has been
	 * loaded
	 */
	"aoStateLoaded": [],

	/**
	 * Cache the table ID for quick access
	 */
	"sTableId": "",

	/**
	 * The TABLE node for the main table
	 */
	"nTable": null,

	/**
	 * Permanent ref to the thead element
	 */
	"nTHead": null,

	/**
	 * Permanent ref to the tfoot element - if it exists
	 */
	"nTFoot": null,

	/**
	 * Permanent ref to the tbody element
	 */
	"nTBody": null,

	/**
	 * Cache the wrapper node (contains all DataTables controlled elements)
	 */
	"nTableWrapper": null,

	/**
	 * Indicate if all required information has been read in
	 */
	"bInitialised": false,

	/**
	 * Information about open rows. Each object in the array has the parameters
	 * 'nTr' and 'nParent'
	 */
	"aoOpenRows": [],

	/**
	 * Dictate the positioning of DataTables' control elements - see
	 * {@link DataTable.model.oInit.sDom}.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"sDom": null,

	/**
	 * Search delay (in mS)
	 */
	"searchDelay": null,

	/**
	 * Which type of pagination should be used.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"sPaginationType": "two_button",

	/**
	 * Number of paging controls on the page. Only used for backwards compatibility
	 */
	pagingControls: 0,

	/**
	 * The state duration (for `stateSave`) in seconds.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"iStateDuration": 0,

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
	"aoStateSave": [],

	/**
	 * Array of callback functions for state loading. Each array element is an
	 * object with the following parameters:
	 *   <ul>
	 *     <li>function:fn - function to call. Takes two parameters, oSettings
	 *       and the object stored. May return false to cancel state loading</li>
	 *     <li>string:sName - name of callback</li>
	 *   </ul>
	 */
	"aoStateLoad": [],

	/**
	 * State that was saved. Useful for back reference
	 */
	"oSavedState": null,

	/**
	 * State that was loaded. Useful for back reference
	 */
	"oLoadedState": null,

	/**
	 * Note if draw should be blocked while getting data
	 */
	"bAjaxDataGet": true,

	/**
	 * The last jQuery XHR object that was used for server-side data gathering.
	 * This can be used for working with the XHR information in one of the
	 * callbacks
	 */
	"jqXHR": null,

	/**
	 * JSON returned from the server in the last Ajax request
	 */
	"json": undefined,

	/**
	 * Data submitted as part of the last Ajax request
	 */
	"oAjaxData": undefined,

	/**
	 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
	 * required).
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"sServerMethod": null,

	/**
	 * Format numbers for display.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"fnFormatNumber": null,

	/**
	 * List of options that can be used for the user selectable length menu.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"aLengthMenu": null,

	/**
	 * Counter for the draws that the table does. Also used as a tracker for
	 * server-side processing
	 */
	"iDraw": 0,

	/**
	 * Indicate if a redraw is being done - useful for Ajax
	 */
	"bDrawing": false,

	/**
	 * Draw index (iDraw) of the last error when parsing the returned data
	 */
	"iDrawError": -1,

	/**
	 * Paging display length
	 */
	"_iDisplayLength": 10,

	/**
	 * Paging start point - aiDisplay index
	 */
	"_iDisplayStart": 0,

	/**
	 * Server-side processing - number of records in the result set
	 * (i.e. before filtering), Use fnRecordsTotal rather than
	 * this property to get the value of the number of records, regardless of
	 * the server-side processing setting.
	 */
	"_iRecordsTotal": 0,

	/**
	 * Server-side processing - number of records in the current display set
	 * (i.e. after filtering). Use fnRecordsDisplay rather than
	 * this property to get the value of the number of records, regardless of
	 * the server-side processing setting.
	 */
	"_iRecordsDisplay": 0,

	/**
	 * The classes to use for the table
	 */
	"oClasses": {},

	/**
	 * Flag attached to the settings object so you can check in the draw
	 * callback if filtering has been done in the draw. Deprecated in favour of
	 * events.
	 *  @deprecated
	 */
	"bFiltered": false,

	/**
	 * Flag attached to the settings object so you can check in the draw
	 * callback if sorting has been done in the draw. Deprecated in favour of
	 * events.
	 *  @deprecated
	 */
	"bSorted": false,

	/**
	 * Indicate that if multiple rows are in the header and there is more than
	 * one unique cell per column, if the top one (true) or bottom one (false)
	 * should be used for sorting / title by DataTables.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 */
	"bSortCellsTop": null,

	/**
	 * Initialisation object that is used for the table
	 */
	"oInit": null,

	/**
	 * Destroy callback functions - for plug-ins to attach themselves to the
	 * destroy so they can clean up markup and events.
	 */
	"aoDestroyCallback": [],


	/**
	 * Get the number of records in the current record set, before filtering
	 */
	"fnRecordsTotal": function ()
	{
		return _fnDataSource( this ) == 'ssp' ?
			this._iRecordsTotal * 1 :
			this.aiDisplayMaster.length;
	},

	/**
	 * Get the number of records in the current record set, after filtering
	 */
	"fnRecordsDisplay": function ()
	{
		return _fnDataSource( this ) == 'ssp' ?
			this._iRecordsDisplay * 1 :
			this.aiDisplay.length;
	},

	/**
	 * Get the display end point - aiDisplay index
	 */
	"fnDisplayEnd": function ()
	{
		var
			len      = this._iDisplayLength,
			start    = this._iDisplayStart,
			calc     = start + len,
			records  = this.aiDisplay.length,
			features = this.oFeatures,
			paginate = features.bPaginate;

		if ( features.bServerSide ) {
			return paginate === false || len === -1 ?
				start + records :
				Math.min( start+len, this._iRecordsDisplay );
		}
		else {
			return ! paginate || calc>records || len===-1 ?
				records :
				calc;
		}
	},

	/**
	 * The DataTables object for this table
	 */
	"oInstance": null,

	/**
	 * Unique identifier for each instance of the DataTables object. If there
	 * is an ID on the table node, then it takes that value, otherwise an
	 * incrementing internal counter is used.
	 */
	"sInstance": null,

	/**
	 * tabindex attribute value that is added to DataTables control elements, allowing
	 * keyboard navigation of the table and its controls.
	 */
	"iTabIndex": 0,

	/**
	 * DIV container for the footer scrolling table if scrolling
	 */
	"nScrollHead": null,

	/**
	 * DIV container for the footer scrolling table if scrolling
	 */
	"nScrollFoot": null,

	/**
	 * Last applied sort
	 */
	"aLastSort": [],

	/**
	 * Stored plug-in instances
	 */
	"oPlugins": {},

	/**
	 * Function used to get a row's id from the row's data
	 */
	"rowIdFn": null,

	/**
	 * Data location where to store a row's id
	 */
	"rowId": null,

	caption: '',

	captionNode: null,

	colgroup: null,

	/** Delay loading of data */
	deferLoading: null,

	/** Allow auto type detection */
	typeDetect: true,

	/** ResizeObserver for the container div */
	resizeObserver: null,

	/** Keep a record of the last size of the container, so we can skip duplicates */
	containerWidth: -1
};
