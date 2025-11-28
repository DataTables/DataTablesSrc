import { sortAttachListener, sortFlatten, sortResolve } from '../core/sort';
import * as object from '../util/object';
import Api from './Api';

Api.register('order()', function (order, dir) {
	var ctx = this.context;
	var args = Array.prototype.slice.call(arguments);

	if (order === undefined) {
		// get
		return ctx.length !== 0 ? ctx[0].aaSorting : undefined;
	}

	// set
	if (typeof order === 'number') {
		// Simple column / direction passed in
		order = [[order, dir]];
	}
	else if (args.length > 1) {
		// Arguments passed in (list of 1D arrays)
		order = args;
	}
	// otherwise a 2D array was passed in

	return this.iterator('table', function (settings) {
		var resolved = [];
		sortResolve(settings, resolved, order);

		settings.aaSorting = resolved;
	});
});

/**
 * Attach a sort listener to an element for a given column
 *
 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
 *   listener to. This can take the form of a single DOM node, a jQuery
 *   collection of nodes or a jQuery selector which will identify the node(s).
 * @param {integer} column the column that a click on this node will sort on
 * @param {function} [callback] callback function when sort is run
 * @returns {DataTables.Api} this
 */
Api.register('order.listener()', function (node, column, callback) {
	return this.iterator('table', function (settings) {
		sortAttachListener(settings, node, '', column, callback);
	});
});

Api.register('order.fixed()', function (set) {
	if (!set) {
		var ctx = this.context;
		var fixed = ctx.length ? ctx[0].aaSortingFixed : undefined;

		return Array.isArray(fixed) ? { pre: fixed } : fixed;
	}

	return this.iterator('table', function (settings) {
		settings.aaSortingFixed = object.assignDeep({}, set);
	});
});

// Order by the selected column(s)
Api.register(['columns().order()', 'column().order()'], function (dir) {
	var that = this;

	if (!dir) {
		return this.iterator(
			'column',
			function (settings, idx) {
				var sort = sortFlatten(settings);

				for (var i = 0, iLen = sort.length; i < iLen; i++) {
					if (sort[i].col === idx) {
						return sort[i].dir;
					}
				}

				return null;
			},
			1
		);
	}
	else {
		return this.iterator('table', function (settings, i) {
			settings.aaSorting = that[i].map(function (col) {
				return [col, dir];
			});
		});
	}
});

Api.registerPlural(
	'columns().orderable()',
	'column().orderable()',
	function (directions) {
		return this.iterator(
			'column',
			function (settings, idx) {
				var col = settings.aoColumns[idx];

				return directions ? col.asSorting : col.bSortable;
			},
			1
		);
	}
);
