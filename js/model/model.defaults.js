
/*
 * Developer note: The properties of the object below are given in Hungarian
 * notation, that was used as the interface for DataTables prior to v1.10, however
 * from v1.10 onwards the primary interface is camel case. In order to avoid
 * breaking backwards compatibility utterly with this change, the Hungarian
 * version is still, internally the primary interface, but is is not documented
 * - hence the @name tags in each doc comment. This allows a JavaScript function
 * to create a map from Hungarian notation to camel case (going the other direction
 * would require each property to be listed, which would add around 3K to the size
 * of DataTables, while this method is about a 0.5K hit).
 *
 * Ultimately this does pave the way for Hungarian notation to be dropped
 * completely, but that is a massive amount of work and will break current
 * installs (therefore is on-hold until v2).
 */

/**
 * Initialisation options that can be given to DataTables at initialisation
 * time.
 *  @namespace
 */
DataTable.defaults = {
	/**
	 * An array of data to use for the table, passed in at initialisation which
	 * will be used in preference to any data which is already in the DOM. This is
	 * particularly useful for constructing tables purely in JavaScript, for
	 * example with a custom Ajax call.
	 */
	"aaData": null,


	/**
	 * If ordering is enabled, then DataTables will perform a first pass sort on
	 * initialisation. You can define which column(s) the sort is performed
	 * upon, and the sorting direction, with this variable. The `sorting` array
	 * should contain an array for each column to be sorted initially containing
	 * the column's index and a direction string ('asc' or 'desc').
	 */
	"aaSorting": [[0,'asc']],


	/**
	 * This parameter is basically identical to the `sorting` parameter, but
	 * cannot be overridden by user interaction with the table. What this means
	 * is that you could have a column (visible or hidden) which the sorting
	 * will always be forced on first - any sorting after that (from the user)
	 * will then be performed as required. This can be useful for grouping rows
	 * together.
	 */
	"aaSortingFixed": [],


	/**
	 * DataTables can be instructed to load data to display in the table from a
	 * Ajax source. This option defines how that Ajax call is made and where to.
	 *
	 * The `ajax` property has three different modes of operation, depending on
	 * how it is defined. These are:
	 *
	 * * `string` - Set the URL from where the data should be loaded from.
	 * * `object` - Define properties for `jQuery.ajax`.
	 * * `function` - Custom data get function
	 *
	 * `string`
	 * --------
	 *
	 * As a string, the `ajax` property simply defines the URL from which
	 * DataTables will load data.
	 *
	 * `object`
	 * --------
	 *
	 * As an object, the parameters in the object are passed to
	 * [jQuery.ajax](https://api.jquery.com/jQuery.ajax/) allowing fine control
	 * of the Ajax request. DataTables has a number of default parameters which
	 * you can override using this option. Please refer to the jQuery
	 * documentation for a full description of the options available, although
	 * the following parameters provide additional options in DataTables or
	 * require special consideration:
	 *
	 * * `data` - As with jQuery, `data` can be provided as an object, but it
	 *   can also be used as a function to manipulate the data DataTables sends
	 *   to the server. The function takes a single parameter, an object of
	 *   parameters with the values that DataTables has readied for sending. An
	 *   object may be returned which will be merged into the DataTables
	 *   defaults, or you can add the items to the object that was passed in and
	 *   not return anything from the function. This supersedes `fnServerParams`
	 *   from DataTables 1.9-.
	 *
	 * * `dataSrc` - By default DataTables will look for the property `data` (or
	 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
	 *   from an Ajax source or for server-side processing - this parameter
	 *   allows that property to be changed. You can use JavaScript dotted
	 *   object notation to get a data source for multiple levels of nesting, or
	 *   it my be used as a function. As a function it takes a single parameter,
	 *   the JSON returned from the server, which can be manipulated as
	 *   required, with the returned value being that used by DataTables as the
	 *   data source for the table.
	 *
	 * * `success` - Should not be overridden it is used internally in
	 *   DataTables. To manipulate / transform the data returned by the server
	 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
	 *
	 * `function`
	 * ----------
	 *
	 * As a function, making the Ajax call is left up to yourself allowing
	 * complete control of the Ajax request. Indeed, if desired, a method other
	 * than Ajax could be used to obtain the required data, such as Web storage
	 * or an AIR database.
	 *
	 * The function is given four parameters and no return is required. The
	 * parameters are:
	 *
	 * 1. _object_ - Data to send to the server
	 * 2. _function_ - Callback function that must be executed when the required
	 *    data has been obtained. That data should be passed into the callback
	 *    as the only parameter
	 * 3. _object_ - DataTables settings object for the table
	 */
	"ajax": null,


	/**
	 * This parameter allows you to readily specify the entries in the length drop
	 * down menu that DataTables shows when pagination is enabled. It can be
	 * either a 1D array of options which will be used for both the displayed
	 * option and the value, or a 2D array which will use the array in the first
	 * position as the value, and the array in the second position as the
	 * displayed options (useful for language strings such as 'All').
	 *
	 * Note that the `pageLength` property will be automatically set to the
	 * first value given in this array, unless `pageLength` is also provided.
	 */
	"aLengthMenu": [ 10, 25, 50, 100 ],


	/**
	 * The `columns` option in the initialisation parameter allows you to define
	 * details about the way individual columns behave. For a full list of
	 * column options that can be set, please see
	 * {@link DataTable.defaults.column}. Note that if you use `columns` to
	 * define your columns, you must have an entry in the array for every single
	 * column that you have in your table (these can be null if you don't which
	 * to specify any options).
	 */
	"aoColumns": null,

	/**
	 * Very similar to `columns`, `columnDefs` allows you to target a specific
	 * column, multiple columns, or all columns, using the `targets` property of
	 * each object in the array. This allows great flexibility when creating
	 * tables, as the `columnDefs` arrays can be of any length, targeting the
	 * columns you specifically want. `columnDefs` may use any of the column
	 * options available: {@link DataTable.defaults.column}, but it _must_
	 * have `targets` defined in each object in the array. Values in the `targets`
	 * array may be:
	 *   <ul>
	 *     <li>a string - class name will be matched on the TH for the column</li>
	 *     <li>0 or a positive integer - column index counting from the left</li>
	 *     <li>a negative integer - column index counting from the right</li>
	 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
	 *   </ul>
	 */
	"aoColumnDefs": null,


	/**
	 * Basically the same as `search`, this parameter defines the individual column
	 * filtering state at initialisation time. The array must be of the same size
	 * as the number of columns, and each element be an object with the parameters
	 * `search` and `escapeRegex` (the latter is optional). 'null' is also
	 * accepted and the default will be used.
	 */
	"aoSearchCols": [],


	/**
	 * Enable or disable automatic column width calculation. This can be disabled
	 * as an optimisation (it takes some time to calculate the widths) if the
	 * tables widths are passed in using `columns`.
	 */
	"bAutoWidth": true,


	/**
	 * Deferred rendering can provide DataTables with a huge speed boost when you
	 * are using an Ajax or JS data source for the table. This option, when set to
	 * true, will cause DataTables to defer the creation of the table elements for
	 * each row until they are needed for a draw - saving a significant amount of
	 * time.
	 */
	"bDeferRender": true,


	/**
	 * Replace a DataTable which matches the given selector and replace it with
	 * one which has the properties of the new initialisation object passed. If no
	 * table matches the selector, then the new DataTable will be constructed as
	 * per normal.
	 */
	"bDestroy": false,


	/**
	 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
	 * that it allows the end user to input multiple words (space separated) and
	 * will match a row containing those words, even if not in the order that was
	 * specified (this allow matching across multiple columns). Note that if you
	 * wish to use filtering in DataTables this must remain 'true' - to remove the
	 * default filtering input box and retain filtering abilities, please use
	 * {@link DataTable.defaults.dom}.
	 */
	"bFilter": true,

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
	 * Enable or disable pagination.
	 */
	"bPaginate": true,


	/**
	 * Enable or disable the display of a 'processing' indicator when the table is
	 * being processed (e.g. a sort). This is particularly useful for tables with
	 * large amounts of data where it can take a noticeable amount of time to sort
	 * the entries.
	 */
	"bProcessing": false,


	/**
	 * Retrieve the DataTables object for the given selector. Note that if the
	 * table has already been initialised, this parameter will cause DataTables
	 * to simply return the object that has already been set up - it will not take
	 * account of any changes you might have made to the initialisation object
	 * passed to DataTables (setting this parameter to true is an acknowledgement
	 * that you understand this). `destroy` can be used to reinitialise a table if
	 * you need.
	 */
	"bRetrieve": false,


	/**
	 * When vertical (y) scrolling is enabled, DataTables will force the height of
	 * the table's viewport to the given height at all times (useful for layout).
	 * However, this can look odd when filtering data down to a small data set,
	 * and the footer is left "floating" further down. This parameter (when
	 * enabled) will cause DataTables to collapse the table's viewport down when
	 * the result set will fit within the given Y height.
	 */
	"bScrollCollapse": false,


	/**
	 * Configure DataTables to use server-side processing. Note that the
	 * `ajax` parameter must also be given in order to give DataTables a
	 * source to obtain the required data for each draw.
	 */
	"bServerSide": false,


	/**
	 * Enable or disable sorting of columns. Sorting of individual columns can be
	 * disabled by the `sortable` option for each column.
	 */
	"bSort": true,


	/**
	 * Enable or display DataTables' ability to sort multiple columns at the
	 * same time (activated by shift-click by the user).
	 */
	"bSortMulti": true,


	/**
	 * Allows control over whether DataTables should use the top (true) unique
	 * cell that is found for a single column, or the bottom (false - default).
	 * This is useful when using complex headers.
	 */
	"bSortCellsTop": null,


	/**
	 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
	 * `sorting\_3` to the columns which are currently being sorted on. This is
	 * presented as a feature switch as it can increase processing time (while
	 * classes are removed and added) so for large data sets you might want to
	 * turn this off.
	 */
	"bSortClasses": true,


	/**
	 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
	 * used to save table display information such as pagination information,
	 * display length, filtering and sorting. As such when the end user reloads
	 * the page the display will match what thy had previously set up.
	 */
	"bStateSave": false,


	/**
	 * This function is called when a TR element is created (and all TD child
	 * elements have been inserted), or registered if using a DOM source, allowing
	 * manipulation of the TR element (adding classes etc).
	 */
	"fnCreatedRow": null,


	/**
	 * This function is called on every 'draw' event, and allows you to
	 * dynamically modify any aspect you want about the created DOM.
	 */
	"fnDrawCallback": null,


	/**
	 * Identical to fnHeaderCallback() but for the table footer this function
	 * allows you to modify the table footer on every 'draw' event.
	 */
	"fnFooterCallback": null,


	/**
	 * When rendering large numbers in the information element for the table
	 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
	 * to have a comma separator for the 'thousands' units (e.g. 1 million is
	 * rendered as "1,000,000") to help readability for the end user. This
	 * function will override the default method DataTables uses.
	 */
	"fnFormatNumber": function ( toFormat ) {
		return toFormat.toString().replace(
			/\B(?=(\d{3})+(?!\d))/g,
			this.oLanguage.sThousands
		);
	},


	/**
	 * This function is called on every 'draw' event, and allows you to
	 * dynamically modify the header row. This can be used to calculate and
	 * display useful information about the table.
	 */
	"fnHeaderCallback": null,


	/**
	 * The information element can be used to convey information about the current
	 * state of the table. Although the internationalisation options presented by
	 * DataTables are quite capable of dealing with most customisations, there may
	 * be times where you wish to customise the string further. This callback
	 * allows you to do exactly that.
	 */
	"fnInfoCallback": null,


	/**
	 * Called when the table has been initialised. Normally DataTables will
	 * initialise sequentially and there will be no need for this function,
	 * however, this does not hold true when using external language information
	 * since that is obtained using an async XHR call.
	 */
	"fnInitComplete": null,


	/**
	 * Called at the very start of each table draw and can be used to cancel the
	 * draw by returning false, any other return (including undefined) results in
	 * the full draw occurring).
	 */
	"fnPreDrawCallback": null,


	/**
	 * This function allows you to 'post process' each row after it have been
	 * generated for each table draw, but before it is rendered on screen. This
	 * function might be used for setting the row class name etc.
	 */
	"fnRowCallback": null,


	/**
	 * Load the table state. With this function you can define from where, and how, the
	 * state of a table is loaded. By default DataTables will load from `localStorage`
	 * but you might wish to use a server-side database or cookies.
	 */
	"fnStateLoadCallback": function ( settings ) {
		try {
			return JSON.parse(
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname
				)
			);
		} catch (e) {
			return {};
		}
	},


	/**
	 * Callback which allows modification of the saved state prior to loading that state.
	 * This callback is called when the table is loading state from the stored data, but
	 * prior to the settings object being modified by the saved state. Note that for
	 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
	 * a plug-in.
	 */
	"fnStateLoadParams": null,


	/**
	 * Callback that is called when the state has been loaded from the state saving method
	 * and the DataTables settings object has been modified as a result of the loaded state.
	 */
	"fnStateLoaded": null,


	/**
	 * Save the table state. This function allows you to define where and how the state
	 * information for the table is stored By default DataTables will use `localStorage`
	 * but you might wish to use a server-side database or cookies.
	 */
	"fnStateSaveCallback": function ( settings, data ) {
		try {
			(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
				'DataTables_'+settings.sInstance+'_'+location.pathname,
				JSON.stringify( data )
			);
		} catch (e) {
			// noop
		}
	},


	/**
	 * Callback which allows modification of the state to be saved. Called when the table
	 * has changed state a new state save is required. This method allows modification of
	 * the state saving object prior to actually doing the save, including addition or
	 * other state properties or modification. Note that for plug-in authors, you should
	 * use the `stateSaveParams` event to save parameters for a plug-in.
	 */
	"fnStateSaveParams": null,


	/**
	 * Duration for which the saved state information is considered valid. After this period
	 * has elapsed the state will be returned to the default.
	 * Value is given in seconds.
	 */
	"iStateDuration": 7200,


	/**
	 * Number of rows to display on a single page when using pagination. If
	 * feature enabled (`lengthChange`) then the end user will be able to override
	 * this to a custom setting using a pop-up menu.
	 */
	"iDisplayLength": 10,


	/**
	 * Define the starting point for data display when using DataTables with
	 * pagination. Note that this parameter is the number of records, rather than
	 * the page number, so if you have 10 records per page and want to start on
	 * the third page, it should be "20".
	 */
	"iDisplayStart": 0,


	/**
	 * By default DataTables allows keyboard navigation of the table (sorting, paging,
	 * and filtering) by adding a `tabindex` attribute to the required elements. This
	 * allows you to tab through the controls and press the enter key to activate them.
	 * The tabindex is default 0, meaning that the tab follows the flow of the document.
	 * You can overrule this using this parameter if you wish. Use a value of -1 to
	 * disable built-in keyboard navigation.
	 */
	"iTabIndex": 0,


	/**
	 * Classes that DataTables assigns to the various components and features
	 * that it adds to the HTML table. This allows classes to be configured
	 * during initialisation in addition to through the static
	 * {@link DataTable.ext.oStdClasses} object).
	 */
	"oClasses": {},


	/**
	 * All strings that DataTables uses in the user interface that it creates
	 * are defined in this object, allowing you to modified them individually or
	 * completely replace them all as required.
	 */
	"oLanguage": {
		/**
		 * Strings that are used for WAI-ARIA labels and controls only (these are not
		 * actually visible on the page, but will be read by screenreaders, and thus
		 * must be internationalised as well).
		 */
		"oAria": {
			/**
			 * ARIA label that is added to the table headers when the column may be sorted
			 */
			"orderable": ": Activate to sort",

			/**
			 * ARIA label that is added to the table headers when the column is currently being sorted
			 */
			"orderableReverse": ": Activate to invert sorting",

			/**
			 * ARIA label that is added to the table headers when the column is currently being 
			 * sorted and next step is to remove sorting
			 */
			"orderableRemove": ": Activate to remove sorting",

			paginate: {
				first: 'First',
				last: 'Last',
				next: 'Next',
				previous: 'Previous',
				number: ''
			}
		},

		/**
		 * Pagination string used by DataTables for the built-in pagination
		 * control types.
		 */
		"oPaginate": {
			/**
			 * Label and character for first page button («)
			 */
			"sFirst": "\u00AB",

			/**
			 * Last page button (»)
			 */
			"sLast": "\u00BB",

			/**
			 * Next page button (›)
			 */
			"sNext": "\u203A",

			/**
			 * Previous page button (‹)
			 */
			"sPrevious": "\u2039",
		},

		/**
		 * Plural object for the data type the table is showing
		 */
		entries: {
			_: "entries",
			1: "entry"
		},

		/**
		 * This string is shown in preference to `zeroRecords` when the table is
		 * empty of data (regardless of filtering). Note that this is an optional
		 * parameter - if it is not given, the value of `zeroRecords` will be used
		 * instead (either the default or given value).
		 */
		"sEmptyTable": "No data available in table",


		/**
		 * This string gives information to the end user about the information
		 * that is current on display on the page. The following tokens can be
		 * used in the string and will be dynamically replaced as the table
		 * display updates. This tokens can be placed anywhere in the string, or
		 * removed as needed by the language requires:
		 *
		 * * `\_START\_` - Display index of the first record on the current page
		 * * `\_END\_` - Display index of the last record on the current page
		 * * `\_TOTAL\_` - Number of records in the table after filtering
		 * * `\_MAX\_` - Number of records in the table without filtering
		 * * `\_PAGE\_` - Current page number
		 * * `\_PAGES\_` - Total number of pages of data in the table
		 */
		"sInfo": "Showing _START_ to _END_ of _TOTAL_ _ENTRIES-TOTAL_",


		/**
		 * Display information string for when the table is empty. Typically the
		 * format of this string should match `info`.
		 */
		"sInfoEmpty": "Showing 0 to 0 of 0 _ENTRIES-TOTAL_",


		/**
		 * When a user filters the information in a table, this string is appended
		 * to the information (`info`) to give an idea of how strong the filtering
		 * is. The variable _MAX_ is dynamically updated.
		 */
		"sInfoFiltered": "(filtered from _MAX_ total _ENTRIES-MAX_)",


		/**
		 * If can be useful to append extra information to the info string at times,
		 * and this variable does exactly that. This information will be appended to
		 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
		 * being used) at all times.
		 */
		"sInfoPostFix": "",


		/**
		 * This decimal place operator is a little different from the other
		 * language options since DataTables doesn't output floating point
		 * numbers, so it won't ever use this for display of a number. Rather,
		 * what this parameter does is modify the sort methods of the table so
		 * that numbers which are in a format which has a character other than
		 * a period (`.`) as a decimal place will be sorted numerically.
		 *
		 * Note that numbers with different decimal places cannot be shown in
		 * the same table and still be sortable, the table must be consistent.
		 * However, multiple different tables on the page can use different
		 * decimal place characters.
		 */
		"sDecimal": "",


		/**
		 * DataTables has a build in number formatter (`formatNumber`) which is
		 * used to format large numbers that are used in the table information.
		 * By default a comma is used, but this can be trivially changed to any
		 * character you wish with this parameter.
		 */
		"sThousands": ",",


		/**
		 * Detail the action that will be taken when the drop down menu for the
		 * pagination length option is changed. The '_MENU_' variable is replaced
		 * with a default select list of 10, 25, 50 and 100, and can be replaced
		 * with a custom select box if required.
		 */
		"sLengthMenu": "_MENU_ _ENTRIES_ per page",


		/**
		 * When using Ajax sourced data and during the first draw when DataTables is
		 * gathering the data, this message is shown in an empty row in the table to
		 * indicate to the end user the data is being loaded. Note that this
		 * parameter is not used when loading data by server-side processing, just
		 * Ajax sourced data with client-side processing.
		 */
		"sLoadingRecords": "Loading...",


		/**
		 * Text which is displayed when the table is processing a user action
		 * (usually a sort command or similar).
		 */
		"sProcessing": "",


		/**
		 * Details the actions that will be taken when the user types into the
		 * filtering input text box. The variable "_INPUT_", if used in the string,
		 * is replaced with the HTML text box for the filtering input allowing
		 * control over where it appears in the string. If "_INPUT_" is not given
		 * then the input box is appended to the string automatically.
		 */
		"sSearch": "Search:",


		/**
		 * Assign a `placeholder` attribute to the search `input` element
		 *  @type string
		 *  @default 
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.searchPlaceholder
		 */
		"sSearchPlaceholder": "",


		/**
		 * All of the language information can be stored in a file on the
		 * server-side, which DataTables will look up if this parameter is passed.
		 * It must store the URL of the language file, which is in a JSON format,
		 * and the object has the same properties as the oLanguage object in the
		 * initialiser object (i.e. the above parameters). Please refer to one of
		 * the example language files to see how this works in action.
		 */
		"sUrl": "",


		/**
		 * Text shown inside the table records when the is no information to be
		 * displayed after filtering. `emptyTable` is shown when there is simply no
		 * information in the table at all (regardless of filtering).
		 */
		"sZeroRecords": "No matching records found"
	},


	/** The initial data order is reversed when `desc` ordering */
	orderDescReverse: true,


	/**
	 * This parameter allows you to have define the global filtering state at
	 * initialisation time. As an object the `search` parameter must be
	 * defined, but all other parameters are optional. When `regex` is true,
	 * the search string will be treated as a regular expression, when false
	 * (default) it will be treated as a straight string. When `smart`
	 * DataTables will use it's smart filtering methods (to word match at
	 * any point in the data), when false this will not be done.
	 */
	"oSearch": $.extend( {}, DataTable.models.oSearch ),


	/**
	 * Table and control layout. This replaces the legacy `dom` option.
	 */
	layout: {
		topStart: 'pageLength',
		topEnd: 'search',
		bottomStart: 'info',
		bottomEnd: 'paging'
	},


	/**
	 * Legacy DOM layout option
	 */
	"sDom": null,


	/**
	 * Search delay option. This will throttle full table searches that use the
	 * DataTables provided search input element (it does not effect calls to
	 * `dt-api search()`, providing a delay before the search is made.
	 */
	"searchDelay": null,


	/**
	 * DataTables features six different built-in options for the buttons to
	 * display for pagination control:
	 *
	 * * `numbers` - Page number buttons only
	 * * `simple` - 'Previous' and 'Next' buttons only
	 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
	 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
	 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
	 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
	 */
	"sPaginationType": "",


	/**
	 * Enable horizontal scrolling. When a table is too wide to fit into a
	 * certain layout, or you have a large number of columns in the table, you
	 * can enable x-scrolling to show the table in a viewport, which can be
	 * scrolled. This property can be `true` which will allow the table to
	 * scroll horizontally when needed, or any CSS unit, or a number (in which
	 * case it will be treated as a pixel measurement). Setting as simply `true`
	 * is recommended.
	 */
	"sScrollX": "",


	/**
	 * This property can be used to force a DataTable to use more width than it
	 * might otherwise do when x-scrolling is enabled. For example if you have a
	 * table which requires to be well spaced, this parameter is useful for
	 * "over-sizing" the table, and thus forcing scrolling. This property can by
	 * any CSS unit, or a number (in which case it will be treated as a pixel
	 * measurement).
	 */
	"sScrollXInner": "",


	/**
	 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
	 * to the given height, and enable scrolling for any data which overflows the
	 * current viewport. This can be used as an alternative to paging to display
	 * a lot of data in a small area (although paging and scrolling can both be
	 * enabled at the same time). This property can be any CSS unit, or a number
	 * (in which case it will be treated as a pixel measurement).
	 */
	"sScrollY": "",


	/**
	 * __Deprecated__ The functionality provided by this parameter has now been
	 * superseded by that provided through `ajax`, which should be used instead.
	 *
	 * Set the HTTP method that is used to make the Ajax call for server-side
	 * processing or Ajax sourced data.
	 */
	"sServerMethod": "GET",


	/**
	 * DataTables makes use of renderers when displaying HTML elements for
	 * a table. These renderers can be added or modified by plug-ins to
	 * generate suitable mark-up for a site. For example the Bootstrap
	 * integration plug-in for DataTables uses a paging button renderer to
	 * display pagination buttons in the mark-up required by Bootstrap.
	 *
	 * For further information about the renderers available see
	 * DataTable.ext.renderer
	 */
	"renderer": null,


	/**
	 * Set the data property name that DataTables should use to get a row's id
	 * to set as the `id` property in the node.
	 */
	"rowId": "DT_RowId",


	/**
	 * Caption value
	 */
	"caption": null,


	/**
	 * For server-side processing - use the data from the DOM for the first draw
	 */
	iDeferLoading: null
};

_fnHungarianMap( DataTable.defaults );

