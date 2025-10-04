
import { processingDisplay } from './processing';
import {log, callbackFire} from './support';
import Context from '../model/settings';
import { initComplete } from './init';
import { sortFlatten } from './sort';
import { clearTable, addData } from './data';
import { draw } from './draw';
import { columnTypes } from './columns';

/**
 * Create an Ajax call based on the table's settings, taking into account that
 * parameters can have multiple forms, and backwards compatibility.
 *
 * @param oSettings dataTables settings object
 * @param {array} data Data to send to the server, required by
 *     DataTables - may be augmented by developer callbacks
 * @param {function} fn Callback function to run when data is obtained
 */
export function buildAjax(oSettings: Context, data, fn) {
	var ajaxData;
	var ajax = oSettings.ajax;
	var instance = oSettings.oInstance;
	var callback = function (json) {
		var status = oSettings.jqXHR ? oSettings.jqXHR.status : null;

		if (json === null || (typeof status === 'number' && status == 204)) {
			json = {};
			ajaxDataSrc(oSettings, json, []);
		}

		var error = json.error || json.sError;
		if (error) {
			log(oSettings, 0, error);
		}

		// Microsoft often wrap JSON as a string in another JSON object
		// Let's handle that automatically
		if (json.d && typeof json.d === 'string') {
			try {
				json = JSON.parse(json.d);
			} catch (e) {
				// noop
			}
		}

		oSettings.json = json;

		callbackFire(oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR], true);
		fn(json);
	};

	if ($.isPlainObject(ajax) && ajax.data) {
		ajaxData = ajax.data;

		var newData =
			typeof ajaxData === 'function'
				? ajaxData(data, oSettings) // fn can manipulate data or return
				: ajaxData; // an object or array to merge

		// If the function returned something, use that alone
		data = typeof ajaxData === 'function' && newData ? newData : $.extend(true, data, newData);

		// Remove the data property as we've resolved it already and don't want
		// jQuery to do it again (it is restored at the end of the function)
		delete ajax.data;
	}

	var baseAjax = {
		url: typeof ajax === 'string' ? ajax : '',
		data: data,
		success: callback,
		dataType: 'json',
		cache: false,
		type: oSettings.sServerMethod,
		error: function (xhr, error) {
			var ret = callbackFire(
				oSettings,
				null,
				'xhr',
				[oSettings, null, oSettings.jqXHR],
				true
			);

			if (ret.indexOf(true) === -1) {
				if (error == 'parsererror') {
					log(oSettings, 0, 'Invalid JSON response', 1);
				}
				else if (xhr.readyState === 4) {
					log(oSettings, 0, 'Ajax error', 7);
				}
			}

			processingDisplay(oSettings, false);
		}
	} as any; // TODO

	// If `ajax` option is an object, extend and override our default base
	if ($.isPlainObject(ajax)) {
		$.extend(baseAjax, ajax);
	}

	// Store the data submitted for the API
	oSettings.oAjaxData = data;

	// Allow plug-ins and external processes to modify the data
	callbackFire(oSettings, null, 'preXhr', [oSettings, data, baseAjax], true);

	// Custom Ajax option to submit the parameters as a JSON string
	if (baseAjax.submitAs === 'json' && typeof data === 'object') {
		baseAjax.data = JSON.stringify(data);
	}

	if (typeof ajax === 'function') {
		// Is a function - let the caller define what needs to be done
		oSettings.jqXHR = ajax.call(instance, data, callback, oSettings);
	}
	else if (ajax.url === '') {
		// No url, so don't load any data. Just apply an empty data array
		// to the object for the callback.
		var empty = {};

		ajaxDataSrc(oSettings, empty, []);
		callback(empty);
	}
	else {
		// Object to extend the base settings
		oSettings.jqXHR = $.ajax(baseAjax);
	}

	// Restore for next time around
	if (ajaxData) {
		ajax.data = ajaxData;
	}
}

/**
 * Update the table using an Ajax call
 *
 * @param {object} settings dataTables settings object
 * @returns {boolean} Block the table drawing or not
 */
export function ajaxUpdate(settings) {
	settings.iDraw++;
	processingDisplay(settings, true);

	buildAjax(settings, ajaxParameters(settings), function (json) {
		ajaxUpdateDraw(settings, json);
	});
}

