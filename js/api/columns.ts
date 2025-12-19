import {
	adjustColumnSizing,
	columnIndexToVisible,
	columnsFromHeader,
	columnTypes,
	visibleColumns,
	visibleToColumnIndex
} from '../core/columns';
import { getCellData } from '../core/data';
import { drawHead } from '../core/draw';
import { colGroup } from '../core/sizing';
import { saveState } from '../core/state';
import dom from '../dom';
import { Context, HeaderStructure } from '../model/settings';
import { pluck, pluckOrder, range, removeEmpty } from '../util/array';
import { intVal } from '../util/conv';
import * as is from '../util/is';
import { register, registerPlural } from './Api';
import {
	Api,
	ApiColumn,
	ApiColumns,
	ApiColumnsMethods,
	ApiSelectorModifier,
	ColumnSelector
} from './interface';
import {
	selectorFirst,
	selectorOpts,
	selectorRowIndexes,
	selectorRun
} from './selectors';
import { callbackFire } from './support';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Columns
 *
 * {integer}           - column index (>=0 count from left, <0 count from right)
 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
 * "{string}:name"     - column name
 * "{string}"          - jQuery selector on column header nodes
 *
 */

// can be an array of these items, comma separated list, or an array of comma
// separated lists

const __re_column_selector = /^([^:]+)?:(name|title|visIdx|visible)$/;

// r1 and r2 are redundant - but it means that the parameters match for the
// iterator callback in columns().data()
function columnData(
	settings: Context,
	column: number,
	r1: any,
	r2: any,
	rows: number[],
	type?: string
) {
	let a: any[] = [];

	for (let row = 0, iLen = rows.length; row < iLen; row++) {
		a.push(getCellData(settings, rows[row], column, type));
	}

	return a;
}

function columnHeader(settings: Context, column: number, row?: number) {
	var header = settings.header;
	var titleRow = settings.titleRow;
	var target = 0;

	if (row !== undefined) {
		target = row;
	}
	else if (titleRow === true) {
		// legacy orderCellsTop support
		target = 0;
	}
	else if (titleRow === false) {
		target = header.length - 1;
	}
	else if (titleRow !== null) {
		target = titleRow;
	}
	else {
		// Automatic - find the _last_ unique cell from the top that is not empty (last for
		// backwards compatibility)
		for (var i = 0; i < header.length; i++) {
			if (
				header[i][column].unique &&
				dom.s(header[i][column].cell).find('span.dt-column-title').text()
			) {
				target = i;
			}
		}

		if (target === null) {
			target = 0;
		}
	}

	return header[target][column].cell;
}

function columnHeaderCells(header: HeaderStructure[]) {
	var out: any[] = [];

	for (var i = 0; i < header.length; i++) {
		for (var j = 0; j < header[i].length; j++) {
			var cell = header[i][j].cell;

			if (!out.includes(cell)) {
				out.push(cell);
			}
		}
	}

	return out;
}

function selectColumns(
	settings: Context,
	selector: ColumnSelector,
	opts: ApiSelectorModifier
) {
	var columns = settings.columns,
		names: string[],
		titles: string[],
		nodes = columnHeaderCells(settings.header);

	var run = function (s: any) {
		var selInt = intVal(s);

		// Selector - all
		if (s === '') {
			return range(columns.length);
		}

		// Selector - index
		if (selInt !== null) {
			return [
				selInt >= 0
					? selInt // Count from left
					: columns.length + selInt // Count from right (+ because its a negative value)
			];
		}

		// Selector = function
		if (typeof s === 'function') {
			var rows = selectorRowIndexes(settings, opts);

			return columns.map(function (col, idx) {
				return s(
					idx,
					columnData(settings, idx, 0, 0, rows),
					columnHeader(settings, idx)
				)
					? idx
					: null;
			});
		}

		// String selector
		var match = typeof s === 'string' ? s.match(__re_column_selector) : '';

		if (match) {
			switch (match[2]) {
				case 'visIdx':
				case 'visible':
					// Selector is a column index
					if (match[1] && match[1].match(/^\d+$/)) {
						var idx = parseInt(match[1], 10);

						// Visible index given, convert to column index
						if (idx < 0) {
							// Counting from the right
							var visColumns = columns.map(function (col, i) {
								return col.visible ? i : null;
							});
							return [visColumns[visColumns.length + idx]];
						}
						// Counting from the left
						return [visibleToColumnIndex(settings, idx)];
					}

					return columns.map(function (col, mapIdx) {
						// Not visible, can't match
						if (!col.visible) {
							return null;
						}

						// Selector
						if (match && match[1]) {
							return dom.s(nodes[mapIdx]).filter(match[1]).count() > 0
								? mapIdx
								: null;
						}

						// `:visible` on its own
						return mapIdx;
					});

				case 'name':
					// Don't get names, unless needed, and only get once if it is
					if (!names) {
						names = pluck(columns, 'name');
					}

					// match by name. `names` is column index complete and in order
					return names.map(function (name, i) {
						return match && name === match[1] ? i : null;
					});

				case 'title':
					if (!titles) {
						titles = pluck(columns, 'title');
					}

					// match by column title
					return titles.map(function (title, i) {
						return match && title === match[1] ? i : null;
					});

				default:
					return [];
			}
		}

		// Cell in the table body
		if (s.nodeName && s._DT_CellIndex) {
			return [s._DT_CellIndex.column];
		}

		// Selector on the TH elements for the columns
		var result = dom
			.s(nodes)
			.filter(s)
			.mapTo(el => {
				return columnsFromHeader(el); // `nodes` is column index complete and in order
			})
			.flat()
			.sort(function (a, b) {
				return a - b;
			});

		if (result.length || !s.nodeName) {
			return result;
		}

		// Otherwise a node which might have a `dt-column` data attribute, or be
		// a child or such an element
		var host = dom.s(s).closest('*[data-dt-column]');
		return host.count() ? [host.data('dt-column')] : [];
	};

	var selected = selectorRun('column', selector, run, settings, opts);

	return opts.columnOrder && opts.columnOrder === 'index'
		? selected.sort(function (a, b) {
				return a - b;
		  })
		: selected; // implied
}

