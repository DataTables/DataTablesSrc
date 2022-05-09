

/*
 * Developer note - See note in model.defaults.js about the use of Hungarian
 * notation and camel case.
 */

/**
 * Column options that can be given to DataTables at initialisation time.
 *  @namespace
 */
DataTable.defaults.column = {
	/**
	 * Define which column(s) an order will occur on for this column. This
	 * allows a column's ordering to take multiple columns into account when
	 * doing a sort or use the data from a different column. For example first
	 * name / last name columns make sense to do a multi-column sort over the
	 * two columns.
	 *  @type array|int
	 *  @default null <i>Takes the value of the column index automatically</i>
	 *
	 *  @name DataTable.defaults.column.orderData
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
	 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
	 *          { "orderData": 2, "targets": [ 2 ] }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "orderData": [ 0, 1 ] },
	 *          { "orderData": [ 1, 0 ] },
	 *          { "orderData": 2 },
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"aDataSort": null,
	"iDataSort": -1,


	/**
	 * You can control the default ordering direction, and even alter the
	 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
	 * using this parameter.
	 *  @type array
	 *  @default [ 'asc', 'desc' ]
	 *
	 *  @name DataTable.defaults.column.orderSequence
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
	 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
	 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          null,
	 *          { "orderSequence": [ "asc" ] },
	 *          { "orderSequence": [ "desc", "asc", "asc" ] },
	 *          { "orderSequence": [ "desc" ] },
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"asSorting": [ 'asc', 'desc' ],


	/**
	 * Enable or disable filtering on the data in this column.
	 *  @type boolean
	 *  @default true
	 *
	 *  @name DataTable.defaults.column.searchable
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "searchable": false, "targets": [ 0 ] }
	 *        ] } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "searchable": false },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ] } );
	 *    } );
	 */
	"bSearchable": true,


	/**
	 * Enable or disable ordering on this column.
	 *  @type boolean
	 *  @default true
	 *
	 *  @name DataTable.defaults.column.orderable
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "orderable": false, "targets": [ 0 ] }
	 *        ] } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "orderable": false },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ] } );
	 *    } );
	 */
	"bSortable": true,


	/**
	 * Enable or disable the display of this column.
	 *  @type boolean
	 *  @default true
	 *
	 *  @name DataTable.defaults.column.visible
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "visible": false, "targets": [ 0 ] }
	 *        ] } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "visible": false },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ] } );
	 *    } );
	 */
	"bVisible": true,


	/**
	 * Developer definable function that is called whenever a cell is created (Ajax source,
	 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
	 * allowing you to modify the DOM element (add background colour for example) when the
	 * element is available.
	 *  @type function
	 *  @param {element} td The TD node that has been created
	 *  @param {*} cellData The Data for the cell
	 *  @param {array|object} rowData The data for the whole row
	 *  @param {int} row The row index for the aoData data store
	 *  @param {int} col The column index for aoColumns
	 *
	 *  @name DataTable.defaults.column.createdCell
	 *  @dtopt Columns
	 *
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [3],
	 *          "createdCell": function (td, cellData, rowData, row, col) {
	 *            if ( cellData == "1.7" ) {
	 *              $(td).css('color', 'blue')
	 *            }
	 *          }
	 *        } ]
	 *      });
	 *    } );
	 */
	"fnCreatedCell": null,


	/**
	 * This parameter has been replaced by `data` in DataTables to ensure naming
	 * consistency. `dataProp` can still be used, as there is backwards
	 * compatibility in DataTables for this option, but it is strongly
	 * recommended that you use `data` in preference to `dataProp`.
	 *  @name DataTable.defaults.column.dataProp
	 */


	/**
	 * This property can be used to read data from any data source property,
	 * including deeply nested objects / properties. `data` can be given in a
	 * number of different ways which effect its behaviour:
	 *
	 * * `integer` - treated as an array index for the data source. This is the
	 *   default that DataTables uses (incrementally increased for each column).
	 * * `string` - read an object property from the data source. There are
	 *   three 'special' options that can be used in the string to alter how
	 *   DataTables reads the data from the source object:
	 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
	 *      Javascript to read from nested objects, so to can the options
	 *      specified in `data`. For example: `browser.version` or
	 *      `browser.name`. If your object parameter name contains a period, use
	 *      `\\` to escape it - i.e. `first\\.name`.
	 *    * `[]` - Array notation. DataTables can automatically combine data
	 *      from and array source, joining the data with the characters provided
	 *      between the two brackets. For example: `name[, ]` would provide a
	 *      comma-space separated list from the source array. If no characters
	 *      are provided between the brackets, the original array source is
	 *      returned.
	 *    * `()` - Function notation. Adding `()` to the end of a parameter will
	 *      execute a function of the name given. For example: `browser()` for a
	 *      simple function on the data source, `browser.version()` for a
	 *      function in a nested property or even `browser().version` to get an
	 *      object property if the function called returns an object. Note that
	 *      function notation is recommended for use in `render` rather than
	 *      `data` as it is much simpler to use as a renderer.
	 * * `null` - use the original data source for the row rather than plucking
	 *   data directly from it. This action has effects on two other
	 *   initialisation options:
	 *    * `defaultContent` - When null is given as the `data` option and
	 *      `defaultContent` is specified for the column, the value defined by
	 *      `defaultContent` will be used for the cell.
	 *    * `render` - When null is used for the `data` option and the `render`
	 *      option is specified for the column, the whole data source for the
	 *      row is used for the renderer.
	 * * `function` - the function given will be executed whenever DataTables
	 *   needs to set or get the data for a cell in the column. The function
	 *   takes three parameters:
	 *    * Parameters:
	 *      * `{array|object}` The data source for the row
	 *      * `{string}` The type call data requested - this will be 'set' when
	 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
	 *        when gathering data. Note that when `undefined` is given for the
	 *        type DataTables expects to get the raw data for the object back<
	 *      * `{*}` Data to set when the second parameter is 'set'.
	 *    * Return:
	 *      * The return value from the function is not required when 'set' is
	 *        the type of call, but otherwise the return is what will be used
	 *        for the data requested.
	 *
	 * Note that `data` is a getter and setter option. If you just require
	 * formatting of data for output, you will likely want to use `render` which
	 * is simply a getter and thus simpler to use.
	 *
	 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
	 * name change reflects the flexibility of this property and is consistent
	 * with the naming of mRender. If 'mDataProp' is given, then it will still
	 * be used by DataTables, as it automatically maps the old name to the new
	 * if required.
	 *
	 *  @type string|int|function|null
	 *  @default null <i>Use automatically calculated column index</i>
	 *
	 *  @name DataTable.defaults.column.data
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Read table data from objects
	 *    // JSON structure for each row:
	 *    //   {
	 *    //      "engine": {value},
	 *    //      "browser": {value},
	 *    //      "platform": {value},
	 *    //      "version": {value},
	 *    //      "grade": {value}
	 *    //   }
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "ajaxSource": "sources/objects.txt",
	 *        "columns": [
	 *          { "data": "engine" },
	 *          { "data": "browser" },
	 *          { "data": "platform" },
	 *          { "data": "version" },
	 *          { "data": "grade" }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Read information from deeply nested objects
	 *    // JSON structure for each row:
	 *    //   {
	 *    //      "engine": {value},
	 *    //      "browser": {value},
	 *    //      "platform": {
	 *    //         "inner": {value}
	 *    //      },
	 *    //      "details": [
	 *    //         {value}, {value}
	 *    //      ]
	 *    //   }
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "ajaxSource": "sources/deep.txt",
	 *        "columns": [
	 *          { "data": "engine" },
	 *          { "data": "browser" },
	 *          { "data": "platform.inner" },
	 *          { "data": "details.0" },
	 *          { "data": "details.1" }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `data` as a function to provide different information for
	 *    // sorting, filtering and display. In this case, currency (price)
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "data": function ( source, type, val ) {
	 *            if (type === 'set') {
	 *              source.price = val;
	 *              // Store the computed display and filter values for efficiency
	 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
	 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
	 *              return;
	 *            }
	 *            else if (type === 'display') {
	 *              return source.price_display;
	 *            }
	 *            else if (type === 'filter') {
	 *              return source.price_filter;
	 *            }
	 *            // 'sort', 'type' and undefined all just use the integer
	 *            return source.price;
	 *          }
	 *        } ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using default content
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "data": null,
	 *          "defaultContent": "Click to edit"
	 *        } ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using array notation - outputting a list from an array
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "data": "name[, ]"
	 *        } ]
	 *      } );
	 *    } );
	 *
	 */
	"mData": null,


	/**
	 * This property is the rendering partner to `data` and it is suggested that
	 * when you want to manipulate data for display (including filtering,
	 * sorting etc) without altering the underlying data for the table, use this
	 * property. `render` can be considered to be the the read only companion to
	 * `data` which is read / write (then as such more complex). Like `data`
	 * this option can be given in a number of different ways to effect its
	 * behaviour:
	 *
	 * * `integer` - treated as an array index for the data source. This is the
	 *   default that DataTables uses (incrementally increased for each column).
	 * * `string` - read an object property from the data source. There are
	 *   three 'special' options that can be used in the string to alter how
	 *   DataTables reads the data from the source object:
	 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
	 *      Javascript to read from nested objects, so to can the options
	 *      specified in `data`. For example: `browser.version` or
	 *      `browser.name`. If your object parameter name contains a period, use
	 *      `\\` to escape it - i.e. `first\\.name`.
	 *    * `[]` - Array notation. DataTables can automatically combine data
	 *      from and array source, joining the data with the characters provided
	 *      between the two brackets. For example: `name[, ]` would provide a
	 *      comma-space separated list from the source array. If no characters
	 *      are provided between the brackets, the original array source is
	 *      returned.
	 *    * `()` - Function notation. Adding `()` to the end of a parameter will
	 *      execute a function of the name given. For example: `browser()` for a
	 *      simple function on the data source, `browser.version()` for a
	 *      function in a nested property or even `browser().version` to get an
	 *      object property if the function called returns an object.
	 * * `object` - use different data for the different data types requested by
	 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
	 *   of the object is the data type the property refers to and the value can
	 *   defined using an integer, string or function using the same rules as
	 *   `render` normally does. Note that an `_` option _must_ be specified.
	 *   This is the default value to use if you haven't specified a value for
	 *   the data type requested by DataTables.
	 * * `function` - the function given will be executed whenever DataTables
	 *   needs to set or get the data for a cell in the column. The function
	 *   takes three parameters:
	 *    * Parameters:
	 *      * {array|object} The data source for the row (based on `data`)
	 *      * {string} The type call data requested - this will be 'filter',
	 *        'display', 'type' or 'sort'.
	 *      * {array|object} The full data source for the row (not based on
	 *        `data`)
	 *    * Return:
	 *      * The return value from the function is what will be used for the
	 *        data requested.
	 *
	 *  @type string|int|function|object|null
	 *  @default null Use the data source value.
	 *
	 *  @name DataTable.defaults.column.render
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Create a comma separated list from an array of objects
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "ajaxSource": "sources/deep.txt",
	 *        "columns": [
	 *          { "data": "engine" },
	 *          { "data": "browser" },
	 *          {
	 *            "data": "platform",
	 *            "render": "[, ].name"
	 *          }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Execute a function to obtain data
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "data": null, // Use the full data source object for the renderer's source
	 *          "render": "browserName()"
	 *        } ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // As an object, extracting different data for the different types
	 *    // This would be used with a data source such as:
	 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
	 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
	 *    // (which has both forms) is used for filtering for if a user inputs either format, while
	 *    // the formatted phone number is the one that is shown in the table.
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "data": null, // Use the full data source object for the renderer's source
	 *          "render": {
	 *            "_": "phone",
	 *            "filter": "phone_filter",
	 *            "display": "phone_display"
	 *          }
	 *        } ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Use as a function to create a link from the data source
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "data": "download_link",
	 *          "render": function ( data, type, full ) {
	 *            return '<a href="'+data+'">Download</a>';
	 *          }
	 *        } ]
	 *      } );
	 *    } );
	 */
	"mRender": null,


	/**
	 * Change the cell type created for the column - either TD cells or TH cells. This
	 * can be useful as TH cells have semantic meaning in the table body, allowing them
	 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
	 *  @type string
	 *  @default td
	 *
	 *  @name DataTable.defaults.column.cellType
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Make the first column use TH cells
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "cellType": "th"
	 *        } ]
	 *      } );
	 *    } );
	 */
	"sCellType": "td",


	/**
	 * Class to give to each cell in this column.
	 *  @type string
	 *  @default <i>Empty string</i>
	 *
	 *  @name DataTable.defaults.column.class
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "class": "my_class", "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "class": "my_class" },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"sClass": "",

	/**
	 * When DataTables calculates the column widths to assign to each column,
	 * it finds the longest string in each column and then constructs a
	 * temporary table and reads the widths from that. The problem with this
	 * is that "mmm" is much wider then "iiii", but the latter is a longer
	 * string - thus the calculation can go wrong (doing it properly and putting
	 * it into an DOM object and measuring that is horribly(!) slow). Thus as
	 * a "work around" we provide this option. It will append its value to the
	 * text that is found to be the longest string for the column - i.e. padding.
	 * Generally you shouldn't need this!
	 *  @type string
	 *  @default <i>Empty string<i>
	 *
	 *  @name DataTable.defaults.column.contentPadding
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          null,
	 *          null,
	 *          null,
	 *          {
	 *            "contentPadding": "mmm"
	 *          }
	 *        ]
	 *      } );
	 *    } );
	 */
	"sContentPadding": "",


	/**
	 * Allows a default value to be given for a column's data, and will be used
	 * whenever a null data source is encountered (this can be because `data`
	 * is set to null, or because the data source itself is null).
	 *  @type string
	 *  @default null
	 *
	 *  @name DataTable.defaults.column.defaultContent
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          {
	 *            "data": null,
	 *            "defaultContent": "Edit",
	 *            "targets": [ -1 ]
	 *          }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          null,
	 *          null,
	 *          null,
	 *          {
	 *            "data": null,
	 *            "defaultContent": "Edit"
	 *          }
	 *        ]
	 *      } );
	 *    } );
	 */
	"sDefaultContent": null,


	/**
	 * This parameter is only used in DataTables' server-side processing. It can
	 * be exceptionally useful to know what columns are being displayed on the
	 * client side, and to map these to database fields. When defined, the names
	 * also allow DataTables to reorder information from the server if it comes
	 * back in an unexpected order (i.e. if you switch your columns around on the
	 * client-side, your server-side code does not also need updating).
	 *  @type string
	 *  @default <i>Empty string</i>
	 *
	 *  @name DataTable.defaults.column.name
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "name": "engine", "targets": [ 0 ] },
	 *          { "name": "browser", "targets": [ 1 ] },
	 *          { "name": "platform", "targets": [ 2 ] },
	 *          { "name": "version", "targets": [ 3 ] },
	 *          { "name": "grade", "targets": [ 4 ] }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "name": "engine" },
	 *          { "name": "browser" },
	 *          { "name": "platform" },
	 *          { "name": "version" },
	 *          { "name": "grade" }
	 *        ]
	 *      } );
	 *    } );
	 */
	"sName": "",


	/**
	 * Defines a data source type for the ordering which can be used to read
	 * real-time information from the table (updating the internally cached
	 * version) prior to ordering. This allows ordering to occur on user
	 * editable elements such as form inputs.
	 *  @type string
	 *  @default std
	 *
	 *  @name DataTable.defaults.column.orderDataType
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
	 *          { "type": "numeric", "targets": [ 3 ] },
	 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
	 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          null,
	 *          null,
	 *          { "orderDataType": "dom-text" },
	 *          { "orderDataType": "dom-text", "type": "numeric" },
	 *          { "orderDataType": "dom-select" },
	 *          { "orderDataType": "dom-checkbox" }
	 *        ]
	 *      } );
	 *    } );
	 */
	"sSortDataType": "std",


	/**
	 * The title of this column.
	 *  @type string
	 *  @default null <i>Derived from the 'TH' value for this column in the
	 *    original HTML table.</i>
	 *
	 *  @name DataTable.defaults.column.title
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "title": "My column title", "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "title": "My column title" },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"sTitle": null,


	/**
	 * The type allows you to specify how the data for this column will be
	 * ordered. Four types (string, numeric, date and html (which will strip
	 * HTML tags before ordering)) are currently available. Note that only date
	 * formats understood by Javascript's Date() object will be accepted as type
	 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
	 * 'numeric', 'date' or 'html' (by default). Further types can be adding
	 * through plug-ins.
	 *  @type string
	 *  @default null <i>Auto-detected from raw data</i>
	 *
	 *  @name DataTable.defaults.column.type
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "type": "html", "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "type": "html" },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"sType": null,


	/**
	 * Defining the width of the column, this parameter may take any CSS value
	 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
	 * been given a specific width through this interface ensuring that the table
	 * remains readable.
	 *  @type string
	 *  @default null <i>Automatic</i>
	 *
	 *  @name DataTable.defaults.column.width
	 *  @dtopt Columns
	 *
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "width": "20%", "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "width": "20%" },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"sWidth": null
};

_fnHungarianMap( DataTable.defaults.column );