/**
 * Build up the parameters in an object needed for a server-side processing
 * request.
 *
 * @param {object} oSettings dataTables settings object
 * @returns {bool} block the table drawing or not
 */
export function ajaxParameters(settings) {
	var columns = settings.aoColumns,
		features = settings.oFeatures,
		preSearch = settings.oPreviousSearch,
		preColSearch = settings.aoPreSearchCols,
		colData = function (idx, prop) {
			return typeof columns[idx][prop] === 'function' ? 'function' : columns[idx][prop];
		};

	return {
		draw: settings.iDraw,
		columns: columns.map(function (column, i) {
			return {
				data: colData(i, 'mData'),
				name: column.sName,
				searchable: column.bSearchable,
				orderable: column.bSortable,
				search: {
					value: preColSearch[i].search,
					regex: preColSearch[i].regex,
					fixed: Object.keys(column.searchFixed)
						.map(function (name) {
							return {
								name: name,
								term: typeof column.searchFixed[name] !== 'function'
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
				name: colData(val.col, 'sName')
			};
		}),
		start: settings._iDisplayStart,
		length: features.bPaginate ? settings._iDisplayLength : -1,
		search: {
			value: preSearch.search,
			regex: preSearch.regex,
			fixed: Object.keys(settings.searchFixed)
				.map(function (name) {
					return {
						name: name,
						term: typeof settings.searchFixed[name] !== 'function'
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
 * @param {object} oSettings dataTables settings object
 * @param {object} json json data return from the server.
 * @param {string} json.sEcho Tracking flag for DataTables to match requests
 * @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
 * @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
 * @param {array} json.aaData The data to display on this page
 * @param {string} [json.sColumns] Column ordering (sName, comma separated)
 */
export function ajaxUpdateDraw(settings: Context, json) {
	var data = ajaxDataSrc(settings, json, false);
	var draw = ajaxDataSrcParam(settings, 'draw', json);
	var recordsTotal = ajaxDataSrcParam(settings, 'recordsTotal', json);
	var recordsFiltered = ajaxDataSrcParam(settings, 'recordsFiltered', json);

	if (draw !== undefined) {
		// Protect against out of sequence returns
		if (draw * 1 < settings.iDraw) {
			return;
		}
		settings.iDraw = draw * 1;
	}

	// No data in returned object, so rather than an array, we show an empty table
	if (!data) {
		data = [];
	}

	clearTable(settings);
	settings._iRecordsTotal = parseInt(recordsTotal, 10);
	settings._iRecordsDisplay = parseInt(recordsFiltered, 10);

	for (var i = 0, iLen = data.length; i < iLen; i++) {
		addData(settings, data[i]);
	}
	settings.aiDisplay = settings.aiDisplayMaster.slice();

	columnTypes(settings);
	draw(settings, true);
	initComplete(settings);
	processingDisplay(settings, false);
}

/**
 * Get the data from the JSON data source to use for drawing a table. Using
 * `DataTable.util.get` allows the data to be sourced from a property of the
 * source object, or from a processing function.
 *
 * @param {object} settings dataTables settings object
 * @param  {object} json Data source object / array from the server
 * @return {array} Array of data to use
 */
export function ajaxDataSrc(settings, json, write) {
	var dataProp = 'data';

	if ($.isPlainObject(settings.ajax) && settings.ajax.dataSrc !== undefined) {
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
			// If the default, then we still want to support the old style, and safely ignore
			// it if possible
			return json.aaData || json[dataProp];
		}

		return dataProp !== '' ? DataTable.util.get(dataProp)(json) : json;
	}

	// set
	DataTable.util.set(dataProp)(json, write);
}

/**
 * Very similar to ajaxDataSrc, but for the other SSP properties
 *
 * @param {*} settings DataTables settings object
 * @param {*} param Target parameter
 * @param {*} json JSON data
 * @returns Resolved value
 */
export function ajaxDataSrcParam(settings, param, json) {
	var dataSrc = $.isPlainObject(settings.ajax) ? settings.ajax.dataSrc : null;

	if (dataSrc && dataSrc[param]) {
		// Get from custom location
		return DataTable.util.get(dataSrc[param])(json);
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
