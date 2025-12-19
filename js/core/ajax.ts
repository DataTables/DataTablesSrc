import { callbackFire, log } from '../api/support';
import { AjaxData } from '../model/interface';
import { Context, DtAjaxOptions } from '../model/settings';
import { AjaxOptions } from '../util/ajax';
import util from '../util/index';
import { GetFunction, JSON } from '../util/types';
import { columnTypes } from './columns';
import { addData, clearTable } from './data';
import { draw } from './draw';
import { initComplete } from './init';
import { sortFlatten } from './order';
import { processingDisplay } from './processing';

/**
 * Create an Ajax call based on the table's settings, taking into account that
 * parameters can have multiple forms, and backwards compatibility.
 *
 * @param settings DataTables settings object
 * @param data Data to send to the server, required by DataTables - may be
 *   augmented by developer callbacks
 * @param fn Callback function to run when data is obtained
 */
export function buildAjax(
	settings: Context,
	data: AjaxData,
	fn: (json: JSON) => void
) {
	var ajaxData;
	var ajaxConfig = settings.ajax;
	var instance = settings.instance;
	var callback = function (json: JSON) {
		var status = settings.jqXHR ? settings.jqXHR.status : null;

		if (json === null || (typeof status === 'number' && status == 204)) {
			json = {};
			ajaxDataSrc(settings, json, []);
		}

		var error = json.error || json.sError;
		if (error) {
			log(settings, 0, error as string);
		}

		// Microsoft often wrap JSON as a string in another JSON object Let's
		// handle that automatically
		if (json.d && typeof json.d === 'string') {
			try {
				json = JSON.parse(json.d);
			} catch (e) {
				// noop
			}
		}

		settings.json = json;

		callbackFire(
			settings,
			null,
			'xhr',
			[settings, json, settings.jqXHR],
			true
		);
		fn(json);
	};

	if (util.is.plainObject<DtAjaxOptions>(ajaxConfig) && ajaxConfig.data) {
		ajaxData = ajaxConfig.data;

		var newData =
			typeof ajaxData === 'function'
				? ajaxData(data, settings) // fn can manipulate data or return
				: ajaxData; // an object or array to merge

		// If the function returned something, use that alone
		data =
			typeof ajaxData === 'function' && newData
				? newData
				: util.object.assignDeep(data, newData);

		// Remove the data property as we've resolved it already and don't want
		// jQuery to do it again (it is restored at the end of the function)
		delete ajaxConfig.data;
	}

	var baseAjax = {
		url: typeof ajaxConfig === 'string' ? ajaxConfig : '',
		data: data,
		success: callback,
		dataType: 'json',
		cache: false,
		type: settings.serverMethod,
		error: function (xhr, error) {
			var ret = callbackFire(
				settings,
				null,
				'xhr',
				[settings, null, settings.jqXHR],
				true
			);

			if (ret.indexOf(false) === -1) {
				if (error == 'parsererror') {
					log(settings, 0, 'Invalid JSON response', 1);
				}
				else if (xhr.readyState === 4) {
					log(settings, 0, 'Ajax error', 7);
				}
			}

			processingDisplay(settings, false);
		}
	} as AjaxOptions;

	// If `ajax` option is an object, extend and override our default base
	if (util.is.plainObject<DtAjaxOptions>(ajaxConfig)) {
		util.object.assign(baseAjax, ajaxConfig);
	}

	// Store the data submitted for the API
	settings.ajaxData = data;

	// Allow plug-ins and external processes to modify the data
	callbackFire(settings, null, 'preXhr', [settings, data, baseAjax], true);

	// Custom Ajax option to submit the parameters as a JSON string
	if ((baseAjax as any).submitAs === 'json' && typeof data === 'object') {
		baseAjax.data = JSON.stringify(data) as any;

		if (!baseAjax.contentType) {
			baseAjax.contentType = 'application/json; charset=utf-8';
		}
	}

	if (typeof ajaxConfig === 'function') {
		// Is a function - let the caller define what needs to be done
		settings.jqXHR = ajaxConfig.call(instance, data, callback, settings);
	}
	else if (
		ajaxConfig &&
		typeof ajaxConfig !== 'string' &&
		ajaxConfig.url === ''
	) {
		// No url, so don't load any data. Just apply an empty data array
		// to the object for the callback.
		var empty = {};

		ajaxDataSrc(settings, empty, []);
		callback(empty);
	}
	else {
		// Object to extend the base settings
		settings.jqXHR = util.ajax(baseAjax as any);
	}

	// Restore for next time around
	if (ajaxData) {
		(ajaxConfig as DtAjaxOptions).data = ajaxData;
	}
}

/**
 * Update the table using an Ajax call
 *
 * @param settings DataTables settings object
 * @returns Block the table drawing or not
 */
export function ajaxUpdate(settings: Context) {
	settings.drawCount++;
	processingDisplay(settings, true);

	buildAjax(settings, ajaxParameters(settings), function (json) {
		ajaxUpdateDraw(settings, json);
	});
}

