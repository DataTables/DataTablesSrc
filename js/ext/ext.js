

/**
 * DataTables extensions
 * 
 * This namespace acts as a collection area for plug-ins that can be used to
 * extend DataTables capabilities. Indeed many of the build in methods
 * use this method to provide their own capabilities (sorting methods for
 * example).
 *
 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
 * reasons
 *
 *  @namespace
 */
DataTable.ext = {
	/**
	 * Element class names
	 *
	 *  @type object
	 *  @default {}
	 */
	classes: {},


	/**
	 * Error reporting.
	 * 
	 * How should DataTables report an error. Can take the value 'alert' or
	 * 'throw'
	 *
	 *  @type string
	 *  @default alert
	 */
	errMode: "alert",


	/**
	 * Feature plug-ins.
	 * 
	 * This is an array of objects which describe the feature plug-ins that are
	 * available to DataTables. These feature plug-ins are then available for
	 * use through the `dom` initialisation option.
	 * 
	 * Each feature plug-in is described by an object which must have the
	 * following properties:
	 * 
	 * * `fnInit` - function that is used to initialise the plug-in,
	 * * `cFeature` - a character so the feature can be enabled by the `dom`
	 *   instillation option. This is case sensitive.
	 *
	 * The `fnInit` function has the following input parameters:
	 *
	 * 1. `{object}` DataTables settings object: see
	 *    {@link DataTable.models.oSettings}
	 *
	 * And the following return is expected:
	 * 
	 * * {node|null} The element which contains your feature. Note that the
	 *   return may also be void if your plug-in does not require to inject any
	 *   DOM elements into DataTables control (`dom`) - for example this might
	 *   be useful when developing a plug-in which allows table control via
	 *   keyboard entry
	 *
	 *  @type array
	 *
	 *  @example
	 *    $.fn.dataTable.ext.features.push( {
	 *      "fnInit": function( oSettings ) {
	 *        return new TableTools( { "oDTSettings": oSettings } );
	 *      },
	 *      "cFeature": "T"
	 *    } );
	 */
	feature: [],


	/**
	 * Row filtering.
	 * 
	 * This method of filtering is complimentary to the default type based
	 * filtering, and a lot more comprehensive as it allows you complete control
	 * over the filtering logic. Each element in this array is a function
	 * (parameters described below) that is called for every row in the table,
	 * and your logic decides if it should be included in the filtered data set
	 * or not.
	 *
	 * Filtering functions have the following input parameters:
	 *
	 * 1. `{object}` DataTables settings object: see
	 *    {@link DataTable.models.oSettings}
	 * 2. `{array|object}` Data for the row to be processed (same as the
	 *    original format that was passed in as the data source, or an array
	 *    from a DOM data source
	 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
	 *    can be useful to retrieve the `TR` element if you need DOM interaction.
	 *
	 * And the following return is expected:
	 *
	 * * {boolean} Include the row in the filtered result set (true) or not
	 *   (false)
	 *
	 *  @type array
	 *  @default []
	 *
	 *  @example
	 *    // The following example shows custom filtering being applied to the
	 *    // fourth column (i.e. the data[3] index) based on two input values
	 *    // from the end-user, matching the data in a certain range.
	 *    $.fn.dataTable.ext.filter.push(
	 *      function( settings, data, dataIndex ) {
	 *        var min = document.getElementById('min').value * 1;
	 *        var max = document.getElementById('max').value * 1;
	 *        var version = data[3] == "-" ? 0 : data[3]*1;
	 *
	 *        if ( min == "" && max == "" ) {
	 *          return true;
	 *        }
	 *        else if ( min == "" && version < max ) {
	 *          return true;
	 *        }
	 *        else if ( min < version && "" == max ) {
	 *          return true;
	 *        }
	 *        else if ( min < version && version < max ) {
	 *          return true;
	 *        }
	 *        return false;
	 *      }
	 *    );
	 */
	filter: [],


	/**
	 * Internal functions, exposed for used in plug-ins.
	 * 
	 * Please note that you should not need to use the internal methods for
	 * anything other than a plug-in (and even then, try to avoid if possible).
	 * The internal function may change between releases.
	 *
	 * externally
	 *  @type object
	 *  @default {}
	 */
	internal: {},


	/**
	 * Pagination plug-in methods.
	 * 
	 * Each entry in this object is a function and defines which buttons should
	 * be shown by the pagination rendering method that is used for the table:
	 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
	 * buttons are displayed in the document, while the functions here tell it
	 * what buttons to display. This is done by returning an array of button
	 * descriptions (what each button will do).
	 *
	 * Pagination types (the four built in options and any additional plug-in
	 * options defined here) can be used through the `paginationType`
	 * initialisation parameter.
	 *
	 * The functions defined take two parameters:
	 *
	 * 1. `{int} page` The current page index
	 * 2. `{int} pages` The number of pages in the table
	 *
	 * Each function is expected to return an array where each element of the
	 * array can be one of:
	 *
	 * * `first` - Jump to first page when activated
	 * * `last` - Jump to last page when activated
	 * * `previous` - Show previous page when activated
	 * * `next` - Show next page when activated
	 * * `{int}` - Show page of the index given
	 * * `{array}` - A nested array containing the above elements to add a
	 *   containing 'DIV' element (might be useful for styling).
	 *
	 * Note that DataTables v1.9- used this object slightly differently whereby
	 * an object with two functions would be defined for each plug-in. That
	 * ability is still supported by DataTables 1.10+ to provide backwards
	 * compatibility, but this option of use is now decremented and no longer
	 * documented in DataTables 1.10+.
	 *
	 *  @type object
	 *  @default {}
	 *
	 *  @example
	 *    // Show previous, next and current page buttons only
	 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
	 *      return [ 'previous', page, 'next' ];
	 *    };
	 */
	pager: {},


	renderer: {
		pageButton: {},
		header: {}
	},


	/**
	 * Sorting plug-ins - custom data source
	 * 
	 * The extension options for sorting of data available here is complimentary
	 * to the default type based sorting that DataTables typically uses. It
	 * allows much greater control over the the data that is being used to
	 * sort a column, but is necessarily therefore more complex.
	 * 
	 * This type of sorting is useful if you want to do sorting based on data
	 * live from the DOM (for example the contents of an 'input' element) rather
	 * than just the static string that DataTables knows of.
	 * 
	 * The way these plug-ins work is that you create an array of the values you
	 * wish to be sorted for the column in question and then return that array.
	 * The data in the array much be in the index order of the rows in the table
	 * (not the currently sorted order!). Which sort data gathering function is
	 * run here depends on the `sortDataType` parameter that is used for the
	 * column (if any).
	 *
	 * The functions defined take two parameters:
	 *
	 * 1. `{object}` DataTables settings object: see
	 *    {@link DataTable.models.oSettings}
	 * 2. `{int}` Target column index
	 *
	 * Each function is expected to return an array:
	 *
	 * * `{array}` Data for the column to be sorted upon
	 *
	 *  @type array
	 *
	 *  @example
	 *    // Sort using `input` node values
	 *    $.fn.dataTable.ext.sort['dom-text'] = function  ( settings, col )
	 *    {
	 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
	 *        return $('input', td).val();
	 *      } );
	 *    }
	 */
	sort: [],


	/**
	 * Type based plug-ins.
	 *
	 * Each column in DataTables has a type assigned to it, either by automatic
	 * detection or by direct assignment using the `type` option for the column.
	 * The type of a column will effect how it is sorted and filtered (plug-ins
	 * can also make use of the column type if required).
	 *
	 * @namespace
	 */
	type: {
		/**
		 * Type detection functions.
		 *
		 * The functions defined in this object are used to automatically detect
		 * a column's type, making initialisation of DataTables super easy, even
		 * when complex data is in the table.
		 *
		 * The functions defined take a single parameter:
		 *
	     *  1. `{*}` Data from the column cell to be analysed
		 *
		 * Each function is expected to return:
		 *
		 * * `{string|null}` Data type detected, or null if unknown (and thus
		 *   pass it on to the other type detection functions.
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Currency type detection plug-in:
		 *    $.fn.dataTable.ext.type.detect.push(
		 *      function ( data ) {
		 *        // Check the numeric part
		 *        if ( ! $.isNumeric( data.substring(1) ) ) {
		 *          return null;
		 *        }
		 *
		 *        // Check prefixed by currency
		 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
		 *          return 'currency';
		 *        }
		 *        return null;
		 *      }
		 *    );
		 */
		detect: [],


		/**
		 * Type based filter formatting.
		 *
		 * The type based filtering functions can be used to pre-format the
		 * data to be filtered up. For example, it can be used to strip HTML
		 * tags or to de-format telephone numbers for numeric only filtering.
		 *
		 * Note that is a filter is not defined for a column of a given type,
		 * no filter formatting will be performed.
		 * 
		 * Pre-processing of filtering data plug-ins - When you assign the sType
		 * for a column (or have it automatically detected for you by DataTables
		 * or a type detection plug-in), you will typically be using this for
		 * custom sorting, but it can also be used to provide custom filtering
		 * by allowing you to pre-processing the data and returning the data in
		 * the format that should be filtered upon. This is done by adding
		 * functions this object with a parameter name which matches the sType
		 * for that target column. This is the corollary of <i>afnSortData</i>
		 * for filtering data.
		 *
		 * The functions defined take a single parameter:
		 *
	     *  1. `{*}` Data from the column cell to be prepared for filtering
		 *
		 * Each function is expected to return:
		 *
		 * * `{string|null}` Formatted string that will be used for the filtering.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    $.fn.dataTable.ext.type.filter['title-numeric'] = function ( d ) {
		 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
		 *    }
		 */
		filter: {},


		/**
		 * Type based sorting.
		 *
		 * The column type tells DataTables what sorting to apply to the table
		 * when a column is sorted upon. The sort for each type that is defined,
		 * is defined by the functions available in this object.
		 *
		 * Each sorting option can be described by three properties added to
		 * this object:
		 *
		 * * `{type}-pre` - Pre-formatting function
		 * * `{type}-asc` - Ascending sort function
		 * * `{type}-desc` - Descending sort function
		 *
		 * All three can be used together, only `{type}-pre` or only
		 * `{type}-asc` and `{type}-desc` together. It is generally recommended
		 * that only `{type}-pre` is used, as this provides the optimal
		 * implementation in terms of speed, although the others are provided
		 * for compatibility with existing Javascript sort functions.
		 *
		 * `{type}-pre`: Functions defined take a single parameter:
		 *
	     *  1. `{*}` Data from the column cell to be prepared for sorting
		 *
		 * And return:
		 *
		 * * `{*}` Data to be sorted upon
		 *
		 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
		 * functions, taking two parameters:
		 *
	     *  1. `{*}` Data to compare to the second parameter
	     *  2. `{*}` Data to compare to the first parameter
		 *
		 * And returning:
		 *
		 * * `{*}` Sorting match: <0 if first parameter should be sorted lower
		 *   than the second parameter, ===0 if the two parameters are equal and
		 *   >0 if the first parameter should be sorted height than the second
		 *   parameter.
		 * 
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Numeric sorting of formatted numbers with a pre-formatter
		 *    $.extend( $.fn.dataTable.ext.type.sort, {
		 *      "string-pre": function(x) {
		 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
		 *        return parseFloat( a );
		 *      }
		 *    } );
		 *
		 *  @example
		 *    // Case-sensitive string sorting, with no pre-formatting method
		 *    $.extend( $.fn.dataTable.ext.sort, {
		 *      "string-case-asc": function(x,y) {
		 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		 *      },
		 *      "string-case-desc": function(x,y) {
		 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		 *      }
		 *    } );
		 */
		sort: {}
	},

	/**
	 * Unique DataTables instance counter
	 *
	 * @type int
	 * @private
	 */
	_unique: 0,


	//
	// Depreciated
	// The following properties are retained for backwards compatiblity only.
	// The should not be used in new projects and will be removed in a future
	// version
	//

	/**
	 * Version check function.
	 *  @type function
	 *  @depreciated Since 1.10
	 */
	fnVersionCheck: DataTable.fnVersionCheck,


	/**
	 * Index for what 'this' index API functions should use
	 *  @type int
	 *  @deprecated Since v1.10
	 */
	iApiIndex: 0,


	/**
	 * jQuery UI class container
	 *  @type object
	 *  @deprecated Since v1.10
	 */
	oJUIClasses: {},


	/**
	 * Software version
	 *  @type string
	 *  @deprecated Since v1.10
	 */
	sVersion: DataTable.version
};


//
// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
//
(function () {

var ext = DataTable.ext;

$.extend( ext, {
	afnFiltering: ext.filter,
	aTypes:       ext.type.detect,
	ofnSearch:    ext.type.filter,
	oSort:        ext.type.sort,
	afnSortData:  ext.sort,
	aoFeatures:   ext.feature,
	oApi:         ext.internal,
	oStdClasses:  ext.classes,
	oPagination:  ext.pager
} );

}());