function setColumnVis(settings: Context, column: number, vis: boolean) {
	var cols = settings.columns,
		col = cols[column],
		data = settings.data,
		cells,
		i,
		iLen,
		tr;

	// Get
	if (vis === undefined) {
		return col.visible;
	}

	// Set
	// No change
	if (col.visible === vis) {
		return false;
	}

	if (vis) {
		// Insert column
		// Need to decide if we should use appendChild or insertBefore
		var insertBefore = pluck(cols, 'visible').indexOf(true, column + 1);

		for (i = 0, iLen = data.length; i < iLen; i++) {
			let row = data[i];

			if (row) {
				tr = row.tr;
				cells = row.cells;

				if (tr) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore(cells[column], cells[insertBefore] || null);
				}
			}
		}
	}
	else {
		// Remove column
		dom.s(removeEmpty(pluck(settings.data, 'cells', column))).detach();
	}

	// Common actions
	col.visible = vis;

	colGroup(settings);

	return true;
}

type ApiColumnsOverload = (
	this: Api,
	selector?: ColumnSelector | ApiSelectorModifier,
	modifier?: ApiSelectorModifier
) => Api;

register<ApiColumnsOverload>('columns()', function (arg1?, arg2?) {
	let selector: ColumnSelector;
	let opts: ApiSelectorModifier;

	// argument shifting
	if (arg1 === undefined) {
		selector = '';
	}
	else if (is.plainObject(arg1)) {
		selector = '';
		arg2 = arg1 as ApiSelectorModifier;
	}
	else {
		selector = arg1 as ColumnSelector;
	}

	opts = selectorOpts(arg2);

	let inst = this.iterator(
		'table',
		settings => selectColumns(settings, selector, opts),
		true
	);

	// Want argument shifting here and in _row_selector?
	inst.selector.cols = selector;
	inst.selector.opts = opts;

	return inst;
});

register<ApiColumnsMethods<any>['every']>('columns().every()', function (fn) {
	var opts = this.selector.opts;
	var counter = 0;

	return this.iterator('every', (settings, selectedIdx, tableIdx) => {
		let inst = this.column(selectedIdx, opts);

		fn.call(inst, selectedIdx, tableIdx, counter);

		counter++;
	});
});

