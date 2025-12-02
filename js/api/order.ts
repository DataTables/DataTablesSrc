import { sortAttachListener, sortFlatten, sortResolve } from '../core/sort';
import { Order, OrderState } from '../model/settings';
import * as object from '../util/object';
import { register, registerPlural } from './Api';
import { Api, ApiColumnsMethods, ApiOrder, OrderFixed } from './interface';

type ApiOrderOverload = (
	this: Api,
	order?: Order | Order[],
	dir?: 'asc' | 'desc' | ''
) => OrderState[] | Api | undefined;

register<ApiOrderOverload>('order()', function (order, dir) {
	let ctx = this.context;
	let args = Array.prototype.slice.call(arguments);

	if (order === undefined) {
		// get
		return ctx.length !== 0 ? ctx[0].aaSorting : undefined;
	}

	// set
	if (typeof order === 'number' && typeof dir === 'string') {
		// Simple column / direction passed in
		order = [[order, dir]];
	}
	else if (args.length > 1) {
		// Arguments passed in (list of 1D arrays)
		order = args;
	}
	// otherwise a 2D array was passed in

	return this.iterator('table', function (settings) {
		let resolved: OrderState[] = [];

		sortResolve(settings, resolved, order);

		settings.aaSorting = resolved;
	});
});

register<ApiOrder['listener']>(
	'order.listener()',
	function (node, column, callback) {
		return this.iterator('table', function (settings) {
			sortAttachListener(settings, node, '', column, callback);
		});
	}
);

type ApiOrderFixedOverload = (
	this: Api,
	order?: OrderFixed
) => OrderFixed | Api | undefined;

register<ApiOrderFixedOverload>('order.fixed()', function (set) {
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
register<ApiColumnsMethods<any>['order']>(
	['columns().order()', 'column().order()'],
	function (dir) {
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
				true
			);
		}
		else {
			return this.iterator('table', function (settings, i) {
				settings.aaSorting = that[i].map(function (col: number) {
					return [col, dir];
				});
			});
		}
	}
);

type ApiColumnsOrderableOverload = (
	this: ApiColumnsMethods<any>,
	directions?: true
) => Api<boolean> | Api<Array<string>>;

registerPlural<ApiColumnsOrderableOverload>(
	'columns().orderable()',
	'column().orderable()',
	function (directions?) {
		return this.iterator(
			'column',
			function (settings, idx) {
				var col = settings.aoColumns[idx];

				return directions ? col.asSorting : col.bSortable;
			},
			true
		);
	}
);
