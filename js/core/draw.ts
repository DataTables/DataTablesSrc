import { callbackFire, dataSource, escapeObject, log } from '../api/support';
import dom, { Dom } from '../dom';
import ext from '../ext/index';
import Settings from '../model/columns/settings';
import { Row, TableCellElement, TableRowElement } from '../model/row';
import {
	Context,
	HeaderStructure,
	HeaderStructureCell
} from '../model/settings';
import util from '../util';
import { ajaxUpdate } from './ajax';
import { columnOptions, columnTypes, visibleColumns } from './columns';
import { getCellData, getDataMaster, writeCell } from './data';
import { sort } from './order';
import { processingDisplay } from './processing';
import { renderer } from './render';
import { filterComplete } from './search';

interface HeaderLayoutCell {
	cell: HTMLElement;
	colspan: number;
	rowspan: number;
	title: string;
}

/**
 * Render and cache a row's display data for the columns, if required
 *
 * @param settings DataTables settings object
 * @param rowIdx Row index
 * @returns Array with display information
 */
export function getRowDisplay(settings: Context, rowIdx: number) {
	var rowModal = settings.data[rowIdx];
	var columns = settings.columns;

	if (!rowModal) {
		return [];
	}

	if (!rowModal.displayData) {
		// Need to render and cache
		rowModal.displayData = [];

		for (var colIdx = 0, len = columns.length; colIdx < len; colIdx++) {
			rowModal.displayData.push(
				getCellData(settings, rowIdx, colIdx, 'display')
			);
		}
	}

	return rowModal.displayData;
}

/**
 * Create a new TR element (and it's TD children) for a row
 *
 * @param settings DataTables settings object
 * @param rowIdx Row to consider
 * @param trIn TR element to add to the table - optional. If not given,
 *   DataTables will create a row automatically
 * @param tds Array of TD|TH elements for the row - must be given if trIn is.
 */
export function createTr(
	settings: Context,
	rowIdx: number,
	trIn?: HTMLTableRowElement,
	tds?: HTMLTableCellElement[]
) {
	var row = settings.data[rowIdx],
		cells: HTMLTableCellElement[] = [],
		tr: TableRowElement,
		td: TableCellElement,
		column: Settings,
		i,
		iLen,
		create,
		trClass = settings.classes.tbody.row;

	if (row && row.tr === null) {
		let rowData = row.data;

		tr = trIn || document.createElement('tr');
		row.tr = tr;
		row.cells = cells;

		dom.s(tr).classAdd(trClass);

		/* Use a private property on the node to allow reserve mapping from the node
		 * to the aoData array for fast look up
		 */
		tr._DT_RowIndex = rowIdx;

		/* Special parameters can be given by the data source to be used on the row */
		rowAttributes(settings, row);

		/* Process each column */
		for (i = 0, iLen = settings.columns.length; i < iLen; i++) {
			column = settings.columns[i];
			create = trIn && tds && tds[i] ? false : true;

			td = create
				? (document.createElement(column.cellType) as HTMLTableCellElement)
				: tds![i];

			if (!td) {
				log(settings, 0, 'Incorrect column count', 18);
			}

			td._DT_CellIndex = {
				row: rowIdx,
				column: i
			};

			cells.push(td);

			var display = getRowDisplay(settings, rowIdx);

			// Need to create the HTML if new, or if a rendering function is defined
			if (
				create ||
				((column.render || column.data !== i) &&
					(!util.is.plainObject(column.data) ||
						(column.data && (column.data as any)._ !== i + '.display')))
			) {
				writeCell(td, display[i]);
			}

			// column class
			dom.s(td).classAdd(column.className);

			// Visibility - add or remove as required
			if (column.visible && create) {
				tr.appendChild(td);
			}
			else if (!column.visible && !create) {
				td.parentNode!.removeChild(td);
			}

			if (column.createdCell) {
				column.createdCell.call(
					settings.oInstance,
					td,
					getCellData(settings, rowIdx, i),
					rowData,
					rowIdx,
					i
				);
			}
		}

		callbackFire(settings, 'rowCreated', 'row-created', [
			tr,
			rowData,
			rowIdx,
			cells
		]);
	}
	else if (row) {
		dom.s(row.tr).classAdd(trClass);
	}
}

/**
 * Add attributes to a row based on the special `DT_*` parameters in a data
 * source object.
 *
 * @param settings DataTables settings object
 * @param row Row object for the row to be modified
 */
