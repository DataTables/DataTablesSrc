import { addData, addTr, invalidate } from '../core/data';
import { sortDisplay } from '../core/sort';
import dom from '../dom';
import { pluckOrder, removeEmpty } from '../util/array';
import { intVal } from '../util/conv';
import * as is from '../util/is';
import Api from './base';
import {
	selector_first,
	selector_opts,
	selector_row_indexes,
	selector_run,
} from './selectors';
import { arrayApply, lengthOverflow } from './support';
import util from './util';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Rows
 *
 * {}          - no selector - use all available rows
 * {integer}   - row aoData index
 * {node}      - TR node
 * {string}    - jQuery selector to apply to the TR elements
 * {array}     - jQuery array of nodes, or simply an array of TR nodes
 *
 */
function row_selector(settings, selector, opts) {
	var rows;
	var run = function (sel) {
		var selInt = intVal(sel);
		var aoData = settings.aoData;

		// Short cut - selector is a number and no options provided (default is
		// all records, so no need to check if the index is in there, since it
		// must be - dev error if the index doesn't exist).
		if (selInt !== null && !opts) {
			return [selInt];
		}

		if (!rows) {
			rows = selector_row_indexes(settings, opts);
		}

		if (selInt !== null && rows.indexOf(selInt) !== -1) {
			// Selector - integer
			return [selInt];
		}
		else if (sel === null || sel === undefined || sel === '') {
			// Selector - none
			return rows;
		}

		// Selector - function
		if (typeof sel === 'function') {
			return rows.map(function (idx) {
				var row = aoData[idx];
				return sel(idx, row._aData, row.nTr) ? idx : null;
			});
		}

		// Selector - node
		if (sel.nodeName) {
			var rowIdx = sel._DT_RowIndex; // Property added by DT for fast lookup
			var cellIdx = sel._DT_CellIndex;

			if (rowIdx !== undefined) {
				// Make sure that the row is actually still present in the table
				return aoData[rowIdx] && aoData[rowIdx].nTr === sel ? [rowIdx] : [];
			}
			else if (cellIdx) {
				return aoData[cellIdx.row] && aoData[cellIdx.row].nTr === sel.parentNode
					? [cellIdx.row]
					: [];
			}
			else {
				var host = dom.s(sel).closest('*[data-dt-row]');
				return host.count() ? [host.data('dt-row')] : [];
			}
		}

		// ID selector. Want to always be able to select rows by id, regardless
		// of if the tr element has been created or not, so can't rely upon
		// jQuery here - hence a custom implementation. This does not match
		// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
		// but to select it using a CSS selector engine (like Sizzle or
		// querySelect) it would need to need to be escaped for some characters.
		// DataTables simplifies this for row selectors since you can select
		// only a row. A # indicates an id any anything that follows is the id -
		// unescaped.
		if (typeof sel === 'string' && sel.charAt(0) === '#') {
			// get row index from id
			var rowObj = settings.aIds[sel.replace(/^#/, '')];
			if (rowObj !== undefined) {
				return [rowObj.idx];
			}

			// need to fall through to jQuery in case there is DOM id that
			// matches
		}

		// Get nodes in the order from the `rows` array with null values removed
		var nodes = removeEmpty(pluckOrder(settings.aoData, rows, 'nTr'));

		// Selector - selector string, array of nodes or jQuery object.
		return dom
			.s(nodes)
			.filter(sel)
			.map(function () {
				return this._DT_RowIndex;
			})
			.get();
	};

	var matched = selector_run('row', selector, run, settings, opts);

	if (opts.order === 'current' || opts.order === 'applied') {
		sortDisplay(settings, matched);
	}

	return matched;
}

Api.register('rows()', function (selector, opts) {
	// argument shifting
	if (selector === undefined) {
		selector = '';
	}
	else if (is.plainObject(selector)) {
		opts = selector;
		selector = '';
	}

	opts = selector_opts(opts);

	var inst = this.iterator(
		'table',
		function (settings) {
			return row_selector(settings, selector, opts);
		},
		1
	);

	// Want argument shifting here and in row_selector?
	inst.selector.rows = selector;
	inst.selector.opts = opts;

	return inst;
});

Api.register('rows().nodes()', function () {
	return this.iterator(
		'row',
		function (settings, row) {
			return settings.aoData[row].nTr || undefined;
		},
		1
	);
});

Api.register('rows().data()', function () {
	return this.iterator(
		true,
		'rows',
		function (settings, rows) {
			return pluckOrder(settings.aoData, rows, '_aData');
		},
		1
	);
});

Api.registerPlural('rows().cache()', 'row().cache()', function (type) {
	return this.iterator(
		'row',
		function (settings, row) {
			var r = settings.aoData[row];
			return type === 'search' ? r._aFilterData : r._aSortData;
		},
		1
	);
});

Api.registerPlural('rows().invalidate()', 'row().invalidate()', function (src) {
	return this.iterator('row', function (settings, row) {
		invalidate(settings, row, src);
	});
});

Api.registerPlural('rows().indexes()', 'row().index()', function () {
	return this.iterator(
		'row',
		function (settings, row) {
			return row;
		},
		1
	);
});

Api.registerPlural('rows().ids()', 'row().id()', function (hash) {
	var a: any[] = [];
	var context = this.context;

	// `iterator` will drop undefined values, but in this case we want them
	for (var i = 0, iLen = context.length; i < iLen; i++) {
		for (var j = 0, jen = this[i].length; j < jen; j++) {
			var id = context[i].rowIdFn(context[i].aoData[this[i][j]]._aData);
			a.push((hash === true ? '#' : '') + id);
		}
	}

	return new Api(context, a);
});

Api.registerPlural('rows().remove()', 'row().remove()', function () {
	this.iterator('row', function (settings, row) {
		var data = settings.aoData;
		var rowData = data[row];

		// Delete from the display arrays
		var idx = settings.aiDisplayMaster.indexOf(row);
		if (idx !== -1) {
			settings.aiDisplayMaster.splice(idx, 1);
		}

		// For server-side processing tables - subtract the deleted row from the count
		if (settings._iRecordsDisplay > 0) {
			settings._iRecordsDisplay--;
		}

		// Check for an 'overflow' they case for displaying the table
		lengthOverflow(settings);

		// Remove the row's ID reference if there is one
		var id = settings.rowIdFn(rowData._aData);
		if (id !== undefined) {
			delete settings.aIds[id];
		}

		data[row] = null;
	});

	return this;
});

Api.register('rows.add()', function (rows) {
	var newRows = this.iterator(
		'table',
		function (settings) {
			var row, i, iLen;
			var out: any[] = [];

			for (i = 0, iLen = rows.length; i < iLen; i++) {
				row = rows[i];

				if (row.nodeName && row.nodeName.toUpperCase() === 'TR') {
					out.push(addTr(settings, dom.s(row))[0]);
				}
				else {
					out.push(addData(settings, row));
				}
			}

			return out;
		},
		1
	);

	// Return an Api.rows() extended instance, so rows().nodes() etc can be used
	var modRows = this.rows(-1);
	modRows.pop();
	arrayApply(modRows, newRows);

	return modRows;
});

/**
 *
 */
Api.register('row()', function (selector, opts) {
	return selector_first(this.rows(selector, opts));
});

Api.register('row().data()', function (data) {
	var ctx = this.context;

	if (data === undefined) {
		// Get
		return ctx.length && this.length && this[0].length
			? ctx[0].aoData[this[0]]._aData
			: undefined;
	}

	// Set
	var row = ctx[0].aoData[this[0]];
	row._aData = data;

	// If the DOM has an id, and the data source is an array
	if (Array.isArray(data) && row.nTr && row.nTr.id) {
		util.set(ctx[0].rowId)(data, row.nTr.id);
	}

	// Automatically invalidate
	invalidate(ctx[0], this[0], 'data');

	return this;
});

Api.register('row().node()', function () {
	var ctx = this.context;

	if (ctx.length && this.length && this[0].length) {
		var row = ctx[0].aoData[this[0]];

		if (row && row.nTr) {
			return row.nTr;
		}
	}

	return null;
});

Api.register('row.add()', function (row) {
	// Allow a jQuery object to be passed in - only a single row is added from
	// it though - the first element in the set
	if (row && row.fn && (row as any).length) {
		// TODO typing
		row = row[0];
	}

	var rows = this.iterator('table', function (settings) {
		if (row.nodeName && row.nodeName.toUpperCase() === 'TR') {
			return addTr(settings, dom.s(row))[0];
		}
		return addData(settings, row);
	});

	// Return an Api.rows() extended instance, with the newly added row selected
	return this.row(rows[0]);
});
