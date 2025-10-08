
import { register as registerType, types } from './ext/types';
import helpers, {datetime} from './ext/helpers';
import models from './model/index';
import defaults from './model/defaults';
import construct from './core/constructor';
import { extend } from './core/support';
import ext from './ext/index';
import * as apiStatic from './api/static';
import { camelToHungarian } from "./core/compat";
import util from './api/util';
import Api from './api/index';
import registerFeature from './features/index';
import { browser } from './core/compat';

// TODO typing
var DataTable: any = function ( selector, options )
{
	// Check if called with a window or jQuery object for DOM less applications
	// This is for backwards compatibility
	if (apiStatic.factory(selector, options)) {
		return DataTable;
	}

	// When creating with `new`, create a new DataTable, returning the API instance
	if (this instanceof DataTable) {
		return ($(selector) as any).DataTable(options);
	}
	else {
		// Argument switching
		options = selector;
	}

	var _that = this;
	var emptyInit = options === undefined;
	var len = this.length;

	if ( emptyInit ) {
		options = {};
	}

	// Method to get DT API instance from jQuery object
	this.api = function ()
	{
		return new Api( this );
	};

	this.each(function() {
		// For each initialisation we want to give it a clean initialisation
		// object that can be bashed around
		var o = {};
		var init = len > 1 ? // optimisation for single table case
		extend( o, options, true ) :
			options;

		construct(this, _that, init, emptyInit);
	} );
	_that = null;
	return this;
};

DataTable.type = registerType;
DataTable.types = types;
DataTable.render = helpers;
DataTable.ext = ext;
DataTable.use = apiStatic.use;
DataTable.factory = apiStatic.factory;
DataTable.versionCheck = apiStatic.versionCheck;
DataTable.version = ext.version;
DataTable.isDataTable = apiStatic.isDataTable;
DataTable.tables = apiStatic.tables;
DataTable.camelToHungarian = camelToHungarian;
DataTable.util = util;
DataTable.Api = Api;
DataTable.datetime = datetime;
DataTable.__browser = browser;

/**
 * Version string for plug-ins to check compatibility. Allowed format is
 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
 * only for non-release builds. See https://semver.org/ for more information.
 *  @member
 *  @type string
 *  @default Version number
 */
DataTable.version = ext.version;

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
DataTable.settings = ext.settings;

/**
 * Object models container, for the various models that DataTables has
 * available to it. These models define the objects that are used to hold
 * the active state and configuration of the table.
 *  @namespace
 */
DataTable.models = models;
DataTable.defaults = defaults;

DataTable.feature = {
	register: registerFeature
};

// Provide access to the host jQuery object (circular reference)
DataTable.$ = $;

// jQuery access
($.fn as any).dataTable = DataTable;


// Legacy aliases
($.fn as any).dataTableSettings = ext.settings;
($.fn as any).dataTableExt = DataTable.ext;

// With a capital `D` we return a DataTables API instance rather than a
// jQuery object
($.fn as any).DataTable = function ( opts ) {
	return ($(this) as any).dataTable( opts ).api();
};

// All properties that are available to $.fn.dataTable should also be
// available on $.fn.DataTable
$.each( DataTable, function ( prop, val ) {
	($.fn as any).DataTable[ prop ] = val;
} );