export function rowAttributes(settings: Context, row: Row) {
	var tr = row.tr;
	var data = row.data;

	if (tr) {
		var id = settings.rowIdFn(data);

		if (id) {
			tr.id = id;
		}

		if (data.DT_RowClass) {
			// Remove any classes added by DT_RowClass before
			var a = data.DT_RowClass.split(' ');
			row.addedClasses = row.addedClasses
				? util.unique(row.addedClasses.concat(a))
				: a;

			dom
				.s(tr)
				.classRemove(row.addedClasses.join(' '))
				.classAdd(data.DT_RowClass);
		}

		if (data.DT_RowAttr) {
			dom.s(tr).attr(data.DT_RowAttr);
		}

		if (data.DT_RowData) {
			dom.s(tr).data(data.DT_RowData);
		}
	}
}

/**
 * Create the HTML header for the table
 *
 * @param settings DataTable instance
 * @param side If the header or footer should be used
 * @returns
 */
export function buildHead(settings: Context, side: 'header' | 'footer') {
	let classes = settings.classes;
	let columns = settings.columns;
	let i, iLen, row: Dom;
	let target = dom.s(side === 'header' ? settings.nTHead : settings.nTFoot);
	let titleProp: 'title' | 'footer' = side === 'header' ? 'title' : side;

	// Footer might be defined
	if (!target) {
		return;
	}

	// If no cells yet and we have content for them, then create
	if (
		side === 'header' ||
		util.array.pluck(settings.columns, titleProp).join('')
	) {
		row = target.find('tr');

		// Add a row if needed
		if (!row.count()) {
			row = dom.c('tr').appendTo(target);
		}

		// Add the number of cells needed to make up to the number of columns
		if (row.count() === 1) {
			let cellCount = 0;

			row.find<HTMLTableCellElement>('td, th').each(el => {
				cellCount += el.colSpan;
			});

			for (i = cellCount, iLen = columns.length; i < iLen; i++) {
				dom
					.c('th')
					.html(columns[i][titleProp] || '')
					.appendTo(row);
			}
		}
	}

	let detected = detectHeader(settings, target.get(0), true);

	if (side === 'header') {
		settings.header = detected;
		target.find('tr').classAdd(classes.thead.row);
	}
	else {
		settings.footer = detected;
		target.find('tr').classAdd(classes.tfoot.row);
	}

	// Every cell needs to be passed through the renderer
	target
		.children('tr')
		.children('th, td')
		.each(el => {
			// Should just be able to do `renderer(settings, side)` here but
			// Typescript doesn't like it, despite it already being constrained!
			let runner =
				side === 'header'
					? renderer(settings, 'header')
					: renderer(settings, 'footer');

			runner(settings, dom.s(el), classes);
		});
}

/**
 * Build a layout structure for a header or footer
 *
 * @param settings DataTables settings
 * @param source Source layout array
 * @param incColumns What columns should be included
 * @returns Layout array in column index order
 */
export function headerLayout(
	settings: Context,
	source: HeaderStructure[],
	incColumns?: number[]
) {
	var row, column, cell;
	var local: HeaderStructureCell[][] = [];
	var structure: Array<Array<HeaderLayoutCell | null>> = [];
	var columns = settings.columns;
	var columnCount = columns.length;
	var rowspan, colspan;

	if (!source) {
		return;
	}

	// Default is to work on only visible columns
	if (!incColumns) {
		incColumns = util.array.range(columnCount).filter(function (idx) {
			return columns[idx].visible;
		});
	}

	// Make a copy of the master layout array, but with only the columns we want
	for (row = 0; row < source.length; row++) {
		// Remove any columns we haven't selected
		local[row] = source[row].slice().filter(function (c, i) {
			return incColumns.includes(i);
		});

		// Prep the structure array - it needs an element for each row
		structure.push([]);
	}

	for (row = 0; row < local.length; row++) {
		for (column = 0; column < local[row].length; column++) {
			rowspan = 1;
			colspan = 1;

			// Check to see if there is already a cell (row/colspan) covering our target
			// insert point. If there is, then there is nothing to do.
			if (structure[row][column] === undefined) {
				cell = local[row][column].cell;

				// Expand for rowspan
				while (
					local[row + rowspan] !== undefined &&
					local[row][column].cell == local[row + rowspan][column].cell
				) {
					structure[row + rowspan][column] = null;
					rowspan++;
				}

				// And for colspan
				while (
					local[row][column + colspan] !== undefined &&
					local[row][column].cell == local[row][column + colspan].cell
				) {
					// Which also needs to go over rows
					for (var k = 0; k < rowspan; k++) {
						structure[row + k][column + colspan] = null;
					}

					colspan++;
				}

				var titleSpan = dom.s(cell).find('span.dt-column-title');

				structure[row][column] = {
					cell: cell,
					colspan: colspan,
					rowspan: rowspan,
					title: titleSpan.count() ? titleSpan.html() : dom.s(cell).html()
				};
			}
		}
	}

	return structure;
}

