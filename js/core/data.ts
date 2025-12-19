import { log } from '../api/support';
import dom, { Dom } from '../dom';
import ext from '../ext/index';
import createRow, { Row } from '../model/row';
import { Context } from '../model/settings';
import util from '../util';
import { createTr, getRowDisplay, rowAttributes } from './draw';

/**
 * Add a data array to the table, creating DOM node etc. This is the parallel to
 * gatherData, but for adding rows from a JavaScript source, rather than a
 * DOM source.
 *
 * @param settings DataTables settings object
 * @param data data array to be added
 * @param tr TR element to add to the table - optional. If not given, DataTables
 *   will create a row automatically
 * @param tds Array of TD|TH elements for the row - must be given if tr is.
 * @returns >=0 if successful (index of new data entry), -1 if failed
 */
export function addData(
	settings: Context,
	dataIn: any,
	tr?: HTMLTableRowElement,
	tds?: HTMLTableCellElement[]
) {
	/* Create the object for storing information about this new row */
	var rowIdx = settings.data.length;
	var row = createRow({
		src: tr ? 'dom' : 'data',
		idx: rowIdx
	});

	row.data = dataIn;
	settings.data.push(row);

	var columns = settings.columns;

	for (var i = 0, iLen = columns.length; i < iLen; i++) {
		// Invalidate the column types as the new data needs to be revalidated
		columns[i].type = null;
	}

	/* Add to the display array */
	settings.displayMaster.push(rowIdx);

	var id = settings.rowIdFn(dataIn);
	if (id !== undefined) {
		settings.ids[id] = row;
	}

	/* Create the DOM information, or register it if already present */
	if (tr || !settings.features.deferRender) {
		createTr(settings, rowIdx, tr, tds);
	}

	return rowIdx;
}

/**
 * Add one or more TR elements to the table. Generally we'd expect to
 * use this for reading data from a DOM sourced table, but it could be
 * used for an TR element. Note that if a TR is given, it is used (i.e.
 * it is not cloned).
 *
 * @param settings DataTables settings object
 * @param trs The TR element(s) to add to the table
 * @returns Array of indexes for the added rows
 */
export function addTr(settings: Context, rows: Dom<HTMLTableRowElement>) {
	return rows.mapTo(el => {
		let row = getRowElementsFromNode(settings, el);

		return addData(settings, row.data, el, row.cells);
	});
}

/**
 * Get the data for a given cell from the internal cache, taking into account
 * data mapping
 *
 * @param settings DataTables settings object
 * @param rowIdx data row id
 * @param colIdx Column index
 * @param type data get type ('display', 'type' 'filter|search' 'sort|order')
 * @returns Cell data
 */
export function getCellData(
	settings: Context,
	rowIdx: number,
	colIdx: number,
	type?: string
) {
	if (type === 'search') {
		type = 'filter';
	}
	else if (type === 'order') {
		type = 'sort';
	}

	var row = settings.data[rowIdx];

	if (!row) {
		return undefined;
	}

	var draw = settings.drawCount;
	var col = settings.columns[colIdx];
	var rowData = row.data;
	var defaultContent = col.defaultContent;
	var cellData = col.dataGet(rowData, type, {
		settings: settings,
		row: rowIdx,
		col: colIdx
	});

	// Allow for a node being returned for non-display types
	if (
		type !== 'display' &&
		cellData &&
		typeof cellData === 'object' &&
		cellData.nodeName
	) {
		cellData = cellData.innerHTML;
	}

	if (cellData === undefined) {
		if (settings.drawError != draw && defaultContent === null) {
			log(
				settings,
				0,
				'Requested unknown parameter ' +
					(typeof col.data == 'function'
						? '{function}'
						: "'" + col.data + "'") +
					' for row ' +
					rowIdx +
					', column ' +
					colIdx,
				4
			);

			settings.drawError = draw;
		}

		return defaultContent;
	}

	// When the data source is null and a specific data type is requested (i.e.
	// not the original data), we can use default column data
	if (
		(cellData === rowData || cellData === null) &&
		defaultContent !== null &&
		type !== undefined
	) {
		cellData = defaultContent;
	}
	else if (typeof cellData === 'function') {
		// If the data source is a function, then we run it and use the return,
		// executing in the scope of the data object (for instances)
		return cellData.call(rowData);
	}

	if (cellData === null && type === 'display') {
		return '';
	}

	if (type === 'filter') {
		var formatters = ext.type.search;

		if (col.type && formatters[col.type]) {
			cellData = formatters[col.type](cellData);
		}
	}

	return cellData;
}

/**
 * Set the value for a specific cell, into the internal data cache
 *
 * @param settings DataTables settings object
 * @param rowIdx data row id
 * @param colIdx Column index
 * @param val Value to set
 */
export function setCellData(
	settings: Context,
	rowIdx: number,
	colIdx: number,
	val: any
) {
	let row = settings.data[rowIdx];

	if (row) {
		let col = settings.columns[colIdx];
		let rowData = row.data;

		col.dataSet(rowData, val, {
			settings: settings,
			row: rowIdx,
			col: colIdx
		});
	}
}

/**
 * Write a value to a cell
 *
 * @param td Cell
 * @param val Value
 */
