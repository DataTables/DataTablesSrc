import { columnIndexToVisible } from '../core/columns';
import { getCellData, invalidate, setCellData } from '../core/data';
import dom from '../dom';
import { flatten, pluckOrder, removeEmpty } from '../util/array';
import * as is from '../util/is';
import * as object from '../util/object';
import Api from './base';
import {
    selector_first,
    selector_opts,
    selector_row_indexes,
    selector_run,
} from './selectors';

var __cell_selector = function (settings, selector, opts) {
	var data = settings.aoData;
	var rows = selector_row_indexes(settings, opts);
	var cells = removeEmpty(pluckOrder(data, rows, 'anCells'));
	var allCells = dom.s(flatten([], cells));
	var row;
	var columns = settings.aoColumns.length;
	var a, i, iLen, j, o, host;

	var run = function (s) {
		var fnSelector = typeof s === 'function';

		if (s === null || s === undefined || fnSelector) {
			// All cells and function selectors
			a = [];

			for (i = 0, iLen = rows.length; i < iLen; i++) {
				row = rows[i];

				for (j = 0; j < columns; j++) {
					o = {
						row: row,
						column: j,
					};

					if (fnSelector) {
						// Selector - function
						host = data[row];

						if (
							s(
								o,
								getCellData(settings, row, j),
								host.anCells ? host.anCells[j] : null
							)
						) {
							a.push(o);
						}
					}
					else {
						// Selector - all
						a.push(o);
					}
				}
			}

			return a;
		}

		// Selector - index
		if (is.plainObject(s)) {
			// Valid cell index and its in the array of selectable rows
			return s.column !== undefined &&
				s.row !== undefined &&
				rows.indexOf(s.row) !== -1
				? [s]
				: [];
		}

		// Selector - jQuery filtered cells
		var jqResult = allCells.filter(s).mapTo((el: any) => {
			return {
				// use a new object, in case someone changes the values
				row: el._DT_CellIndex.row,
				column: el._DT_CellIndex.column,
			};
		});

		if (jqResult.length || !s.nodeName) {
			return jqResult;
		}

		// Otherwise the selector is a node, and there is one last option - the
		// element might be a child of an element which has dt-row and dt-column
		// data attributes
		host = dom.s(s).closest('*[data-dt-row]');
		return host.length
			? [
					{
						row: host.data('dt-row'),
						column: host.data('dt-column'),
					},
			  ]
			: [];
	};

	return selector_run('cell', selector, run, settings, opts);
};

Api.register('cells()', function (rowSelector, columnSelector, opts) {
	// Argument shifting
	if (is.plainObject(rowSelector)) {
		// Indexes
		if (rowSelector.row === undefined) {
			// Selector options in first parameter
			opts = rowSelector;
			rowSelector = null;
		}
		else {
			// Cell index objects in first parameter
			opts = columnSelector;
			columnSelector = null;
		}
	}
	if (is.plainObject(columnSelector)) {
		opts = columnSelector;
		columnSelector = null;
	}

	// Cell selector
	if (columnSelector === null || columnSelector === undefined) {
		return this.iterator('table', function (settings) {
			return __cell_selector(settings, rowSelector, selector_opts(opts));
		});
	}

	// The default built in options need to apply to row and columns
	var internalOpts = opts
		? {
				page: opts.page,
				order: opts.order,
				search: opts.search,
		  }
		: {};

	// Row + column selector
	var columns = this.columns(columnSelector, internalOpts);
	var rows = this.rows(rowSelector, internalOpts);
	var i, iLen, j, jen;

	var cellsNoOpts = this.iterator(
		'table',
		function (settings, idx) {
			var a: any[] = [];

			for (i = 0, iLen = rows[idx].length; i < iLen; i++) {
				for (j = 0, jen = columns[idx].length; j < jen; j++) {
					a.push({
						row: rows[idx][i],
						column: columns[idx][j],
					});
				}
			}

			return a;
		},
		1
	);

	// There is currently only one extension which uses a cell selector extension
	// It is a _major_ performance drag to run this if it isn't needed, so this is
	// an extension specific check at the moment
	var cells =
		opts && opts.selected ? this.cells(cellsNoOpts, opts) : cellsNoOpts;

	object.assign(cells.selector, {
		cols: columnSelector,
		rows: rowSelector,
		opts: opts,
	});

	return cells;
});

Api.registerPlural('cells().nodes()', 'cell().node()', function () {
	return this.iterator(
		'cell',
		function (settings, row, column) {
			var data = settings.aoData[row];

			return data && data.anCells ? data.anCells[column] : undefined;
		},
		1
	);
});

Api.register('cells().data()', function () {
	return this.iterator(
		'cell',
		function (settings, row, column) {
			return getCellData(settings, row, column);
		},
		1
	);
});

Api.registerPlural('cells().cache()', 'cell().cache()', function (type) {
	type = type === 'search' ? '_aFilterData' : '_aSortData';

	return this.iterator(
		'cell',
		function (settings, row, column) {
			return settings.aoData[row][type][column];
		},
		1
	);
});

Api.registerPlural('cells().render()', 'cell().render()', function (type) {
	return this.iterator(
		'cell',
		function (settings, row, column) {
			return getCellData(settings, row, column, type);
		},
		1
	);
});

Api.registerPlural('cells().indexes()', 'cell().index()', function () {
	return this.iterator(
		'cell',
		function (settings, row, column) {
			return {
				row: row,
				column: column,
				columnVisible: columnIndexToVisible(settings, column),
			};
		},
		1
	);
});

Api.registerPlural(
	'cells().invalidate()',
	'cell().invalidate()',
	function (src) {
		return this.iterator('cell', function (settings, row, column) {
			invalidate(settings, row, src, column);
		});
	}
);

Api.register('cell()', function (rowSelector, columnSelector, opts) {
	return selector_first(this.cells(rowSelector, columnSelector, opts));
});

Api.register('cell().data()', function (data) {
	var ctx = this.context;
	var cell = this[0];

	if (data === undefined) {
		// Get
		return ctx.length && cell.length
			? getCellData(ctx[0], cell[0].row, cell[0].column)
			: undefined;
	}

	// Set
	setCellData(ctx[0], cell[0].row, cell[0].column, data);
	invalidate(ctx[0], cell[0].row, 'data', cell[0].column);

	return this;
});