/**
 * Draw the header (or footer) element based on the column visibility states.
 *
 * @param settings DataTables settings object
 * @param source Layout array from detectHeader
 */
export function drawHead(settings: Context, source: HeaderStructure[]) {
	let layout = headerLayout(settings, source);
	let tr;

	if (!layout) {
		return;
	}

	for (let row = 0; row < source.length; row++) {
		tr = source[row].row;

		// All cells are going to be replaced, so empty out the row
		if (tr) {
			dom.s(tr).detachChildren();
		}

		for (let column = 0; column < layout[row].length; column++) {
			let point = layout[row][column];

			if (point) {
				dom
					.s(point.cell)
					.appendTo(tr)
					.attr('rowspan', point.rowspan)
					.attr('colspan', point.colspan);
			}
		}
	}
}

/**
 * Insert the required TR nodes into the table for display
 *
 * @param settings DataTables settings object
 * @param ajaxComplete true after ajax call to complete rendering
 */
export function draw(settings: Context, ajaxComplete?: boolean) {
	// Allow for state saving and a custom start position
	setStartPosition(settings);

	// Provide a pre-callback function which can be used to cancel the draw is
	// false is returned
	var aPreDraw = callbackFire(settings, 'preDraw', 'preDraw', [settings]);

	if (aPreDraw.indexOf(false) !== -1) {
		processingDisplay(settings, false);
		return;
	}

	var rowEls: HTMLTableRowElement[] = [];
	var rowCount = 0;
	var isServerSide = dataSource(settings) == 'ssp';
	var display = settings.display;
	var start = settings.displayStart;
	var end = displayEnd(settings);
	var columns = settings.columns;
	var body = dom.s(settings.nTBody);

	settings.doingDraw = true;

	/* Server-side processing draw intercept */
	if (settings.deferLoading) {
		settings.deferLoading = false;
		settings.drawCount++;
		processingDisplay(settings, false);
	}
	else if (!isServerSide) {
		settings.drawCount++;
	}
	else if (!settings.destroying && !ajaxComplete) {
		// Show loading message for server-side processing
		if (settings.drawCount === 0) {
			body.empty().append(_emptyRow(settings));
		}

		ajaxUpdate(settings);
		return;
	}

	if (display.length !== 0) {
		var iStart = isServerSide ? 0 : start;
		var iEnd = isServerSide ? settings.data.length : end;

		for (var j = iStart; j < iEnd; j++) {
			var dataIdx = display[j];
			var data = settings.data[dataIdx];

			// Row has been deleted - can't be displayed
			if (data === null) {
				continue;
			}

			// Row node hasn't been created yet
			if (data.tr === null) {
				createTr(settings, dataIdx);
			}

			var nRow = data.tr!;

			// Add various classes as needed
			for (var i = 0; i < columns.length; i++) {
				var col = columns[i];
				var td = data.cells[i];

				dom
					.s(td)
					.classAdd(col.type ? ext.type.className[col.type] : null) // auto class
					.classAdd(settings.classes.tbody.cell); // all cells
			}

			// Row callback functions - might want to manipulate the row
			// rowCount and j are not currently documented. Are they at all
			// useful?
			callbackFire(settings, 'row', null, [
				nRow,
				data.data,
				rowCount,
				j,
				dataIdx
			]);

			rowEls.push(nRow);
			rowCount++;
		}
	}
	else {
		rowEls[0] = _emptyRow(settings);
	}

	/* Header and footer callbacks */
	callbackFire(settings, 'header', 'header', [
		dom.s(settings.nTHead).children('tr').get(0),
		getDataMaster(settings),
		start,
		end,
		display
	]);

	callbackFire(settings, 'footer', 'footer', [
		dom.s(settings.nTFoot).children('tr').get(0),
		getDataMaster(settings),
		start,
		end,
		display
	]);

	body.detachChildren().append(rowEls);

	// Empty table needs a specific class
	dom
		.s(settings.nTableWrapper)
		.classToggle(
			'dt-empty-footer',
			dom.s(settings.nTFoot).find('tr').count() === 0
		);

	// Call all required callback functions for the end of a draw
	callbackFire(settings, 'draw', 'draw', [settings], true);

	// Draw is complete, sorting and filtering must be as well
	settings.wasOrdered = false;
	settings.wasFiltered = false;
	settings.doingDraw = false;
}