export function writeCell(td: HTMLTableCellElement, val: string | HTMLElement) {
	let cell = dom.s(td);

	if (val && typeof val === 'object' && val.nodeName) {
		cell.empty().append(val);
	}
	else {
		cell.html(val as string);
	}
}

/**
 * Return an array with the full table data
 *
 * @param settings DataTables settings object
 * @returns array {array} aData Master data array
 */
export function getDataMaster(settings: Context) {
	return util.array.pluck(settings.data, 'data');
}

/**
 * Nuke the table
 *
 * @param settings DataTables settings object
 */
export function clearTable(settings: Context) {
	settings.data.length = 0;
	settings.displayMaster.length = 0;
	settings.display.length = 0;
	settings.ids = {};
}

/**
 * Mark cached data as invalid such that a re-read of the data will occur when
 * the cached data is next requested. Also update from the data source object.
 *
 * @param settings DataTables settings object
 * @param rowIdx Row index to invalidate
 * @param src Source to invalidate from: undefined, 'auto', 'dom' or 'data'
 * @param colIdx Column index to invalidate. If undefined the whole row will be
 *    invalidated
 */
export function invalidate(
	settings: Context,
	rowIdx: number,
	src?: string,
	colIdx?: number
) {
	var row = settings.data[rowIdx];
	var i, iLen;

	if (!row) {
		return;
	}

	// Remove the cached data for the row
	row.orderCache = null;
	row.searchCellCache = null;
	row.displayData = null;

	// Are we reading last data from DOM or the data object?
	if (src === 'dom' || ((!src || src === 'auto') && row.src === 'dom')) {
		// Read the data from the DOM
		row.data = getRowElementsFromModel(settings, row, colIdx).data;
	}
	else {
		// Reading from data object, update the DOM
		var cells = row.cells;
		var display = getRowDisplay(settings, rowIdx);

		if (cells.length) {
			if (colIdx !== undefined) {
				writeCell(cells[colIdx], display[colIdx]);
			}
			else {
				for (i = 0, iLen = cells.length; i < iLen; i++) {
					writeCell(cells[i], display[i]);
				}
			}
		}
	}

	// Column specific invalidation
	var cols = settings.columns;
	if (colIdx !== undefined) {
		// Type - the data might have changed
		cols[colIdx].type = null;

		// Max length string. Its a fairly cheep recalculation, so not worth
		// something more complicated
		cols[colIdx].wideStrings = null;
	}
	else {
		for (i = 0, iLen = cols.length; i < iLen; i++) {
			cols[i].type = null;
			cols[i].wideStrings = null;
		}

		// Update DataTables special `DT_*` attributes for the row
		rowAttributes(settings, row);
	}
}

/**
 * Get the cells and data for a given row - from a <tr> element
 *
 * @param settings DataTables settings object
 * @param row TR element from which to read data or existing row object from
 *   which to re-read the data from the cells
 */
export function getRowElementsFromNode(
	settings: Context,
	row: HTMLTableRowElement
) {
	let data = settings.rowReadObject ? {} : [];
	let cells = dom.s(row).children<HTMLTableCellElement>('th, td');
	let id = row.getAttribute('id');

	cells.each((el, idx) => {
		readCellData(settings, el, data, idx);
	});

	if (id) {
		util.set(settings.rowId)(data, id);
	}

	return {
		data: data,
		cells: cells.get()
	};
}

/**
 * Get the cells and data for a given row - from an existing row model
 *
 * @param settings DataTables settings object
 * @param row Existing row object from which to re-read the data from the cells
 * @param colIdx Optional column index
 */
export function getRowElementsFromModel(
	settings: Context,
	row: Row,
	colIdx?: number
) {
	let tds = row.cells;

	for (let i = 0; i < tds.length; i++) {
		if (colIdx === undefined || colIdx === i) {
			readCellData(settings, tds[i], row.data, i);
		}
	}

	// Read the ID from the DOM if present
	if (row.tr) {
		let id = row.tr.getAttribute('id');

		if (id) {
			util.set(settings.rowId)(row.data, id);
		}
	}

	return {
		data: row.data,
		cells: tds
	};
}

/**
 * Read data from a cell into the data source object
 *
 * @param settings DataTables settings object
 * @param cell The HTML cell element to read from
 * @param data Data object / array to store data into
 * @param colIdx The column index for the cell
 */
function readCellData(
	settings: Context,
	cell: HTMLElement,
	data: any,
	colIdx: number
) {
	let column = settings.columns[colIdx];
	let contents = cell.innerHTML.trim();

	if (column.attrSrc) {
		// If we are working with attributes from the cell as values
		let dataPoint = column.data as any;
		let setter = util.set(dataPoint._);
		let attr = function (str: string, cell: HTMLElement) {
			if (typeof str === 'string') {
				let idx = str.indexOf('@');

				if (idx !== -1) {
					let att = str.substring(idx + 1);
					let setter = util.set(str);

					setter(data, cell.getAttribute(att)!);
				}
			}
		};

		setter(data, contents);
		attr(dataPoint.sort, cell);
		attr(dataPoint.type, cell);
		attr(dataPoint.filter, cell);
	}
	else {
		if (!column.setter) {
			// Cache the setter function
			column.setter = util.set(column.data);
		}

		column.setter(data, contents);
	}
}