/**
 * Build up the parameters in an object needed for a server-side processing
 * request.
 *
 * @param settings DataTables settings object
 * @returns Block the table drawing or not
 */
export function ajaxParameters(settings: Context): AjaxData {
	var columns = settings.columns,
		features = settings.features,
		preSearch = settings.previousSearch,
		preColSearch = settings.preSearchCols,
		colData = function (idx: number, prop: 'name' | 'data') {
			return typeof columns[idx][prop] === 'function'
				? 'function'
				: columns[idx][prop];
		};

	return {
		draw: settings.drawCount,
		columns: columns.map(function (column, i) {
			return {
				data: colData(i, 'data'),
				name: column.name,
				searchable: column.searchable,
				orderable: column.orderable,
				search: {
					value: preColSearch[i].search.toString(),
					regex: preColSearch[i].regex,
					fixed: Object.keys(column.searchFixed).map(function (name) {
						return {
							name: name,
							term:
								typeof column.searchFixed[name] !== 'function'
									? column.searchFixed[name].toString()
									: 'function'
						};
					})
				}
			};
		}),
		order: sortFlatten(settings).map(function (val) {
			return {
				column: val.col,
				dir: val.dir,
				name: colData(val.col, 'name')
			};
		}),
		start: settings.displayStart,
		length: features.paging ? settings.pageLength : -1,
		search: {
			value: preSearch.search.toString(),
			regex: preSearch.regex,
			fixed: Object.keys(settings.searchFixed).map(function (name) {
				return {
					name: name,
					term:
						typeof settings.searchFixed[name] !== 'function'
							? settings.searchFixed[name].toString()
							: 'function'
				};
			})
		}
	};
}

/**
 * Data the data from the server (nuking the old) and redraw the table
 *
 * @param settings DataTables settings object
 * @param json json data return from the server.
 */
export function ajaxUpdateDraw(settings: Context, json: JSON) {
	var data = ajaxDataSrc(settings, json, false);
	var drawUnique = ajaxDataSrcParam(settings, 'draw', json);
	var recordsTotal = ajaxDataSrcParam(settings, 'recordsTotal', json);
	var recordsFiltered = ajaxDataSrcParam(settings, 'recordsFiltered', json);

	if (drawUnique !== undefined) {
		// Protect against out of sequence returns
		if (drawUnique * 1 < settings.drawCount) {
			return;
		}
		settings.drawCount = drawUnique * 1;
	}

	// No data in returned object, so rather than an array, we show an empty
	// table
	if (!data) {
		data = [];
	}

	clearTable(settings);
	settings.recordsTotal = parseInt(recordsTotal, 10);
	settings.recordsDisplay = parseInt(recordsFiltered, 10);

	for (var i = 0, iLen = data.length; i < iLen; i++) {
		addData(settings, data[i]);
	}
	settings.display = settings.displayMaster.slice();

	columnTypes(settings);
	draw(settings, true);
	initComplete(settings);
	processingDisplay(settings, false);
}

/**
 * Get the data from the JSON data source to use for drawing a table.
 *
 * @param settings DataTables settings object
 * @param json Data source object / array from the server
 * @param write Array or object to write the data to
 * @return Array of data to use
 */
export function ajaxDataSrc(settings: Context, json: JSON, write: any) {
	var dataProp: string | GetFunction = 'data';

	if (
		util.is.plainObject<AjaxOptions>(settings.ajax) &&
		settings.ajax.dataSrc !== undefined
	) {
		// Could in inside a `dataSrc` object, or not!
		var dataSrc = settings.ajax.dataSrc;

		// string, function and object are valid types
		if (typeof dataSrc === 'string' || typeof dataSrc === 'function') {
			dataProp = dataSrc;
		}
		else if (dataSrc.data !== undefined) {
			dataProp = dataSrc.data;
		}
	}

	if (!write) {
		if (dataProp === 'data') {
			// If the default, then we still want to support the old style, and
			// safely ignore it if possible
			return json.aaData || json[dataProp];
		}

		return dataProp !== '' ? util.get(dataProp)(json) : json;
	}

	// set
	util.set(dataProp)(json, write);
}

/**
 * Very similar to ajaxDataSrc, but for the other SSP properties
 *
 * @param settings DataTables settings object
 * @param param Target parameter
 * @param json JSON data
 * @returns Resolved value
 */
export function ajaxDataSrcParam(
	settings: Context,
	param: 'draw' | 'recordsTotal' | 'recordsFiltered',
	json: JSON
) {
	var dataSrc = util.is.plainObject<AjaxOptions>(settings.ajax)
		? (settings.ajax.dataSrc as any) // TODO
		: null;

	if (dataSrc && dataSrc[param]) {
		// Get from custom location
		return util.data.get(dataSrc[param])(json);
	}

	// else - Default behaviour
	var old = '';

	// Legacy support
	if (param === 'draw') {
		old = 'sEcho';
	}
	else if (param === 'recordsTotal') {
		old = 'iTotalRecords';
	}
	else if (param === 'recordsFiltered') {
		old = 'iTotalDisplayRecords';
	}

	return json[old] !== undefined ? json[old] : json[param];
}