/**
 * Redraw the table - taking account of the various features which are enabled
 *
 * @param settings DataTables settings object
 * @param holdPosition Keep the current paging position. By default the paging
 *    is reset to the first page
 * @param recompute Indicate if a rebuild of sort and filter should happen
 */
export function reDraw(
	settings: Context,
	holdPosition?: boolean,
	recompute?: boolean
) {
	let features = settings.features,
		doSort = features.ordering,
		doFilter = features.searching;

	if (recompute === undefined || recompute === true) {
		// Resolve any column types that are unknown due to addition or invalidation
		columnTypes(settings);

		if (doSort) {
			sort(settings);
		}

		if (doFilter) {
			filterComplete(settings, settings.previousSearch);
		}
		else {
			// No filtering, so we want to just use the display master
			settings.display = settings.displayMaster.slice();
		}
	}

	if (holdPosition !== true) {
		settings.displayStart = 0;
	}

	// Let any modules know about the draw hold position state (used by
	// scrolling internally)
	settings.drawHold = holdPosition;

	draw(settings);

	settings.api.one('draw', function () {
		settings.drawHold = false;
	});
}

/**
 * Table is empty - create a row with an empty message in it
 *
 * @param settings DataTables context
 */
function _emptyRow(settings: Context) {
	let lang = settings.language;
	let zero = lang.zeroRecords;
	let dataSrc = dataSource(settings);

	// Make use of the fact that settings.json is only set once the initial data has
	// been loaded. Show loading when that isn't the case
	if ((dataSrc === 'ssp' || dataSrc === 'ajax') && !settings.json) {
		zero = lang.loadingRecords;
	}
	else if (lang.emptyTable && recordsTotal(settings) === 0) {
		zero = lang.emptyTable;
	}

	return dom
		.c<HTMLTableRowElement>('tr')
		.append(
			dom
				.c('td')
				.attr('colSpan', visibleColumns(settings))
				.classAdd(settings.classes.empty.row)
				.html(zero)
		)
		.get(0);
}

/**
 * Use the DOM source to create up an array of header cells. The idea here is to
 * create a layout grid (array) of rows x columns, which contains a reference to
 * the cell at that point in the grid (regardless of col/rowspan), such that any
 * column / row could be removed and the new grid constructed.
 *
 * @param settings DataTables context
 * @param thead thead / tbody element
 * @param write If cells should be written (if required)
 * @returns Calculated layout array
 */
