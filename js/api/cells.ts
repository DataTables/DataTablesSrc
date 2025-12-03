import { columnIndexToVisible } from '../core/columns';
import { getCellData, invalidate, setCellData } from '../core/data';
import dom, { Dom } from '../dom';
import Context from '../model/settings';
import { flatten, pluckOrder, removeEmpty } from '../util/array';
import * as is from '../util/is';
import * as object from '../util/object';
import { register, registerPlural } from './Api';
import {
	Api,
	ApiCellMethods,
	ApiCellsMethods,
	ApiSelectorModifier,
	CellSelector,
	ColumnSelector,
	RowSelector
} from './interface';
import {
	selector_first,
	selector_opts,
	selector_row_indexes,
	selector_run
} from './selectors';

function selectCells(
	settings: Context,
	selector: CellSelector,
	opts: ApiSelectorModifier
) {
	var data = settings.aoData;
	var rows = selector_row_indexes(settings, opts);
	var allCells: Dom;
	var row;
	var columns = settings.aoColumns.length;
	var a, i, iLen, j, o, host;

	var run = function (s: any) {
		var fnSelector = typeof s === 'function';

		if (s === null || s === undefined || fnSelector) {
			// All cells and function selectors
			a = [];

			for (i = 0, iLen = rows.length; i < iLen; i++) {
				row = rows[i];

				for (j = 0; j < columns; j++) {
					o = {
						row: row,
						column: j
					};

					if (fnSelector) {
						// Selector - function
						host = data[row];

						if (
							s(
								o,
								getCellData(settings, row, j),
								host && host.anCells ? host.anCells[j] : null
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

		// Only get the nodes if we get these far in the selector and need to
		// actually work with the cell nodes.
		if (!allCells) {
			let cells = removeEmpty(pluckOrder(data, rows, 'anCells'));

			allCells = dom.s(flatten([], cells));
		}

		// Selector - jQuery filtered cells
		let jqResult = allCells.filter(s).mapTo((el: any) => {
			return {
				// use a new object, in case someone changes the values
				row: el._DT_CellIndex.row,
				column: el._DT_CellIndex.column
			};
		});

		if (jqResult.length || !s.nodeName) {
			return jqResult;
		}

		// Otherwise the selector is a node, and there is one last option - the
		// element might be a child of an element which has dt-row and dt-column
		// data attributes
		host = dom.s(s).closest('*[data-dt-row]');
		return host.count()
			? [
					{
						row: host.data('dt-row'),
						column: host.data('dt-column')
					}
			  ]
			: [];
	};

	return selector_run('cell', selector, run, settings, opts);
}

type ApiCellsOverload<T = any> = (
	this: Api,
	rowSelector?: ApiSelectorModifier | CellSelector | RowSelector<T>,
	columnSelector?: ApiSelectorModifier | ColumnSelector,
	modifier?: ApiSelectorModifier
) => ApiCellsMethods<T>;

register<ApiCellsOverload>('cells()', function (arg1?, arg2?, arg3?) {
	// // Argument shifting
	let rowSelector: RowSelector<any> = null;
	let columnSelector: ColumnSelector = null;
	let cellSelector: CellSelector;
	let opts: ApiSelectorModifier | undefined;

	// Argument shifting
	if (is.plainObject(arg1)) {
		if ((arg1 as any).row === undefined) {
			// Selector modifier only overload
			opts = arg1 as ApiSelectorModifier;
		}
		else {
			// Cell selector as an index object
			cellSelector = arg1 as CellSelector;
			opts = arg2 as ApiSelectorModifier;
		}
	}
	else if (is.plainObject(arg2) || arg2 === undefined) {
		// Cell selector overload
		cellSelector = arg1 as CellSelector;
		opts = arg2 as ApiSelectorModifier;
	}
	else if (arg1 !== undefined) {
		// Row + column selector overload
		rowSelector = arg1 as RowSelector<any>;
		columnSelector = arg2 as ColumnSelector;
		opts = arg3;
	}

	// Cell selector (if there is no column selector, then it must be)
	if (columnSelector === null) {
		return this.iterator('table', function (settings) {
			return selectCells(settings, cellSelector, selector_opts(opts));
		});
	}

	// The default built in options need to apply to row and columns
	let internalOpts = opts
		? {
				page: opts.page,
				order: opts.order,
				search: opts.search
		  }
		: {};

	// Row + column selector
	let columns = this.columns(columnSelector, internalOpts);
	let rows = this.rows(rowSelector, internalOpts);
	let i, iLen, j, jen;

	let cellsNoOpts = this.iterator<ApiCellsMethods<any>>(
		'table',
		function (settings, idx) {
			let a: any[] = [];

			for (i = 0, iLen = rows[idx].length; i < iLen; i++) {
				for (j = 0, jen = columns[idx].length; j < jen; j++) {
					a.push({
						row: rows[idx][i],
						column: columns[idx][j]
					});
				}
			}

			return a;
		},
		true
	);

	// There is currently only one extension which uses a cell selector extension
	// It is a _major_ performance drag to run this if it isn't needed, so this is
	// an extension specific check at the moment
	let cells =
		opts && opts.selected
			? this.cells(cellsNoOpts.toArray(), opts)
			: cellsNoOpts;

	object.assign(cells.selector, {
		cols: columnSelector,
		rows: rowSelector,
		opts: opts
	});

	return cells;
});

register<ApiCellsMethods<any>['every']>('cells().every()', function (fn) {
	var opts = this.selector.opts;
	var counter = 0;

	return this.iterator('every', (settings, selectedIdx, tableIdx) => {
		let inst = this.cell(selectedIdx, opts);

		fn.call(inst, inst[0][0].row, inst[0][0].column, tableIdx, counter);

		counter++;
	});
});

registerPlural<ApiCellsMethods<any>['nodes']>(
	'cells().nodes()',
	'cell().node()',
	function () {
		return this.iterator(
			'cell',
			function (settings, row, column) {
				var data = settings.aoData[row];

				return data && data.anCells ? data.anCells[column] : undefined;
			},
			true
		);
	}
);

register<ApiCellsMethods<any>['data']>('cells().data()', function () {
	return this.iterator(
		'cell',
		function (settings, row, column) {
			return getCellData(settings, row, column);
		},
		true
	);
});

registerPlural<ApiCellsMethods<any>['cache']>(
	'cells().cache()',
	'cell().cache()',
	function (type) {
		let prop: '_aFilterData' | '_aSortData' =
			type === 'search' ? '_aFilterData' : '_aSortData';

		return this.iterator(
			'cell',
			function (settings, row, column) {
				let rowData = settings.aoData[row];

				return rowData && rowData[prop] ? rowData[prop][column] : null;
			},
			true
		);
	}
);

registerPlural<ApiCellsMethods<any>['render']>(
	'cells().render()',
	'cell().render()',
	function (type) {
		return this.iterator(
			'cell',
			function (settings, row, column) {
				return getCellData(settings, row, column, type);
			},
			true
		);
	}
);

registerPlural<ApiCellsMethods<any>['indexes']>(
	'cells().indexes()',
	'cell().index()',
	function () {
		return this.iterator(
			'cell',
			function (settings, row, column) {
				return {
					row: row,
					column: column,
					columnVisible: columnIndexToVisible(settings, column)
				};
			},
			true
		);
	}
);

registerPlural<ApiCellsMethods<any>['invalidate']>(
	'cells().invalidate()',
	'cell().invalidate()',
	function (src) {
		return this.iterator('cell', function (settings, row, column) {
			invalidate(settings, row, src!, column);
		});
	}
);

type APiCellOverload = (
	this: Api,
	rowSelector?: ApiSelectorModifier | CellSelector | RowSelector<any>,
	columnSelector?: ApiSelectorModifier | ColumnSelector,
	modifier?: ApiSelectorModifier
) => ApiCellMethods<any>;

register<APiCellOverload>(
	'cell()',
	function (rowSelector, columnSelector?, opts?) {
		return selector_first(
			this.cells(rowSelector as any, columnSelector as any, opts)
		);
	}
);

register<ApiCellMethods<any>['data']>('cell().data()', function (data?) {
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
