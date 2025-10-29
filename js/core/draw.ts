import { callbackFire, dataSource, escapeObject, log } from '../api/support';
import dom, { Dom } from '../dom';
import ext from '../ext/index';
import Context from '../model/settings';
import { pluck, range, unique } from '../util/array';
import { addClass } from '../util/internal';
import { stripHtml } from '../util/string';
import { ajaxUpdate } from './ajax';
import { columnOptions, columnTypes, visibleColumns } from './columns';
import { getCellData, getDataMaster, writeCell } from './data';
import { filterComplete } from './filter';
import { processingDisplay } from './processing';
import { renderer } from './render';
import { sort } from './sort';

/**
 * Render and cache a row's display data for the columns, if required
 * @returns
 */
export function getRowDisplay(settings, rowIdx) {
	var rowModal = settings.aoData[rowIdx];
	var columns = settings.aoColumns;

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
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow Row to consider
 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
 *    DataTables will create a row automatically
 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
 *    if nTr is.
 *  @memberof DataTable#oApi
 */
export function createTr(oSettings, iRow, nTrIn?, anTds?) {
	var row = oSettings.aoData[iRow],
		rowData = row._aData,
		cells: HTMLTableCellElement[] = [],
		nTr,
		nTd,
		oCol,
		i,
		iLen,
		create,
		trClass = oSettings.oClasses.tbody.row;

	if (row.nTr === null) {
		nTr = nTrIn || document.createElement('tr');

		row.nTr = nTr;
		row.anCells = cells;

		addClass(nTr, trClass);

		/* Use a private property on the node to allow reserve mapping from the node
		 * to the aoData array for fast look up
		 */
		nTr._DT_RowIndex = iRow;

		/* Special parameters can be given by the data source to be used on the row */
		rowAttributes(oSettings, row);

		/* Process each column */
		for (i = 0, iLen = oSettings.aoColumns.length; i < iLen; i++) {
			oCol = oSettings.aoColumns[i];
			create = nTrIn && anTds[i] ? false : true;

			nTd = create ? document.createElement(oCol.sCellType) : anTds[i];

			if (!nTd) {
				log(oSettings, 0, 'Incorrect column count', 18);
			}

			nTd._DT_CellIndex = {
				row: iRow,
				column: i,
			};

			cells.push(nTd);

			var display = getRowDisplay(oSettings, iRow);

			// Need to create the HTML if new, or if a rendering function is defined
			if (
				create ||
				((oCol.mRender || oCol.mData !== i) &&
					(!$.isPlainObject(oCol.mData) || oCol.mData._ !== i + '.display'))
			) {
				writeCell(nTd, display[i]);
			}

			// column class
			addClass(nTd, oCol.sClass);

			// Visibility - add or remove as required
			if (oCol.bVisible && create) {
				nTr.appendChild(nTd);
			}
			else if (!oCol.bVisible && !create) {
				nTd.parentNode.removeChild(nTd);
			}

			if (oCol.fnCreatedCell) {
				oCol.fnCreatedCell.call(
					oSettings.oInstance,
					nTd,
					getCellData(oSettings, iRow, i),
					rowData,
					iRow,
					i
				);
			}
		}

		callbackFire(oSettings, 'aoRowCreatedCallback', 'row-created', [
			nTr,
			rowData,
			iRow,
			cells,
		]);
	}
	else {
		addClass(row.nTr, trClass);
	}
}

/**
 * Add attributes to a row based on the special `DT_*` parameters in a data
 * source object.
 *  @param {object} settings DataTables settings object
 *  @param {object} DataTables row object for the row to be modified
 *  @memberof DataTable#oApi
 */
export function rowAttributes(settings, row) {
	var tr = row.nTr;
	var data = row._aData;

	if (tr) {
		var id = settings.rowIdFn(data);

		if (id) {
			tr.id = id;
		}

		if (data.DT_RowClass) {
			// Remove any classes added by DT_RowClass before
			var a = data.DT_RowClass.split(' ');
			row.__rowc = row.__rowc ? unique(row.__rowc.concat(a)) : a;

			$(tr).removeClass(row.__rowc.join(' ')).addClass(data.DT_RowClass);
		}

		if (data.DT_RowAttr) {
			$(tr).attr(data.DT_RowAttr);
		}

		if (data.DT_RowData) {
			$(tr).data(data.DT_RowData);
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
	let classes = settings.oClasses;
	let columns = settings.aoColumns;
	let i, iLen, row: Dom;
	let target = dom.s(side === 'header' ? settings.nTHead : settings.nTFoot);
	let titleProp = side === 'header' ? 'sTitle' : side;

	// Footer might be defined
	if (!target) {
		return;
	}

	// If no cells yet and we have content for them, then create
	if (side === 'header' || pluck(settings.aoColumns, titleProp).join('')) {
		row = target.find('tr');

		// Add a row if needed
		if (!row.count()) {
			row = dom.c('tr').appendTo(target);
		}

		// Add the number of cells needed to make up to the number of columns
		if (row.count() === 1) {
			let cellCount = 0;

			row.find<HTMLTableCellElement>('td, th').each((el) => {
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
		settings.aoHeader = detected;
		target.find('tr').classAdd(classes.thead.row);
	}
	else {
		settings.aoFooter = detected;
		target.find('tr').classAdd(classes.tfoot.row);
	}

	// Every cell needs to be passed through the renderer
	target
		.children('tr')
		.children('th, td')
		.each((el) => {
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
 * @param {*} settings DataTables settings
 * @param {*} source Source layout array
 * @param {*} incColumns What columns should be included
 * @returns Layout array in column index order
 */
export function headerLayout(settings, source, incColumns?) {
	var row, column, cell;
	var local: any[] = [];
	var structure: any[][] = []; // TODO typing
	var columns = settings.aoColumns;
	var columnCount = columns.length;
	var rowspan, colspan;

	if (!source) {
		return;
	}

	// Default is to work on only visible columns
	if (!incColumns) {
		incColumns = range(columnCount).filter(function (idx) {
			return columns[idx].bVisible;
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

				var titleSpan = $('span.dt-column-title', cell);

				structure[row][column] = {
					cell: cell,
					colspan: colspan,
					rowspan: rowspan,
					title: titleSpan.length ? titleSpan.html() : $(cell).html(),
				};
			}
		}
	}

	return structure;
}

/**
 * Draw the header (or footer) element based on the column visibility states.
 *
 *  @param object oSettings dataTables settings object
 *  @param array aoSource Layout array from detectHeader
 *  @memberof DataTable#oApi
 */
export function drawHead(settings, source) {
	var layout = headerLayout(settings, source);
	var tr, n;

	if (!layout) {
		return;
	}

	for (var row = 0; row < source.length; row++) {
		tr = source[row].row;

		// All cells are going to be replaced, so empty out the row
		// Can't use $().empty() as that kills event handlers
		if (tr) {
			while ((n = tr.firstChild)) {
				tr.removeChild(n);
			}
		}

		for (var column = 0; column < layout[row].length; column++) {
			var point = layout[row][column];

			if (point) {
				$(point.cell)
					.appendTo(tr)
					.attr('rowspan', point.rowspan)
					.attr('colspan', point.colspan);
			}
		}
	}
}

/**
 * Insert the required TR nodes into the table for display
 *  @param {object} oSettings dataTables settings object
 *  @param ajaxComplete true after ajax call to complete rendering
 *  @memberof DataTable#oApi
 */
export function draw(oSettings, ajaxComplete?) {
	// Allow for state saving and a custom start position
	start(oSettings);

	/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
	var aPreDraw = callbackFire(oSettings, 'aoPreDrawCallback', 'preDraw', [
		oSettings,
	]);
	if (aPreDraw.indexOf(true) !== -1) {
		processingDisplay(oSettings, false);
		return;
	}

	var anRows: HTMLTableRowElement[] = [];
	var iRowCount = 0;
	var bServerSide = dataSource(oSettings) == 'ssp';
	var aiDisplay = oSettings.aiDisplay;
	var iDisplayStart = oSettings._iDisplayStart;
	var iDisplayEnd = oSettings.fnDisplayEnd();
	var columns = oSettings.aoColumns;
	var body = $(oSettings.nTBody);

	oSettings.bDrawing = true;

	/* Server-side processing draw intercept */
	if (oSettings.deferLoading) {
		oSettings.deferLoading = false;
		oSettings.iDraw++;
		processingDisplay(oSettings, false);
	}
	else if (!bServerSide) {
		oSettings.iDraw++;
	}
	else if (!oSettings.bDestroying && !ajaxComplete) {
		// Show loading message for server-side processing
		if (oSettings.iDraw === 0) {
			body.empty().append(_emptyRow(oSettings));
		}

		ajaxUpdate(oSettings);
		return;
	}

	if (aiDisplay.length !== 0) {
		var iStart = bServerSide ? 0 : iDisplayStart;
		var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;

		for (var j = iStart; j < iEnd; j++) {
			var iDataIndex = aiDisplay[j];
			var aoData = oSettings.aoData[iDataIndex];

			// Row has been deleted - can't be displayed
			if (aoData === null) {
				continue;
			}

			// Row node hasn't been created yet
			if (aoData.nTr === null) {
				createTr(oSettings, iDataIndex);
			}

			var nRow = aoData.nTr;

			// Add various classes as needed
			for (var i = 0; i < columns.length; i++) {
				var col = columns[i];
				var td = aoData.anCells[i];

				addClass(td, ext.type.className[col.sType]); // auto class
				addClass(td, oSettings.oClasses.tbody.cell); // all cells
			}

			// Row callback functions - might want to manipulate the row
			// iRowCount and j are not currently documented. Are they at all
			// useful?
			callbackFire(oSettings, 'aoRowCallback', null, [
				nRow,
				aoData._aData,
				iRowCount,
				j,
				iDataIndex,
			]);

			anRows.push(nRow);
			iRowCount++;
		}
	}
	else {
		anRows[0] = _emptyRow(oSettings);
	}

	/* Header and footer callbacks */
	callbackFire(oSettings, 'aoHeaderCallback', 'header', [
		$(oSettings.nTHead).children('tr')[0],
		getDataMaster(oSettings),
		iDisplayStart,
		iDisplayEnd,
		aiDisplay,
	]);

	callbackFire(oSettings, 'aoFooterCallback', 'footer', [
		$(oSettings.nTFoot).children('tr')[0],
		getDataMaster(oSettings),
		iDisplayStart,
		iDisplayEnd,
		aiDisplay,
	]);

	// replaceChildren is faster, but only became widespread in 2020,
	// so a fall back in jQuery is provided for older browsers.
	if (body[0].replaceChildren) {
		body[0].replaceChildren.apply(body[0], anRows);
	}
	else {
		body.children().detach();
		body.append($(anRows));
	}

	// Empty table needs a specific class
	$(oSettings.nTableWrapper).toggleClass(
		'dt-empty-footer',
		$('tr', oSettings.nTFoot).length === 0
	);

	/* Call all required callback functions for the end of a draw */
	callbackFire(oSettings, 'aoDrawCallback', 'draw', [oSettings], true);

	/* Draw is complete, sorting and filtering must be as well */
	oSettings.bSorted = false;
	oSettings.bFiltered = false;
	oSettings.bDrawing = false;
}

/**
 * Redraw the table - taking account of the various features which are enabled
 *  @param {object} oSettings dataTables settings object
 *  @param {boolean} [holdPosition] Keep the current paging position. By default
 *    the paging is reset to the first page
 *  @memberof DataTable#oApi
 */
export function reDraw(settings, holdPosition?, recompute?) {
	var features = settings.oFeatures,
		doSort = features.bSort,
		doFilter = features.bFilter;

	if (recompute === undefined || recompute === true) {
		// Resolve any column types that are unknown due to addition or invalidation
		columnTypes(settings);

		if (doSort) {
			sort(settings);
		}

		if (doFilter) {
			filterComplete(settings, settings.oPreviousSearch);
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	}

	if (holdPosition !== true) {
		settings._iDisplayStart = 0;
	}

	// Let any modules know about the draw hold position state (used by
	// scrolling internally)
	settings._drawHold = holdPosition;

	draw(settings);

	settings.api.one('draw', function () {
		settings._drawHold = false;
	});
}

/*
 * Table is empty - create a row with an empty message in it
 */
function _emptyRow(settings) {
	var oLang = settings.oLanguage;
	var zero = oLang.sZeroRecords;
	var dataSrc = dataSource(settings);

	// Make use of the fact that settings.json is only set once the initial data has
	// been loaded. Show loading when that isn't the case
	if ((dataSrc === 'ssp' || dataSrc === 'ajax') && !settings.json) {
		zero = oLang.sLoadingRecords;
	}
	else if (oLang.sEmptyTable && settings.fnRecordsTotal() === 0) {
		zero = oLang.sEmptyTable;
	}

	return $<HTMLTableRowElement>('<tr/>').append(
		$('<td />', {
			colSpan: visibleColumns(settings),
			class: settings.oClasses.empty.row,
		}).html(zero)
	)[0];
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
export function detectHeader(settings: Context, thead: Element, write: boolean) {
	var columns = settings.aoColumns;
	var rows = $(thead).children('tr');
	var row, cell;
	var i, k, l, iLen, shifted, column, colspan, rowspan;
	var titleRow = settings.titleRow;
	var isHeader = thead && thead.nodeName.toLowerCase() === 'thead';
	var layout: any[] = [];
	var isUnique;
	var shift = function (a, b, j) {
		var d = a[b];
		while (d[j]) {
			j++;
		}
		return j;
	};

	// We know how many rows there are in the layout - so prep it
	for (i = 0, iLen = rows.length; i < iLen; i++) {
		layout.push([]);
	}

	for (i = 0, iLen = rows.length; i < iLen; i++) {
		row = rows[i];
		column = 0;

		// For every cell in the row..
		cell = row.firstChild;
		while (cell) {
			if (
				cell.nodeName.toUpperCase() == 'TD' ||
				cell.nodeName.toUpperCase() == 'TH'
			) {
				var cols: any[] = [];
				var jqCell = $(cell);

				// Get the col and rowspan attributes from the DOM and sanitise them
				colspan = cell.getAttribute('colspan') * 1;
				rowspan = cell.getAttribute('rowspan') * 1;
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
						columnOptions(settings, shifted, escapeObject(jqCell.data()));

						// Get the width for the column. This can be defined from the
						// width attribute, style attribute or `columns.width` option
						var columnDef = columns[shifted];
						var width = cell.getAttribute('width') || null;
						var t = cell.style.width.match(/width:\s*(\d+[pxem%]+)/);
						if (t) {
							width = t[1];
						}

						columnDef.sWidthOrig = columnDef.sWidth || width;

						if (isHeader) {
							// Column title handling - can be user set, or read from the DOM
							// This happens before the render, so the original is still in place
							if (columnDef.sTitle !== null && !columnDef.autoTitle) {
								if (
									(titleRow === true && i === 0) || // top row
									(titleRow === false && i === rows.length - 1) || // bottom row
									titleRow === i || // specific row
									titleRow === null
								) {
									cell.innerHTML = columnDef.sTitle;
								}
							}

							if (!columnDef.sTitle && isUnique) {
								columnDef.sTitle = stripHtml(cell.innerHTML);
								columnDef.autoTitle = true;
							}
						}
						else {
							// Footer specific operations
							if (columnDef.footer) {
								cell.innerHTML = columnDef.footer;
							}
						}

						// Fall back to the aria-label attribute on the table header if no ariaTitle is
						// provided.
						if (!columnDef.ariaTitle) {
							columnDef.ariaTitle =
								jqCell.attr('aria-label') || columnDef.sTitle;
						}

						// Column specific class names
						if (columnDef.className) {
							jqCell.addClass(columnDef.className);
						}
					}

					// Wrap the column title so we can write to it in future
					if ($('span.dt-column-title', cell).length === 0) {
						$('<span>')
							.addClass('dt-column-title')
							.append(cell.childNodes)
							.appendTo(cell);
					}

					if (
						settings.orderIndicators &&
						isHeader &&
						jqCell.filter(':not([data-dt-order=disable])').length !== 0 &&
						jqCell.parent(':not([data-dt-order=disable])').length !== 0 &&
						$('span.dt-column-order', cell).length === 0
					) {
						$('<span>').addClass('dt-column-order').appendTo(cell);
					}

					// We need to wrap the elements in the header in another element to use flexbox
					// layout for those elements
					var headerFooter = isHeader ? 'header' : 'footer';

					if ($('span.dt-column-' + headerFooter, cell).length === 0) {
						$('<div>')
							.addClass('dt-column-' + headerFooter)
							.append(cell.childNodes)
							.appendTo(cell);
					}
				}

				// If there is col / rowspan, copy the information into the layout grid
				for (l = 0; l < colspan; l++) {
					for (k = 0; k < rowspan; k++) {
						layout[i + k][shifted + l] = {
							cell: cell,
							unique: isUnique,
						};

						layout[i + k].row = row;
					}

					cols.push(shifted + l);
				}

				// Assign an attribute so spanning cells can still be identified
				// as belonging to a column
				cell.setAttribute('data-dt-column', unique(cols).join(','));
			}

			cell = cell.nextSibling;
		}
	}

	return layout;
}

/**
 * Set the start position for draw
 *  @param {object} oSettings dataTables settings object
 */
export function start(oSettings) {
	var bServerSide = dataSource(oSettings) == 'ssp';
	var iInitDisplayStart = oSettings.iInitDisplayStart;

	// Check and see if we have an initial draw position from state saving
	if (iInitDisplayStart !== undefined && iInitDisplayStart !== -1) {
		oSettings._iDisplayStart = bServerSide
			? iInitDisplayStart
			: iInitDisplayStart >= oSettings.fnRecordsDisplay()
			? 0
			: iInitDisplayStart;

		oSettings.iInitDisplayStart = -1;
	}
}
