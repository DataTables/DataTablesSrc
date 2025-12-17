import Api from './api/index';
import * as apiStatic from './api/static';
import {
	callbackFire,
	callbackReg,
	dataSource,
	escapeObject,
	listener,
	log,
	map
} from './api/support';
import { addColumn, applyColumnDefs, columnOptions } from './core/columns';
import {
	browser,
	browserDetect,
	camelToHungarian,
	compatCols,
	compatOpts,
	hungarianToCamel
} from './core/compat';
import { getCellData } from './core/data';
import { detectHeader } from './core/draw';
import { initialise } from './core/init';
import { sortingClasses } from './core/order';
import { saveState } from './core/state';
import dom from './dom';
import ext from './ext';
import helpers, { datetime } from './ext/helpers';
import { register as registerType, types } from './ext/types';
import registerFeature from './features';
import models from './model';
import columnDefaults from './model/columns/defaults';
import defaults, { Defaults } from './model/defaults';
import createContext from './model/settings';
import util from './util';

const DataTable = function (
	selector: string | HTMLElement,
	options: Partial<typeof defaults>
) {
	// Check if called with a window or jQuery object for DOM less applications
	// This is for backwards compatibility
	if (apiStatic.factory(selector as any, options as any)) {
		return DataTable;
	}

	// Allow access to the API from the core class
	this.api = () => {
		return new Api(selector);
	};

	// Backwards compatibility with this "class" being exposed as
	// `$().dataTable()`. We can't simply provide that as a wrapper, as there
	// are properties on this class which are expected to be exposed.
	if (typeof this.jquery === 'string') {
		// Typescript doesn't like the `return api` from the constructor, but is
		// it valid Javascript, and allows backwards compatibility, hence the any
		new (DataTable as any)(this.toArray(), selector); // note argument shift

		return this;
	}

	var emptyInit = options === undefined;
	let tableEls = dom.s(selector);
	let len = tableEls.count();

	if (emptyInit) {
		options = {};
	}

	tableEls.each(tableEl => {
		// For each initialisation we want to give it a clean initialisation
		// object that can be bashed around
		var o = {};
		var init: Partial<typeof defaults> =
			len > 1 // optimisation for single table case
				? util.object.assignDeepObjects(o, options, true)
				: options;

		var i = 0,
			iLen;
		var id = tableEl.getAttribute('id');
		var table = dom.s(tableEl);

		// Sanity check
		if (tableEl.nodeName.toLowerCase() != 'table') {
			log(
				null,
				0,
				'Non-table node initialisation (' + tableEl.nodeName + ')',
				2
			);
			return;
		}

		// Special case for options
		if (init.on && init.on.options) {
			listener(table, 'options', init.on.options);
		}

		table.trigger('options.dt', true, [init]);

		// Backwards compatibility parameter mapping
		compatOpts(defaults);
		compatCols(columnDefaults);

		// Allow data properties on the table element to be used as
		// initialisation options
		util.object.assign(init, escapeObject(table.data()));

		compatOpts(init);

		/* Check to see if we are re-initialising a table */
		var allSettings = ext.settings;
		for (i = 0, iLen = allSettings.length; i < iLen; i++) {
			var s = allSettings[i];

			/* Base check on table node */
			if (
				s.nTable == tableEl ||
				(s.nTHead && s.nTHead.parentNode == tableEl) ||
				(s.nTFoot && s.nTFoot.parentNode == tableEl)
			) {
				var retrieve = init.retrieve || false;
				var destroy = init.destroy || false;

				if (emptyInit || retrieve) {
					return s.oInstance;
				}
				else if (destroy) {
					new Api(s).destroy();
					break;
				}
				else {
					log(s, 0, 'Cannot reinitialise DataTable', 3);
					return;
				}
			}

			/* If the element we are initialising has the same ID as a table
			 * which was previously initialised, but the table nodes don't match
			 * (from before) then we destroy the old instance by simply deleting
			 * it. This is under the assumption that the table has been
			 * destroyed by other methods. Anyone using non-id selectors will
			 * need to do this manually
			 */
			if (s.sTableId == tableEl.id) {
				allSettings.splice(i, 1);
				break;
			}
		}

		/* Ensure the table has an ID - required for accessibility */
		if (id === null || id === '') {
			id = 'DataTables_Table_' + ext._unique++;
			tableEl.id = id;
		}

		// Replacing an existing colgroup with our own. Not ideal, but a merge
		// could take a lot of code
		table.children('colgroup').remove();

		// Create the settings object for this table and set some of the default
		// parameters
		var settings = createContext({
			sDestroyWidth: table.width(),
			sInstance: id,
			sTableId: id,
			colgroup: dom.c('colgroup').prependTo(tableEl),
			fastData: function (row, column, type) {
				return getCellData(settings, row, column, type);
			}
		});

		settings.nTable = tableEl;
		settings.init = init;

		allSettings.push(settings);

		// Make a single API instance available for internal handling
		settings.api = new Api(settings);

		// Need to add the instance after the instance after the settings object
		// has been added to the settings array, so we can self reference the
		// table instance if more than one
		settings.oInstance = this; // TODO, not sure about this?

		// If the length menu is given, but the init display length is not, use
		// the length menu
		if (init.lengthMenu && !init.pageLength) {
			init.pageLength = Array.isArray(init.lengthMenu[0])
				? init.lengthMenu[0][0]
				: typeof init.lengthMenu[0] === 'number'
				? init.lengthMenu[0]
				: init.lengthMenu[0].value;
		}

		// Apply the defaults and init options to make a single init object will
		// all options defined from defaults and instance options.
		let config: Defaults = util.object.assignDeepObjects(
			util.object.assignDeep({}, defaults),
			init
		);

		// Map the initialisation options onto the context object
		map(settings.features, config, [
			'autoWidth',
			'deferRender',
			'info',
			'lengthChange',
			'orderClasses',
			'ordering',
			'orderMulti',
			'paging',
			'processing',
			'searching',
			'serverSide'
		]);
		map(settings, config, [
			'ajax',
			'formatNumber',
			'serverMethod',
			'order',
			'orderFixed',
			'lengthMenu',
			'pagingType',
			'stateDuration',
			'orderCellsTop',
			'tabIndex',
			'dom',
			'stateLoadCallback',
			'stateSaveCallback',
			'renderer',
			'searchDelay',
			'rowId',
			'caption',
			'layout',
			'orderDescReverse',
			'orderIndicators',
			'orderHandler',
			'titleRow',
			'typeDetect',
			'pageLength',
			['search', 'previousSearch'],
			['searchCols', 'preSearchCols']
		]);
		map(settings.scroll, config, [
			['scrollX', 'x'],
			['scrollXInner', 'xInner'],
			['scrollY', 'y'],
			['scrollCollapse', 'collapse']
		]);
		map(settings.language, config, 'infoCallback');

		/* Callback functions which are array driven */
		callbackReg(settings, 'draw', config.drawCallback);
		callbackReg(settings, 'stateSaveParams', config.stateSaveParams);
		callbackReg(settings, 'stateLoadParams', config.stateLoadParams);
		callbackReg(settings, 'stateLoaded', config.stateLoaded);
		callbackReg(settings, 'row', config.rowCallback);
		callbackReg(settings, 'rowCreated', config.createdRow);
		callbackReg(settings, 'header', config.headerCallback);
		callbackReg(settings, 'footer', config.footerCallback);
		callbackReg(settings, 'init', config.initComplete);
		callbackReg(settings, 'preDraw', config.preDrawCallback);

		settings.rowIdFn = util.get(settings.rowId);

		// Add event listeners
		if (config.on) {
			Object.keys(config.on).forEach(function (key) {
				listener(table, key, config.on![key]);
			});
		}

		// Browser support detection
		browserDetect(settings);

		var classes = settings.classes;

		util.object.assignDeep(classes, ext.classes, config.classes as any);
		table.classAdd(classes.table);

		if (!settings.features.paging) {
			config.displayStart = 0;
		}

		if (settings.displayStartInit === -1) {
			// Display start point, taking into account the save saving
			settings.displayStartInit = config.displayStart!;
			settings.displayStart = config.displayStart!; // TODO remove !
		}

		var defer = config.deferLoading;
		if (defer !== null) {
			settings.deferLoading = true;

			if (Array.isArray(defer)) {
				settings.recordsDisplay = defer[0];
				settings.recordsTotal = defer[1];
			}
			else {
				settings.recordsDisplay = defer!; // TODO remove !
				settings.recordsTotal = defer!;
			}
		}

		/*
		 * Columns
		 * See if we should load columns automatically or use defined ones
		 */
		var columnsInit: any[] = [];
		var thead = table.children('thead');
		var initHeaderLayout = detectHeader(settings, thead.get(0), false);

		// If we don't have a columns array, then generate one with nulls
		if (config.columns) {
			columnsInit = config.columns;
		}
		else if (initHeaderLayout.length) {
			for (i = 0, iLen = initHeaderLayout[0].length; i < iLen; i++) {
				columnsInit.push(null);
			}
		}

		// Add the columns
		for (i = 0, iLen = columnsInit.length; i < iLen; i++) {
			addColumn(settings);
		}

		// Apply the column definitions
		applyColumnDefs(
			settings,
			config.columnDefs,
			columnsInit,
			initHeaderLayout,
			function (idx, def) {
				columnOptions(settings, idx, def);
			}
		);

		/* HTML5 attribute detection - build an mData object automatically if
		 * the attributes are found
		 */
		var rowOne = table.children('tbody').find('tr:first-child').eq(0);

		if (rowOne.count()) {
			var a = function (cell: HTMLElement, name: string) {
				return cell.getAttribute('data-' + name) !== null ? name : null;
			};

			rowOne
				.eq(0)
				.children('th, td')
				.each(function (cell, loop) {
					var col = settings.columns[loop];

					if (!col) {
						log(settings, 0, 'Incorrect column count', 18);
					}

					if (col.data === loop) {
						var sort = a(cell, 'sort') || a(cell, 'order');
						var filter = a(cell, 'filter') || a(cell, 'search');

						if (sort !== null || filter !== null) {
							col.data = {
								_: loop + '.display',
								sort: sort !== null ? loop + '.@data-' + sort : undefined,
								type: sort !== null ? loop + '.@data-' + sort : undefined,
								filter: filter !== null ? loop + '.@data-' + filter : undefined
							};
							col._isArrayHost = true;

							columnOptions(settings, loop);
						}
					}
				});
		}

		// Must be done after everything which can be overridden by the state
		// saving!
		callbackReg(settings, 'draw', saveState);

		var features = settings.features;
		if (config.stateSave) {
			features.stateSave = true;
		}

		// If aaSorting is not defined, then we use the first indicator in
		// asSorting in case that has been altered, so the default sort reflects
		// that option
		if (config.order === undefined) {
			var sorting = settings.order;
			for (i = 0, iLen = sorting.length; i < iLen; i++) {
				sorting[i][1] = settings.columns[i].orderSequence[0];
			}
		}

		// Do a first pass on the sorting classes (allows any size changes to be
		// taken into account, and also will apply sorting disabled classes if
		// disabled
		sortingClasses(settings);

		callbackReg(settings, 'draw', function () {
			if (
				settings.bSorted ||
				dataSource(settings) === 'ssp' ||
				features.deferRender
			) {
				sortingClasses(settings);
			}
		});

		/*
		 * Table HTML init Cache the header, body and footer as required,
		 * creating them if needed
		 */
		var caption = table.children('caption');

		if (settings.caption) {
			if (caption.count() === 0) {
				caption = dom.c('caption').appendTo(table);
			}

			caption.html(settings.caption);
		}

		// Store the caption side, so we can remove the element from the
		// document when creating the element
		if (caption.count()) {
			(caption.get(0) as any)._captionSide = caption.css('caption-side');
			settings.captionNode = caption.get(0);
		}

		if (thead.count() === 0) {
			thead = dom.c('thead').appendTo(table) as any;
		}
		settings.nTHead = thead.get(0);

		var tbody = table.children('tbody');
		if (tbody.count() === 0) {
			tbody = dom.c('tbody').insertAfter(thead.get(0));
		}
		settings.nTBody = tbody.get(0);

		var tfoot = table.children('tfoot');
		if (tfoot.count() === 0) {
			// If we are a scrolling table, and no footer has been given, then
			// we need to create a tfoot element for the caption element to be
			// appended to
			tfoot = dom.c('tfoot').appendTo(table);
		}
		settings.nTFoot = tfoot.get(0);

		// Copy the data index array
		settings.aiDisplay = settings.aiDisplayMaster.slice();

		// Initialisation complete - table can be drawn
		settings.bInitialised = true;

		// Language definitions
		var language = settings.language;

		if (config.language) {
			util.object.assignDeep(language, config.language);
		}

		if (language.url) {
			// Get the language definitions from a file
			util.ajax({
				dataType: 'json',
				url: language.url,
				success: function (json) {
					hungarianToCamel(json);
					util.object.assignDeep(language, json, settings.init.language as any);

					callbackFire(settings, null, 'i18n', [settings], true);
					initialise(settings);
				},
				error: function () {
					// Error occurred loading language file
					log(settings, 0, 'i18n file loading error', 21);

					// Continue on as best we can
					initialise(settings);
				}
			});
		}
		else {
			callbackFire(settings, null, 'i18n', [settings], true);
			initialise(settings);
		}
	});

	// This is unusual, but we want the return from the exposed `DataTable`
	// function to be an API instance, rather than the core, which is not
	// publicly exposed.
	return this.api();
};

DataTable.type = registerType;
DataTable.types = types;
DataTable.render = helpers;
DataTable.ext = ext;
DataTable.use = util.external;
DataTable.factory = apiStatic.factory;
DataTable.versionCheck = util.version.check;
DataTable.version = ext.version;
DataTable.isDataTable = apiStatic.isDataTable;
DataTable.tables = apiStatic.tables;
DataTable.camelToHungarian = camelToHungarian;
DataTable.util = util;
DataTable.Api = Api;
DataTable.datetime = datetime;
DataTable.__browser = browser;
DataTable.dom = dom;
DataTable.ajax = util.ajax;

/**
 * Private data store, containing all of the settings objects that are created
 * for the tables on a given page.
 */
DataTable.settings = ext.settings;

/**
 * Object models container, for the various models that DataTables has available
 * to it. These models define the objects that are used to hold the active state
 * and configuration of the table.
 */
DataTable.models = models;
DataTable.defaults = defaults;

DataTable.feature = {
	register: registerFeature
};

// Register the libraries
util.external(DataTable);

if ((window as any).jQuery) {
	util.external((window as any).jQuery);
}

export default DataTable;
