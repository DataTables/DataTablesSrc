
import { jQuerySetup } from "../core/compat";
import DataTable from "../dataTable";
import dom from "../dom";
import ext from "../ext/index";
import { arrayLike } from "../util/is";
import Api from "./base";

// Can be assigned in DateTable.use()
var __bootstrap;
var __foundation;
var __luxon;
var __moment;
var __dateTime;

/**
 * Set the libraries that DataTables uses, or the global objects.
 * Note that the arguments can be either way around (legacy support)
 * and the second is optional. See docs.
 */
export function use (arg1, arg2?) {
	// Reverse arguments for legacy support
	var module = typeof arg1 === 'string'
		? arg2
		: arg1;
	var type = typeof arg2 === 'string'
		? arg2
		: arg1;

	// Getter
	if (module === undefined && typeof type === 'string') {
		switch (type) {
			case 'lib':
			case 'jq':
				return $;

			case 'win':
				return window;

			case 'datetime':
				return __dateTime;

			case 'luxon':
				return __luxon || (window as any).luxon || null;

			case 'moment':
				return __moment || (window as any).moment || null;

			case 'bootstrap':
				// Use local if set, otherwise try window, which could be undefined
				return __bootstrap || (window as any).bootstrap || null;

			case 'foundation':
				// Ditto
				return __foundation || (window as any).Foundation || null;

			default:
				return null;
		}
	}

	// Setter
	if (type === 'lib' || type === 'jq' || (module && module.fn && module.fn.jquery)) {
		// TODO $ = module;
		jQuerySetup(jQuery, DataTable);
	}
	else if (type === 'win' || (module && module.document)) {
		window = module;
		document = module.document;
	}
	else if (type === 'datetime' || (module && module.type === 'DateTime')) {
		__dateTime = module;
	}
	else if (type === 'luxon' || (module && module.FixedOffsetZone)) {
		__luxon = module;
	}
	else if (type === 'moment' || (module && module.isMoment)) {
		__moment = module;
	}
	else if (type === 'bootstrap' || (module && module.Modal && module.Modal.NAME === 'modal'))
	{
		// This is currently for BS5 only. BS3/4 attach to jQuery, so no need to use `.use()`
		__bootstrap = module;
	}
	else if (type === 'foundation' || (module && module.Reveal)) {
		__foundation = module;
	}
}

/**
 * CommonJS factory function pass through. This will check if the arguments
 * given are a window object or a jQuery object. If so they are set
 * accordingly.
 * @param {*} root Window
 * @param {*} jq jQUery
 * @returns {boolean} Indicator
 */
export function factory (root, jq) {
	var is = false;

	// Test if the first parameter is a window object
	if (root && root.document) {
		window = root;
		document = root.document;
	}

	// Test if the second parameter is a jQuery object
	if (jq && jq.fn && jq.fn.jquery) {
		// TODO $ = jq;
		is = true;
	}

	return is;
}

/**
 * Provide a common method for plug-ins to check the version of DataTables being
 * used, in order to ensure compatibility.
 *
 *  @param {string} version Version string to check for, in the format "X.Y.Z".
 *    Note that the formats "X" and "X.Y" are also acceptable.
 *  @param {string} [version2=current DataTables version] As above, but optional.
 *   If not given the current DataTables version will be used.
 *  @returns {boolean} true if this version of DataTables is greater or equal to
 *    the required version, or false if this version of DataTales is not
 *    suitable
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
 */
export function versionCheck( version, version2 )
{
	var aThis = version2 ?
		version2.split('.') :
		ext.version.split('.');
	var aThat = version.split('.');
	var iThis, iThat;

	for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
		iThis = parseInt( aThis[i], 10 ) || 0;
		iThat = parseInt( aThat[i], 10 ) || 0;

		// Parts are the same, keep comparing
		if (iThis === iThat) {
			continue;
		}

		// Parts are different, return immediately
		return iThis > iThat;
	}

	return true;
};


/**
 * Check if a `<table>` node is a DataTable table already or not.
 *
 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
 *      selector for the table to test. Note that if more than more than one
 *      table is passed on, only the first will be checked
 *  @returns {boolean} true the table given is a DataTable, or false otherwise
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
 *      $('#example').dataTable();
 *    }
 */
export function isDataTable( table )
{
	var t = dom.s(table).get(0);
	var is = false;

	if ( table instanceof Api ) {
		return true;
	}
	else if (arrayLike(table)) {
		// jQuery compatibility
		table = Array.from(table);
	}

	for (let i=0 ; i<ext.settings.length ; i++) {
		let ctx = ext.settings[i];

		var head = ctx.nScrollHead ? dom.s(ctx.nScrollHead).find('table').get(0) : null;
		var foot = ctx.nScrollFoot ? dom.s(ctx.nScrollFoot).find('table').get(0) : null;

		if ( ctx.nTable === t || head === t || foot === t ) {
			is = true;
		}
	}

	return is;
};


/**
 * Get all DataTable tables that have been initialised - optionally you can
 * select to get only currently visible tables.
 *
 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
 *    or visible tables only.
 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
 *    DataTables
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    $.each( $.fn.dataTable.tables(true), function () {
 *      $(table).DataTable().columns.adjust();
 *    } );
 */
export function tables( visible )
{
	var api = false;

	if ( $.isPlainObject( visible ) ) {
		api = visible.api;
		visible = visible.visible;
	}

	var a = ext.settings
		.filter( function (o) {
			return !visible || (visible && $(o.nTable).is(':visible')) 
				? true
				: false;
		} )
		.map( function (o) {
			return o.nTable;
		});

	return api ?
		new Api( a ) :
		a;
};

