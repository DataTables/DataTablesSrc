
var DataTable = function ( selector, options )
{
	// When creating with `new`, create a new DataTable, returning the API instance
	if (this instanceof DataTable) {
		return $(selector).DataTable(options);
	}
	else {
		// Argument switching
		options = selector;
	}

	_buildInclude('api.legacy.js');

	var _that = this;
	var emptyInit = options === undefined;
	var len = this.length;

	if ( emptyInit ) {
		options = {};
	}

	this.oApi = this.internal = _ext.internal;

	// Extend with old style plug-in API methods
	for ( var fn in DataTable.ext.internal ) {
		if ( fn ) {
			this[fn] = _fnExternApiFunc(fn);
		}
	}

	this.each(function() {
		// For each initialisation we want to give it a clean initialisation
		// object that can be bashed around
		var o = {};
		var oInit = len > 1 ? // optimisation for single table case
			_fnExtend( o, options, true ) :
			options;

		_buildInclude('core.constructor.js');
	} );
	_that = null;
	return this;
};

_buildInclude('core.internal.js');
_buildInclude('api.util.js');
_buildInclude('core.compat.js');
_buildInclude('core.columns.js');
_buildInclude('core.data.js');
_buildInclude('core.draw.js');
_buildInclude('core.ajax.js');
_buildInclude('core.filter.js');
_buildInclude('core.info.js');
_buildInclude('core.init.js');
_buildInclude('core.length.js');
_buildInclude('core.page.js');
_buildInclude('core.processing.js');
_buildInclude('core.scrolling.js');
_buildInclude('core.sizing.js');
_buildInclude('core.sort.js');
_buildInclude('core.state.js');
_buildInclude('core.support.js');

_buildInclude('api.base.js');
_buildInclude('api.table.js');
_buildInclude('api.draw.js');
_buildInclude('api.page.js');
_buildInclude('api.ajax.js');
_buildInclude('api.selectors.js');
_buildInclude('api.rows.js');
_buildInclude('api.row.details.js');
_buildInclude('api.columns.js');
_buildInclude('api.cells.js');
_buildInclude('api.order.js');
_buildInclude('api.search.js');
_buildInclude('api.state.js');
_buildInclude('api.static.js');
_buildInclude('api.core.js');

/**
 * Version string for plug-ins to check compatibility. Allowed format is
 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
 * only for non-release builds. See http://semver.org/ for more information.
 *  @member
 *  @type string
 *  @default Version number
 */
DataTable.version = "1.12.1";

/**
 * Private data store, containing all of the settings objects that are
 * created for the tables on a given page.
 *
 * Note that the `DataTable.settings` object is aliased to
 * `jQuery.fn.dataTableExt` through which it may be accessed and
 * manipulated, or `jQuery.fn.dataTable.settings`.
 *  @member
 *  @type array
 *  @default []
 *  @private
 */
DataTable.settings = [];

/**
 * Object models container, for the various models that DataTables has
 * available to it. These models define the objects that are used to hold
 * the active state and configuration of the table.
 *  @namespace
 */
DataTable.models = {};
_buildInclude('model.search.js');
_buildInclude('model.row.js');
_buildInclude('model.column.js');
_buildInclude('model.defaults.js');
_buildInclude('model.defaults.columns.js');
_buildInclude('model.settings.js');

/**
 * Extension object for DataTables that is used to provide all extension
 * options.
 *
 * Note that the `DataTable.ext` object is available through
 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
 *  @namespace
 *  @extends DataTable.models.ext
 */
_buildInclude('ext.js');
_buildInclude('ext.classes.js');
_buildInclude('ext.paging.js');
_buildInclude('ext.types.js');
_buildInclude('ext.filter.js');
_buildInclude('ext.sorting.js');
_buildInclude('ext.renderer.js');
_buildInclude('ext.helpers.js');
_buildInclude('api.internal.js');

// jQuery access
$.fn.dataTable = DataTable;

// Provide access to the host jQuery object (circular reference)
DataTable.$ = $;

// Legacy aliases
$.fn.dataTableSettings = DataTable.settings;
$.fn.dataTableExt = DataTable.ext;

// With a capital `D` we return a DataTables API instance rather than a
// jQuery object
$.fn.DataTable = function ( opts ) {
	return $(this).dataTable( opts ).api();
};

// All properties that are available to $.fn.dataTable should also be
// available on $.fn.DataTable
$.each( DataTable, function ( prop, val ) {
	$.fn.DataTable[ prop ] = val;
} );