export function detectHeader(
	settings: Context,
	thead: Element,
	write: boolean
) {
	let columns = settings.columns;
	let rows = dom.s(thead).children('tr');
	let row, loopCell: ChildNode | null;
	let i: number,
		k: number,
		l: number,
		len: number,
		shifted: number,
		column: number,
		colspan: number,
		rowspan: number;
	let titleRow = settings.titleRow;
	let isHeader = thead && thead.nodeName.toLowerCase() === 'thead';
	let layout: HeaderStructure[] = [];
	let isUnique: boolean;
	let shift = function (a: HeaderStructure[], b: number, j: number) {
		let d = a[b];

		while (d[j]) {
			j++;
		}

		return j;
	};

	// We know how many rows there are in the layout - so prep it
	for (i = 0, len = rows.count(); i < len; i++) {
		layout.push([] as any);
	}

	for (i = 0, len = rows.count(); i < len; i++) {
		row = rows.get(i);
		column = 0;

		// For every cell in the row..
		loopCell = row.firstChild;

		while (loopCell) {
			if (
				loopCell.nodeName.toUpperCase() == 'TD' ||
				loopCell.nodeName.toUpperCase() == 'TH'
			) {
				let cell = dom.s(loopCell as HTMLTableCellElement);
				let cols: any[] = [];

				// Get the col and rowspan attributes from the DOM and sanitise them
				colspan = parseInt(cell.attr('colspan') || '1') || 1;
				rowspan = parseInt(cell.attr('rowspan') || '1') || 1;
				colspan = !colspan || colspan === 0 || colspan === 1 ? 1 : colspan;
				rowspan = !rowspan || rowspan === 0 || rowspan === 1 ? 1 : rowspan;

				// There might be colspan cells already in this row, so shift our target
				// accordingly
				shifted = shift(layout, i, column);

				// Cache calculation for unique columns
				isUnique = colspan === 1 ? true : false;

				// Perform header setup
				if (write) {
					if (isUnique) {
						// Allow column options to be set from HTML attributes
						columnOptions(settings, shifted, escapeObject(cell.data()));

						// Get the width for the column. This can be defined from the
						// width attribute, style attribute or `columns.width` option
						let columnDef = columns[shifted];
						let width = cell.attr('width') || null;
						let t = cell.get(0).style.width.match(/width:\s*(\d+[pxem%]+)/);

						if (t) {
							width = t[1];
						}

						columnDef.widthOrig = columnDef.width || width;

						if (isHeader) {
							// Column title handling - can be user set, or read from the DOM
							// This happens before the render, so the original is still in place
							if (columnDef.title !== null && !columnDef.autoTitle) {
								if (
									(titleRow === true && i === 0) || // top row
									(titleRow === false && i === rows.count() - 1) || // bottom row
									titleRow === i || // specific row
									titleRow === null
								) {
									cell.html(columnDef.title);
								}
							}

							if (!columnDef.title && isUnique) {
								columnDef.title = util.string.stripHtml(cell.html());
								columnDef.autoTitle = true;
							}
						}
						else {
							// Footer specific operations
							if (columnDef.footer) {
								cell.html(columnDef.footer);
							}
						}

						// Fall back to the aria-label attribute on the table header if no ariaTitle is
						// provided.
						if (!columnDef.ariaTitle) {
							columnDef.ariaTitle = cell.attr('aria-label') || columnDef.title;
						}

						// Column specific class names
						if (columnDef.className) {
							cell.classAdd(columnDef.className);
						}
					}

					// Wrap the column title so we can write to it in future
					if (cell.find('span.dt-column-title').count() === 0) {
						dom
							.c('span')
							.classAdd('dt-column-title')
							.append(Array.from(cell.get(0).childNodes))
							.appendTo(cell);
					}

					if (
						settings.orderIndicators &&
						isHeader &&
						cell.filter(':not([data-dt-order=disable])').count() !== 0 &&
						cell.parent(':not([data-dt-order=disable])').count() !== 0 &&
						cell.find('span.dt-column-order').count() === 0
					) {
						dom.c('span').classAdd('dt-column-order').appendTo(cell);
					}

					// We need to wrap the elements in the header in another element to use flexbox
					// layout for those elements
					var headerFooter = isHeader ? 'header' : 'footer';

					if (cell.find('span.dt-column-' + headerFooter).count() === 0) {
						dom
							.c('div')
							.classAdd('dt-column-' + headerFooter)
							.append(Array.from(cell.get(0).childNodes))
							.appendTo(cell);
					}
				}

				// If there is col / rowspan, copy the information into the layout grid
				for (l = 0; l < colspan; l++) {
					for (k = 0; k < rowspan; k++) {
						layout[i + k][shifted + l] = {
							cell: cell.get(0),
							unique: isUnique
						};

						layout[i + k].row = row;
					}

					cols.push(shifted + l);
				}

				// Assign an attribute so spanning cells can still be identified
				// as belonging to a column
				cell.attr('data-dt-column', util.unique(cols).join(','));
			}

			loopCell = loopCell.nextSibling;
		}
	}

	return layout;
}

/**
 * Set the start position for draw
 *
 * @param settings DataTables settings object
 */
export function setStartPosition(settings: Context) {
	var bServerSide = dataSource(settings) == 'ssp';
	var iInitDisplayStart = settings.displayStartInit;

	// Check and see if we have an initial draw position from state saving
	if (iInitDisplayStart !== undefined && iInitDisplayStart !== -1) {
		settings.displayStart = bServerSide
			? iInitDisplayStart
			: iInitDisplayStart >= recordsDisplay(settings)
			? 0
			: iInitDisplayStart;

		settings.displayStartInit = -1;
	}
}

/**
 * Get the number of records in the current record set, before filtering
 *
 * @param ctx DataTables settings object
 */
export function recordsTotal(ctx: Context) {
	return dataSource(ctx) == 'ssp'
		? ctx.recordsTotal * 1
		: ctx.displayMaster.length;
}

/**
 * Get the number of records in the current record set, after filtering
 *
 * @param ctx DataTables settings object
 */
export function recordsDisplay(ctx: Context) {
	return dataSource(ctx) == 'ssp' ? ctx.recordsDisplay * 1 : ctx.display.length;
}

/**
 * Get the display end point - display index
 *
 * @param ctx DataTables settings object
 */
export function displayEnd(ctx: Context) {
	var len = ctx.pageLength,
		start = ctx.displayStart,
		calc = start + len,
		records = ctx.display.length,
		features = ctx.features,
		paginate = features.paging;

	if (features.serverSide) {
		return paginate === false || len === -1
			? start + records
			: Math.min(start + len, ctx.recordsDisplay);
	}
	else {
		return !paginate || calc > records || len === -1 ? records : calc;
	}
}
