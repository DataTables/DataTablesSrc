
/*
 * Developer note: The properties of the object below are given in Hungarian
 * notation, that was used as the interface for DataTables prior to v1.10, however
 * from v1.10 onwards the primary interface is camel case. In order to avoid
 * breaking backwards compatibility utterly with this change, the Hungarian
 * version is still, internally the primary interface, but is is not documented
 * - hence the @name tags in each doc comment. This allows a Javascript function
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
	 * particularly useful for constructing tables purely in Javascript, for
	 * example with a custom Ajax call.
	 *  @type array
	 *  @default null
	 *
	 *  @dtopt Option
	 *  @name DataTable.defaults.data
	 *
	 *  @example
	 *    // Using a 2D array data source
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "data": [
	 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
	 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
	 *        ],
	 *        "columns": [
	 *          { "title": "Engine" },
	 *          { "title": "Browser" },
	 *          { "title": "Platform" },
	 *          { "title": "Version" },
	 *          { "title": "Grade" }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using an array of objects as a data source (`data`)
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "data": [
	 *          {
	 *            "engine":   "Trident",
	 *            "browser":  "Internet Explorer 4.0",
	 *            "platform": "Win 95+",
	 *            "version":  4,
	 *            "grade":    "X"
	 *          },
	 *          {
	 *            "engine":   "Trident",
	 *            "browser":  "Internet Explorer 5.0",
	 *            "platform": "Win 95+",
	 *            "version":  5,
	 *            "grade":    "C"
	 *          }
	 *        ],
	 *        "columns": [
	 *          { "title": "Engine",   "data": "engine" },
	 *          { "title": "Browser",  "data": "browser" },
	 *          { "title": "Platform", "data": "platform" },
	 *          { "title": "Version",  "data": "version" },
	 *          { "title": "Grade",    "data": "grade" }
	 *        ]
	 *      } );
	 *    } );
	 */
	"aaData": null,


	/**
	 * If ordering is enabled, then DataTables will perform a first pass sort on
	 * initialisation. You can define which column(s) the sort is performed
	 * upon, and the sorting direction, with this variable. The `sorting` array
	 * should contain an array for each column to be sorted initially containing
	 * the column's index and a direction string ('asc' or 'desc').
	 *  @type array
	 *  @default [[0,'asc']]
	 *
	 *  @dtopt Option
	 *  @name DataTable.defaults.order
	 *
	 *  @example
	 *    // Sort by 3rd column first, and then 4th column
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "order": [[2,'asc'], [3,'desc']]
	 *      } );
	 *    } );
	 *
	 *    // No initial sorting
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "order": []
	 *      } );
	 *    } );
	 */
	"aaSorting": [[0,'asc']],


	/**
	 * This parameter is basically identical to the `sorting` parameter, but
	 * cannot be overridden by user interaction with the table. What this means
	 * is that you could have a column (visible or hidden) which the sorting
	 * will always be forced on first - any sorting after that (from the user)
	 * will then be performed as required. This can be useful for grouping rows
	 * together.
	 *  @type array
	 *  @default null
	 *
	 *  @dtopt Option
	 *  @name DataTable.defaults.orderFixed
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "orderFixed": [[0,'asc']]
	 *      } );
	 *    } )
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
	 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
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
	 *   allows that property to be changed. You can use Javascript dotted
	 *   object notation to get a data source for multiple levels of nesting, or
	 *   it my be used as a function. As a function it takes a single parameter,
	 *   the JSON returned from the server, which can be manipulated as
	 *   required, with the returned value being that used by DataTables as the
	 *   data source for the table. This supersedes `sAjaxDataProp` from
	 *   DataTables 1.9-.
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
	 *
	 * Note that this supersedes `fnServerData` from DataTables 1.9-.
	 *
	 *  @type string|object|function
	 *  @default null
	 *
	 *  @dtopt Option
	 *  @name DataTable.defaults.ajax
	 *  @since 1.10.0
	 *
	 * @example
	 *   // Get JSON data from a file via Ajax.
	 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
	 *   $('#example').dataTable( {
	 *     "ajax": "data.json"
	 *   } );
	 *
	 * @example
	 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
	 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
	 *   $('#example').dataTable( {
	 *     "ajax": {
	 *       "url": "data.json",
	 *       "dataSrc": "tableData"
	 *     }
	 *   } );
	 *
	 * @example
	 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
	 *   // from a plain array rather than an array in an object
	 *   $('#example').dataTable( {
	 *     "ajax": {
	 *       "url": "data.json",
	 *       "dataSrc": ""
	 *     }
	 *   } );
	 *
	 * @example
	 *   // Manipulate the data returned from the server - add a link to data
	 *   // (note this can, should, be done using `render` for the column - this
	 *   // is just a simple example of how the data can be manipulated).
	 *   $('#example').dataTable( {
	 *     "ajax": {
	 *       "url": "data.json",
	 *       "dataSrc": function ( json ) {
	 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
	 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
	 *         }
	 *         return json;
	 *       }
	 *     }
	 *   } );
	 *
	 * @example
	 *   // Add data to the request
	 *   $('#example').dataTable( {
	 *     "ajax": {
	 *       "url": "data.json",
	 *       "data": function ( d ) {
	 *         return {
	 *           "extra_search": $('#extra').val()
	 *         };
	 *       }
	 *     }
	 *   } );
	 *
	 * @example
	 *   // Send request as POST
	 *   $('#example').dataTable( {
	 *     "ajax": {
	 *       "url": "data.json",
	 *       "type": "POST"
	 *     }
	 *   } );
	 *
	 * @example
	 *   // Get the data from localStorage (could interface with a form for
	 *   // adding, editing and removing rows).
	 *   $('#example').dataTable( {
	 *     "ajax": function (data, callback, settings) {
	 *       callback(
	 *         JSON.parse( localStorage.getItem('dataTablesData') )
	 *       );
	 *     }
	 *   } );
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
	 *  @type array
	 *  @default [ 10, 25, 50, 100 ]
	 *
	 *  @dtopt Option
	 *  @name DataTable.defaults.lengthMenu
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
	 *      } );
	 *    } );
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
	 *  @member
	 *
	 *  @name DataTable.defaults.column
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
	 *  @member
	 *
	 *  @name DataTable.defaults.columnDefs
	 */
	"aoColumnDefs": null,


	/**
	 * Basically the same as `search`, this parameter defines the individual column
	 * filtering state at initialisation time. The array must be of the same size
	 * as the number of columns, and each element be an object with the parameters
	 * `search` and `escapeRegex` (the latter is optional). 'null' is also
	 * accepted and the default will be used.
	 *  @type array
	 *  @default []
	 *
	 *  @dtopt Option
	 *  @name DataTable.defaults.searchCols
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "searchCols": [
	 *          null,
	 *          { "search": "My filter" },
	 *          null,
	 *          { "search": "^[0-9]", "escapeRegex": false }
	 *        ]
	 *      } );
	 *    } )
	 */
	"aoSearchCols": [],


	/**
	 * An array of CSS classes that should be applied to displayed rows. This
	 * array may be of any length, and DataTables will apply each class
	 * sequentially, looping when required.
	 *  @type array
	 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
	 *    options</i>
	 *
	 *  @dtopt Option
	 *  @name DataTable.defaults.stripeClasses
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
	 *      } );
	 *    } )
	 */
	"asStripeClasses": null,


	/**
	 * Enable or disable automatic column width calculation. This can be disabled
	 * as an optimisation (it takes some time to calculate the widths) if the
	 * tables widths are passed in using `columns`.
	 *  @type boolean
	 *  @default true
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.autoWidth
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "autoWidth": false
	 *      } );
	 *    } );
	 */
	"bAutoWidth": true,


	/**
	 * Deferred rendering can provide DataTables with a huge speed boost when you
	 * are using an Ajax or JS data source for the table. This option, when set to
	 * true, will cause DataTables to defer the creation of the table elements for
	 * each row until they are needed for a draw - saving a significant amount of
	 * time.
	 *  @type boolean
	 *  @default false
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.deferRender
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "ajax": "sources/arrays.txt",
	 *        "deferRender": true
	 *      } );
	 *    } );
	 */
	"bDeferRender": false,


	/**
	 * Replace a DataTable which matches the given selector and replace it with
	 * one which has the properties of the new initialisation object passed. If no
	 * table matches the selector, then the new DataTable will be constructed as
	 * per normal.
	 *  @type boolean
	 *  @default false
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.destroy
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "srollY": "200px",
	 *        "paginate": false
	 *      } );
	 *
	 *      // Some time later....
	 *      $('#example').dataTable( {
	 *        "filter": false,
	 *        "destroy": true
	 *      } );
	 *    } );
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
	 *  @type boolean
	 *  @default true
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.searching
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "searching": false
	 *      } );
	 *    } );
	 */
	"bFilter": true,


	/**
	 * Enable or disable the table information display. This shows information
	 * about the data that is currently visible on the page, including information
	 * about filtered data if that action is being performed.
	 *  @type boolean
	 *  @default true
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.info
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "info": false
	 *      } );
	 *    } );
	 */
	"bInfo": true,


	/**
	 * Allows the end user to select the size of a formatted page from a select
	 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
	 *  @type boolean
	 *  @default true
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.lengthChange
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "lengthChange": false
	 *      } );
	 *    } );
	 */
	"bLengthChange": true,


	/**
	 * Enable or disable pagination.
	 *  @type boolean
	 *  @default true
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.paging
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "paging": false
	 *      } );
	 *    } );
	 */
	"bPaginate": true,


	/**
	 * Enable or disable the display of a 'processing' indicator when the table is
	 * being processed (e.g. a sort). This is particularly useful for tables with
	 * large amounts of data where it can take a noticeable amount of time to sort
	 * the entries.
	 *  @type boolean
	 *  @default false
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.processing
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "processing": true
	 *      } );
	 *    } );
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
	 *  @type boolean
	 *  @default false
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.retrieve
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      initTable();
	 *      tableActions();
	 *    } );
	 *
	 *    function initTable ()
	 *    {
	 *      return $('#example').dataTable( {
	 *        "scrollY": "200px",
	 *        "paginate": false,
	 *        "retrieve": true
	 *      } );
	 *    }
	 *
	 *    function tableActions ()
	 *    {
	 *      var table = initTable();
	 *      // perform API operations with oTable
	 *    }
	 */
	"bRetrieve": false,


	/**
	 * When vertical (y) scrolling is enabled, DataTables will force the height of
	 * the table's viewport to the given height at all times (useful for layout).
	 * However, this can look odd when filtering data down to a small data set,
	 * and the footer is left "floating" further down. This parameter (when
	 * enabled) will cause DataTables to collapse the table's viewport down when
	 * the result set will fit within the given Y height.
	 *  @type boolean
	 *  @default false
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.scrollCollapse
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "scrollY": "200",
	 *        "scrollCollapse": true
	 *      } );
	 *    } );
	 */
	"bScrollCollapse": false,


	/**
	 * Configure DataTables to use server-side processing. Note that the
	 * `ajax` parameter must also be given in order to give DataTables a
	 * source to obtain the required data for each draw.
	 *  @type boolean
	 *  @default false
	 *
	 *  @dtopt Features
	 *  @dtopt Server-side
	 *  @name DataTable.defaults.serverSide
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "serverSide": true,
	 *        "ajax": "xhr.php"
	 *      } );
	 *    } );
	 */
	"bServerSide": false,


	/**
	 * Enable or disable sorting of columns. Sorting of individual columns can be
	 * disabled by the `sortable` option for each column.
	 *  @type boolean
	 *  @default true
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.ordering
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "ordering": false
	 *      } );
	 *    } );
	 */
	"bSort": true,


	/**
	 * Enable or display DataTables' ability to sort multiple columns at the
	 * same time (activated by shift-click by the user).
	 *  @type boolean
	 *  @default true
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.orderMulti
	 *
	 *  @example
	 *    // Disable multiple column sorting ability
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "orderMulti": false
	 *      } );
	 *    } );
	 */
	"bSortMulti": true,


	/**
	 * Allows control over whether DataTables should use the top (true) unique
	 * cell that is found for a single column, or the bottom (false - default).
	 * This is useful when using complex headers.
	 *  @type boolean
	 *  @default false
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.orderCellsTop
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "orderCellsTop": true
	 *      } );
	 *    } );
	 */
	"bSortCellsTop": false,


	/**
	 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
	 * `sorting\_3` to the columns which are currently being sorted on. This is
	 * presented as a feature switch as it can increase processing time (while
	 * classes are removed and added) so for large data sets you might want to
	 * turn this off.
	 *  @type boolean
	 *  @default true
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.orderClasses
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "orderClasses": false
	 *      } );
	 *    } );
	 */
	"bSortClasses": true,


	/**
	 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
	 * used to save table display information such as pagination information,
	 * display length, filtering and sorting. As such when the end user reloads
	 * the page the display display will match what thy had previously set up.
	 *
	 * Due to the use of `localStorage` the default state saving is not supported
	 * in IE6 or 7. If state saving is required in those browsers, use
	 * `stateSaveCallback` to provide a storage solution such as cookies.
	 *  @type boolean
	 *  @default false
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.stateSave
	 *
	 *  @example
	 *    $(document).ready( function () {
	 *      $('#example').dataTable( {
	 *        "stateSave": true
	 *      } );
	 *    } );
	 */
	"bStateSave": false,


	/**
	 * This function is called when a TR element is created (and all TD child
	 * elements have been inserted), or registered if using a DOM source, allowing
	 * manipulation of the TR element (adding classes etc).
	 *  @type function
	 *  @param {node} row "TR" element for the current row
	 *  @param {array} data Raw data array for this row
	 *  @param {int} dataIndex The index of this row in the internal aoData array
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.createdRow
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "createdRow": function( row, data, dataIndex ) {
	 *          // Bold the grade for all 'A' grade browsers
	 *          if ( data[4] == "A" )
	 *          {
	 *            $('td:eq(4)', row).html( '<b>A</b>' );
	 *          }
	 *        }
	 *      } );
	 *    } );
	 */
	"fnCreatedRow": null,


	/**
	 * This function is called on every 'draw' event, and allows you to
	 * dynamically modify any aspect you want about the created DOM.
	 *  @type function
	 *  @param {object} settings DataTables settings object
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.drawCallback
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "drawCallback": function( settings ) {
	 *          alert( 'DataTables has redrawn the table' );
	 *        }
	 *      } );
	 *    } );
	 */
	"fnDrawCallback": null,


	/**
	 * Identical to fnHeaderCallback() but for the table footer this function
	 * allows you to modify the table footer on every 'draw' event.
	 *  @type function
	 *  @param {node} foot "TR" element for the footer
	 *  @param {array} data Full table data (as derived from the original HTML)
	 *  @param {int} start Index for the current display starting point in the
	 *    display array
	 *  @param {int} end Index for the current display ending point in the
	 *    display array
	 *  @param {array int} display Index array to translate the visual position
	 *    to the full data array
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.footerCallback
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "footerCallback": function( tfoot, data, start, end, display ) {
	 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
	 *        }
	 *      } );
	 *    } )
	 */
	"fnFooterCallback": null,


	/**
	 * When rendering large numbers in the information element for the table
	 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
	 * to have a comma separator for the 'thousands' units (e.g. 1 million is
	 * rendered as "1,000,000") to help readability for the end user. This
	 * function will override the default method DataTables uses.
	 *  @type function
	 *  @member
	 *  @param {int} toFormat number to be formatted
	 *  @returns {string} formatted string for DataTables to show the number
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.formatNumber
	 *
	 *  @example
	 *    // Format a number using a single quote for the separator (note that
	 *    // this can also be done with the language.thousands option)
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "formatNumber": function ( toFormat ) {
	 *          return toFormat.toString().replace(
	 *            /\B(?=(\d{3})+(?!\d))/g, "'"
	 *          );
	 *        };
	 *      } );
	 *    } );
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
	 *  @type function
	 *  @param {node} head "TR" element for the header
	 *  @param {array} data Full table data (as derived from the original HTML)
	 *  @param {int} start Index for the current display starting point in the
	 *    display array
	 *  @param {int} end Index for the current display ending point in the
	 *    display array
	 *  @param {array int} display Index array to translate the visual position
	 *    to the full data array
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.headerCallback
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "fheaderCallback": function( head, data, start, end, display ) {
	 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
	 *        }
	 *      } );
	 *    } )
	 */
	"fnHeaderCallback": null,


	/**
	 * The information element can be used to convey information about the current
	 * state of the table. Although the internationalisation options presented by
	 * DataTables are quite capable of dealing with most customisations, there may
	 * be times where you wish to customise the string further. This callback
	 * allows you to do exactly that.
	 *  @type function
	 *  @param {object} oSettings DataTables settings object
	 *  @param {int} start Starting position in data for the draw
	 *  @param {int} end End position in data for the draw
	 *  @param {int} max Total number of rows in the table (regardless of
	 *    filtering)
	 *  @param {int} total Total number of rows in the data set, after filtering
	 *  @param {string} pre The string that DataTables has formatted using it's
	 *    own rules
	 *  @returns {string} The string to be displayed in the information element.
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.infoCallback
	 *
	 *  @example
	 *    $('#example').dataTable( {
	 *      "infoCallback": function( settings, start, end, max, total, pre ) {
	 *        return start +" to "+ end;
	 *      }
	 *    } );
	 */
	"fnInfoCallback": null,


	/**
	 * Called when the table has been initialised. Normally DataTables will
	 * initialise sequentially and there will be no need for this function,
	 * however, this does not hold true when using external language information
	 * since that is obtained using an async XHR call.
	 *  @type function
	 *  @param {object} settings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.initComplete
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "initComplete": function(settings, json) {
	 *          alert( 'DataTables has finished its initialisation.' );
	 *        }
	 *      } );
	 *    } )
	 */
	"fnInitComplete": null,


	/**
	 * Called at the very start of each table draw and can be used to cancel the
	 * draw by returning false, any other return (including undefined) results in
	 * the full draw occurring).
	 *  @type function
	 *  @param {object} settings DataTables settings object
	 *  @returns {boolean} False will cancel the draw, anything else (including no
	 *    return) will allow it to complete.
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.preDrawCallback
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "preDrawCallback": function( settings ) {
	 *          if ( $('#test').val() == 1 ) {
	 *            return false;
	 *          }
	 *        }
	 *      } );
	 *    } );
	 */
	"fnPreDrawCallback": null,


	/**
	 * This function allows you to 'post process' each row after it have been
	 * generated for each table draw, but before it is rendered on screen. This
	 * function might be used for setting the row class name etc.
	 *  @type function
	 *  @param {node} row "TR" element for the current row
	 *  @param {array} data Raw data array for this row
	 *  @param {int} displayIndex The display index for the current table draw
	 *  @param {int} displayIndexFull The index of the data in the full list of
	 *    rows (after filtering)
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.rowCallback
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
	 *          // Bold the grade for all 'A' grade browsers
	 *          if ( data[4] == "A" ) {
	 *            $('td:eq(4)', row).html( '<b>A</b>' );
	 *          }
	 *        }
	 *      } );
	 *    } );
	 */
	"fnRowCallback": null,


	/**
	 * __Deprecated__ The functionality provided by this parameter has now been
	 * superseded by that provided through `ajax`, which should be used instead.
	 *
	 * This parameter allows you to override the default function which obtains
	 * the data from the server so something more suitable for your application.
	 * For example you could use POST data, or pull information from a Gears or
	 * AIR database.
	 *  @type function
	 *  @member
	 *  @param {string} source HTTP source to obtain the data from (`ajax`)
	 *  @param {array} data A key/value pair object containing the data to send
	 *    to the server
	 *  @param {function} callback to be called on completion of the data get
	 *    process that will draw the data on the page.
	 *  @param {object} settings DataTables settings object
	 *
	 *  @dtopt Callbacks
	 *  @dtopt Server-side
	 *  @name DataTable.defaults.serverData
	 *
	 *  @deprecated 1.10. Please use `ajax` for this functionality now.
	 */
	"fnServerData": null,


	/**
	 * __Deprecated__ The functionality provided by this parameter has now been
	 * superseded by that provided through `ajax`, which should be used instead.
	 *
	 *  It is often useful to send extra data to the server when making an Ajax
	 * request - for example custom filtering information, and this callback
	 * function makes it trivial to send extra information to the server. The
	 * passed in parameter is the data set that has been constructed by
	 * DataTables, and you can add to this or modify it as you require.
	 *  @type function
	 *  @param {array} data Data array (array of objects which are name/value
	 *    pairs) that has been constructed by DataTables and will be sent to the
	 *    server. In the case of Ajax sourced data with server-side processing
	 *    this will be an empty array, for server-side processing there will be a
	 *    significant number of parameters!
	 *  @returns {undefined} Ensure that you modify the data array passed in,
	 *    as this is passed by reference.
	 *
	 *  @dtopt Callbacks
	 *  @dtopt Server-side
	 *  @name DataTable.defaults.serverParams
	 *
	 *  @deprecated 1.10. Please use `ajax` for this functionality now.
	 */
	"fnServerParams": null,


	/**
	 * Load the table state. With this function you can define from where, and how, the
	 * state of a table is loaded. By default DataTables will load from `localStorage`
	 * but you might wish to use a server-side database or cookies.
	 *  @type function
	 *  @member
	 *  @param {object} settings DataTables settings object
	 *  @param {object} callback Callback that can be executed when done. It
	 *    should be passed the loaded state object.
	 *  @return {object} The DataTables state object to be loaded
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.stateLoadCallback
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "stateSave": true,
	 *        "stateLoadCallback": function (settings, callback) {
	 *          $.ajax( {
	 *            "url": "/state_load",
	 *            "dataType": "json",
	 *            "success": function (json) {
	 *              callback( json );
	 *            }
	 *          } );
	 *        }
	 *      } );
	 *    } );
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
	 *  @type function
	 *  @param {object} settings DataTables settings object
	 *  @param {object} data The state object that is to be loaded
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.stateLoadParams
	 *
	 *  @example
	 *    // Remove a saved filter, so filtering is never loaded
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "stateSave": true,
	 *        "stateLoadParams": function (settings, data) {
	 *          data.oSearch.sSearch = "";
	 *        }
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Disallow state loading by returning false
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "stateSave": true,
	 *        "stateLoadParams": function (settings, data) {
	 *          return false;
	 *        }
	 *      } );
	 *    } );
	 */
	"fnStateLoadParams": null,


	/**
	 * Callback that is called when the state has been loaded from the state saving method
	 * and the DataTables settings object has been modified as a result of the loaded state.
	 *  @type function
	 *  @param {object} settings DataTables settings object
	 *  @param {object} data The state object that was loaded
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.stateLoaded
	 *
	 *  @example
	 *    // Show an alert with the filtering value that was saved
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "stateSave": true,
	 *        "stateLoaded": function (settings, data) {
	 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
	 *        }
	 *      } );
	 *    } );
	 */
	"fnStateLoaded": null,


	/**
	 * Save the table state. This function allows you to define where and how the state
	 * information for the table is stored By default DataTables will use `localStorage`
	 * but you might wish to use a server-side database or cookies.
	 *  @type function
	 *  @member
	 *  @param {object} settings DataTables settings object
	 *  @param {object} data The state object to be saved
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.stateSaveCallback
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "stateSave": true,
	 *        "stateSaveCallback": function (settings, data) {
	 *          // Send an Ajax request to the server with the state object
	 *          $.ajax( {
	 *            "url": "/state_save",
	 *            "data": data,
	 *            "dataType": "json",
	 *            "method": "POST"
	 *            "success": function () {}
	 *          } );
	 *        }
	 *      } );
	 *    } );
	 */
	"fnStateSaveCallback": function ( settings, data ) {
		try {
			(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
				'DataTables_'+settings.sInstance+'_'+location.pathname,
				JSON.stringify( data )
			);
		} catch (e) {}
	},


	/**
	 * Callback which allows modification of the state to be saved. Called when the table
	 * has changed state a new state save is required. This method allows modification of
	 * the state saving object prior to actually doing the save, including addition or
	 * other state properties or modification. Note that for plug-in authors, you should
	 * use the `stateSaveParams` event to save parameters for a plug-in.
	 *  @type function
	 *  @param {object} settings DataTables settings object
	 *  @param {object} data The state object to be saved
	 *
	 *  @dtopt Callbacks
	 *  @name DataTable.defaults.stateSaveParams
	 *
	 *  @example
	 *    // Remove a saved filter, so filtering is never saved
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "stateSave": true,
	 *        "stateSaveParams": function (settings, data) {
	 *          data.oSearch.sSearch = "";
	 *        }
	 *      } );
	 *    } );
	 */
	"fnStateSaveParams": null,


	/**
	 * Duration for which the saved state information is considered valid. After this period
	 * has elapsed the state will be returned to the default.
	 * Value is given in seconds.
	 *  @type int
	 *  @default 7200 <i>(2 hours)</i>
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.stateDuration
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "stateDuration": 60*60*24; // 1 day
	 *      } );
	 *    } )
	 */
	"iStateDuration": 7200,


	/**
	 * When enabled DataTables will not make a request to the server for the first
	 * page draw - rather it will use the data already on the page (no sorting etc
	 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
	 * is used to indicate that deferred loading is required, but it is also used
	 * to tell DataTables how many records there are in the full table (allowing
	 * the information element and pagination to be displayed correctly). In the case
	 * where a filtering is applied to the table on initial load, this can be
	 * indicated by giving the parameter as an array, where the first element is
	 * the number of records available after filtering and the second element is the
	 * number of records without filtering (allowing the table information element
	 * to be shown correctly).
	 *  @type int | array
	 *  @default null
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.deferLoading
	 *
	 *  @example
	 *    // 57 records available in the table, no filtering applied
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "serverSide": true,
	 *        "ajax": "scripts/server_processing.php",
	 *        "deferLoading": 57
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "serverSide": true,
	 *        "ajax": "scripts/server_processing.php",
	 *        "deferLoading": [ 57, 100 ],
	 *        "search": {
	 *          "search": "my_filter"
	 *        }
	 *      } );
	 *    } );
	 */
	"iDeferLoading": null,


	/**
	 * Number of rows to display on a single page when using pagination. If
	 * feature enabled (`lengthChange`) then the end user will be able to override
	 * this to a custom setting using a pop-up menu.
	 *  @type int
	 *  @default 10
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.pageLength
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "pageLength": 50
	 *      } );
	 *    } )
	 */
	"iDisplayLength": 10,


	/**
	 * Define the starting point for data display when using DataTables with
	 * pagination. Note that this parameter is the number of records, rather than
	 * the page number, so if you have 10 records per page and want to start on
	 * the third page, it should be "20".
	 *  @type int
	 *  @default 0
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.displayStart
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "displayStart": 20
	 *      } );
	 *    } )
	 */
	"iDisplayStart": 0,


	/**
	 * By default DataTables allows keyboard navigation of the table (sorting, paging,
	 * and filtering) by adding a `tabindex` attribute to the required elements. This
	 * allows you to tab through the controls and press the enter key to activate them.
	 * The tabindex is default 0, meaning that the tab follows the flow of the document.
	 * You can overrule this using this parameter if you wish. Use a value of -1 to
	 * disable built-in keyboard navigation.
	 *  @type int
	 *  @default 0
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.tabIndex
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "tabIndex": 1
	 *      } );
	 *    } );
	 */
	"iTabIndex": 0,


	/**
	 * Classes that DataTables assigns to the various components and features
	 * that it adds to the HTML table. This allows classes to be configured
	 * during initialisation in addition to through the static
	 * {@link DataTable.ext.oStdClasses} object).
	 *  @namespace
	 *  @name DataTable.defaults.classes
	 */
	"oClasses": {},


	/**
	 * All strings that DataTables uses in the user interface that it creates
	 * are defined in this object, allowing you to modified them individually or
	 * completely replace them all as required.
	 *  @namespace
	 *  @name DataTable.defaults.language
	 */
	"oLanguage": {
		/**
		 * Strings that are used for WAI-ARIA labels and controls only (these are not
		 * actually visible on the page, but will be read by screenreaders, and thus
		 * must be internationalised as well).
		 *  @namespace
		 *  @name DataTable.defaults.language.aria
		 */
		"oAria": {
			/**
			 * ARIA label that is added to the table headers when the column may be
			 * sorted ascending by activing the column (click or return when focused).
			 * Note that the column header is prefixed to this string.
			 *  @type string
			 *  @default : activate to sort column ascending
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.aria.sortAscending
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "aria": {
			 *            "sortAscending": " - click/return to sort ascending"
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"sSortAscending": ": activate to sort column ascending",

			/**
			 * ARIA label that is added to the table headers when the column may be
			 * sorted descending by activing the column (click or return when focused).
			 * Note that the column header is prefixed to this string.
			 *  @type string
			 *  @default : activate to sort column ascending
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.aria.sortDescending
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "aria": {
			 *            "sortDescending": " - click/return to sort descending"
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"sSortDescending": ": activate to sort column descending"
		},

		/**
		 * Pagination string used by DataTables for the built-in pagination
		 * control types.
		 *  @namespace
		 *  @name DataTable.defaults.language.paginate
		 */
		"oPaginate": {
			/**
			 * Text to use when using the 'full_numbers' type of pagination for the
			 * button to take the user to the first page.
			 *  @type string
			 *  @default First
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.paginate.first
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "paginate": {
			 *            "first": "First page"
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"sFirst": "First",


			/**
			 * Text to use when using the 'full_numbers' type of pagination for the
			 * button to take the user to the last page.
			 *  @type string
			 *  @default Last
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.paginate.last
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "paginate": {
			 *            "last": "Last page"
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"sLast": "Last",


			/**
			 * Text to use for the 'next' pagination button (to take the user to the
			 * next page).
			 *  @type string
			 *  @default Next
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.paginate.next
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "paginate": {
			 *            "next": "Next page"
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"sNext": "Next",


			/**
			 * Text to use for the 'previous' pagination button (to take the user to
			 * the previous page).
			 *  @type string
			 *  @default Previous
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.paginate.previous
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "paginate": {
			 *            "previous": "Previous page"
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"sPrevious": "Previous"
		},

		/**
		 * This string is shown in preference to `zeroRecords` when the table is
		 * empty of data (regardless of filtering). Note that this is an optional
		 * parameter - if it is not given, the value of `zeroRecords` will be used
		 * instead (either the default or given value).
		 *  @type string
		 *  @default No data available in table
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.emptyTable
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "emptyTable": "No data available in table"
		 *        }
		 *      } );
		 *    } );
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
		 *
		 *  @type string
		 *  @default Showing _START_ to _END_ of _TOTAL_ entries
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.info
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "info": "Showing page _PAGE_ of _PAGES_"
		 *        }
		 *      } );
		 *    } );
		 */
		"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",


		/**
		 * Display information string for when the table is empty. Typically the
		 * format of this string should match `info`.
		 *  @type string
		 *  @default Showing 0 to 0 of 0 entries
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.infoEmpty
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "infoEmpty": "No entries to show"
		 *        }
		 *      } );
		 *    } );
		 */
		"sInfoEmpty": "Showing 0 to 0 of 0 entries",


		/**
		 * When a user filters the information in a table, this string is appended
		 * to the information (`info`) to give an idea of how strong the filtering
		 * is. The variable _MAX_ is dynamically updated.
		 *  @type string
		 *  @default (filtered from _MAX_ total entries)
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.infoFiltered
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "infoFiltered": " - filtering from _MAX_ records"
		 *        }
		 *      } );
		 *    } );
		 */
		"sInfoFiltered": "(filtered from _MAX_ total entries)",


		/**
		 * If can be useful to append extra information to the info string at times,
		 * and this variable does exactly that. This information will be appended to
		 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
		 * being used) at all times.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.infoPostFix
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "infoPostFix": "All records shown are derived from real information."
		 *        }
		 *      } );
		 *    } );
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
		 *  @type string
		 *  @default 
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.decimal
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "decimal": ","
		 *          "thousands": "."
		 *        }
		 *      } );
		 *    } );
		 */
		"sDecimal": "",


		/**
		 * DataTables has a build in number formatter (`formatNumber`) which is
		 * used to format large numbers that are used in the table information.
		 * By default a comma is used, but this can be trivially changed to any
		 * character you wish with this parameter.
		 *  @type string
		 *  @default ,
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.thousands
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "thousands": "'"
		 *        }
		 *      } );
		 *    } );
		 */
		"sThousands": ",",


		/**
		 * Detail the action that will be taken when the drop down menu for the
		 * pagination length option is changed. The '_MENU_' variable is replaced
		 * with a default select list of 10, 25, 50 and 100, and can be replaced
		 * with a custom select box if required.
		 *  @type string
		 *  @default Show _MENU_ entries
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.lengthMenu
		 *
		 *  @example
		 *    // Language change only
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "lengthMenu": "Display _MENU_ records"
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Language and options change
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "lengthMenu": 'Display <select>'+
		 *            '<option value="10">10</option>'+
		 *            '<option value="20">20</option>'+
		 *            '<option value="30">30</option>'+
		 *            '<option value="40">40</option>'+
		 *            '<option value="50">50</option>'+
		 *            '<option value="-1">All</option>'+
		 *            '</select> records'
		 *        }
		 *      } );
		 *    } );
		 */
		"sLengthMenu": "Show _MENU_ entries",


		/**
		 * When using Ajax sourced data and during the first draw when DataTables is
		 * gathering the data, this message is shown in an empty row in the table to
		 * indicate to the end user the the data is being loaded. Note that this
		 * parameter is not used when loading data by server-side processing, just
		 * Ajax sourced data with client-side processing.
		 *  @type string
		 *  @default Loading...
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.loadingRecords
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "loadingRecords": "Please wait - loading..."
		 *        }
		 *      } );
		 *    } );
		 */
		"sLoadingRecords": "Loading...",


		/**
		 * Text which is displayed when the table is processing a user action
		 * (usually a sort command or similar).
		 *  @type string
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.processing
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "processing": "DataTables is currently busy"
		 *        }
		 *      } );
		 *    } );
		 */
		"sProcessing": "",


		/**
		 * Details the actions that will be taken when the user types into the
		 * filtering input text box. The variable "_INPUT_", if used in the string,
		 * is replaced with the HTML text box for the filtering input allowing
		 * control over where it appears in the string. If "_INPUT_" is not given
		 * then the input box is appended to the string automatically.
		 *  @type string
		 *  @default Search:
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.search
		 *
		 *  @example
		 *    // Input text box will be appended at the end automatically
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "search": "Filter records:"
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Specify where the filter should appear
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "search": "Apply filter _INPUT_ to table"
		 *        }
		 *      } );
		 *    } );
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
		 *  @type string
		 *  @default <i>Empty string - i.e. disabled</i>
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.url
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
		 *        }
		 *      } );
		 *    } );
		 */
		"sUrl": "",


		/**
		 * Text shown inside the table records when the is no information to be
		 * displayed after filtering. `emptyTable` is shown when there is simply no
		 * information in the table at all (regardless of filtering).
		 *  @type string
		 *  @default No matching records found
		 *
		 *  @dtopt Language
		 *  @name DataTable.defaults.language.zeroRecords
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "language": {
		 *          "zeroRecords": "No records to display"
		 *        }
		 *      } );
		 *    } );
		 */
		"sZeroRecords": "No matching records found"
	},


	/**
	 * This parameter allows you to have define the global filtering state at
	 * initialisation time. As an object the `search` parameter must be
	 * defined, but all other parameters are optional. When `regex` is true,
	 * the search string will be treated as a regular expression, when false
	 * (default) it will be treated as a straight string. When `smart`
	 * DataTables will use it's smart filtering methods (to word match at
	 * any point in the data), when false this will not be done.
	 *  @namespace
	 *  @extends DataTable.models.oSearch
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.search
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "search": {"search": "Initial search"}
	 *      } );
	 *    } )
	 */
	"oSearch": $.extend( {}, DataTable.models.oSearch ),


	/**
	 * __Deprecated__ The functionality provided by this parameter has now been
	 * superseded by that provided through `ajax`, which should be used instead.
	 *
	 * By default DataTables will look for the property `data` (or `aaData` for
	 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
	 * source or for server-side processing - this parameter allows that
	 * property to be changed. You can use Javascript dotted object notation to
	 * get a data source for multiple levels of nesting.
	 *  @type string
	 *  @default data
	 *
	 *  @dtopt Options
	 *  @dtopt Server-side
	 *  @name DataTable.defaults.ajaxDataProp
	 *
	 *  @deprecated 1.10. Please use `ajax` for this functionality now.
	 */
	"sAjaxDataProp": "data",


	/**
	 * __Deprecated__ The functionality provided by this parameter has now been
	 * superseded by that provided through `ajax`, which should be used instead.
	 *
	 * You can instruct DataTables to load data from an external
	 * source using this parameter (use aData if you want to pass data in you
	 * already have). Simply provide a url a JSON object can be obtained from.
	 *  @type string
	 *  @default null
	 *
	 *  @dtopt Options
	 *  @dtopt Server-side
	 *  @name DataTable.defaults.ajaxSource
	 *
	 *  @deprecated 1.10. Please use `ajax` for this functionality now.
	 */
	"sAjaxSource": null,


	/**
	 * This initialisation variable allows you to specify exactly where in the
	 * DOM you want DataTables to inject the various controls it adds to the page
	 * (for example you might want the pagination controls at the top of the
	 * table). DIV elements (with or without a custom class) can also be added to
	 * aid styling. The follow syntax is used:
	 *   <ul>
	 *     <li>The following options are allowed:
	 *       <ul>
	 *         <li>'l' - Length changing</li>
	 *         <li>'f' - Filtering input</li>
	 *         <li>'t' - The table!</li>
	 *         <li>'i' - Information</li>
	 *         <li>'p' - Pagination</li>
	 *         <li>'r' - pRocessing</li>
	 *       </ul>
	 *     </li>
	 *     <li>The following constants are allowed:
	 *       <ul>
	 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
	 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
	 *       </ul>
	 *     </li>
	 *     <li>The following syntax is expected:
	 *       <ul>
	 *         <li>'&lt;' and '&gt;' - div elements</li>
	 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
	 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
	 *       </ul>
	 *     </li>
	 *     <li>Examples:
	 *       <ul>
	 *         <li>'&lt;"wrapper"flipt&gt;'</li>
	 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
	 *       </ul>
	 *     </li>
	 *   </ul>
	 *  @type string
	 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
	 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.dom
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
	 *      } );
	 *    } );
	 */
	"sDom": "lfrtip",


	/**
	 * Search delay option. This will throttle full table searches that use the
	 * DataTables provided search input element (it does not effect calls to
	 * `dt-api search()`, providing a delay before the search is made.
	 *  @type integer
	 *  @default 0
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.searchDelay
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "searchDelay": 200
	 *      } );
	 *    } )
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
	 *  
	 * Further methods can be added using {@link DataTable.ext.oPagination}.
	 *  @type string
	 *  @default simple_numbers
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.pagingType
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "pagingType": "full_numbers"
	 *      } );
	 *    } )
	 */
	"sPaginationType": "simple_numbers",


	/**
	 * Enable horizontal scrolling. When a table is too wide to fit into a
	 * certain layout, or you have a large number of columns in the table, you
	 * can enable x-scrolling to show the table in a viewport, which can be
	 * scrolled. This property can be `true` which will allow the table to
	 * scroll horizontally when needed, or any CSS unit, or a number (in which
	 * case it will be treated as a pixel measurement). Setting as simply `true`
	 * is recommended.
	 *  @type boolean|string
	 *  @default <i>blank string - i.e. disabled</i>
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.scrollX
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "scrollX": true,
	 *        "scrollCollapse": true
	 *      } );
	 *    } );
	 */
	"sScrollX": "",


	/**
	 * This property can be used to force a DataTable to use more width than it
	 * might otherwise do when x-scrolling is enabled. For example if you have a
	 * table which requires to be well spaced, this parameter is useful for
	 * "over-sizing" the table, and thus forcing scrolling. This property can by
	 * any CSS unit, or a number (in which case it will be treated as a pixel
	 * measurement).
	 *  @type string
	 *  @default <i>blank string - i.e. disabled</i>
	 *
	 *  @dtopt Options
	 *  @name DataTable.defaults.scrollXInner
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "scrollX": "100%",
	 *        "scrollXInner": "110%"
	 *      } );
	 *    } );
	 */
	"sScrollXInner": "",


	/**
	 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
	 * to the given height, and enable scrolling for any data which overflows the
	 * current viewport. This can be used as an alternative to paging to display
	 * a lot of data in a small area (although paging and scrolling can both be
	 * enabled at the same time). This property can be any CSS unit, or a number
	 * (in which case it will be treated as a pixel measurement).
	 *  @type string
	 *  @default <i>blank string - i.e. disabled</i>
	 *
	 *  @dtopt Features
	 *  @name DataTable.defaults.scrollY
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "scrollY": "200px",
	 *        "paginate": false
	 *      } );
	 *    } );
	 */
	"sScrollY": "",


	/**
	 * __Deprecated__ The functionality provided by this parameter has now been
	 * superseded by that provided through `ajax`, which should be used instead.
	 *
	 * Set the HTTP method that is used to make the Ajax call for server-side
	 * processing or Ajax sourced data.
	 *  @type string
	 *  @default GET
	 *
	 *  @dtopt Options
	 *  @dtopt Server-side
	 *  @name DataTable.defaults.serverMethod
	 *
	 *  @deprecated 1.10. Please use `ajax` for this functionality now.
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
	 *  @type string|object
	 *  @default null
	 *
	 *  @name DataTable.defaults.renderer
	 *
	 */
	"renderer": null,


	/**
	 * Set the data property name that DataTables should use to get a row's id
	 * to set as the `id` property in the node.
	 *  @type string
	 *  @default DT_RowId
	 *
	 *  @name DataTable.defaults.rowId
	 */
	"rowId": "DT_RowId"
};

_fnHungarianMap( DataTable.defaults );

