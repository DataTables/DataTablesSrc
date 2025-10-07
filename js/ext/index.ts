
import classes from "./classes";
import pager, {render as pagingRenderer} from './paging';
import renderer from './renderer';
import {features, legacy as featuresLegacy} from '../features/index';
import { store } from "./types";
import {versionCheck} from "../api/static";

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
 */
const ext = {
	/**
	 * DataTables build type (expanded by the download builder)
	 *
	 *  @type string
	 */
	builder: "-source-",

	/**
	 * Buttons. For use with the Buttons extension for DataTables. This is
	 * defined here so other extensions can define buttons regardless of load
	 * order. It is _not_ used by DataTables core.
	 *
	 *  @type object
	 *  @default {}
	 */
	buttons: {},


	/**
	 * ColumnControl buttons and content
	 *
	 *  @type object
	 */
	ccContent: {},


	/**
	 * Element class names
	 */
	classes,


	/**
	 * Error reporting.
	 * 
	 * How should DataTables report an error. Can take the value 'alert',
	 * 'throw', 'none' or a function.
	 *
	 *  @type string|function
	 *  @default alert
	 */
	errMode: "alert",

	/** HTML entity escaping */
	escape: {
		/** When reading data-* attributes for initialisation options */
		attributes: false
	},

	/**
	 * Legacy so v1 plug-ins don't throw js errors on load
	 */
	feature: featuresLegacy,

	/**
	 * Feature plug-ins.
	 * 
	 * This is an object of callbacks which provide the features for DataTables
	 * to be initialised via the `layout` option.
	 */
	features: features,


	/**
	 * Row searching.
	 * 
	 * This method of searching is complimentary to the default type based
	 * searching, and a lot more comprehensive as it allows you complete control
	 * over the searching logic. Each element in this array is a function
	 * (parameters described below) that is called for every row in the table,
	 * and your logic decides if it should be included in the searching data set
	 * or not.
	 *
	 * Searching functions have the following input parameters:
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
	 * * {boolean} Include the row in the searched result set (true) or not
	 *   (false)
	 *
	 * Note that as with the main search ability in DataTables, technically this
	 * is "filtering", since it is subtractive. However, for consistency in
	 * naming we call it searching here.
	 *
	 *  @type array
	 *  @default []
	 *
	 *  @example
	 *    // The following example shows custom search being applied to the
	 *    // fourth column (i.e. the data[3] index) based on two input values
	 *    // from the end-user, matching the data in a certain range.
	 *    $.fn.dataTable.ext.search.push(
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
	search: [],


	/**
	 * Selector extensions
	 *
	 * The `selector` option can be used to extend the options available for the
	 * selector modifier options (`selector-modifier` object data type) that
	 * each of the three built in selector types offer (row, column and cell +
	 * their plural counterparts). For example the Select extension uses this
	 * mechanism to provide an option to select only rows, columns and cells
	 * that have been marked as selected by the end user (`{selected: true}`),
	 * which can be used in conjunction with the existing built in selector
	 * options.
	 *
	 * Each property is an array to which functions can be pushed. The functions
	 * take three attributes:
	 *
	 * * Settings object for the host table
	 * * Options object (`selector-modifier` object type)
	 * * Array of selected item indexes
	 *
	 * The return is an array of the resulting item indexes after the custom
	 * selector has been applied.
	 *
	 *  @type object
	 */
	selector: {
		cell: [],
		column: [],
		row: []
	},


	settings: [] as any[],


	/**
	 * Legacy configuration options. Enable and disable legacy options that
	 * are available in DataTables.
	 *
	 *  @type object
	 */
	legacy: {
		/**
		 * Enable / disable DataTables 1.9 compatible server-side processing
		 * requests
		 *
		 *  @type boolean
		 *  @default null
		 */
		ajax: null
	},


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
	pager: pager,


	renderer: {
		footer: renderer.footer,
		header: renderer.header,
		layout: renderer.layout,
		pagingButton: pagingRenderer.pagingButton,
		pagingContainer: pagingRenderer.pagingContainer
	},


	/**
	 * Ordering plug-ins - custom data source
	 * 
	 * The extension options for ordering of data available here is complimentary
	 * to the default type based ordering that DataTables typically uses. It
	 * allows much greater control over the data that is being used to
	 * order a column, but is necessarily therefore more complex.
	 * 
	 * This type of ordering is useful if you want to do ordering based on data
	 * live from the DOM (for example the contents of an 'input' element) rather
	 * than just the static string that DataTables knows of.
	 * 
	 * The way these plug-ins work is that you create an array of the values you
	 * wish to be ordering for the column in question and then return that
	 * array. The data in the array much be in the index order of the rows in
	 * the table (not the currently ordering order!). Which order data gathering
	 * function is run here depends on the `dt-init columns.orderDataType`
	 * parameter that is used for the column (if any).
	 *
	 * The functions defined take two parameters:
	 *
	 * 1. `{object}` DataTables settings object: see
	 *    {@link DataTable.models.oSettings}
	 * 2. `{int}` Target column index
	 *
	 * Each function is expected to return an array:
	 *
	 * * `{array}` Data for the column to be ordering upon
	 *
	 *  @type array
	 *
	 *  @example
	 *    // Ordering using `input` node values
	 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
	 *    {
	 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
	 *        return $('input', td).val();
	 *      } );
	 *    }
	 */
	order: {},


	/**
	 * Type based plug-ins.
	 *
	 * Each column in DataTables has a type assigned to it, either by automatic
	 * detection or by direct assignment using the `type` option for the column.
	 * The type of a column will effect how it is ordering and search (plug-ins
	 * can also make use of the column type if required).
	 */
	type: store,

	/**
	 * Unique DataTables instance counter
	 *
	 * @type int
	 * @private
	 */
	_unique: 0,


	//
	// Depreciated
	// The following properties are retained for backwards compatibility only.
	// The should not be used in new projects and will be removed in a future
	// version
	//

	/**
	 * Version check function.
	 *  @type function
	 *  @depreciated Since 1.10
	 */
	fnVersionCheck: versionCheck,


	/**
	 * Index for what 'this' index API functions should use
	 *  @type int
	 *  @deprecated Since v1.10
	 */
	iApiIndex: 0,


	/**
	 * Software version
	 *  @type string
	 */
	version: '2.3.4'
};


//
// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
//
$.extend( ext, {
	afnFiltering: ext.search,
	aTypes:       ext.type.detect,
	ofnSearch:    ext.type.search,
	oSort:        ext.type.order,
	afnSortData:  ext.order,
	aoFeatures:   ext.feature,
	oStdClasses:  ext.classes,
	oPagination:  ext.pager,
	sVersion:     ext.version
} );

export default ext;
