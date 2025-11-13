import Api from './api/index';
import * as apiStatic from './api/static';
import {
	callbackFire,
	callbackReg,
	dataSource,
	escapeObject,
	listener,
	log,
	map,
} from './api/support';
import util from './api/util';
import { addColumn, applyColumnDefs, columnOptions } from './core/columns';
import {
	browser,
	browserDetect,
	camelToHungarian,
	compatCols,
	compatOpts,
} from './core/compat';
import { getCellData } from './core/data';
import { detectHeader } from './core/draw';
import { initialise } from './core/init';
import { sortingClasses } from './core/sort';
import { saveState } from './core/state';
import dom from './dom';
import ext from './ext';
import helpers, { datetime } from './ext/helpers';
import { register as registerType, types } from './ext/types';
import registerFeature from './features';
import models from './model';
import columnDefaults from './model/columns/defaults';
import defaults from './model/defaults';
import Settings from './model/settings';
import ajax from './util/ajax';
import external from './util/external';
import * as object from './util/object';
import { check as versionCheck } from './util/version';

// TODO typing
const DataTable: any = function (
	selector: string | HTMLElement,
	options: Partial<typeof defaults>
) {
	// Check if called with a window or jQuery object for DOM less applications
	// This is for backwards compatibility
	if (apiStatic.factory(selector, options)) {
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
		new DataTable(this.toArray(), selector); // note argument shift

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
				? object.assignDeepObjects(o, options, true)
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

		/* Backwards compatibility for the defaults */
		compatOpts(defaults);
		compatCols(columnDefaults);

		/* Convert the camel-case defaults to Hungarian */
		camelToHungarian(defaults, defaults, true);
		camelToHungarian(columnDefaults, columnDefaults, true);

		/* Setting up the initialisation object */
		camelToHungarian(
			defaults,
			object.assign(init, escapeObject(table.data())),
			true
		);

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
				var bRetrieve =
					init.bRetrieve !== undefined
						? init.bRetrieve
						: (defaults as any).bRetrieve;
				var bDestroy =
					init.bDestroy !== undefined
						? init.bDestroy
						: (defaults as any).bDestroy;

				if (emptyInit || bRetrieve) {
					return s.oInstance;
				}
				else if (bDestroy) {
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
		var settings: any = object.assignDeep(new Settings(), {
			sDestroyWidth: table.get(0).style.width,
			sInstance: id,
			sTableId: id,
			colgroup: dom.c('colgroup').prependTo(tableEl),
			fastData: function (row: number, column: number, type: string) {
				return getCellData(settings, row, column, type);
			},
		});

		settings.nTable = tableEl;
		settings.oInit = init;

		allSettings.push(settings);

		// Make a single API instance available for internal handling
		settings.api = new Api(settings);

		// Need to add the instance after the instance after the settings object
		// has been added to the settings array, so we can self reference the
		// table instance if more than one
		settings.oInstance = this; // TODO, not sure about this?

		// Backwards compatibility, before we apply all the defaults
		compatOpts(init);

		// If the length menu is given, but the init display length is not, use
		// the length menu
		if (init.aLengthMenu && !init.iDisplayLength) {
			init.iDisplayLength = Array.isArray(init.aLengthMenu[0])
				? init.aLengthMenu[0][0]
				: typeof init.aLengthMenu[0] === 'number'
				? init.aLengthMenu[0]
				: init.aLengthMenu[0].value;
		}

		// Apply the defaults and init options to make a single init object will
		// all options defined from defaults and instance options.
		let config: typeof defaults = object.assignDeepObjects(
			object.assignDeep({}, defaults),
			init
		);

		// Map the initialisation options onto the settings object
		map(settings.oFeatures, config, [
			'bPaginate',
			'bLengthChange',
			'bFilter',
			'bSort',
			'bSortMulti',
			'bInfo',
			'bProcessing',
			'bAutoWidth',
			'bSortClasses',
			'bServerSide',
			'bDeferRender',
		]);
		map(settings, config, [
			'ajax',
			'fnFormatNumber',
			'sServerMethod',
			'aaSorting',
			'aaSortingFixed',
			'aLengthMenu',
			'sPaginationType',
			'iStateDuration',
			'bSortCellsTop',
			'iTabIndex',
			'sDom',
			'fnStateLoadCallback',
			'fnStateSaveCallback',
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
			['iCookieDuration', 'iStateDuration'], // backwards compat
			['oSearch', 'oPreviousSearch'],
			['aoSearchCols', 'aoPreSearchCols'],
			['iDisplayLength', '_iDisplayLength'],
		]);
		map(settings.oScroll, config, [
			['sScrollX', 'sX'],
			['sScrollXInner', 'sXInner'],
			['sScrollY', 'sY'],
			['bScrollCollapse', 'bCollapse'],
		]);
		map(settings.oLanguage, config, 'fnInfoCallback');

		/* Callback functions which are array driven */
		callbackReg(settings, 'aoDrawCallback', config.fnDrawCallback);
		callbackReg(settings, 'aoStateSaveParams', config.fnStateSaveParams);
		callbackReg(settings, 'aoStateLoadParams', config.fnStateLoadParams);
		callbackReg(settings, 'aoStateLoaded', config.fnStateLoaded);
		callbackReg(settings, 'aoRowCallback', config.fnRowCallback);
		callbackReg(settings, 'aoRowCreatedCallback', config.fnCreatedRow);
		callbackReg(settings, 'aoHeaderCallback', config.fnHeaderCallback);
		callbackReg(settings, 'aoFooterCallback', config.fnFooterCallback);
		callbackReg(settings, 'aoInitComplete', config.fnInitComplete);
		callbackReg(settings, 'aoPreDrawCallback', config.fnPreDrawCallback);

		settings.rowIdFn = util.get(config.rowId);

		// Add event listeners
		if (config.on) {
			Object.keys(config.on).forEach(function (key) {
				listener(table, key, config.on![key]);
			});
		}

		/* Browser support detection */
		browserDetect(settings);

		var oClasses = settings.oClasses;

		object.assign(oClasses, ext.classes, config.oClasses);
		table.classAdd(oClasses.table);

		if (!settings.oFeatures.bPaginate) {
			config.iDisplayStart = 0;
		}

		if (settings.iInitDisplayStart === undefined) {
			/* Display start point, taking into account the save saving */
			settings.iInitDisplayStart = config.iDisplayStart;
			settings._iDisplayStart = config.iDisplayStart;
		}

		var defer = config.iDeferLoading;
		if (defer !== null) {
			settings.deferLoading = true;

			var tmp = Array.isArray(defer);
			settings._iRecordsDisplay = tmp ? defer[0] : defer;
			settings._iRecordsTotal = tmp ? defer[1] : defer;
		}

		/*
		 * Columns
		 * See if we should load columns automatically or use defined ones
		 */
		var columnsInit: any[] = [];
		var thead = table.children('thead');
		var initHeaderLayout = detectHeader(settings, thead.get(0), false);

		// If we don't have a columns array, then generate one with nulls
		if (config.aoColumns) {
			columnsInit = config.aoColumns;
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
			config.aoColumnDefs,
			columnsInit,
			initHeaderLayout,
			function (iCol, oDef) {
				columnOptions(settings, iCol, oDef);
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
					var col = settings.aoColumns[loop];

					if (!col) {
						log(settings, 0, 'Incorrect column count', 18);
					}

					if (col.mData === loop) {
						var sort = a(cell, 'sort') || a(cell, 'order');
						var filter = a(cell, 'filter') || a(cell, 'search');

						if (sort !== null || filter !== null) {
							col.mData = {
								_: loop + '.display',
								sort: sort !== null ? loop + '.@data-' + sort : undefined,
								type: sort !== null ? loop + '.@data-' + sort : undefined,
								filter: filter !== null ? loop + '.@data-' + filter : undefined,
							};
							col._isArrayHost = true;

							columnOptions(settings, loop);
						}
					}
				});
		}

		// Must be done after everything which can be overridden by the state
		// saving!
		callbackReg(settings, 'aoDrawCallback', saveState);

		var features = settings.oFeatures;
		if (config.bStateSave) {
			features.bStateSave = true;
		}

		// If aaSorting is not defined, then we use the first indicator in
		// asSorting in case that has been altered, so the default sort reflects
		// that option
		if (config.aaSorting === undefined) {
			var sorting = settings.aaSorting;
			for (i = 0, iLen = sorting.length; i < iLen; i++) {
				sorting[i][1] = settings.aoColumns[i].asSorting[0];
			}
		}

		// Do a first pass on the sorting classes (allows any size changes to be
		// taken into account, and also will apply sorting disabled classes if
		// disabled
		sortingClasses(settings);

		callbackReg(settings, 'aoDrawCallback', function () {
			if (
				settings.bSorted ||
				dataSource(settings) === 'ssp' ||
				features.bDeferRender
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
		var oLanguage = settings.oLanguage;
		object.assignDeep(oLanguage, config.oLanguage);

		if (oLanguage.sUrl) {
			// Get the language definitions from a file
			ajax({
				dataType: 'json',
				url: oLanguage.sUrl,
				success: function (json) {
					camelToHungarian((defaults as any).oLanguage, json);
					object.assignDeep(oLanguage, json, settings.oInit.oLanguage);

					callbackFire(settings, null, 'i18n', [settings], true);
					initialise(settings);
				},
				error: function () {
					// Error occurred loading language file
					log(settings, 0, 'i18n file loading error', 21);

					// Continue on as best we can
					initialise(settings);
				},
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
DataTable.use = external;
DataTable.factory = apiStatic.factory;
DataTable.versionCheck = versionCheck;
DataTable.version = ext.version;
DataTable.isDataTable = apiStatic.isDataTable;
DataTable.tables = apiStatic.tables;
DataTable.camelToHungarian = camelToHungarian;
DataTable.util = util;
DataTable.Api = Api;
DataTable.datetime = datetime;
DataTable.__browser = browser;
DataTable.dom = dom;
DataTable.ajax = ajax;

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
	register: registerFeature,
};

// Register the libraries
external(DataTable);

if ((window as any).jQuery) {
	external((window as any).jQuery);
}

export default DataTable;