registerPlural<ApiColumnsMethods<any>['header']>(
	'columns().header()',
	'column().header()',
	function (row?) {
		return this.iterator(
			'column',
			function (settings, column) {
				return columnHeader(settings, column, row);
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['footer']>(
	'columns().footer()',
	'column().footer()',
	function (row) {
		return this.iterator(
			'column',
			function (settings, column) {
				var footer = settings.footer;

				if (!footer.length) {
					return null;
				}

				return settings.footer[row !== undefined ? row : 0][column].cell;
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['data']>(
	'columns().data()',
	'column().data()',
	function () {
		return this.iterator('column-rows', columnData, true);
	}
);

registerPlural<ApiColumnsMethods<any>['render']>(
	'columns().render()',
	'column().render()',
	function (type) {
		return this.iterator(
			'column-rows',
			function (settings, column, i, j, rows) {
				return columnData(settings, column, i, j, rows, type);
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['dataSrc']>(
	'columns().dataSrc()',
	'column().dataSrc()',
	function () {
		return this.iterator(
			'column',
			function (settings, column) {
				return settings.columns[column].data;
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['cache']>(
	'columns().cache()',
	'column().cache()',
	function (type) {
		return this.iterator(
			'column-rows',
			function (settings, column, i, j, rows) {
				return pluckOrder(
					settings.data,
					rows,
					type === 'search' ? 'searchCellCache' : 'orderCache',
					column
				);
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['init']>(
	'columns().init()',
	'column().init()',
	function () {
		return this.iterator(
			'column',
			function (settings, column) {
				return settings.columns[column];
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['names']>(
	'columns().names()',
	'column().name()',
	function () {
		return this.iterator(
			'column',
			function (settings, column) {
				return settings.columns[column].name;
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['nodes']>(
	'columns().nodes()',
	'column().nodes()',
	function () {
		return this.iterator(
			'column-rows',
			function (settings, column, i, j, rows) {
				return removeEmpty(
					pluckOrder(settings.data, rows, 'cells', column)
				);
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['titles']>(
	'columns().titles()',
	'column().title()',
	function (title, row?) {
		return this.iterator(
			'column',
			function (settings, column) {
				// Argument shifting
				if (typeof title === 'number') {
					row = title;
					title = undefined;
				}

				var span = dom
					.s(this.column(column).header(row))
					.find('span.dt-column-title');

				if (title !== undefined) {
					span.html(title);
					return this;
				}

				return span.html();
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['types']>(
	'columns().types()',
	'column().type()',
	function () {
		return this.iterator(
			'column',
			function (settings, column) {
				var colObj = settings.columns[column];
				var type = colObj.type;

				// If the type was invalidated, then resolve it. This actually does
				// all columns at the moment. Would only happen once if getting all
				// column's data types.
				if (!type) {
					columnTypes(settings);

					type = colObj.type;
				}

				return type;
			},
			true
		);
	}
);

type ApiColumnsVisibleOverload = (
	this: Api<any>,
	show?: boolean,
	redrawCalculations?: boolean
) => boolean | Api<any>;

registerPlural<ApiColumnsVisibleOverload>(
	'columns().visible()',
	'column().visible()',
	function (vis?, calc?) {
		var that = this;
		var changed: any[] = [];
		var ret = this.iterator('column', function (settings, column) {
			if (vis === undefined) {
				return settings.columns[column].visible;
			} // else

			if (setColumnVis(settings, column, vis)) {
				changed.push(column);
			}
		});

		// Group the column visibility changes
		if (vis !== undefined) {
			this.iterator('table', function (settings) {
				// Redraw the header after changes
				drawHead(settings, settings.header);
				drawHead(settings, settings.footer);

				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if (!settings.display.length) {
					dom
						.s(settings.nTBody)
						.find('td[colspan]')
						.attr('colspan', visibleColumns(settings));
				}

				saveState(settings);

				// Second loop once the first is done for events
				that.iterator('column', function (ctx, column) {
					if (changed.includes(column)) {
						callbackFire(ctx, null, 'column-visibility', [
							ctx,
							column,
							vis,
							calc
						]);
					}
				});

				if (changed.length && (calc === undefined || calc)) {
					that.columns.adjust();
				}
			});
		}

		return ret;
	}
);

registerPlural<ApiColumnsMethods<any>['widths']>(
	'columns().widths()',
	'column().width()',
	function () {
		// Injects a fake row into the table for just a moment so the widths can
		// be read, regardless of colspan in the header and rows being present in
		// the body
		var columns = this.columns(':visible').count();
		var row = dom
			.c('tr')
			.html('<td>' + Array(columns).join('</td><td>') + '</td>');

		dom.s(this.table().body()).append(row);

		var widths = row.children().mapTo(el => {
			return dom.s(el).width('outer');
		});

		row.remove();

		return this.iterator(
			'column',
			function (settings, column) {
				var visIdx = columnIndexToVisible(settings, column);

				return visIdx !== null ? widths[visIdx] : 0;
			},
			true
		);
	}
);

registerPlural<ApiColumnsMethods<any>['indexes']>(
	'columns().indexes()',
	'column().index()',
	function (type) {
		return this.iterator(
			'column',
			function (settings, column) {
				return type === 'visible'
					? columnIndexToVisible(settings, column)
					: column;
			},
			true
		);
	}
);

register<ApiColumns<any>['adjust']>('columns.adjust()', function () {
	return this.iterator(
		'table',
		function (settings) {
			// Force a column sizing to happen with a manual call - otherwise it can skip
			// if the size hasn't changed
			settings.containerWidth = -1;

			adjustColumnSizing(settings);
		},
		true
	);
});

register<ApiColumn<any>['index']>('column.index()', function (type, idx) {
	if (this.context.length !== 0) {
		var ctx = this.context[0];

		if (type === 'fromVisible' || type === 'toData') {
			return visibleToColumnIndex(ctx, idx);
		}
		else if (type === 'fromData' || type === 'toVisible') {
			return columnIndexToVisible(ctx, idx);
		}
	}

	return -1;
});

type ApiColumnOverload = (
	this: Api,
	selector: ColumnSelector,
	opts?: ApiSelectorModifier
) => Api<any>;

register<ApiColumnOverload>('column()', function (selector, opts?) {
	return selectorFirst(this.columns(selector, opts) as any);
});
